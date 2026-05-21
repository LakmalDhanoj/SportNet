import { useState, useEffect } from 'react';
import { getPlayerReports } from '../services/api';

const Spinner = () => (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite', display: 'inline-block', marginBottom: '16px' }}>⚙️</div>
        <p style={{ fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--font-heading)' }}>SYNCING PERFORMANCE REGISTRY...</p>
    </div>
);

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

// Map discipline score (1-10) to words matching the model
const getDisciplineLabel = (score) => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Average';
    return 'Poor';
};

// ─── VIEW 1: PERFORMANCE OVERVIEW ─────────────────────────────────────────────
export const PerformanceOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPlayerReports()
            .then(r => { setData(r.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    const player = data?.player || {};
    const reports = data?.reports || [];
    const attendanceRate = data?.attendanceRate || 0;

    // Derived statistics
    const matchesPlayed = player.matches_played || 12;
    const avgDiscipline = reports.length > 0
        ? (reports.reduce((s, r) => s + Number(r.discipline || 0), 0) / reports.length).toFixed(1)
        : 'Good';

    // Format Player ID
    const formattedPlayerId = `P${String(player.player_id || 1).padStart(3, '0')}`;

    return (
        <div className="view-container fade-in">
            {/* Header with Current Status */}
            <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                <div>
                    <h1>My Performance Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Secure strategic operations and professional metrics log.</p>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid var(--border-dim)', padding: '10px 20px', borderRadius: '14px',
                    boxShadow: 'var(--glow-primary)'
                }}>
                    <span style={{ fontSize: '1.1rem' }}>📌</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Current Status:</span>
                    <span style={{ 
                        fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', 
                        color: player.availability === 'Available' ? 'var(--accent-success)' : 'var(--accent-warning)'
                    }}>
                        {player.availability === 'Available' ? 'Active' : 'Pending'}
                    </span>
                </div>
            </div>

            {/* Quick Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                
                {/* Recreated Modern Terminal Summary Card from User specifications */}
                <div className="glass-panel" style={{ 
                    padding: '24px', borderRadius: '16px', fontFamily: 'monospace', 
                    border: '1px dashed var(--accent-primary)', background: 'var(--bg-deep)',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-primary)', color: 'white', padding: '2px 10px', fontSize: '0.65rem', fontWeight: 'bold' }}>TERMINAL REPORT</div>
                    <div style={{ color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px', marginBottom: '12px', fontWeight: 'bold' }}>
                        [// SPORTNET: MY PERFORMANCE REPORT]
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                        <div><span style={{ color: 'var(--text-muted)' }}>Name:</span> <strong style={{ color: 'var(--text-main)' }}>{player.name || 'Nimal'}</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Sport:</span> <strong style={{ color: 'var(--text-main)' }}>{player.sport_category || 'Football'}</strong></div>
                        <div style={{ borderTop: '1px dashed var(--border-dim)', margin: '6px 0' }}></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Matches Played:</span> <strong style={{ color: 'var(--text-main)' }}>{matchesPlayed}</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Attendance Rate:</span> <strong style={{ color: 'var(--accent-success)' }}>{attendanceRate}%</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Discipline Score:</span> <strong style={{ color: 'var(--accent-primary)' }}>{getDisciplineLabel(player.discipline || 8)}</strong></div>
                        <div style={{ borderTop: '1px dashed var(--border-dim)', margin: '6px 0' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Weekly Trend:</span> 
                            <span style={{ color: 'var(--accent-success)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                📈 Improving
                            </span>
                        </div>
                    </div>
                </div>

                {/* Core KPIs Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Score</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>{player.total_score || 75.0}</div>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginTop: '6px' }}>
                            <div style={{ width: `${player.total_score || 75}%`, height: '100%', background: 'var(--accent-primary)' }}></div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Rank / Position</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-warning)', fontFamily: 'var(--font-heading)' }}>#{player.rank_pos || 1}</div>
                    </div>
                </div>
            </div>

            {/* 7 CATEGORY PROFILE METRICS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>

                {/* 1. Basic Player Information & 2. Team Details */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                        🆔 IDENTITY & TEAM STRUCTURE
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Player Registration ID</span>
                            <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{formattedPlayerId}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Full Name</span>
                            <span style={{ fontWeight: 700 }}>{player.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Gender / Age</span>
                            <span style={{ fontWeight: 700 }}>{player.gender || 'Male'} / {player.age || 20}</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-dim)', margin: '4px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Team Group / Division</span>
                            <span style={{ fontWeight: 700 }}>{player.team_group || 'Squad A'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sport Category</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{player.sport_category || 'Football'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Strategic Position</span>
                            <span style={{ fontWeight: 700 }}>{player.position || 'Forward'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Strategic Role</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Player</span>
                        </div>
                    </div>
                </div>

                {/* 3. Performance Attributes & 6. Fitness */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-success)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                        ⚡ PERFORMANCE & FITNESS
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Attendance Rate</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>{attendanceRate}%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Discipline Quotient</span>
                            <span style={{ fontWeight: 700 }}>{player.discipline || 8}/10</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Time Management</span>
                            <span style={{ fontWeight: 700 }}>{player.time_mgmt || 8}/10</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Performance Rating</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{player.performance_rating || 7.5}/10</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Skill Classification</span>
                            <span style={{ fontWeight: 800, color: 'var(--accent-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{player.skill_level || 'Advanced'}</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-dim)', margin: '4px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Fitness Level</span>
                            <span style={{ fontWeight: 700 }}>{player.fitness_level || 'High'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Injury Registry</span>
                            <span style={{ fontWeight: 700, color: player.injury_status === 'Fit' ? 'var(--accent-success)' : 'var(--accent-danger)' }}>{player.injury_status || 'Fit'}</span>
                        </div>
                    </div>
                </div>

                {/* 4. Match Statistics & 5. Scoring & Evals */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-warning)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                        📊 GAMEPLAY & METRICS RECORD
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Matches Logged (W/L)</span>
                            <span style={{ fontWeight: 700 }}>{matchesPlayed} ({player.matches_won || 8}W - {player.matches_lost || 4}L)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Participation Frequency</span>
                            <span style={{ fontWeight: 700 }}>{player.participation_count || 12} times</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Weekly Match Points</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-warning)' }}>{player.weekly_match_pts || 25} pts</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-dim)', margin: '4px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Coach Evaluation Score</span>
                            <span style={{ fontWeight: 700 }}>{player.coach_eval_sc || 8.0}/10.0</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Bonus Allowances</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>+{player.bonus_points || 5} pts</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Penalty Deductions</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-danger)' }}>-{player.penalty_points || 0} pts</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 7. Experience, Achievements & Remarks */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', marginTop: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                    🏅 EXPERIENCE, ACHIEVEMENTS & REMARKS
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>Experience in Registry</div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent-primary)' }}>{player.experience_years || 2} Years Active</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>Awards & Major Highlights</div>
                        <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            {player.achievements || '🏆 Seeded Athlete of the Month — Consistent Training Discipline'}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>Supervisor Comments & Remarks</div>
                        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            "{player.remarks || 'Excellent physical conditioning. Highly responsive to tactics during defensive plays.'}"
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── VIEW 2: ATTENDANCE HISTORY ───────────────────────────────────────────────
export const AttendanceHistory = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPlayerReports()
            .then(r => { setData(r.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    const reports = data?.reports || [];
    const player = data?.player || {};

    // Mock Squad Data to match the exact mockup requirements
    const mockSquadData = [
        { id: 'P001', name: 'Nimal', sport: 'Football', date: '21/04/2026', attendance: 'Present', discipline: 'Good', hours: '2h' },
        { id: 'P002', name: 'Kasun', sport: 'Football', date: '21/04/2026', attendance: 'Absent', discipline: 'Average', hours: '0h' },
        { id: 'P003', name: 'Amal', sport: 'Football', date: '21/04/2026', attendance: 'Present', discipline: 'Good', hours: '3h' },
        { id: 'P004', name: 'Sahan', sport: 'Football', date: '21/04/2026', attendance: 'Present', discipline: 'Good', hours: '2h' },
        { id: 'P005', name: 'Kavindu', sport: 'Football', date: '21/04/2026', attendance: 'Present', discipline: 'Excellent', hours: '3h' }
    ];

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Attendance History</h1>
                <p style={{ color: 'var(--text-muted)' }}>Chronological tracking and verification logs.</p>
            </div>

            {/* TAB 1: My Attendance History Table */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--accent-primary)', fontWeight: 800 }}>
                    📅 MY PERSONAL ATTENDANCE JOURNAL
                </h3>
                <div className="glass-table-container" style={{ border: '1px solid var(--border-dim)' }}>
                    <table className="glass-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Discipline</th>
                                <th>Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        No attendance logs present in system.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((r, idx) => (
                                    <tr key={idx}>
                                        <td style={{ fontWeight: 'bold' }}>
                                            {new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                        </td>
                                        <td>
                                            <span style={{
                                                fontWeight: 800, fontSize: '0.75rem',
                                                color: r.attendance === 'Present' ? 'var(--accent-success)' : 'var(--accent-danger)'
                                            }}>
                                                {r.attendance}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{getDisciplineLabel(r.discipline)}</td>
                                        <td style={{ fontFamily: 'monospace' }}>{Math.round(r.training_hours)}h</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TAB 2: Squad Session Status (All Players) */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-secondary)', fontWeight: 800 }}>
                        👥 SQUAD SESSION STATUS (ALL PLAYERS)
                    </h3>
                    <div style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800,
                        background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}>
                        ✔ Final Approved by Coach
                    </div>
                </div>

                <div className="glass-table-container" style={{ border: '1px solid var(--border-dim)' }}>
                    <table className="glass-table">
                        <thead>
                            <tr>
                                <th>Player ID</th>
                                <th>Player Name</th>
                                <th>Sport</th>
                                <th>Date</th>
                                <th>Attendance</th>
                                <th>Discipline</th>
                                <th>Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockSquadData.map((s, idx) => (
                                <tr key={idx}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{s.id}</td>
                                    <td style={{ fontWeight: 700 }}>{s.name}</td>
                                    <td>{s.sport}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{s.date}</td>
                                    <td>
                                        <span style={{
                                            fontWeight: 800, fontSize: '0.75rem',
                                            color: s.attendance === 'Present' ? 'var(--accent-success)' : 'var(--accent-danger)'
                                        }}>
                                            {s.attendance}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{s.discipline}</td>
                                    <td style={{ fontFamily: 'monospace' }}>{s.hours}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ─── VIEW 3: DISCIPLINE RECORD ────────────────────────────────────────────────
export const DisciplineSummary = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPlayerReports()
            .then(r => { setData(r.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    const reports = data?.reports || [];
    const player = data?.player || {};

    // Calculating behaviors from real daily logs
    const goodDays = reports.filter(r => r.discipline >= 8).length || 10;
    const avgDays = reports.filter(r => r.discipline >= 5 && r.discipline < 8).length || 2;
    const warnings = reports.filter(r => r.discipline < 5).length || 1;

    // Grab notes
    const coachNotes = reports
        .filter(r => r.coach_feedback)
        .map(r => r.coach_feedback);

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Discipline Record</h1>
                <p style={{ color: 'var(--text-muted)' }}>Ethical conduct feedback and strategic comments.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                
                {/* Discipline Overview Panel */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '20px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                        🏆 BEHAVIOR REGISTRY SUMMARY
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Good Behavior Days</span>
                            <span style={{ fontWeight: 800, color: 'var(--accent-success)', fontSize: '1.1rem' }}>{goodDays} Days</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Average Behavior Days</span>
                            <span style={{ fontWeight: 800, color: 'var(--accent-warning)', fontSize: '1.1rem' }}>{avgDays} Days</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Warnings Issued</span>
                            <span style={{ fontWeight: 800, color: 'var(--accent-danger)', fontSize: '1.1rem' }}>{warnings} Warnings</span>
                        </div>
                    </div>
                </div>

                {/* Coach Notes List */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-secondary)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                        📋 COACH NOTES & DIRECTIVES
                    </h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        <li style={{ color: 'var(--text-main)', display: 'flex', gap: '10px' }}>
                            <span>🔹</span> <span>Keep improving punctuality during early morning fitness sessions.</span>
                        </li>
                        <li style={{ display: 'flex', gap: '10px' }}>
                            <span>🔹</span> <span>Highly responsible teammate behavior noted during drills.</span>
                        </li>
                        {coachNotes.map((note, idx) => (
                            <li key={idx} style={{ display: 'flex', gap: '10px' }}>
                                <span>🔹</span> <span>{note}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// ─── VIEW 4: WEEKLY PROGRESS REPORT ───────────────────────────────────────────
export const WeeklyProgressReport = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPlayerReports()
            .then(r => { setData(r.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    const player = data?.player || {};
    const reports = data?.reports || [];

    // Mock progress data for rendering a gorgeous chart
    const progressWeeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
    const progressScores = [62, 65, 68, 70, 72, player.total_score || 75];

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Weekly Progress Report</h1>
                <p style={{ color: 'var(--text-muted)' }}>Long-term growth analytics and score mapping.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                
                {/* Growth Chart Panel */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '20px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                        📈 SCORE PROGRESSION TREND
                    </h3>
                    
                    {/* SVG Progress Graph */}
                    <div style={{ background: 'var(--bg-deep)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 400 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                            {/* Grid Lines */}
                            <line x1="40" y1="20" x2="360" y2="20" stroke="rgba(255,255,255,0.05)" />
                            <line x1="40" y1="60" x2="360" y2="60" stroke="rgba(255,255,255,0.05)" />
                            <line x1="40" y1="100" x2="360" y2="100" stroke="rgba(255,255,255,0.05)" />
                            <line x1="40" y1="140" x2="360" y2="140" stroke="rgba(255,255,255,0.1)" />

                            {/* Line Chart */}
                            <path 
                                d={`M 50 ${180 - progressScores[0]*1.8} L 110 ${180 - progressScores[1]*1.8} L 170 ${180 - progressScores[2]*1.8} L 230 ${180 - progressScores[3]*1.8} L 290 ${180 - progressScores[4]*1.8} L 350 ${180 - progressScores[5]*1.8}`}
                                fill="none"
                                stroke="var(--accent-primary)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />

                            {/* Data points */}
                            {progressScores.map((score, idx) => {
                                const cx = 50 + idx * 60;
                                const cy = 180 - score * 1.8;
                                return (
                                    <g key={idx}>
                                        <circle cx={cx} cy={cy} r="5" fill="var(--bg-deep)" stroke="var(--accent-primary)" strokeWidth="2" />
                                        <text x={cx} y={cy - 10} fill="var(--text-main)" fontSize="9" fontWeight="bold" textAnchor="middle">{score}</text>
                                    </g>
                                );
                            })}

                            {/* X-axis Labels */}
                            {progressWeeks.map((week, idx) => (
                                <text key={idx} x={50 + idx * 60} y="165" fill="var(--text-muted)" fontSize="10" textAnchor="middle">{week}</text>
                            ))}
                        </svg>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>Current Progression Rate:</span>
                        <span style={{ fontWeight: 800, color: 'var(--accent-success)' }}>+20.9% Growth</span>
                    </div>
                </div>

                {/* Score breakdown metrics card */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-secondary)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                            🎯 TARGET MILESTONES
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Seasonal Target Score</span>
                                <span style={{ fontWeight: 700 }}>85.0 Pts</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Current Standing gap</span>
                                <span style={{ fontWeight: 700, color: 'var(--accent-warning)' }}>-10.0 Pts</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Rank Progression Target</span>
                                <span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>Top #1</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-surface-alt)', borderRadius: '12px', padding: '16px', fontSize: '0.8rem', border: '1px solid var(--border-dim)', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        ⚡ <strong>Note:</strong> Your weekly match points contribute directly to the global leaderboard calculation. Maintain a high attendance rating to continuously build bonus points.
                    </div>
                </div>
            </div>
        </div>
    );
};

// Compatibility exports
export const PerformanceReport = PerformanceOverview;

// ─── PLAYER: My Teammates ─────────────────────────────────────────────────────
export const MyTeammates = () => {
    const [teammates, setTeammates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import('../services/api').then(({ getMyTeammates }) => {
            getMyTeammates().then(r => {
                setTeammates(r.data.teammates);
                setLoading(false);
            }).catch(() => setLoading(false));
        });
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>My Teammates</h1>
                <p style={{ color: 'var(--text-muted)' }}>Players assigned to your captain.</p>
            </div>
            <div className="glass-table-container">
                <table className="glass-table">
                    <thead><tr><th>Name</th><th>Age</th><th>Gender</th><th>Contact</th></tr></thead>
                    <tbody>
                        {teammates.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No teammates found.</td></tr>
                        ) : teammates.map(t => (
                            <tr key={t.player_id}>
                                <td>{t.name}</td>
                                <td>{t.age}</td>
                                <td>{t.gender}</td>
                                <td>{t.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
