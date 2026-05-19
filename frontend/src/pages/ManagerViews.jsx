import { useState, useEffect } from 'react';
import { getManagerOverview, getAllCoaches } from '../services/api';

const Spinner = () => (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite', display: 'inline-block', marginBottom: '16px' }}>⚙️</div>
        <p style={{ fontWeight: 600, letterSpacing: '0.05em' }}>SYNCING PERSONNEL RECORDS...</p>
    </div>
);

// ─── MANAGER: Coach Performance Monitoring ────────────────────────────────────
export const PersonnelMonitoring = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getManagerOverview()
            .then(r => { setCoaches(r.data.coaches); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Personnel Monitoring</h1>
                <p style={{ color: 'var(--text-muted)' }}>Audit coach performance, evaluation scores, and departmental report activity.</p>
            </div>

            <div className="glass-table-container">
                <table className="glass-table">
                    <thead>
                        <tr><th>Coach Name</th><th>Squads</th><th>Conduct</th><th>Performance Eval</th><th>Logs Filed</th><th>Verified</th></tr>
                    </thead>
                    <tbody>
                        {coaches.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No personnel records found</td></tr>
                        ) : coaches.map(c => (
                            <tr key={c.coach_id}>
                                <td>
                                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Department Staff</div>
                                </td>
                                <td>{c.captain_count} Captains</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{ width: `${(c.discipline || 0) * 10}%`, height: '100%', background: 'var(--accent-success)' }}></div>
                                        </div>
                                        <span>{c.discipline ?? '0'}/10</span>
                                    </div>
                                </td>
                                <td><span style={{ color: 'var(--accent-success)', fontWeight: 800, fontSize: '1.1rem' }}>{c.evaluation_sc ?? '—'}</span></td>
                                <td>{c.reports_filed}</td>
                                <td><span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{c.approved_count ?? 0}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─── MANAGER: Resource Allocation ─────────────────────────────────────────────
export const ResourceAllocation = () => (
    <div className="view-container fade-in">
        <div className="view-header">
            <h1>Resource Allocation</h1>
            <p style={{ color: 'var(--text-muted)' }}>Budget tracking and equipment distribution management.</p>
        </div>

        <div className="glass-table-container">
            <table className="glass-table">
                <thead><tr><th>Resource Category</th><th>Allocated Amount</th><th>Approval Status</th><th>Transaction Date</th></tr></thead>
                <tbody>
                    <tr><td>Football Gear & Kits</td><td>$2,500.00</td><td><span style={{ color: 'var(--accent-success)', fontWeight: 700 }}>● APPROVED</span></td><td>12/04/2026</td></tr>
                    <tr><td>Training Facility Maintenance</td><td>$5,000.00</td><td><span style={{ color: 'var(--accent-warning)', fontWeight: 700 }}>● PENDING</span></td><td>15/04/2026</td></tr>
                    <tr><td>Regional Travel Stipends</td><td>$1,200.00</td><td><span style={{ color: 'var(--accent-success)', fontWeight: 700 }}>● DISBURSED</span></td><td>10/04/2026</td></tr>
                </tbody>
            </table>
        </div>
        <div style={{ marginTop: '24px' }}>
            <button className="glass-button" style={{ width: 'auto', padding: '12px 32px' }}>+ Request New Allocation</button>
        </div>
    </div>
);

// ─── MANAGER: Event Coordinator ───────────────────────────────────────────────
export const EventCoordinator = () => {
    const [form, setForm] = useState({ tournament: '', sport: 'Football', date: '', venue: '' });
    const [msg, setMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMsg(`✅ Event "${form.tournament}" successfully scheduled for ${form.date}`);
    };

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Tournament Coordinator</h1>
                <p style={{ color: 'var(--text-muted)' }}>Schedule and coordinate multi-sport regional events.</p>
            </div>

            {msg && <div style={{ padding: '16px 24px', borderRadius: '12px', marginBottom: '24px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--accent-success)', color: 'var(--accent-success)', fontWeight: 600 }} className="fade-in">{msg}</div>}
            
            <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="form-group">
                        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Tournament Designation</label>
                        <input type="text" className="glass-input" placeholder="e.g. Regional Championship 2026" required
                            value={form.tournament} onChange={e => setForm({ ...form, tournament: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Sport Category</label>
                        <select className="glass-input" value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value })}>
                            <option>Football</option><option>Cricket</option><option>Volleyball</option><option>Tennis</option>
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Scheduled Date</label>
                            <input type="date" className="glass-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Primary Venue</label>
                            <input type="text" className="glass-input" placeholder="Stadium / Complex Name"
                                value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
                        </div>
                    </div>
                    <button type="submit" className="glass-button" style={{ marginTop: '12px' }}>📅 Register Event</button>
                </form>
            </div>
        </div>
    );
};
