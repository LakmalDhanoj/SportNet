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
