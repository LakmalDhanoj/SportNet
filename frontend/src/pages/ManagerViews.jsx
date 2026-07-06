import React from 'react';

const StubContainer = ({ title, member, role }) => (
    <div style={{ padding: '40px', background: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid var(--border-dim)', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.8rem', fontWeight: 800 }}>{title}</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            This component belongs to <strong>Member {member}</strong> ({role} Module).
        </p>
    </div>
);

export const ResourceAllocation = () => <StubContainer title="💰 Resource Allocation & Budget" member="3" role="Manager" />;
export const PersonnelMonitoring = () => <StubContainer title="👥 Personnel & Staff Monitoring" member="3" role="Manager" />;
export const EventCoordinator = () => <StubContainer title="📅 Event Scheduling & Coordination" member="3" role="Manager" />;
export const ManagerProfileOverview = () => <StubContainer title="📊 Manager Profile & Overview" member="3" role="Manager" />;

const ManagerViews = () => <StubContainer title="💼 Sport Manager Dashboard" member="3" role="Manager" />;
export default ManagerViews;
