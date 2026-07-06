import React from 'react';

const StubContainer = ({ title, member, role }) => (
    <div style={{ padding: '40px', background: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid var(--border-dim)', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.8rem', fontWeight: 800 }}>{title}</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            This component belongs to <strong>Member {member}</strong> ({role} Module).
        </p>
    </div>
);

export const PlayerEntry = () => <StubContainer title="📝 Daily Attendance Entry" member="5" role="Captain" />;
export const SubmissionStatus = () => <StubContainer title="📤 Report Submission Status" member="5" role="Captain" />;
export const CaptainProfileOverview = () => <StubContainer title="📊 Captain Profile & Overview" member="5" role="Captain" />;
export const SquadList = () => <StubContainer title="👥 My Squad List" member="5" role="Captain" />;
export const CaptainPlayerRequests = () => <StubContainer title="➕ Request Player Onboarding" member="5" role="Captain" />;
export const CaptainCommentsView = () => <StubContainer title="💬 Squad Comments & Feedback" member="5" role="Captain" />;

const CaptainViews = () => <StubContainer title="🎖️ Captain Dashboard" member="5" role="Captain" />;
export default CaptainViews;
