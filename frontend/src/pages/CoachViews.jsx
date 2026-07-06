import React from 'react';

const StubContainer = ({ title, member, role }) => (
    <div style={{ padding: '40px', background: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid var(--border-dim)', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.8rem', fontWeight: 800 }}>{title}</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            This component belongs to <strong>Member {member}</strong> ({role} Module).
        </p>
    </div>
);

export const LeadershipManagement = () => <StubContainer title="👤 Leadership Management" member="4" role="Coach" />;
export const PlayerReview = () => <StubContainer title="👥 Squad Review" member="4" role="Coach" />;
export const CoachProfileOverview = () => <StubContainer title="📊 Coach Profile & Overview" member="4" role="Coach" />;
export const CaptainAttendanceEntry = () => <StubContainer title="📥 Captain Attendance Entry" member="4" role="Coach" />;
export const PendingApprovals = () => <StubContainer title="⚠️ Pending Approvals" member="4" role="Coach" />;
export const PendingPlayersReview = () => <StubContainer title="⏳ Pending Players Review" member="4" role="Coach" />;
export const AddPlayerDirectly = () => <StubContainer title="➕ Add Player Directly" member="4" role="Coach" />;
export const CoachPlayerRequestsReview = () => <StubContainer title="📋 Player Onboarding Requests" member="4" role="Coach" />;
export const CoachCommentsView = () => <StubContainer title="💬 Player Comments View" member="4" role="Coach" />;

const CoachViews = () => <StubContainer title="📋 Coach Dashboard" member="4" role="Coach" />;
export default CoachViews;
