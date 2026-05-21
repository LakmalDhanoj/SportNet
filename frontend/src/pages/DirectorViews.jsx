import { useState, useEffect } from 'react';
import { getDirectorOverview, getAllCaptains, getAllPlayers } from '../services/api';

const StatCard = ({ icon, label, value, color = 'var(--accent-primary)' }) => (
    <div className="glass-card stat-card">
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{icon}</div>
        <div className="stat-value" style={{ color }}>{value}</div>
        <div className="stat-label">{label}</div>
    </div>
);

const Spinner = () => (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite', display: 'inline-block', marginBottom: '16px' }}>⚙️</div>
        <p style={{ fontWeight: 600, letterSpacing: '0.05em' }}>COMPILING EXECUTIVE METRICS...</p>
    </div>
);

// ─── DIRECTOR: Annual Oversight ───────────────────────────────────────────────
export const AnnualOversight = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDirectorOverview()
            .then(r => { setStats(r.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    const approvalRate = stats?.total_submitted > 0
        ? Math.round((stats.total_approved / stats.total_submitted) * 100)
        : 0;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Annual Organizational Oversight</h1>
                <p style={{ color: 'var(--text-muted)' }}>High-level performance analysis across all sports departments.</p>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <StatCard icon="👥" label="Total Athletes" value={stats?.total_players ?? '—'} color="var(--accent-primary)" />
                <StatCard icon="🏅" label="Squad Captains" value={stats?.total_captains ?? '—'} color="var(--accent-secondary)" />
                <StatCard icon="🎽" label="Coaching Staff" value={stats?.total_coaches ?? '—'} color="var(--accent-success)" />
                <StatCard icon="✅" label="Verified Reports" value={stats?.total_approved ?? '—'} color="var(--accent-primary)" />
            </div>

            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', marginTop: '32px' }}>
                <h3 style={{ marginBottom: '24px' }}>System Verification Pipeline</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="metric-row">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontWeight: 600 }}>Global Approval Rate</span>
                            <span style={{ fontWeight: 800, color: 'var(--accent-success)' }}>{approvalRate}%</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', height: '14px', overflow: 'hidden' }}>
                            <div style={{ width: `${approvalRate}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-success))', borderRadius: '10px', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        <div>
                            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px', color: 'var(--text-muted)' }}>Departmental Distribution</h4>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '120px', paddingBottom: '10px', borderBottom: '1px solid var(--border-glass)' }}>
                                <div style={{ flex: 1, height: '80%', background: 'var(--accent-primary)', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                                    <span style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: 700 }}>{stats?.total_players}</span>
                                </div>
                                <div style={{ flex: 1, height: '40%', background: 'var(--accent-secondary)', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                                    <span style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: 700 }}>{stats?.total_captains}</span>
                                </div>
                                <div style={{ flex: 1, height: '25%', background: 'var(--accent-success)', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                                    <span style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: 700 }}>{stats?.total_coaches}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginTop: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                                <span>ATHLETES</span><span>CAPTAINS</span><span>STAFF</span>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px', color: 'var(--text-muted)' }}>Real-time Engagement</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <div style={{fontSize:'0.75rem', marginBottom:'8px', fontWeight: 600}}>Approved Logs</div>
                                    <div style={{width:'100%', background:'rgba(255,255,255,0.05)', height:'8px', borderRadius:'4px'}}>
                                        <div style={{width:`${Math.min(100, (stats?.total_approved/20)*100)}%`, height:'100%', background:'var(--accent-success)', borderRadius:'4px'}} />
                                    </div>
                                </div>
                                <div>
                                    <div style={{fontSize:'0.75rem', marginBottom:'8px', fontWeight: 600}}>Pending Review</div>
                                    <div style={{width:'100%', background:'rgba(255,255,255,0.05)', height:'8px', borderRadius:'4px'}}>
                                        <div style={{width:`${Math.min(100, (stats?.pending_reports/20)*100)}%`, height:'100%', background:'var(--accent-warning)', borderRadius:'4px'}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── DIRECTOR: Structural Mapping ─────────────────────────────────────────────
export const StructuralMapping = () => {
    const [captains, setCaptains] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllCaptains().then(r => { setCaptains(r.data.captains); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Structural Organization Mapping</h1>
                <p style={{ color: 'var(--text-muted)' }}>Hierarchy breakdown: Director → Manager → Coach → Captain → Player</p>
            </div>

            <div className="glass-table-container">
                <table className="glass-table">
                    <thead><tr><th>Squad Leader</th><th>Supervising Coach</th><th>Demographics</th><th>Squad Size</th><th>Performance RT</th></tr></thead>
                    <tbody>
                        {captains.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No mapping data available</td></tr>
                        ) : captains.map(c => (
                            <tr key={c.captain_id}>
                                <td>
                                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Captain</div>
                                </td>
                                <td>{c.coach_name ?? '—'}</td>
                                <td>{c.gender} | Age: {c.age}</td>
                                <td>
                                    <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                                        {c.player_count} Athletes
                                    </span>
                                </td>
                                <td><strong style={{ color: 'var(--accent-secondary)', fontSize: '1.1rem' }}>{c.total_score}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ─── DIRECTOR: Success Metrics ────────────────────────────────────────────────
export const SuccessMetrics = () => {
    const [players, setPlayers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getAllPlayers(), getDirectorOverview()])
            .then(([pr, sr]) => {
                setPlayers(pr.data.players);
                setStats(sr.data);
                setLoading(false);
            }).catch(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    const avgScore = players.length > 0
        ? (players.reduce((s, p) => s + Number(p.total_score || 0), 0) / players.length).toFixed(1)
        : 0;

    const topPlayer = [...players].sort((a, b) => b.total_score - a.total_score)[0];

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1>Success & Performance Metrics</h1>
                <p style={{ color: 'var(--text-muted)' }}>Aggregate success indicators and global player rankings.</p>
            </div>

            <div className="stats-grid">
                <StatCard icon="⭐" label="Avg Player Score" value={avgScore} color="var(--accent-warning)" />
                <StatCard icon="🥇" label="Top Scorer" value={topPlayer?.name?.split(' ')[0] ?? '—'} color="var(--accent-success)" />
                <StatCard icon="👥" label="Active Athletes" value={players.length} color="var(--accent-primary)" />
                <StatCard icon="✅" label="Verified Reports" value={stats?.total_approved ?? '—'} color="var(--accent-secondary)" />
            </div>

            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', marginTop: '32px' }}>
                <h3 style={{ marginBottom: '24px' }}>🏅 Player Leaderboard (Top 10)</h3>
                <div className="glass-table-container" style={{ marginTop: 0 }}>
                    <table className="glass-table">
                        <thead><tr><th>Rank</th><th>Player Profile</th><th>Category</th><th>Status</th><th>Skill Level</th><th>Total Score</th></tr></thead>
                        <tbody>
                            {[...players].sort((a, b) => b.total_score - a.total_score).slice(0, 10).map((p, i) => (
                                <tr key={p.player_id}>
                                    <td>
                                        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Lead: {p.captain_name ?? '—'}</div>
                                    </td>
                                    <td>Football</td>
                                    <td>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', background: p.approval_status === 'Pending' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', color: p.approval_status === 'Pending' ? 'var(--accent-warning)' : 'var(--accent-success)' }}>{p.approval_status || 'Approved'}</span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{p.skill_level || 'ADVANCED'}</span>
                                    </td>
                                    <td><strong style={{ color: 'var(--accent-success)', fontSize: '1.2rem' }}>{p.total_score}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

