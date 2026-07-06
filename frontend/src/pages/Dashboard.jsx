import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';

// ── Member module imports (members fill their own files and update these imports)
// import { ManageUsers, ManageSports, AllPerformance, ApprovalsOverview, SystemSettings } from './AdminViews';
// import { LeadershipManagement, PlayerReview, CoachProfileOverview, CaptainAttendanceEntry, PendingApprovals, PendingPlayersReview, AddPlayerDirectly, CoachPlayerRequestsReview, CoachCommentsView } from './CoachViews';
// import { PlayerEntry, SubmissionStatus, CaptainProfileOverview, SquadList, CaptainPlayerRequests, CaptainCommentsView } from './CaptainViews';
// import { PerformanceOverview, AttendanceHistory, DisciplineSummary, WeeklyProgressReport, MyTeammates, PlayerProfileView } from './PlayerViews';
// import { ResourceAllocation, PersonnelMonitoring, EventCoordinator, ManagerProfileOverview } from './ManagerViews';

// Temporary placeholder — replaced once members push their components
const ComingSoon = ({ label }) => (
    <div style={{ padding: '60px 40px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: '24px', border: '1px dashed var(--border-dim)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔧</div>
        <h2 style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: '1.6rem' }}>{label || 'Coming Soon'}</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>This section is being built by the assigned team member.</p>
    </div>
);

// ── Aliases so route elements below keep the same component names ──
const ManageUsers            = () => <ComingSoon label="👥 User Management" />;
const ManageSports           = () => <ComingSoon label="🏆 Sport Management" />;
const AllPerformance         = () => <ComingSoon label="📈 Performance Overview" />;
const ApprovalsOverview      = () => <ComingSoon label="✅ Audit / Approvals" />;
const SystemSettings         = () => <ComingSoon label="⚙️ System Settings" />;
const LeadershipManagement   = () => <ComingSoon label="👤 Captain Management" />;
const PlayerReview           = () => <ComingSoon label="👥 Squad Review" />;
const CoachProfileOverview   = () => <ComingSoon label="📊 Coach Overview" />;
const CaptainAttendanceEntry = () => <ComingSoon label="📥 Captain Attendance Entry" />;
const PendingApprovals       = () => <ComingSoon label="⚠️ Pending Approvals" />;
const PendingPlayersReview   = () => <ComingSoon label="⏳ Pending Players" />;
const AddPlayerDirectly      = () => <ComingSoon label="➕ Add Player" />;
const CoachPlayerRequestsReview = () => <ComingSoon label="📋 Player Requests" />;
const CoachCommentsView      = () => <ComingSoon label="💬 Comments (Coach)" />;
const PlayerEntry            = () => <ComingSoon label="📝 Daily Attendance Entry" />;
const SubmissionStatus       = () => <ComingSoon label="📤 Submission Status" />;
const CaptainProfileOverview = () => <ComingSoon label="📊 Captain Overview" />;
const SquadList              = () => <ComingSoon label="👥 My Squad" />;
const CaptainPlayerRequests  = () => <ComingSoon label="➕ Request Player" />;
const CaptainCommentsView    = () => <ComingSoon label="💬 Comments (Captain)" />;
const PerformanceOverview    = () => <ComingSoon label="📊 Performance Overview" />;
const AttendanceHistory      = () => <ComingSoon label="📅 Attendance History" />;
const DisciplineSummary      = () => <ComingSoon label="⚖️ Discipline Summary" />;
const WeeklyProgressReport   = () => <ComingSoon label="📈 Weekly Progress" />;
const MyTeammates            = () => <ComingSoon label="👥 My Teammates" />;
const PlayerProfileView      = () => <ComingSoon label="👤 My Profile" />;
const ResourceAllocation     = () => <ComingSoon label="💰 Resource Allocation" />;
const PersonnelMonitoring    = () => <ComingSoon label="👥 Personnel Monitoring" />;
const EventCoordinator       = () => <ComingSoon label="📅 Events" />;
const ManagerProfileOverview = () => <ComingSoon label="📊 Manager Overview" />;

// ─── Role-specific welcome home ────────────────────────────────────────────────
const HomeContent = ({ user }) => {
    const [stats, setStats] = useState(null);
    const [sportsCount, setSportsCount] = useState(4);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user.role === 'director') {
            Promise.all([
                import('../services/api').then(m => m.getDirectorOverview()),
                import('../services/api').then(m => m.getAllSports())
            ]).then(([sRes, spRes]) => {
                setStats(sRes.data);
                setSportsCount(spRes.data.sports.length);
                setLoading(false);
            }).catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user.role]);

    const tips = {
        director: { icon: '🏛️', title: 'DIRECTOR OPERATIONS', desc: 'Oversee institutional sports domains, user management, and global performance indicators.', color: 'var(--accent-warning)' },
        manager:  { icon: '💼', title: 'OPERATIONS',          desc: 'Monitor staff performance, allocate department resources, and schedule events.',              color: 'var(--accent-secondary)' },
        coach:    { icon: '📋', title: 'COACHING HUB',        desc: 'Review squad reports and evaluate the leadership of your assigned captains.',                 color: 'var(--accent-success)' },
        captain:  { icon: '🎖️', title: 'SQUAD LEAD',          desc: 'Handle daily attendance and discipline. Submit reports for coach verification.',              color: 'var(--accent-primary)' },
        player:   { icon: '👟', title: 'PERFORMANCE',         desc: 'Track your training progress, attendance history, and professional feedback.',                color: 'var(--text-muted)' },
    };
    const info = tips[user.role] || { icon: '🏆', title: 'DASHBOARD', desc: '', color: 'var(--accent-primary)' };

    if (loading) return <div style={{ color: 'var(--accent-primary)', textAlign: 'center', padding: '40px', fontWeight: 800 }}>LOADING SUMMARY ENGINE...</div>;

    if (user.role === 'director') {
        const s = stats || {
            total_coaches: 2, total_captains: 2, total_players: 3,
            total_submitted: 9, total_approved: 6, pending_reports: 3, captain_evals: 2
        };
        return (
            <div className="view-container fade-in">
                <div className="view-header" style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase' }}>
                        👑 DIRECTOR DASHBOARD
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
                        SportNet Strategic Operations — {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
                        <div className="stat-label">Total Sports</div>
                        <div className="stat-value">{sportsCount}</div>
                    </div>
                    <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--accent-success)' }}>
                        <div className="stat-label">Total Coaches</div>
                        <div className="stat-value" style={{ color: 'var(--accent-success)' }}>{s.total_coaches}</div>
                    </div>
                    <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
                        <div className="stat-label">Total Captains</div>
                        <div className="stat-value" style={{ color: 'var(--accent-secondary)' }}>{s.total_captains}</div>
                    </div>
                    <div className="glass-card stat-card" style={{ borderLeft: '4px solid var(--accent-warning)' }}>
                        <div className="stat-label">Total Players</div>
                        <div className="stat-value" style={{ color: 'var(--accent-warning)' }}>{s.total_players}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                            📊 ATTENDANCE &amp; PERFORMANCE SUMMARY
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Approved Player Reports</span>
                                <span style={{ fontWeight: 700 }}>{s.total_approved} Locked</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Pending Player Reports</span>
                                <span style={{ fontWeight: 700, color: 'var(--accent-warning)' }}>{s.pending_reports} Reviewing</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Captain Leadership Evals</span>
                                <span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>{s.captain_evals} Finalized</span>
                            </div>
                            <div style={{ borderTop: '1px dashed var(--border-dim)', margin: '4px 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Global Attendance Rate</span>
                                <span style={{ fontWeight: 900, color: 'var(--accent-success)', fontSize: '1.2rem' }}>92.5%</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-secondary)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                            ⚡ QUICK STRATEGIC ACTIONS
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <Link to="/dashboard/sports"      className="glass-button" style={{ fontSize: '0.75rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '44px', fontWeight: 800 }}>🏆 MANAGE SPORTS</Link>
                            <Link to="/dashboard/users"       className="glass-button primary-btn" style={{ fontSize: '0.75rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '44px', fontWeight: 800 }}>👤 ASSIGN USERS</Link>
                            <Link to="/dashboard/performance" className="glass-button" style={{ fontSize: '0.75rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '44px', fontWeight: 800 }}>📊 PERFORMANCE LOG</Link>
                            <Link to="/dashboard/approvals"   className="glass-button" style={{ fontSize: '0.75rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '44px', fontWeight: 800 }}>✅ AUDIT PROTOCOLS</Link>
                        </div>
                        <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '12px', padding: '12px', marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            👑 <strong>Director Control:</strong> You have full system settings approval, user role setup, and sport metric customisation access.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="view-container fade-in">
            <div className="view-header">
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>WELCOME, {user.email.split('@')[0].toUpperCase()}</h1>
                <p style={{ color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>{info.title} — {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>

            <div className="glass-panel" style={{ padding: '64px', borderRadius: '32px', textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ fontSize: '5rem', marginBottom: '24px' }}>{info.icon}</div>
                <h2 style={{ fontSize: '2.4rem', marginBottom: '16px', fontWeight: 900 }}>{info.title}</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 2, fontSize: '1.1rem' }}>{info.desc}</p>
            </div>

            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
                <h4 style={{ marginBottom: '24px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', fontWeight: 800 }}>Organizational Hierarchy</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {['Director', 'Manager', 'Coach', 'Captain', 'Player'].map((r, i, arr) => (
                        <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                padding: '12px 28px', borderRadius: '16px',
                                background: user.role === r.toLowerCase() ? 'rgba(14,165,233,0.15)' : 'var(--bg-surface-alt)',
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

// ─── Sidebar NavItem ────────────────────────────────────────────────────────────
const NavItem = ({ to, icon, label, location }) => {
    const active = location.pathname === `/dashboard${to}`;
    return (
        <Link
            to={`/dashboard${to}`}
            className={`sidebar-item${active ? ' sidebar-item--active' : ''}`}
        >
            <span className="sidebar-item-icon">{icon}</span>
            <span className="sidebar-item-label">{label}</span>
        </Link>
    );
};

// ─── Section divider label ──────────────────────────────────────────────────────
const SectionLabel = ({ label }) => (
    <div className="sidebar-section-label">{label}</div>
);

// ─── Sidebar ────────────────────────────────────────────────────────────────────
const Sidebar = ({ user, location, onLogout }) => {
    const roleMenuLabel = {
        director: 'DIRECTOR MENU',
        manager:  'MANAGER MENU',
        coach:    'COACH MENU',
        captain:  'CAPTAIN MENU',
        player:   'PLAYER MENU',
    };

    const roleMenuLinks = () => {
        switch (user.role) {
            case 'director': return (<>
                <NavItem to="/users"       icon="👤" label="Users"          location={location} />
                <NavItem to="/sports"      icon="🏆" label="Sports"         location={location} />
                <NavItem to="/performance" icon="📊" label="Global Metrics" location={location} />
                <NavItem to="/approvals"   icon="✅" label="Approvals"      location={location} />
                <NavItem to="/settings"    icon="⚙️" label="System"         location={location} />
            </>);
            case 'manager': return (<>
                <NavItem to="/overview"             icon="📊" label="Dashboard" location={location} />
                <NavItem to="/resource-allocation"  icon="💰" label="Budget"    location={location} />
                <NavItem to="/personnel-monitoring" icon="👥" label="Staff"     location={location} />
                <NavItem to="/event-coordinator"    icon="📅" label="Events"    location={location} />
            </>);
            case 'coach': return (<>
                <NavItem to="/overview"          icon="📊" label="Dashboard"       location={location} />
                <NavItem to="/captain-management"icon="👤" label="Captain Mgmt"    location={location} />
                <NavItem to="/captain-attendance"icon="📥" label="Captain Entry"   location={location} />
                <NavItem to="/player-review"     icon="👥" label="Squad Review"    location={location} />
                <NavItem to="/pending-approvals" icon="⚠️" label="Approvals"       location={location} />
                <NavItem to="/pending-players"   icon="⏳" label="Pending Players" location={location} />
                <NavItem to="/captain-requests"  icon="📋" label="Player Requests" location={location} />
                <NavItem to="/comments"          icon="💬" label="Comments"        location={location} />
                <NavItem to="/add-player"        icon="➕" label="Add Player"      location={location} />
            </>);
            case 'captain': return (<>
                <NavItem to="/overview"          icon="📊" label="Dashboard"      location={location} />
                <NavItem to="/squad-list"        icon="👥" label="My Squad"       location={location} />
                <NavItem to="/player-entry"      icon="📝" label="Attendance"     location={location} />
                <NavItem to="/player-requests"   icon="➕" label="Request Player" location={location} />
                <NavItem to="/submission-status" icon="📤" label="Submissions"    location={location} />
                <NavItem to="/comments"          icon="💬" label="Comments"       location={location} />
            </>);
            case 'player': return (<>
                <NavItem to="/overview"     icon="📊" label="Dashboard"  location={location} />
                <NavItem to="/profile"      icon="👤" label="My Profile" location={location} />
                <NavItem to="/my-teammates" icon="👥" label="Teammates"  location={location} />
                <NavItem to="/attendance"   icon="📅" label="Attendance" location={location} />
                <NavItem to="/discipline"   icon="⚖️" label="Discipline" location={location} />
                <NavItem to="/progress"     icon="📈" label="Progress"   location={location} />
            </>);
            default: return null;
        }
    };

    const roleColors = {
        director: '#f59e0b',
        manager:  '#6366f1',
        coach:    '#10b981',
        captain:  '#3b82f6',
        player:   '#94a3b8',
    };
    const rc = roleColors[user.role] || '#3b82f6';

    return (
        <nav className="glass-sidebar">
            {/* Brand */}
            <div className="sidebar-brand-block">
                <div className="sidebar-logo-box">🏆</div>
                <span className="sidebar-brand-name">SportNet</span>
            </div>

            {/* Role badge */}
            <div className="sidebar-role-badge" style={{ background: `${rc}18`, color: rc, borderColor: `${rc}40` }}>
                {user.role.toUpperCase()} ACCESS
            </div>

            {/* Navigation */}
            <div className="sidebar-nav">
                <SectionLabel label="OVERVIEW" />
                <NavItem to="/" icon="🏠" label="Home" location={location} />

                <div className="sidebar-divider" />

                <SectionLabel label={roleMenuLabel[user.role] || 'MENU'} />
                {roleMenuLinks()}
            </div>

            {/* Footer */}
            <div className="sidebar-footer">
                <div className="sidebar-user-block">
                    <div className="sidebar-user-avatar" style={{ background: `${rc}28`, color: rc }}>
                        {(user.name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{user.name || user.email || 'User'}</div>
                        <div className="sidebar-user-role">{user.role}</div>
                    </div>
                </div>
                <button className="sidebar-logout-btn" onClick={onLogout}>
                    🚪 Sign Out
                </button>
            </div>
        </nav>
    );
};

// ─── Dashboard ──────────────────────────────────────────────────────────────────
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

    if (!user) return (
        <div style={{ color: 'var(--accent-primary)', fontWeight: 900, padding: '40px', textAlign: 'center' }}>
            INITIALIZING...
        </div>
    );

    return (
        <div className="dashboard-layout">
            <Sidebar user={user} location={location} onLogout={handleLogout} />

            <main className="dashboard-content">
                <Routes>
                    <Route path="/"  element={<HomeContent user={user} />} />

                    {/* Director */}
                    <Route path="/users"       element={<ManageUsers />} />
                    <Route path="/sports"      element={<ManageSports />} />
                    <Route path="/performance" element={user.role === 'director' ? <AllPerformance /> : <PerformanceOverview />} />
                    <Route path="/approvals"   element={<ApprovalsOverview />} />
                    <Route path="/settings"    element={<SystemSettings />} />

                    {/* Shared: /overview renders the correct component by role */}
                    <Route path="/overview" element={
                        user.role === 'manager' ? <ManagerProfileOverview /> :
                        user.role === 'coach'   ? <CoachProfileOverview />   :
                        user.role === 'captain' ? <CaptainProfileOverview /> :
                                                  <PerformanceOverview />
                    } />

                    {/* Manager */}
                    <Route path="/resource-allocation"  element={<ResourceAllocation />} />
                    <Route path="/personnel-monitoring" element={<PersonnelMonitoring />} />
                    <Route path="/event-coordinator"    element={<EventCoordinator />} />

                    {/* Coach */}
                    <Route path="/captain-management" element={<LeadershipManagement />} />
                    <Route path="/captain-attendance" element={<CaptainAttendanceEntry />} />
                    <Route path="/player-review"      element={<PlayerReview />} />
                    <Route path="/pending-approvals"  element={<PendingApprovals />} />
                    <Route path="/pending-players"    element={<PendingPlayersReview />} />
                    <Route path="/captain-requests"   element={<CoachPlayerRequestsReview />} />
                    <Route path="/add-player"         element={<AddPlayerDirectly />} />

                    {/* Shared: /comments renders by role */}
                    <Route path="/comments" element={
                        user.role === 'coach' ? <CoachCommentsView /> : <CaptainCommentsView />
                    } />

                    {/* Captain */}
                    <Route path="/player-entry"      element={<PlayerEntry />} />
                    <Route path="/player-requests"   element={<CaptainPlayerRequests />} />
                    <Route path="/submission-status" element={<SubmissionStatus />} />
                    <Route path="/squad-list"        element={<SquadList />} />

                    {/* Player */}
                    <Route path="/profile"      element={<PlayerProfileView />} />
                    <Route path="/attendance"   element={<AttendanceHistory />} />
                    <Route path="/discipline"   element={<DisciplineSummary />} />
                    <Route path="/progress"     element={<WeeklyProgressReport />} />
                    <Route path="/my-teammates" element={<MyTeammates />} />
                </Routes>
            </main>
        </div>
    );
};

export default Dashboard;
