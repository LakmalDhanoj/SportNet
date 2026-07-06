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
