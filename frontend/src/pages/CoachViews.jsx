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

// ─── COACH: OVERVIEW DASHBOARD (8-Part Model) ────────────────────────────────
export const CoachProfileOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import('../services/api').then(({ getCoachOverview }) => {
            getCoachOverview()
                .then(r => { setData(r.data); setLoading(false); })
                .catch(() => setLoading(false));
        });
    }, []);

    if (loading) return <Spinner />;

    // 8-Part fallback for robust rendering if DB data is missing
    const profile = data?.coachProfile || {
        coach_id: 1, name: 'Mike Perera', gender: 'Male', age: 38,
        sport_category: 'Football', experience_years: 8, qualification: 'B.Sc. Sports Science', coaching_level: 'Professional',
        teams_assigned_count: 2, players_under_coaching: 45, captain_coordination_sc: 9.0,
        matches_coached: 120, matches_won: 85, matches_lost: 15, win_percentage: 70.8, tournament_results: 'National League Winners 2024',
        training_effectiveness_rt: 9.2, strategy_dev_rt: 9.5, decision_making_rt: 8.8,
        attendance: 98.0, discipline: 9, time_mgmt: 9, team_disc_improvement_sc: 8.5,
        overall_perf_score: 92.5, player_feedback_rt: 9.1, weekly_perf_rt: 9.0, total_score: 91.0, rank_pos: 2,
        achievements: 'Coach of the Year 2023', remarks: 'Excellent strategic mastermind.', specializations: 'Strategy, Fitness'
    };

    const formattedId = `COA-${String(profile.coach_id).padStart(3, '0')}`;

    return (
        <div className="view-container fade-in">
            {/* Header */}
            <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                <div>
                    <h1>Coach Operation Profile</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Squad management and training oversight metrics.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>Operation Status</div>
                    <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>ACTIVE MANAGEMENT</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                
                {/* 1. Basic Info & 2. Professional Details */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                        🆔 IDENTITY & PROFESSIONAL LOG
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Coach ID</span><span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-main)' }}>{formattedId}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Full Name</span><span style={{ fontWeight: 700 }}>{profile.name}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Gender / Age</span><span style={{ fontWeight: 700 }}>{profile.gender} / {profile.age}</span></div>
                        <div style={{ borderTop: '1px dashed var(--border-dim)', margin: '4px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sport Category</span><span style={{ fontWeight: 700, color: 'var(--accent-warning)' }}>{profile.sport_category || 'Football'}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Experience</span><span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{profile.experience_years} Years</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Coaching Level</span><span style={{ fontWeight: 700 }}>{profile.coaching_level}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Qualification</span><span style={{ fontWeight: 700, fontSize: '0.8rem', textAlign: 'right', maxWidth: '160px' }}>{profile.qualification}</span></div>
                    </div>
                </div>

                {/* 3. Team Management & 6. Discipline */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-success)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                        🌐 MANAGEMENT & DISCIPLINE
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Team / Group Assigned</span><span style={{ fontWeight: 700, color: 'var(--accent-warning)' }}>{profile.team_group || 'Alpha Squad'}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Teams Assigned</span><span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>{profile.teams_assigned_count} Squads</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Players Monitored</span><span style={{ fontWeight: 700 }}>{profile.players_under_coaching}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Captain Coordination</span><span style={{ fontWeight: 700 }}>{profile.captain_coordination_sc}/10</span></div>
                        <div style={{ borderTop: '1px dashed var(--border-dim)', margin: '4px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Attendance Output</span><span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{profile.attendance}%</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Coach Discipline</span><span style={{ fontWeight: 700 }}>{profile.discipline}/10</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Time Management</span><span style={{ fontWeight: 700 }}>{profile.time_mgmt}/10</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Squad Discipline Boost</span><span style={{ fontWeight: 700 }}>{profile.team_disc_improvement_sc}/10</span></div>
                    </div>
                </div>

                {/* 4. Performance & 5. Coaching Skills */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-warning)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                        📈 PERFORMANCE & SKILLS
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Win Percentage</span><span style={{ fontWeight: 900, color: 'var(--accent-warning)', fontSize: '1.1rem' }}>{profile.win_percentage}%</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Matches (Coached/Won/Lost)</span><span style={{ fontWeight: 700 }}>{profile.matches_coached} / {profile.matches_won} / {profile.matches_lost}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tournament Output</span><span style={{ fontWeight: 700, fontSize: '0.8rem', textAlign: 'right', maxWidth: '140px' }}>{profile.tournament_results || 'N/A'}</span></div>
                        <div style={{ borderTop: '1px dashed var(--border-dim)', margin: '4px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Training Effectiveness</span><span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{profile.training_effectiveness_rt}/10</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Strategy Development</span><span style={{ fontWeight: 700 }}>{profile.strategy_dev_rt}/10</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Decision Making</span><span style={{ fontWeight: 700 }}>{profile.decision_making_rt}/10</span></div>
                    </div>
                </div>
            </div>

            {/* 7. Evaluation & 8. Additional Information */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', marginTop: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                    🏆 EVALUATION, AWARDS & SPECIALIZATIONS
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>Evaluated Scoring</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total System Score</span><span style={{ fontWeight: 900, color: 'var(--accent-success)' }}>{profile.total_score}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Overall Performance</span><span style={{ fontWeight: 700 }}>{profile.overall_perf_score}/10</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Weekly Tracking Index</span><span style={{ fontWeight: 700 }}>{profile.weekly_perf_rt}/10</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Current Global Rank</span><span style={{ fontWeight: 700, color: 'var(--accent-warning)' }}>#{profile.rank_pos || 1}</span></div>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>Key Achievements</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-warning)', lineHeight: '1.5' }}>{profile.achievements || 'Recognized for excellent squad leadership.'}</div>
                        <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Feedback Rating: <span style={{color: 'var(--accent-primary)'}}>{profile.player_feedback_rt}/10</span></div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>Manager Remarks & Specialties</div>
                        <div style={{ color: 'var(--text-main)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600 }}>
                            Specializations: {profile.specializations || 'General Coaching'}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            "{profile.remarks || 'Displays high efficacy in training execution.'}"
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

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


// ─── COACH: Captain Attendance Entry (NEW) ───────────────────────────────────
export const CaptainAttendanceEntry = () => {
    const [captains, setCaptains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [form, setForm] = useState({ attendance: 'Present', discipline: 'Good', training_hours: 2, notes: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');

    useEffect(() => {
        import('../services/api').then(({ getMyCaptains }) => {
            getMyCaptains().then(r => { 
                setCaptains(r.data.captains); 
                setLoading(false); 
                if(r.data.captains.length > 0) setSelected(r.data.captains[0].captain_id); 
            }).catch(() => setLoading(false));
        });
    }, []);

    const handleSave = async () => {
        if (!selected) return;
        setSaving(true); setMsg(''); setErr('');
        try {
            const { submitCaptainReport } = await import('../services/api');
            await submitCaptainReport({ captain_id: selected, date, ...form, strategy_rt: 8, responsibility_rt: 8 });
            setMsg('✅ Captain Record successfully saved (Final Authority Data).');
        } catch (ex) {
            setErr(ex.response?.data?.message || 'Error saving record');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Spinner />;

    const capt = captains.find(c => c.captain_id.toString() === selected.toString());

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Captain Attendance & Discipline</h1>
                <p style={{ color: 'var(--text-muted)' }}>Coach holds final authority over Captain metrics.</p>
            </div>

            <Alert msg={msg} type="success" /><Alert msg={err} type="error" />

            <div className="glass-panel" style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', border: '1px solid var(--accent-primary)' }}>
                <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '15px' }}>
                    <div className="form-group">
                        <label>Select Captain</label>
                        <select className="glass-input" value={selected} onChange={e => setSelected(e.target.value)}>
                            {captains.map(c => <option key={c.captain_id} value={c.captain_id}>{c.name}</option>)}
                        </select>
                    </div>
                    {capt && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Sport:</span> <strong style={{ color: 'var(--accent-secondary)' }}>Football</strong></div>
                            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Leader ID:</span> <strong>CAP-{capt.captain_id}</strong></div>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Date</label>
                    <input type="date" className="glass-input" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Attendance</label>
                    <select className="glass-input" value={form.attendance} onChange={e => setForm({...form, attendance: e.target.value})}>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                        <option value="Training">Training</option>
                        <option value="Medical Leave">Medical Leave</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Discipline</label>
                    <select className="glass-input" value={form.discipline} onChange={e => setForm({...form, discipline: e.target.value})}>
                        <option value="Good">Good</option>
                        <option value="Average">Average</option>
                        <option value="Poor">Poor</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Training Hours</label>
                    <input type="number" step="0.5" min="0" className="glass-input" 
                        value={form.training_hours} 
                        onChange={e => {
                            const v = parseFloat(e.target.value);
                            setForm({...form, training_hours: isNaN(v) || v < 0 ? 0 : v});
                        }} 
                        onKeyDown={e => {
                            if (e.key === '-' || e.key === 'e') e.preventDefault();
                        }} />
                </div>
                <div className="form-group">
                    <label>Notes</label>
                    <input type="text" className="glass-input" placeholder="Feedback..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                </div>

                <button className="glass-button primary-btn" style={{ width: '100%', marginTop: '20px', height: '50px', fontSize: '1rem', fontWeight: 800 }} onClick={handleSave} disabled={saving || !selected}>
                    {saving ? 'SAVING...' : '💾 SAVE CAPTAIN RECORD'}
                </button>
            </div>
        </div>
    );
};

// ─── COACH: Player Attendance Review (Edit, Approve, Reject) ────────────────
export const PlayerReview = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const [editRow, setEditRow] = useState(null); // report_id currently being edited
    const [editForm, setEditForm] = useState({});

    const load = useCallback(() => {
        import('../services/api').then(({ getPlayerReportsForCoach }) => {
            getPlayerReportsForCoach().then(r => { setReports(r.data.reports); setLoading(false); }).catch(() => setLoading(false));
        });
    }, []);
    useEffect(() => { load(); }, [load]);

    const handleAction = async (report_id, actionType) => {
        setMsg('');
        const { approvePlayerReport } = await import('../services/api');
        try {
            if (actionType === 'Reject') {
                await approvePlayerReport(report_id, { status: 'Rejected' });
                setMsg('❌ Report rejected and sent back to captain.');
            } else if (actionType === 'Approve') {
                let data = { status: 'Final Approved' };
                if (editRow === report_id) {
                    data = { ...editForm, status: 'Final Approved' };
                } else {
                    const existing = reports.find(r => r.report_id === report_id);
                    data = { ...existing, status: 'Final Approved' };
                }
                await approvePlayerReport(report_id, data);
                setMsg('✅ Final data approved and locked.');
                setEditRow(null);
            }
            load();
        } catch { alert('Action failed'); }
    };

    const startEdit = (r) => {
        setEditRow(r.report_id);
        setEditForm({ attendance: r.attendance, discipline: r.discipline, training_hours: r.training_hours, notes: r.notes || '' });
    };

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Player Attendance Review</h1>
                <p style={{ color: 'var(--text-muted)' }}>Coach can fix mistakes, approve final data, or reject.</p>
            </div>
            <Alert msg={msg} />

            <div className="glass-table-container">
                <table className="glass-table">
                    <thead><tr><th>Player</th><th>Attendance</th><th>Discipline</th><th>Hours</th><th>Actions</th></tr></thead>
                    <tbody>
                        {reports.map(r => {
                            const isEditing = editRow === r.report_id;
                            return (
                                <tr key={r.report_id}>
                                    <td style={{ fontWeight: 700 }}>{r.player_name}</td>
                                    <td>
                                        {isEditing ? (
                                            <select className="glass-input" value={editForm.attendance} onChange={e => setEditForm({...editForm, attendance: e.target.value})} style={{ padding: '6px', fontSize: '0.8rem' }}>
                                                <option value="Present">Present</option>
                                                <option value="Absent">Absent</option>
                                                <option value="Late">Late</option>
                                                <option value="Training">Training</option>
                                                <option value="Medical Leave">Medical Leave</option>
                                            </select>
                                        ) : (
                                            <span style={{ 
                                                color: r.attendance === 'Present' ? 'var(--accent-success)' : 
                                                       r.attendance === 'Absent' ? 'var(--accent-danger)' : 
                                                       r.attendance === 'Medical Leave' ? '#94a3b8' : 'var(--accent-warning)', 
                                                fontWeight: 700 
                                            }}>{r.attendance}</span>
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <select className="glass-input" value={editForm.discipline} onChange={e => setEditForm({...editForm, discipline: e.target.value})} style={{ padding: '6px', fontSize: '0.8rem' }}>
                                                <option value="10">10 (Good)</option>
                                                <option value="5">5 (Average)</option>
                                                <option value="1">1 (Poor)</option>
                                            </select>
                                        ) : (
                                            <span>{r.discipline}/10</span>
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input type="number" step="0.5" min="0" className="glass-input" 
                                                value={editForm.training_hours} 
                                                onChange={e => {
                                                    const v = parseFloat(e.target.value);
                                                    setEditForm({...editForm, training_hours: isNaN(v) || v < 0 ? 0 : v});
                                                }}
                                                onKeyDown={e => {
                                                    if (e.key === '-' || e.key === 'e') e.preventDefault();
                                                }}
                                                style={{ width: '60px', padding: '6px' }} />
                                        ) : (
                                            <span>{r.training_hours}h</span>
                                        )}
                                    </td>
                                    <td>
                                        {r.status === 'Final Approved' ? (
                                            <StatusBadge status={r.status} />
                                        ) : (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {isEditing ? (
                                                    <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: '#94a3b8' }} onClick={() => setEditRow(null)}>CANCEL</button>
                                                ) : (
                                                    <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }} onClick={() => startEdit(r)}>EDIT</button>
                                                )}
                                                <button className="glass-button primary-btn" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => handleAction(r.report_id, 'Approve')}>APPROVE</button>
                                                <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--accent-danger)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => handleAction(r.report_id, 'Reject')}>REJECT</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {reports.length === 0 && (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No reports to review.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
