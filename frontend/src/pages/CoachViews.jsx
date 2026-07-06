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

// ─── COACH: Pending Captain Submissions ───────────────────────────────────────
export const PendingApprovals = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    const load = useCallback(() => {
        import('../services/api').then(({ getPlayerReportsForCoach }) => {
            getPlayerReportsForCoach().then(r => { setReports(r.data.reports.filter(x => x.status === 'Pending')); setLoading(false); }).catch(() => setLoading(false));
        });
    }, []);
    useEffect(() => { load(); }, [load]);

    const handleBulkApprove = async (captain_id) => {
        const { bulkApproveByCaption } = await import('../services/api');
        try {
            await bulkApproveByCaption(captain_id);
            setMsg('✅ System locked: All records for captain approved.');
            load();
        } catch { alert('Failed'); }
    };

    if (loading) return <Spinner />;

    // Group by captain
    const grouped = reports.reduce((acc, r) => {
        if (!acc[r.captain_id]) acc[r.captain_id] = { name: r.captain_name, count: 0 };
        acc[r.captain_id].count++;
        return acc;
    }, {});

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Pending Captain Submissions</h1>
                <p style={{ color: 'var(--text-muted)' }}>Coach approves everything, system locks records.</p>
            </div>
            <Alert msg={msg} type="success" />

            {Object.keys(grouped).length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No pending submissions waiting for approval.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {Object.entries(grouped).map(([capId, data]) => (
                        <div key={capId} className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0' }}>Captain: {data.name}</h3>
                                <div style={{ color: 'var(--accent-warning)', fontWeight: 700, fontSize: '0.85rem' }}>Status: Waiting Approval ({data.count} items)</div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="glass-button" style={{ borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}>VIEW DETAILS</button>
                                <button className="glass-button primary-btn" onClick={() => handleBulkApprove(capId)}>APPROVE ALL</button>
                                <button className="glass-button" style={{ borderColor: 'var(--accent-danger)', color: 'var(--accent-danger)' }}>REJECT ALL</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Legacy export alias (still used in Dashboard routes) ─────────────────────
export const CaptainEntry = LeadershipManagement;
export const CoachApproval = PlayerReview;

// ─── COACH: Pending Player Registrations (NEW) ───────────────────────────────────
export const PendingPlayersReview = () => {
    const [players, setPlayers] = useState([]);
    const [captains, setCaptains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const [selectedCaptain, setSelectedCaptain] = useState({});

    const load = () => {
        import('../services/api').then(({ getPendingPlayers, getMyCaptains }) => {
            Promise.all([getPendingPlayers(), getMyCaptains()]).then(([pRes, cRes]) => {
                setPlayers(pRes.data.players);
                setCaptains(cRes.data.captains);
                setLoading(false);
            }).catch(() => setLoading(false));
        });
    };
    useEffect(() => { load(); }, []);

    const handleApprove = async (playerId) => {
        const capId = selectedCaptain[playerId];
        if (!capId) {
            alert('Please select a captain first.');
            return;
        }
        setMsg('');
        try {
            const { approvePlayer } = await import('../services/api');
            await approvePlayer(playerId, { captain_id: capId });
            setMsg('✅ Player approved and assigned.');
            load();
        } catch (e) {
            alert('Approval failed.');
        }
    };

    if (loading) return <div style={{textAlign: 'center', padding: '40px'}}>Loading...</div>;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Pending Player Registrations</h1>
                <p style={{ color: 'var(--text-muted)' }}>Approve new self-registered players and assign them to a captain.</p>
            </div>
            {msg && <div style={{ padding: '10px', background: 'rgba(16,185,129,0.1)', color: '#10b981', marginBottom: '15px' }}>{msg}</div>}
            
            <div className="glass-table-container">
                <table className="glass-table">
                    <thead><tr><th>Player Details</th><th>Age / Gender</th><th>Sport / Position</th><th>Assign Captain</th><th>Actions</th></tr></thead>
                    <tbody>
                        {players.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No pending registrations.</td></tr>
                        ) : players.map(p => (
                            <tr key={p.player_id}>
                                <td>
                                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.email}</div>
                                </td>
                                <td>{p.age} / {p.gender}</td>
                                <td>{p.sport_category || 'Football'} / {p.position || 'N/A'}</td>
                                <td>
                                    <select className="glass-input" value={selectedCaptain[p.player_id] || ''} onChange={(e) => setSelectedCaptain({...selectedCaptain, [p.player_id]: e.target.value})} style={{ padding: '5px' }}>
                                        <option value="">-- Select Captain --</option>
                                        {captains.map(c => <option key={c.captain_id} value={c.captain_id}>{c.name}</option>)}
                                    </select>
                                </td>
                                <td>
                                    <button className="glass-button primary-btn" style={{ padding: '6px 12px' }} onClick={() => handleApprove(p.player_id)}>Approve</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─── COACH: Add Player Directly (NEW) ───────────────────────────────────
export const AddPlayerDirectly = () => {
    const [captains, setCaptains] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', gender: 'Male', age: '', captain_id: '' });
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        import('../services/api').then(({ getMyCaptains }) => {
            getMyCaptains().then(r => setCaptains(r.data.captains)).catch(console.error);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.captain_id) return alert('Select a captain');
        setLoading(true); setMsg(''); setErr('');

        const email = formData.email.toLowerCase();
        const isCampusEmail = email.endsWith('.edu') || email.endsWith('.ac.lk') || email.endsWith('.edu.lk') || email.endsWith('@sportnet.com');
        if (!isCampusEmail) {
            setErr('Please use a valid campus email address (ending with .edu, .ac.lk, or .edu.lk).');
            setLoading(false);
            return;
        }

        try {
            const { coachAddPlayer } = await import('../services/api');
            await coachAddPlayer(formData);
            setMsg('✅ Player created and assigned successfully.');
            setFormData({ name: '', email: '', password: '', gender: 'Male', age: '', captain_id: '' });
        } catch (ex) {
            setErr(ex.response?.data?.message || 'Failed to add player');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Add Player Directly</h1>
                <p style={{ color: 'var(--text-muted)' }}>Create a player profile that is automatically approved.</p>
            </div>
            {msg && <div style={{ padding: '10px', background: 'rgba(16,185,129,0.1)', color: '#10b981', marginBottom: '15px' }}>{msg}</div>}
            {err && <div style={{ padding: '10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', marginBottom: '15px' }}>{err}</div>}
            
            <form className="glass-panel" onSubmit={handleSubmit} style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{display:'block', marginBottom:'5px', color:'var(--text-muted)'}}>Assign to Captain</label>
                    <select className="glass-input" value={formData.captain_id} onChange={e => setFormData({...formData, captain_id: e.target.value})} style={{ width: '100%', background: 'var(--bg-deep)' }}>
                        <option value="">-- Select Captain --</option>
                        {captains.map(c => <option key={c.captain_id} value={c.captain_id}>{c.name}</option>)}
                    </select>
                </div>
                <div><label style={{display:'block', marginBottom:'5px', color:'var(--text-muted)'}}>Name</label><input type="text" className="glass-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%' }} required /></div>
                <div><label style={{display:'block', marginBottom:'5px', color:'var(--text-muted)'}}>Email</label><input type="email" className="glass-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%' }} required /></div>
                <div><label style={{display:'block', marginBottom:'5px', color:'var(--text-muted)'}}>Password</label><input type="password" className="glass-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%' }} required /></div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}><label style={{display:'block', marginBottom:'5px', color:'var(--text-muted)'}}>Gender</label><select className="glass-input" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} style={{ width: '100%', background: 'var(--bg-deep)' }}><option value="Male">Male</option><option value="Female">Female</option></select></div>
                    <div style={{ flex: 1 }}><label style={{display:'block', marginBottom:'5px', color:'var(--text-muted)'}}>Age</label><input type="number" className="glass-input" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} style={{ width: '100%' }} required /></div>
                </div>
                <button type="submit" className="glass-button primary-btn" disabled={loading} style={{ height: '50px', marginTop: '10px' }}>{loading ? 'ADDING...' : 'ADD PLAYER'}</button>
            </form>
        </div>
    );
};

export const CoachPlayerRequestsReview = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [actioning, setActioning] = useState(false);

    const loadRequests = useCallback(async () => {
        try {
            const { getCoachRequests } = await import('../services/api');
            const res = await getCoachRequests();
            setRequests(res.data.requests || []);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

    const handleDecision = async (requestId, decision) => {
        setActioning(true); setMsg(''); setErr('');
        try {
            const { reviewPlayerRequest } = await import('../services/api');
            const res = await reviewPlayerRequest(requestId, decision);
            setMsg(`✅ Request ${decision.toLowerCase()} successfully: ${res.data.message}`);
            loadRequests();
        } catch (ex) {
            setErr(ex.response?.data?.message || 'Error processing request decision.');
        } finally {
            setActioning(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Captain's Player Submissions</h1>
                <p style={{ color: 'var(--text-muted)' }}>Review and approve registrations submitted by squad captains.</p>
            </div>

            <Alert msg={msg} type="success" />
            <Alert msg={err} type="error" />

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px', marginBottom: '16px' }}>
                    ⏳ PENDING SQUAD REGISTRATIONS
                </h3>
                <div className="glass-table-container">
                    <table className="glass-table" style={{ fontSize: '0.85rem' }}>
                        <thead>
                            <tr>
                                <th>Captain Name</th>
                                <th>Player Details</th>
                                <th>Gender/Age</th>
                                <th>Sport/Position</th>
                                <th>System Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                        No pending player registration requests from captains.
                                    </td>
                                </tr>
                            ) : requests.map((req) => (
                                <tr key={req.request_id}>
                                    <td>
                                        <strong style={{ color: 'var(--accent-secondary)' }}>{req.captain_name}</strong>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{req.player_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.player_email}</div>
                                    </td>
                                    <td>{req.gender || 'N/A'}, Age: {req.age || 'N/A'}</td>
                                    <td>{req.sport_category || 'Football'} / {req.position || 'Midfielder'}</td>
                                    <td>
                                        {req.is_duplicate === 1 ? (
                                            <span style={{ color: 'var(--accent-danger)', fontWeight: 800, fontSize: '0.75rem' }}>
                                                ⚠️ ALREADY REGISTERED
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--accent-success)', fontSize: '0.75rem', fontWeight: 600 }}>
                                                New Unique Account
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="glass-button primary-btn" style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                                onClick={() => handleDecision(req.request_id, 'Approved')} disabled={actioning}>
                                                Approve
                                            </button>
                                            <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--accent-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                                                onClick={() => handleDecision(req.request_id, 'Rejected')} disabled={actioning}>
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const CoachCommentsView = () => {
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
                <p style={{ color: 'var(--text-muted)' }}>Secure 1-to-1 notes and directives visible ONLY to the specific player and yourself.</p>
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
                                
                                {c.coach_reply_message ? (
                                    <div style={{ marginLeft: '24px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--accent-primary)', marginBottom: '4px' }}>
                                            <strong>Coach (You) Reply:</strong>
                                            <span>{new Date(c.coach_reply_date).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>{c.coach_reply_message}</p>
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
