import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';

import { ManageUsers, ManageSports, AllPerformance, ApprovalsOverview, SystemSettings } from './AdminViews';
import { LeadershipManagement, PlayerReview, CoachProfileOverview, CaptainAttendanceEntry, PendingApprovals, PendingPlayersReview, AddPlayerDirectly } from './CoachViews';
import { PlayerEntry, SubmissionStatus, CaptainProfileOverview, SquadList } from './CaptainViews';
import { PerformanceOverview, AttendanceHistory, DisciplineSummary, WeeklyProgressReport, MyTeammates } from './PlayerViews';
import { AnnualOversight, StructuralMapping, SuccessMetrics } from './DirectorViews';
import { ResourceAllocation, PersonnelMonitoring, EventCoordinator, ManagerProfileOverview } from './ManagerViews';

// ─── Role-specific welcome home ────────────────────────────────────────────────
const HomeContent = ({ user }) => {
    const tips = {
        admin: { icon: '🛡️', title: 'SYSTEM CONTROL', desc: 'Manage users, audit global activity, and configure sport parameters.', color: 'var(--accent-danger)' },
        director: { icon: '🏛️', title: 'STRATEGIC VIEW', desc: 'Analyze annual trends, organizational mapping, and success indicators.', color: 'var(--accent-warning)' },
        manager: { icon: '💼', title: 'OPERATIONS', desc: 'Monitor staff performance, allocate department resources, and schedule events.', color: 'var(--accent-secondary)' },
        coach: { icon: '📋', title: 'COACHING HUB', desc: 'Review squad reports and evaluate the leadership of your assigned captains.', color: 'var(--accent-success)' },
        captain: { icon: '🎖️', title: 'SQUAD LEAD', desc: 'Handle daily attendance and discipline. Submit reports for coach verification.', color: 'var(--accent-primary)' },
        player: { icon: '👟', title: 'PERFORMANCE', desc: 'Track your training progress, attendance history, and professional feedback.', color: 'var(--text-muted)' },
    };
    const info = tips[user.role] || { icon: '🏆', title: 'DASHBOARD', desc: '', color: 'var(--accent-primary)' };

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>WELCOME, {user.email.split('@')[0].toUpperCase()}</h1>
                <p style={{ color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>{info.title} — {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>

            <div className="glass-panel" style={{ padding: '64px', borderRadius: '32px', textAlign: 'center', marginBottom: '40px', background: 'var(--bg-surface-alt)', border: '1px solid var(--border-dim)' }}>
                <div style={{ fontSize: '5rem', marginBottom: '24px', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))' }}>{info.icon}</div>
                <h2 style={{ fontSize: '2.4rem', marginBottom: '16px', color: 'var(--text-main)', fontWeight: 900 }}>{info.title}</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 2, fontSize: '1.2rem', fontWeight: 500 }}>{info.desc}</p>
            </div>

            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
                <h4 style={{ marginBottom: '24px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', fontWeight: 800 }}>Organizational Hierarchy</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {['Director', 'Manager', 'Coach', 'Captain', 'Player'].map((r, i, arr) => (
                        <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ 
                                padding: '12px 28px', borderRadius: '16px', 
                                background: user.role === r.toLowerCase() ? 'rgba(14, 165, 233, 0.15)' : 'var(--bg-surface-alt)', 
                                color: user.role === r.toLowerCase() ? 'var(--accent-primary)' : 'var(--text-muted)', 
                                border: `1px solid ${user.role === r.toLowerCase() ? 'var(--accent-primary)' : 'var(--border-dim)'}`,
                                fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em'
                            }}>{r.toUpperCase()}</div>
                            {i < arr.length - 1 && <span style={{ color: 'var(--border-dim)', fontSize: '1.2rem' }}>→</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); }
        else { setUser(JSON.parse(storedUser)); }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!user) return <div className="loading" style={{ color: 'var(--accent-primary)', fontWeight: 900 }}>INITIALIZING...</div>;

    const isActive = (path) => location.pathname === `/dashboard${path}` ? 'active' : '';

    const navLink = (to, icon, label) => (
        <li key={to}>
            <Link to={`/dashboard${to}`} className={`glass-link ${isActive(to)}`}>
                <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            </Link>
        </li>
    );

    const renderSidebarLinks = () => {
        switch (user.role) {
            case 'admin': return (<>
                {navLink('/users', '👤', 'Users')}
                {navLink('/sports', '🏆', 'Sports')}
                {navLink('/performance', '📊', 'Global Metrics')}
                {navLink('/approvals', '✅', 'Approvals')}
                {navLink('/settings', '⚙️', 'System')}
            </>);
            case 'director': return (<>
                {navLink('/annual-oversight', '📈', 'Oversight')}
                {navLink('/structural-mapping', '🗺️', 'Structure')}
                {navLink('/success-metrics', '🏆', 'Metrics')}
            </>);
            case 'manager': return (<>
                {navLink('/overview', '📊', 'Dashboard')}
                {navLink('/resource-allocation', '💰', 'Budget')}
                {navLink('/personnel-monitoring', '👥', 'Staff')}
                {navLink('/event-coordinator', '📅', 'Events')}
            </>);
            case 'coach': return (<>
                {navLink('/overview', '📊', 'Dashboard')}
                {navLink('/captain-management', '👤', 'Captain Mgmt')}
                {navLink('/captain-attendance', '📥', 'Captain Entry')}
                {navLink('/player-review', '👥', 'Squad Review')}
                {navLink('/pending-approvals', '⚠', 'Approvals')}
                {navLink('/pending-players', '⏳', 'Pending Players')}
                {navLink('/add-player', '➕', 'Add Player')}
            </>);
            case 'captain': return (<>
                {navLink('/overview', '📊', 'Dashboard')}
                {navLink('/squad-list', '👥', 'My Squad')}
                {navLink('/player-entry', '📝', 'Attendance')}
                {navLink('/submission-status', '📤', 'Submissions')}
            </>);
            case 'player': return (<>
                {navLink('/overview', '📊', 'Dashboard')}
                {navLink('/my-teammates', '👥', 'Teammates')}
                {navLink('/attendance', '📅', 'Attendance')}
                {navLink('/discipline', '⚖', 'Discipline')}
                {navLink('/progress', '📈', 'Progress')}
            </>);
            default: return <li><Link to="/dashboard" className="glass-link active">Home</Link></li>;
        }
    };

    return (
        <div className="dashboard-layout">
            <nav className="glass-sidebar">
                <div className="sidebar-header" style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--accent-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: 'var(--glow-primary)' }}>🏆</div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-main)' }}>
                            SportNet
                        </h2>
                    </div>
                    <div style={{ 
                        padding: '6px 14px', borderRadius: '10px', background: 'var(--bg-surface-alt)', 
                        color: 'var(--accent-primary)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', width: 'fit-content', border: '1px solid var(--border-dim)'
                    }}>
                        {user.role} ACCESS
                    </div>
                </div>
                
                <ul className="nav-links" style={{ flex: 1 }}>
                    {navLink('/', '🏠', 'Overview')}
                    <div style={{ height: '1px', background: 'var(--border-dim)', margin: '16px 0' }}></div>
                    {renderSidebarLinks()}
                </ul>

                <button onClick={handleLogout} className="glass-button"
                    style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)' }}>
                    🚪 SIGN OUT
                </button>
            </nav>

            <main className="dashboard-content">
                <Routes>
                    <Route path="/" element={<HomeContent user={user} />} />

                    {/* Admin */}
                    <Route path="/users" element={<ManageUsers />} />
                    <Route path="/sports" element={<ManageSports />} />
                    <Route path="/performance" element={user.role === 'admin' ? <AllPerformance /> : <PerformanceOverview />} />
                    <Route path="/approvals" element={<ApprovalsOverview />} />
                    <Route path="/settings" element={<SystemSettings />} />

                    {/* Director */}
                    <Route path="/annual-oversight" element={<AnnualOversight />} />
                    <Route path="/structural-mapping" element={<StructuralMapping />} />
                    <Route path="/success-metrics" element={<SuccessMetrics />} />

                    {/* Manager */}
                    <Route path="/overview" element={<ManagerProfileOverview />} />
                    <Route path="/resource-allocation" element={<ResourceAllocation />} />
                    <Route path="/personnel-monitoring" element={<PersonnelMonitoring />} />
                    <Route path="/event-coordinator" element={<EventCoordinator />} />

                    {/* Coach */}
                    <Route path="/overview" element={<CoachProfileOverview />} />
                    <Route path="/captain-management" element={<LeadershipManagement />} />
                    <Route path="/captain-attendance" element={<CaptainAttendanceEntry />} />
                    <Route path="/player-review" element={<PlayerReview />} />
                    <Route path="/pending-approvals" element={<PendingApprovals />} />
                    <Route path="/pending-players" element={<PendingPlayersReview />} />
                    <Route path="/add-player" element={<AddPlayerDirectly />} />

                    {/* Captain */}
                    <Route path="/overview" element={<CaptainProfileOverview />} />
                    <Route path="/player-entry" element={<PlayerEntry />} />
                    <Route path="/submission-status" element={<SubmissionStatus />} />
                    <Route path="/squad-list" element={<SquadList />} />

                    {/* Player */}
                    <Route path="/overview" element={<PerformanceOverview />} />
                    <Route path="/attendance" element={<AttendanceHistory />} />
                    <Route path="/discipline" element={<DisciplineSummary />} />
                    <Route path="/progress" element={<WeeklyProgressReport />} />
                    <Route path="/my-teammates" element={<MyTeammates />} />
                </Routes>
            </main>
        </div>
    );
};

export default Dashboard;


