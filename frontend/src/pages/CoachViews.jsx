import { useState, useEffect, useCallback } from 'react';
import {
    getPlayerReportsForCoach, approvePlayerReport, bulkApproveByCaption,
    getMyCaptainReports, submitCaptainReport, getMyCaptains
} from '../services/api';

// ─── Shared helpers ───────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => (
    <span style={{
        padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600,
        background: status === 'Final Approved' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
        color: status === 'Final Approved' ? '#10b981' : '#f59e0b',
        border: `1px solid ${status === 'Final Approved' ? '#10b981' : '#f59e0b'}`
    }}>{status}</span>
);

const Spinner = () => (
    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</div>
        <p>Loading...</p>
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

// ─── COACH: Leadership Management (Evaluate Captains) ─────────────────────────
export const LeadershipManagement = () => {
    const [captains, setCaptains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [evalForm, setEvalForm] = useState({ date: new Date().toISOString().split('T')[0], attendance: 'Present', discipline: 'Good', training_hours: 2, strategy_rt: 8, responsibility_rt: 8, notes: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        getMyCaptains().then(r => { setCaptains(r.data.captains); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const handleEval = async (e) => {
        e.preventDefault(); setSaving(true); setMsg('');
        try {
            await submitCaptainReport({ captain_id: selected.captain_id, ...evalForm });
            setMsg(`✅ Leadership assessment finalized for ${selected.name}`);
            setSelected(null);
        } catch { alert('Evaluation failed'); } finally { setSaving(false); }
    };

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Captain Leadership Evaluation</h1>
                <p style={{ color: 'var(--text-muted)' }}>Coach holds final authority over Captain performance metrics.</p>
            </div>

            <Alert msg={msg} type="success" />

            <div className="stats-grid">
                <div className="glass-card stat-card">
                    <div className="stat-label">Assigned Captains</div>
                    <div className="stat-value">{captains.length}</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-label">Active Sports</div>
                    <div className="stat-value" style={{ color: 'var(--accent-secondary)' }}>Football</div>
                </div>
            </div>

            <div className="glass-table-container">
                <table className="glass-table">
                    <thead><tr><th>Captain Profile</th><th>Leadership RT</th><th>Strategy</th><th>Total Score</th><th>Action</th></tr></thead>
                    <tbody>
                        {captains.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No captains assigned</td></tr>
                        ) : captains.map(c => (
                            <tr key={c.captain_id}>
                                <td>
                                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{c.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Squad Leader</div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${(c.leadership_rt || 0) * 10}%`, height: '100%', background: 'var(--accent-primary)' }}></div>
                                        </div>
                                        <span style={{ fontWeight: 700 }}>{c.leadership_rt}/10</span>
                                    </div>
                                </td>
                                <td>{c.strategy_rt}/10</td>
                                <td><strong style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{c.total_score}</strong></td>
                                <td>
                                    <button className="glass-button primary-btn" style={{ padding: '8px 16px', fontSize: '0.75rem' }} onClick={() => setSelected(c)}>
                                        EVALUATE
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selected && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '560px', padding: '40px', borderRadius: '24px', border: '1px solid var(--accent-primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Leadership Assessment</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Captain: {selected.name}</p>
                            </div>
                            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.8rem' }}>×</button>
                        </div>
                        <form onSubmit={handleEval} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="form-group">
                                <label>Strategy & Planning (1-10)</label>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <input type="range" min="1" max="10" className="glass-input" value={evalForm.strategy_rt} onChange={e => setEvalForm({ ...evalForm, strategy_rt: e.target.value })} style={{ padding: 0 }} />
                                    <span style={{ fontWeight: 800, color: 'var(--accent-primary)', minWidth: '25px' }}>{evalForm.strategy_rt}</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Team Responsibility (1-10)</label>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <input type="range" min="1" max="10" className="glass-input" value={evalForm.responsibility_rt} onChange={e => setEvalForm({ ...evalForm, responsibility_rt: e.target.value })} style={{ padding: 0 }} />
                                    <span style={{ fontWeight: 800, color: 'var(--accent-primary)', minWidth: '25px' }}>{evalForm.responsibility_rt}</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Coach Observations</label>
                                <textarea className="glass-input" rows="3" placeholder="Identify areas for improvement..." value={evalForm.notes} onChange={e => setEvalForm({ ...evalForm, notes: e.target.value })}></textarea>
                            </div>
                            <button type="submit" className="glass-button primary-btn" style={{ height: '54px' }} disabled={saving}>
                                {saving ? 'FINALIZING...' : 'SUBMIT FINAL EVALUATION'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};


// ─── COACH: Review Player Attendance (Approve/Override Captain Submissions) ──
export const PlayerReview = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [filterCapt, setFilterCapt] = useState('all');

    const load = useCallback(() => {
        getPlayerReportsForCoach().then(r => { setReports(r.data.reports); setLoading(false); }).catch(() => setLoading(false));
    }, []);
    useEffect(() => { load(); }, [load]);

    const captainNames = [...new Set(reports.map(r => r.captain_name))];

    const handleApprove = async (report_id, status = 'Final Approved') => {
        setMsg(''); setErr('');
        try {
            await approvePlayerReport(report_id, { status });
            setMsg(status === 'Rejected' ? '❌ Report rejected' : '✅ Report finalized and approved'); 
            load();
        } catch { setErr('Operation failed'); }
    };

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Review Squad Reports</h1>
                <p style={{ color: 'var(--text-muted)' }}>Validate reports submitted by Captains. Final authority rests with the Coach.</p>
            </div>

            <Alert msg={msg} type="success" /><Alert msg={err} type="error" />

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filter by Captain</label>
                    <select className="glass-input" style={{ width: '200px', marginTop: '4px' }} value={filterCapt} onChange={e => setFilterCapt(e.target.value)}>
                        <option value="all">All Captains</option>
                        {captainNames.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
            </div>

            <div className="glass-table-container">
                <table className="glass-table">
                    <thead><tr><th>Player</th><th>Captain</th><th>Date</th><th>Stats</th><th>Status</th><th>Verification</th></tr></thead>
                    <tbody>
                        {reports.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No pending submissions from your Captains</td></tr>
                        ) : reports.filter(r => filterCapt === 'all' || r.captain_name === filterCapt).map(r => (
                            <tr key={r.report_id}>
                                <td>
                                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{r.player_name}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: #{r.player_id}</div>
                                </td>
                                <td>{r.captain_name}</td>
                                <td>{new Date(r.date).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ fontSize: '0.85rem' }}>
                                        <span style={{ color: r.attendance === 'Present' ? 'var(--accent-success)' : 'var(--accent-danger)', fontWeight: 700 }}>{r.attendance.toUpperCase()}</span>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Disc: {r.discipline}/10 | {r.training_hours}h</div>
                                    </div>
                                </td>
                                <td><StatusBadge status={r.status} /></td>
                                <td>
                                    {r.status === 'Pending' ? (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="glass-button primary-btn" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => handleApprove(r.report_id, 'Final Approved')}>APPROVE</button>
                                            <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--accent-danger)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => handleApprove(r.report_id, 'Rejected')}>REJECT</button>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>RECORD LOCKED</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─── Legacy export alias (still used in Dashboard routes) ─────────────────────
export const CaptainEntry = LeadershipManagement;
export const CoachApproval = PlayerReview;
