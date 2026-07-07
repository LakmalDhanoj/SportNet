import { useState, useEffect, useCallback } from 'react';
import { 
    getAllUsers, createUser, deleteUser, getAllPlayers, getAllCaptains, 
    listCoaches, listCaptains, listDirectors, listManagers, getAuditLogs,
    getAllSports, createSport, updateSport, deleteSport, getDirectorTeamTree 
} from '../services/api';

const Spinner = () => (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--accent-primary)' }}>
        <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite', display: 'inline-block', marginBottom: '16px' }}>⚙️</div>
        <p style={{ fontWeight: 800, letterSpacing: '0.1em' }}>SYNCHRONIZING...</p>
    </div>
);
const Alert = ({ msg, type = 'success' }) => msg ? (
    <div style={{
        padding: '16px 24px', borderRadius: '12px', marginBottom: '24px',
        background: type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
        border: `1px solid ${type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
        color: type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)',
        fontWeight: 700, fontSize: '0.9rem'
    }} className="fade-in"> {type === 'success' ? '✔' : '⚠'} {msg}</div>
) : null;

const ROLE_COLOR = { director: '#f59e0b', manager: '#a78bfa', coach: '#60a5fa', captain: '#10b981', player: '#94a3b8' };

// ─── ADMIN: Manage Users ───────────────────────────────────────────────────────
export const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ email: '', password: '', role: 'manager', name: '', gender: 'Male', age: '', qualification: '', managed_by_id: '', sport_specialization: '', sport_id: '' });
    const [dropdowns, setDropdowns] = useState({ coaches: [], captains: [], directors: [], managers: [] });
    const [sports, setSports] = useState([]);
    const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
    const [filter, setFilter] = useState('all');

    const load = useCallback(() => {
        getAllUsers().then(r => { setUsers(r.data.users); setLoading(false); }).catch(() => setLoading(false));
    }, []);
    useEffect(() => {
        load();
        Promise.all([listCoaches(), listCaptains(), listDirectors(), listManagers(), getAllSports()])
            .then(([c, ca, d, m, s]) => {
                setDropdowns({ coaches: c.data.coaches, captains: ca.data.captains, directors: d.data.directors, managers: m.data.managers });
                setSports(s.data.sports || []);
            })
            .catch(() => {});
    }, [load]);

    const handleCreate = async (e) => {
        e.preventDefault(); setMsg(''); setErr('');
        try {
            await createUser(form);
            setMsg(`Identity established for ${form.email}`);
            setShowForm(false);
            setForm({ email: '', password: '', role: 'manager', name: '', gender: 'Male', age: '', qualification: '', managed_by_id: '', sport_specialization: '', sport_id: '' });
            load();
        } catch (ex) { setErr(ex.response?.data?.message || 'Identity creation failure'); }
    };

    const handleDelete = async (uid, email) => {
        if (!window.confirm(`Permanently revoke access for ${email}?`)) return;
        try { await deleteUser(uid); setMsg('Access revoked'); load(); }
        catch { setErr('Revocation failed'); }
    };

    const filtered = filter === 'all' ? users : users.filter(u => u.role === filter);

    const ManagedByDropdown = () => {
        if (!['coach','captain','player'].includes(form.role)) return null;
        let options = [];
        let label = '';
        if (form.role === 'coach') { options = dropdowns.managers; label = 'Department Manager'; }
        else if (form.role === 'captain') { options = dropdowns.coaches; label = 'Operational Coach'; }
        else if (form.role === 'player') { options = dropdowns.captains; label = 'Lead Captain'; }
        return (
            <div className="form-group">
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>{label}</label>
                <select className="glass-input" style={{ width: '100%' }} value={form.managed_by_id} onChange={e => setForm({ ...form, managed_by_id: e.target.value })}>
                    <option value="">— Unassigned —</option>
                    {options.map(o => {
                        const id = o[Object.keys(o)[0]];
                        const extra = o.sport_specialization ? ` (${o.sport_specialization})` : (o.sport_category ? ` (${o.sport_category})` : '');
                        return <option key={id} value={id}>{o.name}{extra}</option>;
                    })}
                </select>
            </div>
        );
    };

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>IDENTITY MANAGEMENT</h1>
                <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Configure system access, roles, and organizational reporting lines.</p>
            </div>

            <Alert msg={msg} type="success" /><Alert msg={err} type="error" />

            <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: 'var(--bg-surface-alt)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-dim)' }}>
                    {['all','director','manager','coach','captain','player'].map(r => (
                        <button key={r} onClick={() => setFilter(r)}
                            style={{ 
                                padding: '8px 20px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800,
                                background: filter === r ? 'var(--accent-primary)' : 'transparent',
                                color: filter === r ? 'white' : 'var(--text-muted)',
                                border: 'none', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.05em'
                            }}>
                            {r.toUpperCase()}
                        </button>
                    ))}
                </div>
                <button className="glass-button primary-btn" style={{ padding: '12px 24px', fontSize: '0.8rem' }} onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'REVOKE COMMAND' : '＋ ESTABLISH NEW IDENTITY'}
                </button>
            </div>

            {showForm && (
                <div className="glass-panel fade-in" style={{ padding: '40px', borderRadius: '24px', marginBottom: '40px', border: '1px solid var(--border-dim)' }}>
                    <h3 style={{ marginBottom: '32px', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>CREATION PARAMETERS</h3>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        <div className="form-group"><label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Legal Name</label><input className="glass-input" style={{ width: '100%' }} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                        <div className="form-group"><label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Email Address</label><input type="email" className="glass-input" style={{ width: '100%' }} required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                        <div className="form-group"><label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Initial Passkey</label><input type="password" className="glass-input" style={{ width: '100%' }} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
                        <div className="form-group"><label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Strategic Role</label>
                            <select className="glass-input" style={{ width: '100%' }} value={form.role} onChange={e => setForm({ ...form, role: e.target.value, managed_by_id: '' })}>
                                {['director','manager','coach','captain'].map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                            </select>
                        </div>
                        <div className="form-group"><label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Biological Gender</label>
                            <select className="glass-input" style={{ width: '100%' }} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                <option>Male</option><option>Female</option><option>Other</option>
                            </select>
                        </div>
                        <div className="form-group"><label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Age Verification</label><input type="number" className="glass-input" style={{ width: '100%' }} value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} /></div>
                        {['manager','coach'].includes(form.role) && (
                            <div className="form-group"><label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Expertise / Qualification</label><input className="glass-input" style={{ width: '100%' }} value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} /></div>
                        )}
                        {['manager', 'coach', 'captain'].includes(form.role) && (
                            <div className="form-group">
                                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Sport Assignment / Specialization</label>
                                <select className="glass-input" style={{ width: '100%' }} required value={form.sport_id || ''} onChange={e => {
                                    const selectedSport = sports.find(s => s.sport_id.toString() === e.target.value);
                                    setForm({ 
                                        ...form, 
                                        sport_id: e.target.value,
                                        sport_specialization: selectedSport ? selectedSport.sport_name : ''
                                    });
                                }}>
                                    <option value="">— Select Sport Domain —</option>
                                    {sports.filter(s => s.status === 'Active').map(s => <option key={s.sport_id} value={s.sport_id}>{s.sport_name}</option>)}
                                </select>
                            </div>
                        )}
                        <ManagedByDropdown />
                        <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                            <button type="submit" className="glass-button primary-btn" style={{ width: 'auto', padding: '16px 40px', fontSize: '0.9rem' }}>EXECUTE CREATION</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-table-container">
                <table className="glass-table">
                    <thead><tr><th>IDENTIFIER</th><th>CREDENTIALS</th><th>ACCESS ROLE</th><th>OPERATIONAL STATUS</th><th>CONTROL</th></tr></thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px', fontWeight: 600 }}>No entities found for selected filter</td></tr>
                        ) : filtered.map(u => (
                            <tr key={u.user_id}>
                                <td><code style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>#{u.user_id.toString().padStart(4, '0')}</code></td>
                                <td>
                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{u.email}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>Registered {new Date(u.created_at).toLocaleDateString('en-GB')}</div>
                                </td>
                                <td>
                                    <span style={{ 
                                        padding: '6px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900, 
                                        background: `${ROLE_COLOR[u.role]}15`, color: ROLE_COLOR[u.role], border: `1px solid ${ROLE_COLOR[u.role]}40`,
                                        textTransform: 'uppercase', letterSpacing: '0.05em'
                                    }}>{u.role}</span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', background: 'var(--accent-success)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-success)' }}></div>
                                        <span style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Active</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="glass-button" style={{ padding: '8px 16px', fontSize: '0.7rem' }}>MODIFY</button>
                                        <button className="glass-button" style={{ padding: '8px 16px', fontSize: '0.7rem', color: 'var(--accent-danger)', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => handleDelete(u.user_id, u.email)}>REVOKE</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─── ADMIN: Manage Sports ───────────────────────────────────────────────────
export const ManageSports = () => {
    const [sports, setSports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editSportId, setEditSportId] = useState(null);
    const [form, setForm] = useState({ sport_name: '', sport_type: 'Team', metrics: '', description: '', status: 'Active' });
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');

    const load = useCallback(() => {
        getAllSports()
            .then(r => { setSports(r.data.sports); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(''); setErr('');
        try {
            if (editSportId) {
                await updateSport(editSportId, form);
                setMsg(`Sport category "${form.sport_name}" updated successfully.`);
            } else {
                await createSport(form);
                setMsg(`Sport category "${form.sport_name}" initialized successfully.`);
            }
            setShowForm(false);
            setEditSportId(null);
            setForm({ sport_name: '', sport_type: 'Team', metrics: '', description: '', status: 'Active' });
            load();
        } catch (ex) {
            setErr(ex.response?.data?.message || 'Failed to save sport category.');
        }
    };

    const handleEdit = (s) => {
        setEditSportId(s.sport_id);
        setForm({
            sport_name: s.sport_name,
            sport_type: s.sport_type,
            metrics: s.metrics,
            description: s.description || '',
            status: s.status
        });
        setShowForm(true);
    };

    const handleDeleteSport = async (id, name) => {
        if (!window.confirm(`Permanently decommission sport domain "${name}"?`)) return;
        setMsg(''); setErr('');
        try {
            await deleteSport(id);
            setMsg(`Domain "${name}" deleted.`);
            load();
        } catch {
            setErr('Decommission failed.');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1>SPORT CATEGORIES</h1>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Define athletic domains, configure custom metrics, and oversee divisions.</p>
                </div>
                <button className="glass-button primary-btn" style={{ padding: '12px 24px', fontSize: '0.8rem' }} onClick={() => {
                    setEditSportId(null);
                    setForm({ sport_name: '', sport_type: 'Team', metrics: '', description: '', status: 'Active' });
                    setShowForm(!showForm);
                }}>
                    {showForm ? 'REVOKE PARAMETERS' : '＋ INITIALIZE NEW DOMAIN'}
                </button>
            </div>

            <Alert msg={msg} type="success" /><Alert msg={err} type="error" />

            {showForm && (
                <div className="glass-panel fade-in" style={{ padding: '40px', borderRadius: '24px', marginBottom: '40px', border: '1px solid var(--border-dim)' }}>
                    <h3 style={{ marginBottom: '32px', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                        {editSportId ? 'MODIFY DOMAIN CONFIGURATION' : 'INITIALIZE SPORT PARAMETERS'}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        <div className="form-group">
                            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Sport Name</label>
                            <input className="glass-input" style={{ width: '100%' }} required value={form.sport_name} onChange={e => setForm({ ...form, sport_name: e.target.value })} placeholder="e.g. Cricket, Football" />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Sport Classification</label>
                            <select className="glass-input" style={{ width: '100%' }} value={form.sport_type} onChange={e => setForm({ ...form, sport_type: e.target.value })}>
                                <option value="Team">Team Sport</option>
                                <option value="Individual">Individual Sport</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Seeded Live Metrics (Comma Separated)</label>
                            <input className="glass-input" style={{ width: '100%' }} required value={form.metrics} onChange={e => setForm({ ...form, metrics: e.target.value })} placeholder="e.g. Batting Avg, Strike Rate" />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Operational Status</label>
                            <select className="glass-input" style={{ width: '100%' }} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                <option value="Active">Active / Operational</option>
                                <option value="Inactive">Inactive / Suspended</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Strategic Description</label>
                            <textarea className="glass-input" style={{ width: '100%', minHeight: '80px' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Enter athletic domain focus and details..." />
                        </div>
                        <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                            <button type="submit" className="glass-button primary-btn" style={{ width: 'auto', padding: '16px 40px', fontSize: '0.9rem' }}>
                                {editSportId ? 'PERSIST CONFIGURATION' : 'EXECUTE INITIALIZATION'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-table-container">
                <table className="glass-table">
                    <thead>
                        <tr>
                            <th>SPORT ID</th>
                            <th>DESIGNATION</th>
                            <th>CLASSIFICATION</th>
                            <th>LIVE METRICS</th>
                            <th>STATUS</th>
                            <th>CONTROL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sports.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px', fontWeight: 600 }}>No sport domains present in the registry</td></tr>
                        ) : sports.map(s => (
                            <tr key={s.sport_id}>
                                <td><code style={{ fontWeight: 800 }}>#SPT-{String(s.sport_id).padStart(3, '0')}</code></td>
                                <td>
                                    <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{s.sport_name}</strong>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.description || 'No description provided.'}</div>
                                </td>
                                <td style={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.sport_type}</td>
                                <td>
                                    <code style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>{s.metrics}</code>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', background: s.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-danger)', borderRadius: '50%', boxShadow: `0 0 10px ${s.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-danger)'}` }}></div>
                                        <span style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>{s.status === 'Active' ? 'Active' : 'Suspended'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="glass-button" style={{ padding: '8px 16px', fontSize: '0.7rem' }} onClick={() => handleEdit(s)}>MODIFY</button>
                                        <button className="glass-button" style={{ padding: '8px 16px', fontSize: '0.7rem', color: 'var(--accent-danger)', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => handleDeleteSport(s.sport_id, s.sport_name)}>DELETE</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─── ADMIN: All Performance ────────────────────────────────────────────────────
export const AllPerformance = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getAllPlayers().then(r => { setPlayers(r.data.players); setLoading(false); }).catch(() => setLoading(false));
    }, []);
    if (loading) return <Spinner />;
    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>ANALYTICAL OVERVIEW</h1>
                <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Aggregate performance intelligence across all athletic departments.</p>
            </div>

            <div className="stats-grid">
                <div className="glass-card stat-card">
                    <div className="stat-label">Total Personnel</div>
                    <div className="stat-value">{players.length}</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-label">Aggregate Discipline</div>
                    <div className="stat-value" style={{ color: 'var(--accent-success)' }}>
                        {(players.reduce((a, b) => a + (b.discipline || 0), 0) / (players.length || 1)).toFixed(1)}
                    </div>
                </div>
                <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
                    <div className="stat-label">System Integrity</div>
                    <div className="stat-value" style={{ color: 'var(--accent-secondary)' }}>98.2%</div>
                </div>
            </div>

            <div className="glass-table-container">
                <table className="glass-table">
                    <thead><tr><th>PERSONNEL</th><th>DOMAIN</th><th>SUPERVISOR</th><th>STATUS</th><th>SKILL INDEX</th><th>CONDUCT</th><th>FINAL SCORE</th></tr></thead>
                    <tbody>
                        {players.map(p => (
                            <tr key={p.player_id}>
                                <td>
                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{p.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.email}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', textTransform: 'uppercase', marginTop: '2px' }}>ID: #{p.player_id.toString().padStart(5, '0')} | Pos: {p.position || 'N/A'}</div>
                                </td>
                                <td style={{ fontWeight: 700, textTransform: 'uppercase' }}>{p.sport_category || 'Football'}</td>
                                <td>{p.captain_name ?? '—'}</td>
                                <td>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', background: p.approval_status === 'Pending' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', color: p.approval_status === 'Pending' ? 'var(--accent-warning)' : 'var(--accent-success)' }}>{p.approval_status || 'Approved'}</span>
                                </td>
                                <td>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.skill_level || 'ADVANCED'}</span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ flex: 1, height: '6px', background: 'var(--bg-surface-alt)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border-dim)' }}>
                                            <div style={{ width: `${(p.discipline || 0) * 10}%`, height: '100%', background: 'var(--accent-success)', boxShadow: '0 0 10px var(--accent-success)' }}></div>
                                        </div>
                                        <span style={{ fontWeight: 900, fontSize: '0.8rem', color: 'var(--accent-success)' }}>{p.discipline}/10</span>
                                    </div>
                                </td>
                                <td><strong style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 900 }}>{p.total_score}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// ─── ADMIN: Audit Logs (System Activity) ──────────────────────────────────────
export const ApprovalsOverview = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAuditLogs().then(r => { setLogs(r.data.logs); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>SYSTEM AUDIT LOGS</h1>
                <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Comprehensive historical record of all administrative and operational transactions.</p>
            </div>
            <div className="glass-table-container">
                <table className="glass-table">
                    <thead><tr><th>TIMESTAMP</th><th>INITIATOR</th><th>PROTOCOL ACTION</th><th>TRANSACTION DETAILS</th></tr></thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px', fontWeight: 600 }}>No audit records present in the secure buffer</td></tr>
                        ) : logs.map(l => (
                            <tr key={l.log_id}>
                                <td style={{fontSize:'0.75rem', fontWeight: 700, color: 'var(--text-muted)'}}>{new Date(l.created_at).toLocaleString('en-GB')}</td>
                                <td><strong style={{fontSize:'0.9rem', fontWeight: 800}}>{l.user_email}</strong></td>
                                <td>
                                    <span style={{ 
                                        padding: '4px 10px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 900,
                                        background: l.action.includes('DELETE') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                                        color: l.action.includes('DELETE') ? 'var(--accent-danger)' : 'var(--accent-success)',
                                        border: `1px solid ${l.action.includes('DELETE') ? 'var(--accent-danger)' : 'var(--accent-success)'}`,
                                        textTransform: 'uppercase', letterSpacing: '0.05em'
                                    }}>{l.action}</span>
                                </td>
                                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                                    {l.details}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// ─── ADMIN: System Settings ───────────────────────────────────────────────────
export const SystemSettings = () => (
    <div className="view-container fade-in">
        <div className="view-header">
            <h1>CORE PARAMETERS</h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Global system configuration and security protocol management.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
                { label: 'AUTHENTICATION GATEWAY', desc: 'Manage password complexity and multi-factor protocols.', icon: '🔐' },
                { label: 'PERMISSION MATRIX', desc: 'Define role-based access control for all system segments.', icon: '👥' },
                { label: 'COMMUNICATION NODE', desc: 'Configure automated notification and alert thresholds.', icon: '📩' },
                { label: 'DATA REPLICATION', desc: 'Initiate manual backup or schedule automated snapshots.', icon: '🗄️' },
                { label: 'SYSTEM KERNEL', desc: 'Adjust global operational flags and API environment vars.', icon: '🌐' }
            ].map(s => (
                <div key={s.label} className="glass-card" style={{ padding: '32px', cursor: 'pointer', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '2rem' }}>{s.icon}</div>
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)' }}>{s.label}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</p>
                    </div>
                </div>
            ))}
        </div>
        <button className="glass-button primary-btn" style={{ width: 'auto', marginTop: '40px', padding: '16px 48px' }}>PERSIST ALL MODIFICATIONS</button>
    </div>
);

export const DirectorTeamView = () => {
    const [teamTree, setTeamTree] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        getDirectorTeamTree()
            .then(res => {
                setTeamTree(res.data.teamTree || []);
                setLoading(false);
            })
            .catch(ex => {
                setErr('Failed to load team structure');
                setLoading(false);
            });
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Sports Management Hierarchy</h1>
                <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                    Strategic organizational tree: Sport → Managers → Coaches → Captains → Players.
                </p>
            </div>

            {err && <Alert msg={err} type="error" />}

            {teamTree.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No sports defined. Go to Sports section to create one.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {teamTree.map(s => (
                        <div key={s.sport_id} className="glass-panel" style={{ padding: '32px', borderRadius: '24px', borderLeft: '5px solid var(--accent-primary)', background: 'var(--bg-surface)' }}>
                            {/* Sport Banner */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-dim)', paddingBottom: '16px', marginBottom: '24px' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-main)', margin: 0 }}>🏆 {s.sport_name}</h2>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Type: {s.sport_type}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)' }}>
                                        ACTIVE HIERARCHY
                                    </span>
                                </div>
                            </div>

                            {/* Managers Section */}
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--accent-secondary)', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 800 }}>
                                    💼 Assigned Managers
                                </h4>
                                {s.managers.length === 0 ? (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No Manager assigned to this sport domain.</p>
                                ) : (
                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                        {s.managers.map(m => (
                                            <div key={m.manager_id} className="glass-card" style={{ padding: '16px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-surface-alt)', border: '1px solid var(--border-dim)' }}>
                                                <div style={{ fontSize: '1.5rem' }}>👤</div>
                                                <div>
                                                    <div style={{ fontWeight: 800 }}>{m.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: MGR-{m.manager_id}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Coaches, Captains & Players Tree */}
                            <div>
                                <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--accent-success)', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 800 }}>
                                    📋 Coaching & Squad Tree
                                </h4>
                                {s.coaches.length === 0 ? (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No Coaches assigned to this sport.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {s.coaches.map(c => (
                                            <div key={c.coach_id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-dim)', borderRadius: '16px', padding: '20px' }}>
                                                {/* Coach Row */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                    <div>
                                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-success)', marginRight: '8px' }}>COACH</span>
                                                        <strong style={{ fontSize: '1.1rem' }}>{c.name}</strong>
                                                    </div>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Squad Group: {c.team_group || 'Unassigned'}</span>
                                                </div>

                                                {/* Captains Under Coach */}
                                                <div style={{ paddingLeft: '24px', borderLeft: '1px dashed var(--border-dim)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                    {c.captains.length === 0 ? (
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No Captains under this coach.</p>
                                                    ) : (
                                                        c.captains.map(cap => (
                                                            <div key={cap.captain_id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px' }}>
                                                                {/* Captain Row */}
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                                    <div>
                                                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', marginRight: '8px' }}>CAPTAIN</span>
                                                                        <strong style={{ fontSize: '0.95rem' }}>{cap.name}</strong>
                                                                    </div>
                                                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Position: {cap.position || 'N/A'}</span>
                                                                </div>

                                                                {/* Players Under Captain */}
                                                                <div style={{ paddingLeft: '20px', borderLeft: '1px dotted var(--border-dim)' }}>
                                                                    {cap.players.length === 0 ? (
                                                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No approved players in this squad.</p>
                                                                    ) : (
                                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                                                                            {cap.players.map(p => (
                                                                                <div key={p.player_id} style={{ background: 'var(--bg-surface-alt)', border: '1px solid var(--border-dim)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.approval_status === 'Approved' ? 'var(--accent-success)' : 'var(--accent-warning)' }}></span>
                                                                                    <span>{p.name}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


