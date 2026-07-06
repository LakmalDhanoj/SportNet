 import { useState, useEffect } from 'react';
 import { getManagerOverview } from '../services/api';
 
 const Spinner = () => (
     <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
         <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite', display: 'inline-block', marginBottom: '16px' }}>⚙️</div>
         <p style={{ fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--font-heading)' }}>SYNCING ADMINISTRATIVE DATA...</p>
     </div>
 );
 
 // ─── MANAGER: OVERVIEW DASHBOARD (7-Part Model) ──────────────────────────────
 export const ManagerProfileOverview = () => {
     const [data, setData] = useState(null);
     const [loading, setLoading] = useState(true);
 
     useEffect(() => {
         getManagerOverview()
             .then(r => { setData(r.data); setLoading(false); })
             .catch(() => setLoading(false));
     }, []);
 
     if (loading) return <Spinner />;
 
     // Use default mockup values if a manager profile doesn't exist yet for robust viewing
     const profile = data?.managerProfile || {
         manager_id: 1, name: 'Chamara Silva', gender: 'Male', age: 42,
         experience_years: 10, qualification: 'MBA Sports Management', sport_specialization: 'Multi-Sport', organization: 'SportNet Global',
         teams_managed_count: 8, coaches_under_supervision: 12, players_coordinated: 240, events_organized: 15,
         budget_mgmt_skill: 9.5, resource_allocation_rt: 9.0, facility_mgmt_rt: 8.8, equipment_mgmt_rt: 9.2,
         team_perf_tracking_sc: 8.9, coach_perf_eval_sc: 9.1, player_dev_monitoring_sc: 8.7, success_rate: 85.5,
         leadership_rt: 9.5, decision_making_rt: 9.0, communication_rt: 9.2, problem_solving_rt: 9.1, planning_skill_rt: 9.4,
         achievements: 'Best Regional Director Award 2025', remarks: 'Highly effective operational leader.', special_projects: 'SportNet National Integration'
     };
 
     const formattedId = `MGR-${String(profile.manager_id).padStart(3, '0')}`;
 
     return (
         <div className="view-container fade-in">
             {/* Header */}
             <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                 <div>
                     <h1>Manager Operation Profile</h1>
                     <p style={{ color: 'var(--text-muted)' }}>Strategic command and operational oversight records.</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>Operation Status</div>
                     <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>ACTIVE COMMAND</div>
                 </div>
             </div>
 
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                 
                 {/* 1. Basic Information & 2. Professional Details */}
                 <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                     <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                         🆔 IDENTITY & PROFESSIONAL LOG
                     </h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manager ID</span>
                             <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-main)' }}>{formattedId}</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Full Name</span>
                             <span style={{ fontWeight: 700 }}>{profile.name}</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Gender / Age</span>
                             <span style={{ fontWeight: 700 }}>{profile.gender} / {profile.age}</span>
                         </div>
                         <div style={{ borderTop: '1px dashed var(--border-dim)', margin: '4px 0' }}></div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Experience</span>
                             <span style={{ fontWeight: 700, color: 'var(--accent-warning)' }}>{profile.experience_years} Years Active</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Qualification</span>
                             <span style={{ fontWeight: 700, fontSize: '0.8rem', textAlign: 'right', maxWidth: '180px' }}>{profile.qualification}</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sport Category</span>
                             <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{profile.sport_specialization || 'General Athletics'}</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Organization</span>
                             <span style={{ fontWeight: 700 }}>{profile.organization}</span>
                         </div>
                     </div>
                 </div>
 
                 {/* 3. Team & Event Management & 4. Administrative Responsibilities */}
                 <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                     <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-success)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                         🌐 TEAM COMMAND & ADMINISTRATION
                     </h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Teams Managed</span>
                             <span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>{profile.teams_managed_count} active squads</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Coaches Supervised</span>
                             <span style={{ fontWeight: 700 }}>{profile.coaches_under_supervision} personnel</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Players Coordinated</span>
                             <span style={{ fontWeight: 700 }}>{profile.players_coordinated} athletes</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Events Organized</span>
                             <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{profile.events_organized} major events</span>
                         </div>
                         <div style={{ borderTop: '1px dashed var(--border-dim)', margin: '4px 0' }}></div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Budget Management</span>
                             <span style={{ fontWeight: 700 }}>{profile.budget_mgmt_skill}/10</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Resource Allocation</span>
                             <span style={{ fontWeight: 700 }}>{profile.resource_allocation_rt}/10</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Facility & Equipment</span>
                             <span style={{ fontWeight: 700 }}>{((Number(profile.facility_mgmt_rt) + Number(profile.equipment_mgmt_rt)) / 2).toFixed(1)}/10</span>
                         </div>
                     </div>
                 </div>
 
                 {/* 5. Performance Monitoring & 6. Leadership */}
                 <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                     <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-warning)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                         📈 PERFORMANCE & LEADERSHIP
                     </h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Success Rate (Global)</span>
                             <span style={{ fontWeight: 900, color: 'var(--accent-warning)', fontSize: '1.1rem' }}>{profile.success_rate}%</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Team Tracking Score</span>
                             <span style={{ fontWeight: 700 }}>{profile.team_perf_tracking_sc}/10</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Coach Evaluation Index</span>
                             <span style={{ fontWeight: 700 }}>{profile.coach_perf_eval_sc}/10</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Player Dev Monitoring</span>
                             <span style={{ fontWeight: 700 }}>{profile.player_dev_monitoring_sc}/10</span>
                         </div>
                         <div style={{ borderTop: '1px dashed var(--border-dim)', margin: '4px 0' }}></div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Leadership & Decision</span>
                             <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{((Number(profile.leadership_rt) + Number(profile.decision_making_rt)) / 2).toFixed(1)}/10</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Communication Output</span>
                             <span style={{ fontWeight: 700 }}>{profile.communication_rt}/10</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Planning & Organization</span>
                             <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{profile.planning_skill_rt}/10</span>
                         </div>
                     </div>
                 </div>
             </div>
 
             {/* 7. Additional Information */}
             <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', marginTop: '24px' }}>
                 <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
                     🏆 AWARDS, PROJECTS & REMARKS
                 </h3>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                     <div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>Key Achievements</div>
                         <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-warning)', lineHeight: '1.5' }}>{profile.achievements || 'Distinguished Service Records in Sports Administration.'}</div>
                     </div>
                     <div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>Special Projects</div>
                         <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                             {profile.special_projects || 'No special enterprise projects currently logged.'}
                         </div>
                     </div>
                     <div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>Director Remarks</div>
                         <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', lineHeight: '1.5' }}>
                             "{profile.remarks || 'Displays excellent strategic foresight during crisis management scenarios.'}"
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     );
 };
 
 // ─── MANAGER: Coach Performance Monitoring ────────────────────────────────────
 export const PersonnelMonitoring = () => {
     const [coaches, setCoaches] = useState([]);
     const [loading, setLoading] = useState(true);
 
     useEffect(() => {
         getManagerOverview()
             .then(r => { setCoaches(r.data.coaches); setLoading(false); })
             .catch(() => setLoading(false));
     }, []);
 
     if (loading) return <Spinner />;
 
     return (
         <div className="view-container fade-in">
             <div className="view-header">
                 <h1>Personnel Monitoring</h1>
                 <p style={{ color: 'var(--text-muted)' }}>Audit coach performance, evaluation scores, and departmental report activity.</p>
             </div>
 
             <div className="glass-table-container">
                 <table className="glass-table">
                     <thead>
                         <tr><th>Coach Name</th><th>Squads</th><th>Conduct</th><th>Performance Eval</th><th>Logs Filed</th><th>Verified</th></tr>
                     </thead>
                     <tbody>
                         {coaches.length === 0 ? (
                             <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No personnel records found</td></tr>
                         ) : coaches.map(c => (
                             <tr key={c.coach_id}>
                                 <td>
                                     <div style={{ fontWeight: 700 }}>{c.name}</div>
                                     <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Department Staff</div>
                                 </td>
                                 <td>{c.captain_count} Captains</td>
                                 <td>
                                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                         <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                             <div style={{ width: `${(c.discipline || 0) * 10}%`, height: '100%', background: 'var(--accent-success)' }}></div>
                                         </div>
                                         <span>{c.discipline ?? '0'}/10</span>
                                     </div>
                                 </td>
                                 <td><span style={{ color: 'var(--accent-success)', fontWeight: 800, fontSize: '1.1rem' }}>{c.evaluation_sc ?? '—'}</span></td>
                                 <td>{c.reports_filed}</td>
                                 <td><span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{c.approved_count ?? 0}</span></td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         </div>
     );
 };
 
 // ─── MANAGER: Resource Allocation ─────────────────────────────────────────────
 export const ResourceAllocation = () => (
     <div className="view-container fade-in">
         <div className="view-header">
             <h1>Resource Allocation</h1>
             <p style={{ color: 'var(--text-muted)' }}>Budget tracking and equipment distribution management.</p>
         </div>
 
         <div className="glass-table-container">
             <table className="glass-table">
                 <thead><tr><th>Resource Category</th><th>Allocated Amount</th><th>Approval Status</th><th>Transaction Date</th></tr></thead>
                 <tbody>
                     <tr><td>Football Gear & Kits</td><td>$2,500.00</td><td><span style={{ color: 'var(--accent-success)', fontWeight: 700 }}>● APPROVED</span></td><td>12/04/2026</td></tr>
                     <tr><td>Training Facility Maintenance</td><td>$5,000.00</td><td><span style={{ color: 'var(--accent-warning)', fontWeight: 700 }}>● PENDING</span></td><td>15/04/2026</td></tr>
                     <tr><td>Regional Travel Stipends</td><td>$1,200.00</td><td><span style={{ color: 'var(--accent-success)', fontWeight: 700 }}>● DISBURSED</span></td><td>10/04/2026</td></tr>
                 </tbody>
             </table>
         </div>
         <div style={{ marginTop: '24px' }}>
             <button className="glass-button" style={{ width: 'auto', padding: '12px 32px' }}>+ Request New Allocation</button>
         </div>
     </div>
 );
 
 // ─── MANAGER: Event Coordinators ───────────────────────────────────────────────
 export const EventCoordinator = () => {
     const [form, setForm] = useState({ tournament: '', sport: 'Football', date: '', venue: '' });
     const [msg, setMsg] = useState('');
 
     const handleSubmit = (e) => {
         e.preventDefault();
         setMsg(`✅ Event "${form.tournament}" successfully scheduled for ${form.date}`);
     };
 
     return (
         <div className="view-container fade-in">
             <div className="view-header">
                 <h1>Tournament Coordinator</h1>
                 <p style={{ color: 'var(--text-muted)' }}>Schedule and coordinate multi-sport regional events.</p>
             </div>
 
             {msg && <div style={{ padding: '16px 24px', borderRadius: '12px', marginBottom: '24px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--accent-success)', color: 'var(--accent-success)', fontWeight: 600 }} className="fade-in">{msg}</div>}
             
             <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
                 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                     <div className="form-group">
                         <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Tournament Designation</label>
                         <input type="text" className="glass-input" placeholder="e.g. Regional Championship 2026" required
                             value={form.tournament} onChange={e => setForm({ ...form, tournament: e.target.value })} />
                     </div>
                     <div className="form-group">
                         <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Sport Category</label>
                         <select className="glass-input" value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value })}>
                             <option>Football</option><option>Cricket</option><option>Volleyball</option><option>Tennis</option>
                         </select>
                     </div>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                         <div className="form-group">
                             <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Scheduled Date</label>
                             <input type="date" className="glass-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                         </div>
                         <div className="form-group">
                             <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Primary Venue</label>
                             <input type="text" className="glass-input" placeholder="Stadium / Complex Name"
                                 value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
                         </div>
                     </div>
                     <button type="submit" className="glass-button" style={{ marginTop: '12px' }}>📅 Register Event</button>
                 </form>
             </div>
         </div>
     );
 };
 
