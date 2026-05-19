import { useState, useEffect, useCallback } from 'react';
import { getMyPlayers, submitPlayerReports, getCaptainSubmissionStatus } from '../services/api';

const StatusBadge = ({ status }) => {
    const config = {
        'Final Approved': { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80', border: '#22c55e' },
        'Pending': { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: '#f59e0b' },
        'Draft': { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', border: '#64748b' },
        'Rejected': { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: '#ef4444' }
    };
    const s = config[status] || config['Pending'];
    return (
        <span style={{
            padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
            background: s.bg, color: s.text, border: `1px solid ${s.border}`, textTransform: 'uppercase'
        }}>{status}</span>
    );
};


const Spinner = () => (
    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2rem' }}>⚙️</div><p>Loading...</p>
    </div>
);

const Alert = ({ msg, type = 'success' }) => msg ? (
    <div style={{
        padding: '10px 15px', borderRadius: '8px', marginBottom: '15px',
        background: type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
        border: `1px solid ${type === 'success' ? '#10b981' : '#ef4444'}`,
        color: type === 'success' ? '#10b981' : '#ef4444'
    }}>{msg}</div>
) : null;

// ─── CAPTAIN: Squad Management — Mark Player Attendance & Discipline ──────────
export const PlayerEntry = () => {
    const [players, setPlayers]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [date, setDate]         = useState(new Date().toISOString().split('T')[0]);
    const [entries, setEntries]   = useState({});
    const [msg, setMsg]           = useState('');
    const [err, setErr]           = useState('');
    const [saving, setSaving]     = useState(false);

    useEffect(() => {
        getMyPlayers().then(r => {
            const ps = r.data.players;
            setPlayers(ps);
            const init = {};
            ps.forEach(p => { 
                init[p.player_id] = { 
                    attendance: 'Present', 
                    discipline: 7,
                    training_hours: 2,
                    notes: ''
                }; 
            });
            setEntries(init);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const update = (pid, field, val) =>
        setEntries(prev => ({ ...prev, [pid]: { ...prev[pid], [field]: val } }));

    const handleSubmit = async (isDraft = false) => {
        setSaving(true); setMsg(''); setErr('');
        try {
            const reports = players.map(p => ({
                player_id: p.player_id,
                attendance: entries[p.player_id]?.attendance || 'Present',
                discipline: Number(entries[p.player_id]?.discipline) || 7,
                training_hours: Number(entries[p.player_id]?.training_hours) || 0,
                notes: entries[p.player_id]?.notes || '',
            }));
            await submitPlayerReports({ date, reports, isDraft });
            setMsg(isDraft ? '✅ Progress saved as Draft.' : '✅ Reports submitted to Coach for review. Status: Pending');
        } catch (ex) {
            setErr(ex.response?.data?.message || 'Submission failed');
        } finally { setSaving(false); }
    };

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Player Attendance Entry (Draft Mode)</h1>
                <p style={{ color: 'var(--text-muted)' }}>Sport: Football | Date: {date}</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Select Date</label>
                        <input type="date" className="glass-input" value={date}
                            onChange={e => setDate(e.target.value)}
                            style={{ width: 'auto' }} />
                    </div>
                    <div className="stat-card" style={{ padding: '0 20px', borderLeft: '1px solid var(--border-glass)' }}>
                        <div className="stat-label">Squad Size</div>
                        <div className="stat-value" style={{ fontSize: '1.5rem' }}>{players.length}</div>
                    </div>
                </div>
            </div>

            <Alert msg={msg} type="success" /><Alert msg={err} type="error" />

            {players.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No players assigned to your squad.
                </div>
            ) : (
                <div className="glass-table-container">
                    <table className="glass-table">
                        <thead>
                            <tr>
                                <th>Player Name</th>
                                <th>Attendance</th>
                                <th>Discipline</th>
                                <th>Hours</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((p) => (
                                <tr key={p.player_id}>
                                    <td>
                                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{p.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{p.skill_level || 'PRO'}</div>
                                    </td>
                                    <td>
                                        <select className="glass-input" value={entries[p.player_id]?.attendance || 'Present'}
                                            onChange={e => update(p.player_id, 'attendance', e.target.value)}
                                            style={{ padding: '8px 12px', fontSize: '0.85rem', width: '130px' }}>
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <input type="range" min="1" max="10"
                                                value={entries[p.player_id]?.discipline || 7}
                                                onChange={e => update(p.player_id, 'discipline', e.target.value)}
                                                style={{ width: '100px' }} />
                                            <span style={{ fontWeight: 800, color: 'var(--accent-primary)', width: '20px' }}>
                                                {entries[p.player_id]?.discipline || 7}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <input type="number" step="0.5" className="glass-input" 
                                            value={entries[p.player_id]?.training_hours || 0}
                                            onChange={e => update(p.player_id, 'training_hours', e.target.value)}
                                            style={{ width: '80px' }} />
                                    </td>
                                    <td>
                                        <input type="text" className="glass-input" placeholder="Feedback..."
                                            value={entries[p.player_id]?.notes || ''}
                                            onChange={e => update(p.player_id, 'notes', e.target.value)}
                                            style={{ fontSize: '0.85rem' }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                <button className="glass-button" style={{ width: 'auto', background: 'rgba(255,255,255,0.05)' }}
                    onClick={() => handleSubmit(true)} disabled={saving || players.length === 0}>
                    {saving ? 'Saving...' : '💾 Save Draft'}
                </button>
                <button className="glass-button primary-btn" style={{ width: 'auto' }}
                    onClick={() => handleSubmit(false)} disabled={saving || players.length === 0}>
                    {saving ? 'Submitting...' : '🚀 Submit to Coach'}
                </button>
            </div>


            <div className="glass-panel" style={{ marginTop: '24px', padding: '16px', borderLeft: '4px solid #f59e0b' }}>
                <h4 style={{ color: '#f59e0b', marginBottom: '8px' }}>⚠ Captain Permissions</h4>
                <p><strong>Can:</strong> Mark player attendance, set discipline scores, submit reports to Coach.</p>
                <p><strong>Cannot:</strong> Edit own attendance (set by Coach), approve any records, view other teams.</p>
            </div>
        </div>
    );
};

// ─── CAPTAIN: Submission Status ───────────────────────────────────────────────
export const SubmissionStatus = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCaptainSubmissionStatus()
            .then(r => { setReports(r.data.reports); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const grouped = reports.reduce((acc, r) => {
        const key = r.date?.split('T')[0];
        if (!acc[key]) acc[key] = [];
        acc[key].push(r);
        return acc;
    }, {});

    const pending = reports.filter(r => r.status === 'Pending').length;
    const approved = reports.filter(r => r.status === 'Final Approved').length;

    if (loading) return <Spinner />;

    return (
        <div className="view-container">
            <h2>📊 Submission Status</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#60a5fa' }}>{reports.length}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Submitted</div>
                </div>
                <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{pending}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pending Review</div>
                </div>
                <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>{approved}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Coach Approved</div>
                </div>
            </div>

            {Object.keys(grouped).length === 0 ? (
                <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No submissions yet. Go to "My Team" to submit your first report.
                </div>
            ) : (
                Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0])).map(([date, reps]) => (
                    <div key={date} className="glass-panel" style={{ marginBottom: '15px', padding: '20px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4>📅 {date}</h4>
                            <StatusBadge status={reps.every(r => r.status === 'Final Approved') ? 'Final Approved' : 'Pending'} />
                        </div>
                        <div className="glass-table-container" style={{ marginTop: 0 }}>
                            <table className="glass-table" style={{ fontSize: '0.9rem' }}>
                                <thead><tr><th>Player</th><th>Attendance</th><th>Discipline</th><th>Status</th></tr></thead>
                                <tbody>
                                    {reps.map((r, i) => (
                                        <tr key={i}>
                                            <td>{r.player_name}</td>
                                            <td style={{ color: r.attendance === 'Present' ? '#10b981' : '#ef4444' }}>{r.attendance}</td>
                                            <td>{r.discipline}/10</td>
                                            <td><StatusBadge status={r.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
