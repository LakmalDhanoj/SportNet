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

// ─── CAPTAIN: OVERVIEW DASHBOARD (8-Part Model) ─────────────────────────────
export const CaptainProfileOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import('../services/api').then(({ getCaptainOverview }) => {
            getCaptainOverview()
                .then(r => { setData(r.data); setLoading(false); })
                .catch(() => setLoading(false));
        });
    }, []);

    if (loading) return <Spinner />;

    // 8-Part fallback for robust rendering if DB data is missing
    const profile = data?.captainProfile || {
        captain_id: 1, name: 'Kasun Jayawardena', gender: 'Male', age: 24,
        team_group: 'A-Team', sport_category: 'Football', position: 'Forward', years_as_captain: 2,
        leadership_rt: 8.5, decision_making_rt: 8.0, communication_rt: 8.2, motivation_lvl: 9.0,
        matches_led: 24, matches_won: 18, matches_lost: 4, win_rate: 75.0, tournament_results: 'Regional Finals 2025 - Winner',
        attendance: 96.5, discipline: 9, time_mgmt: 10, responsibility_sc: 9.2,
        strategy_rt: 8.4, adaptability_rt: 8.6, planning_rt: 8.5,
        weekly_match_pts: 120, total_score: 88.5, coach_eval_sc: 9.0, player_feedback_rt: 9.1, rank_pos: 1,
        experience_years: 5, achievements: 'Best Striker 2024', remarks: 'Exceptional leader on the field.'
    };

    const formattedId = `CAP-${String(profile.captain_id).padStart(3, '0')}`;

    return (
        <div className="view-container fade-in">
            {/* Header */}
            <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                <div>
                    <h1>Captain Operation Profile</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Squad command and leadership metrics.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>Operation Status</div>
                    <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>ACTIVE LEADER</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                
                {/* 1. Basic Info & 2. Team Details */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                        🆔 IDENTITY & SQUAD ROLE
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Captain ID</span><span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-main)' }}>{formattedId}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Full Name</span><span style={{ fontWeight: 700 }}>{profile.name}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Gender / Age</span><span style={{ fontWeight: 700 }}>{profile.gender} / {profile.age}</span></div>
                        <div style={{ borderTop: '1px dashed var(--border-dim)', margin: '4px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Team / Group</span><span style={{ fontWeight: 700, color: 'var(--accent-warning)' }}>{profile.team_group || 'Alpha Squad'}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sport Category</span><span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{profile.sport_category || 'Football'}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Position</span><span style={{ fontWeight: 700 }}>{profile.position}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Leadership Tenure</span><span style={{ fontWeight: 700 }}>{profile.years_as_captain} Years</span></div>
                    </div>
                </div>

                {/* 3. Leadership & 6. Strategy */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-success)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                        🧠 COMMAND & STRATEGY
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Leadership Skill</span><span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>{profile.leadership_rt}/10</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Decision Making</span><span style={{ fontWeight: 700 }}>{profile.decision_making_rt}/10</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Communication</span><span style={{ fontWeight: 700 }}>{profile.communication_rt}/10</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Team Motivation</span><span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{profile.motivation_lvl}/10</span></div>
                        <div style={{ borderTop: '1px dashed var(--border-dim)', margin: '4px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Game Strategy</span><span style={{ fontWeight: 700 }}>{profile.strategy_rt}/10</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Adaptability</span><span style={{ fontWeight: 700 }}>{profile.adaptability_rt}/10</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Planning Ability</span><span style={{ fontWeight: 700 }}>{profile.planning_rt}/10</span></div>
                    </div>
                </div>

                {/* 4. Performance & 5. Discipline */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-warning)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                        📈 PERFORMANCE & CONDUCT
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Win Rate (As Captain)</span><span style={{ fontWeight: 900, color: 'var(--accent-warning)', fontSize: '1.1rem' }}>{profile.win_rate}%</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Matches (Led/Won/Lost)</span><span style={{ fontWeight: 700 }}>{profile.matches_led} / {profile.matches_won} / {profile.matches_lost}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tournament Results</span><span style={{ fontWeight: 700, fontSize: '0.8rem', textAlign: 'right', maxWidth: '140px' }}>{profile.tournament_results || 'N/A'}</span></div>
                        <div style={{ borderTop: '1px dashed var(--border-dim)', margin: '4px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Attendance</span><span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{profile.attendance}%</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Discipline Index</span><span style={{ fontWeight: 700 }}>{profile.discipline}/10</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Time & Responsibility</span><span style={{ fontWeight: 700 }}>{((Number(profile.time_mgmt) + Number(profile.responsibility_sc)) / 2).toFixed(1)}/10</span></div>
                    </div>
                </div>
            </div>

            {/* 7. Evaluation & 8. Additional Information */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', marginTop: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                    🏆 EVALUATION, AWARDS & REMARKS
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>Evaluated Scoring</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total System Score</span><span style={{ fontWeight: 900, color: 'var(--accent-success)' }}>{profile.total_score}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Coach Evaluation</span><span style={{ fontWeight: 700 }}>{profile.coach_eval_sc}/10</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Squad Feedback Rating</span><span style={{ fontWeight: 700 }}>{profile.player_feedback_rt}/10</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Current Global Rank</span><span style={{ fontWeight: 700, color: 'var(--accent-warning)' }}>#{profile.rank_pos || 1}</span></div>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>Key Achievements</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-warning)', lineHeight: '1.5' }}>{profile.achievements || 'Distinguished Squad Leadership.'}</div>
                        <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Experience: {profile.experience_years} Years Active</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>Coach Remarks</div>
                        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            "{profile.remarks || 'Outstanding leadership on and off the field. Effectively coordinates squad disciplines.'}"
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
                                            <option value="Late">Late</option>
                                            <option value="Training">Training</option>
                                            <option value="Medical Leave">Medical Leave</option>
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
                                        <input type="number" step="0.5" min="0" className="glass-input" 
                                            value={entries[p.player_id]?.training_hours || 0}
                                            onChange={e => {
                                                const v = parseFloat(e.target.value);
                                                update(p.player_id, 'training_hours', isNaN(v) || v < 0 ? 0 : v);
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === '-' || e.key === 'e') {
                                                    e.preventDefault();
                                                }
                                            }}
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

// ─── CAPTAIN: Squad List ──────────────────────────────────────────────────────
export const SquadList = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import('../services/api').then(({ getMyPlayers }) => {
            getMyPlayers().then(r => {
                setPlayers(r.data.players);
                setLoading(false);
            }).catch(() => setLoading(false));
        });
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Squad Roster</h1>
                <p style={{ color: 'var(--text-muted)' }}>All players currently assigned to your team.</p>
            </div>
            <div className="glass-table-container">
                <table className="glass-table">
                    <thead><tr><th>Name</th><th>Age</th><th>Gender</th><th>Sport</th><th>Position</th><th>Email</th><th>Status</th></tr></thead>
                    <tbody>
                        {players.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No players found in your squad.</td></tr>
                        ) : players.map(p => (
                            <tr key={p.player_id}>
                                <td>{p.name}</td>
                                <td>{p.age}</td>
                                <td>{p.gender}</td>
                                <td>{p.sport_category || 'Football'}</td>
                                <td>{p.position || 'N/A'}</td>
                                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.email}</td>
                                <td>
                                    <StatusBadge status={p.approval_status || 'Approved'} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const CaptainPlayerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ player_name: '', player_email: '', player_password: '', gender: 'Male', age: '', position: 'Midfielder' });

    const loadRequests = useCallback(async () => {
        try {
            const { getCaptainRequests } = await import('../services/api');
            const res = await getCaptainRequests();
            setRequests(res.data.requests || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); setMsg(''); setErr('');

        const email = form.player_email.toLowerCase();
        const isCampusEmail = email.endsWith('@stu.vau.ac.lk');
        if (!isCampusEmail) {
            setErr('Player email must end with @stu.vau.ac.lk.');
            setSaving(false);
            return;
        }

        try {
            const { submitPlayerRequest } = await import('../services/api');
            const res = await submitPlayerRequest({
                ...form,
                age: form.age ? parseInt(form.age) : null
            });
            if (res.data.isDuplicate) {
                setMsg('⚠️ Request submitted. This player email is already registered in the system (Duplicate Found).');
            } else {
                setMsg('✅ Player registration request submitted to your coach for review.');
            }
            setForm({ player_name: '', player_email: '', player_password: '', gender: 'Male', age: '', position: 'Midfielder' });
            loadRequests();
        } catch (error) {
            setErr(error.response?.data?.message || 'Error submitting player request.');
        } finally {
            setSaving(false);
        }
    };

    const handleRemove = async (requestId) => {
        if (!window.confirm('Are you sure you want to retract/remove this request?')) return;
        setMsg(''); setErr('');
        try {
            const { removePlayerRequest } = await import('../services/api');
            await removePlayerRequest(requestId);
            setMsg('✅ Request removed/retracted successfully.');
            loadRequests();
        } catch (error) {
            setErr(error.response?.data?.message || 'Error removing request.');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Player Registration Requests</h1>
                <p style={{ color: 'var(--text-muted)' }}>Submit requests to register new players under your squad supervision.</p>
            </div>

            <Alert msg={msg} type="success" />
            <Alert msg={err} type="error" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {/* Request Form */}
                <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px', marginBottom: '8px' }}>
                        ➕ REQUEST NEW PLAYER
                    </h3>
                    <div className="form-group">
                        <label>Player Full Name</label>
                        <input type="text" className="glass-input" required value={form.player_name} onChange={e => setForm({...form, player_name: e.target.value})} style={{ width: '100%' }} />
                    </div>
                    <div className="form-group">
                        <label>Player Email</label>
                        <input type="email" className="glass-input" required value={form.player_email} onChange={e => setForm({...form, player_email: e.target.value})} style={{ width: '100%' }} />
                    </div>
                    <div className="form-group">
                        <label>Initial Passkey</label>
                        <input type="password" className="glass-input" required value={form.player_password} onChange={e => setForm({...form, player_password: e.target.value})} style={{ width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Gender</label>
                            <select className="glass-input" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} style={{ width: '100%', background: 'var(--bg-deep)' }}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Age</label>
                            <input type="number" min="1" className="glass-input" value={form.age} onChange={e => setForm({...form, age: e.target.value})} style={{ width: '100%' }} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Strategic Position</label>
                        <input type="text" className="glass-input" value={form.position} onChange={e => setForm({...form, position: e.target.value})} style={{ width: '100%' }} />
                    </div>
                    <button type="submit" className="glass-button primary-btn" style={{ width: '100%', height: '48px', fontWeight: 800 }} disabled={saving}>
                        {saving ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
                    </button>
                </form>

                {/* Submissions List */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', gridColumn: 'span 2' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-secondary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px', marginBottom: '16px' }}>
                        📋 SENT SQUAD REQUESTS
                    </h3>
                    <div className="glass-table-container" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                        <table className="glass-table" style={{ fontSize: '0.85rem' }}>
                            <thead>
                                <tr>
                                    <th>Player Info</th>
                                    <th>Strategic Details</th>
                                    <th>Request Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                            No player registration requests submitted yet.
                                        </td>
                                    </tr>
                                ) : requests.map((req) => (
                                    <tr key={req.request_id}>
                                        <td>
                                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{req.player_name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.player_email}</div>
                                        </td>
                                        <td>
                                            <div>{req.position}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.gender}, Age: {req.age || 'N/A'}</div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                                                <span style={{
                                                    padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                                                    background: req.status === 'Approved' ? 'rgba(34, 197, 94, 0.15)' :
                                                                req.status === 'Rejected' ? 'rgba(239, 68, 68, 0.15)' :
                                                                req.status === 'Duplicate Removed' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                                    color: req.status === 'Approved' ? '#4ade80' :
                                                           req.status === 'Rejected' ? '#f87171' :
                                                           req.status === 'Duplicate Removed' ? '#94a3b8' : '#fbbf24',
                                                    border: `1px solid ${req.status === 'Approved' ? '#22c55e' :
                                                                          req.status === 'Rejected' ? '#ef4444' :
                                                                          req.status === 'Duplicate Removed' ? '#64748b' : '#f59e0b'}`
                                                }}>{req.status}</span>
                                                {req.is_duplicate === 1 && req.status === 'Pending' && (
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-danger)', fontWeight: 800 }}>
                                                        ⚠️ REGISTERED IN SYSTEM
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {req.status === 'Pending' ? (
                                                <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--accent-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                                                    onClick={() => handleRemove(req.request_id)}>
                                                    Retract
                                                </button>
                                            ) : req.is_duplicate === 1 && req.status !== 'Duplicate Removed' ? (
                                                <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--text-muted)', borderColor: 'var(--border-dim)' }}
                                                    onClick={() => handleRemove(req.request_id)}>
                                                    Remove Warning
                                                </button>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>No Actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CaptainCommentsView = () => {
    const [comments, setComments] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [newComment, setNewComment] = useState('');
    const [replyText, setReplyText] = useState({});
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const { getComments, getMyPlayers } = await import('../services/api');
            const [cRes, pRes] = await Promise.all([
                getComments(),
                getMyPlayers()
            ]);
            setComments(cRes.data.comments || []);
            setPlayers(pRes.data.players || []);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!selectedPlayer) return alert('Please select a player to send comment.');
        if (!newComment.trim()) return;
        setSubmitting(true); setMsg(''); setErr('');
        try {
            const { addComment } = await import('../services/api');
            await addComment({ player_id: parseInt(selectedPlayer), message: newComment });
            setMsg('✅ Comment sent to player successfully.');
            setNewComment('');
            loadData();
        } catch (ex) {
            setErr(ex.response?.data?.message || 'Failed to send comment.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (commentId) => {
        const text = replyText[commentId];
        if (!text || !text.trim()) return;
        setSubmitting(true); setMsg(''); setErr('');
        try {
            const { replyComment } = await import('../services/api');
            await replyComment(commentId, text);
            setMsg('✅ Reply posted successfully.');
            setReplyText(prev => ({ ...prev, [commentId]: '' }));
            loadData();
        } catch (ex) {
            setErr(ex.response?.data?.message || 'Failed to reply.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResolve = async (commentId) => {
        setMsg(''); setErr('');
        try {
            const { resolveComment } = await import('../services/api');
            await resolveComment(commentId);
            setMsg('✅ Thread resolved and finalized.');
            loadData();
        } catch (ex) {
            setErr(ex.response?.data?.message || 'Failed to resolve.');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Private Athlete Communications</h1>
                <p style={{ color: 'var(--text-muted)' }}>Secure squad notes and directives visible ONLY to the specific player, the coach, and yourself.</p>
            </div>

            <Alert msg={msg} type="success" />
            <Alert msg={err} type="error" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {/* Send Comment Form */}
                <form onSubmit={handleSendComment} className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px', marginBottom: '8px' }}>
                        ✍️ SEND NOTE TO ATHLETE
                    </h3>
                    <div className="form-group">
                        <label>Select Player</label>
                        <select className="glass-input" value={selectedPlayer} onChange={e => setSelectedPlayer(e.target.value)} style={{ width: '100%', background: 'var(--bg-deep)' }} required>
                            <option value="">-- Choose Athlete --</option>
                            {players.map(p => <option key={p.player_id} value={p.player_id}>{p.name} ({p.position})</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Comment Message</label>
                        <textarea className="glass-input" rows="4" placeholder="Enter private note..." value={newComment} onChange={e => setNewComment(e.target.value)} style={{ width: '100%', resize: 'none' }} required></textarea>
                    </div>
                    <button type="submit" className="glass-button primary-btn" style={{ width: '100%', height: '48px', fontWeight: 800 }} disabled={submitting}>
                        {submitting ? 'SENDING...' : '✉️ SEND PRIVATE COMMENT'}
                    </button>
                </form>

                {/* Comments Stream */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', gridColumn: 'span 2' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-secondary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px', marginBottom: '16px' }}>
                        💬 SECURE COMMUNICATIONS THREADS
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '520px', overflowY: 'auto', paddingRight: '8px' }}>
                        {comments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                No communications history on file.
                            </div>
                        ) : comments.map((c) => (
                            <div key={c.comment_id} className="glass-card" style={{ padding: '16px', borderRadius: '12px', borderLeft: `4px solid ${c.status === 'Resolved' ? 'var(--accent-success)' : 'var(--accent-warning)'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <strong style={{ color: 'var(--text-main)' }}>Player: {c.player_name}</strong>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                                            background: c.status === 'Resolved' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                            color: c.status === 'Resolved' ? '#4ade80' : '#fbbf24',
                                            border: `1px solid ${c.status === 'Resolved' ? '#22c55e' : '#f59e0b'}`
                                        }}>{c.status}</span>
                                        {c.status === 'Active' && (
                                            <button className="glass-button" style={{ padding: '2px 8px', fontSize: '0.65rem', borderColor: 'var(--accent-success)', color: 'var(--accent-success)' }} onClick={() => handleResolve(c.comment_id)}>
                                                Resolve
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                        <span>Sender: {c.sender_role.toUpperCase()}</span>
                                        <span>{new Date(c.created_date).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>{c.message}</p>
                                </div>
                                
                                {c.captain_reply_message ? (
                                    <div style={{ marginLeft: '24px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--accent-success)', marginBottom: '4px' }}>
                                            <strong>Captain (You) Reply:</strong>
                                            <span>{new Date(c.captain_reply_date).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>{c.captain_reply_message}</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginLeft: '24px' }}>
                                        <input type="text" className="glass-input" placeholder="Type reply..." value={replyText[c.comment_id] || ''} onChange={e => setReplyText({ ...replyText, [c.comment_id]: e.target.value })} style={{ flex: 1, fontSize: '0.85rem' }} />
                                        <button className="glass-button primary-btn" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={() => handleReply(c.comment_id)}>Reply</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
