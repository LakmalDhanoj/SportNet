import { useState, useEffect } from 'react';
import { getPlayerReports } from '../services/api';

const Spinner = () => (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite', display: 'inline-block', marginBottom: '16px' }}>⚙️</div>
        <p style={{ fontWeight: 600, letterSpacing: '0.05em' }}>SYNCING PERFORMANCE DATA...</p>
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

// ─── PLAYER: Performance Overview ───────────────────────────────────────────
export const PerformanceOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPlayerReports().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    const reports = data?.reports ?? [];
    const avgDiscipline = reports.length > 0 
        ? (reports.reduce((s, r) => s + Number(r.discipline || 0), 0) / reports.length).toFixed(1) 
        : '0';
    
    const profile = {
        total_score: data?.player?.total_score || 85,
        discipline: avgDiscipline,
        skill_level: data?.player?.skill_level || 'ADVANCED',
        attendance_rate: data?.attendanceRate || '0%',
        sessions: reports.length,
        rank: 4
    };

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>My Performance Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Real-time statistics and evaluations from your coaching staff.</p>
            </div>

            <div className="stats-grid">
                <div className="glass-card stat-card">
                    <div className="stat-label">Overall Rating</div>
                    <div className="stat-value">{profile.total_score}</div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginTop: '8px' }}>
                        <div style={{ width: `${profile.total_score}%`, height: '100%', background: 'var(--accent-primary)' }}></div>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-label">Avg Discipline</div>
                    <div className="stat-value" style={{ color: 'var(--accent-success)' }}>{profile.discipline}/10</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-label">Skill Level</div>
                    <div className="stat-value" style={{ color: 'var(--accent-secondary)', fontSize: '1.8rem' }}>{profile.skill_level}</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-label">Attendance</div>
                    <div className="stat-value" style={{ color: 'var(--accent-warning)' }}>{profile.attendance_rate}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
                <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Engagement Stats</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Sessions Logged</span>
                            <span style={{ fontWeight: 700 }}>{profile.sessions}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Health Status</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>{data?.player?.injury_status || 'FIT'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Training Progress</span>
                            <span style={{ fontWeight: 700 }}>92%</span>
                        </div>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Recent Coach Feedback</h3>
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: '1.6' }}>
                        {reports.find(r => r.coach_feedback)?.coach_feedback || "No recent feedback. Continue maintaining your current discipline levels and focus on tactical execution."}
                    </p>
                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>HC</div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Performance Oversight</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── PLAYER: Attendance History ──────────────────────────────────────────────
export const AttendanceHistory = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPlayerReports().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    const reports = data?.reports ?? [];

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Attendance & Activity Log</h1>
                <p style={{ color: 'var(--text-muted)' }}>Detailed history of your participation and training hours verified by Coach.</p>
            </div>

            <div className="glass-table-container">
                <table className="glass-table">
                    <thead><tr><th>Date</th><th>Status</th><th>Discipline</th><th>Hours</th><th>Verification</th></tr></thead>
                    <tbody>
                        {reports.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No attendance records found in the system</td></tr>
                        ) : reports.map(r => (
                            <tr key={r.report_id}>
                                <td><strong style={{ color: 'var(--text-main)' }}>{new Date(r.date).toLocaleDateString()}</strong></td>
                                <td>
                                    <span style={{ 
                                        color: r.attendance === 'Present' ? 'var(--accent-success)' : 'var(--accent-danger)',
                                        fontWeight: 700, fontSize: '0.75rem'
                                    }}>● {r.attendance.toUpperCase()}</span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{ width: `${(r.discipline || 0) * 10}%`, height: '100%', background: 'var(--accent-success)' }}></div>
                                        </div>
                                        <span style={{ fontWeight: 600 }}>{r.discipline}/10</span>
                                    </div>
                                </td>
                                <td>{r.training_hours}h</td>
                                <td><StatusBadge status={r.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─── PLAYER: Discipline Summary ──────────────────────────────────────────────
export const DisciplineSummary = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPlayerReports().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    const reports = data?.reports ?? [];
    const avgDisc = reports.length > 0
        ? (reports.reduce((s, r) => s + Number(r.discipline), 0) / reports.length).toFixed(1)
        : 0;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Discipline & Health Log</h1>
                <p style={{ color: 'var(--text-muted)' }}>Monitor your conduct and physical readiness status.</p>
            </div>

            <div className="stats-grid">
                <div className="glass-card stat-card">
                    <div className="stat-label">Avg Discipline</div>
                    <div className="stat-value" style={{ color: 'var(--accent-success)' }}>{avgDisc}</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-label">Health Status</div>
                    <div className="stat-value" style={{ color: data?.player?.injury_status === 'Fit' ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                        {data?.player?.injury_status || 'FIT'}
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', marginTop: '24px' }}>
                <h4 style={{ marginBottom: '20px', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Conduct Trend</h4>
                <p style={{ lineHeight: 1.6 }}>
                    {avgDisc >= 8 
                        ? 'Your discipline record is exemplary. Coaches have noted your high level of responsibility during training sessions.' 
                        : 'Maintain focus on consistency. Punctuality and adherence to team rules are key to your growth.'}
                </p>
            </div>
        </div>
    );
};

// Legacy exports for compatibility
export const PerformanceReport = PerformanceOverview;
