import React from 'react';

const StubContainer = ({ title, member, role }) => (
    <div style={{ padding: '40px', background: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid var(--border-dim)', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.8rem', fontWeight: 800 }}>{title}</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            This component belongs to <strong>Member {member}</strong> ({role} Module).
        </p>
    </div>
);

export const PerformanceOverview = () => <StubContainer title="📊 Performance Overview" member="5" role="Player" />;
export const AttendanceHistory = () => <StubContainer title="📅 Personal Attendance History" member="5" role="Player" />;
export const DisciplineSummary = () => <StubContainer title="⚖️ Discipline & Conduct Summary" member="5" role="Player" />;
export const WeeklyProgressReport = () => <StubContainer title="📈 Weekly Progress Report" member="5" role="Player" />;
export const MyTeammates = () => <StubContainer title="👥 Squad Teammates" member="5" role="Player" />;
export const PlayerProfileView = () => <StubContainer title="👤 My Profile View" member="5" role="Player" />;

const PlayerViews = () => <StubContainer title="👟 Player Dashboard" member="5" role="Player" />;
export default PlayerViews;
