import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { forgotKey, getPublicSports } from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('director');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Landing metrics state
    const [sports, setSports] = useState([]);
    const [sportsLoading, setSportsLoading] = useState(true);

    useEffect(() => {
        getPublicSports()
            .then(r => {
                setSports(r.data.sports || []);
                setSportsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setSportsLoading(false);
            });
    }, []);

    // Recover / Help Modal States
    const [forgotModalOpen, setForgotModalOpen] = useState(false);
    const [helpModalOpen, setHelpModalOpen] = useState(false);
    
    // Forgot Key Form States
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotRole, setForgotRole] = useState('director');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotError, setForgotError] = useState('');
    const [recoveredKey, setRecoveredKey] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password, role });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotKey = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotLoading(true);
        try {
            const response = await forgotKey(forgotEmail, forgotRole);
            setRecoveredKey(response.data.tempKey);
        } catch (err) {
            setForgotError(err.response?.data?.message || 'Verification failed. Credentials not found.');
        } finally {
            setForgotLoading(false);
        }
    };

    const roles = [
        { id: 'director', label: 'Director', icon: '🏗️' },
        { id: 'manager', label: 'Manager', icon: '💼' },
        { id: 'coach', label: 'Coach', icon: '📋' },
        { id: 'captain', label: 'Captain', icon: '🎖️' },
        { id: 'player', label: 'Player', icon: '👟' }
    ];

    return (
        <div className="login-bg" style={{ display: 'flex', gap: '32px', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* LEFT SIDE: Landing Page Sports Metrics Panel */}
            <div className="glass-panel fade-in" style={{ flex: 1.2, minWidth: '320px', maxWidth: '600px', padding: '40px', borderRadius: '24px', background: 'var(--bg-surface)', border: '1px solid var(--border-dim)', alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '16px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🏆 LIVE SPORT METRICS
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, marginTop: '4px' }}>Real-time division updates and performance metrics configured by directors.</p>
                </div>

                {sportsLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        🔄 LOADING PLATFORM METRICS...
                    </div>
                ) : sports.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No active sports configured at this time.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
                        {sports.map(s => {
                            let sportIcon = '⚽';
                            if (s.sport_name === 'Cricket') sportIcon = '🏏';
                            else if (s.sport_name === 'Volleyball') sportIcon = '🏐';
                            else if (s.sport_name === 'Basketball') sportIcon = '🏀';
                            else if (s.sport_name === 'Athletics') sportIcon = '🏃';
                            
                            return (
                                <div key={s.sport_id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '4px solid var(--accent-primary)', background: 'var(--bg-surface-alt)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '1.8rem' }}>{sportIcon}</span>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{s.sport_name.toUpperCase()}</h3>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{s.sport_type}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>ATTENDANCE RATE</span>
                                            <strong style={{ fontSize: '1.2rem', color: 'var(--accent-success)', fontWeight: 900 }}>{s.attendanceRate}%</strong>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--border-dim)', paddingTop: '10px', fontSize: '0.85rem' }}>
                                        <div>
                                            <span style={{ color: 'var(--text-muted)' }}>Athletes Assigned:</span>{' '}
                                            <strong style={{ color: 'var(--text-main)' }}>{s.playersCount} Players</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: 'var(--text-muted)' }}>{s.customMetricName || s.metrics}:</span>{' '}
                                            <strong style={{ color: 'var(--accent-primary)' }}>{s.customMetricValue || 0}</strong>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* RIGHT SIDE: System Sign In Box */}
            <div className="glass-panel login-card fade-in" style={{ flex: 1, minWidth: '320px', maxWidth: '460px', padding: '40px', borderRadius: '24px', background: 'var(--bg-surface)', border: '1px solid var(--border-dim)', margin: 0 }}>
                <div className="login-header">
                    <div style={{ width: '64px', height: '64px', background: 'var(--accent-primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 20px', boxShadow: 'var(--glow-primary)' }}>🏆</div>
                    <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-main)' }}>SportNet</h1>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.8rem' }}>Operational Management Platform</p>
                </div>
                
                {error && (
                    <div style={{
                        padding: '14px 20px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', fontSize: '0.85rem', marginBottom: '24px', fontWeight: 600
                    }}>
                        ⚠ {error}
                    </div>
                )}
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="form-group">
                        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Credential Identification</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="glass-input" 
                            required 
                            placeholder="access@sportnet.com"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Security Key</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="glass-input" 
                            required 
                            placeholder="••••••••••••"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Strategic Role Access</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '8px' }}>
                            {roles.map(r => (
                                <div 
                                    key={r.id}
                                    onClick={() => setRole(r.id)}
                                    style={{
                                        padding: '12px 6px',
                                        borderRadius: '12px',
                                        border: '1px solid',
                                        borderColor: role === r.id ? 'var(--accent-primary)' : 'var(--border-dim)',
                                        background: role === r.id ? 'rgba(14, 165, 233, 0.1)' : 'var(--bg-surface-alt)',
                                        color: role === r.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <span style={{ fontSize: '1.4rem' }}>{r.icon}</span>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="glass-button" disabled={loading} 
                        style={{ marginTop: '12px', height: '56px', background: 'var(--accent-primary)', border: 'none', color: 'white', fontSize: '1rem', letterSpacing: '0.1em', boxShadow: 'var(--glow-primary)' }}>
                        {loading ? 'AUTHENTICATING...' : 'ESTABLISH CONNECTION'}
                    </button>
                    
                    <div className="login-footer" style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '16px', fontWeight: 600 }}>
                        <a href="#" onClick={(e) => { e.preventDefault(); setForgotModalOpen(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>FORGOT KEY</a>
                        <span style={{ opacity: 0.3 }}>|</span>
                        <a href="#" onClick={(e) => { e.preventDefault(); setHelpModalOpen(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>SECURE HELP</a>
                    </div>
                </form>
            </div>

            {/* FORGOT KEY MODAL */}
            {forgotModalOpen && (
                <div className="modal-overlay" onClick={() => { if (!forgotLoading) setForgotModalOpen(false); }}>
                    <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-dim)', padding: '40px', maxWidth: '480px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>🔑 Key Recovery</h2>
                            <button 
                                type="button"
                                onClick={() => { setForgotModalOpen(false); setRecoveredKey(''); setForgotError(''); }} 
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
                                disabled={forgotLoading}
                            >
                                ✕
                            </button>
                        </div>

                        {!recoveredKey ? (
                            <form onSubmit={handleForgotKey} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                    Enter your registered credential identity and strategic role to recover/reset your security access key.
                                </p>

                                {forgotError && (
                                    <div style={{
                                        padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', fontSize: '0.8rem', fontWeight: 600
                                    }}>
                                        ⚠ {forgotError}
                                    </div>
                                )}

                                <div className="form-group">
                                    <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Credential Identification</label>
                                    <input 
                                        type="email" 
                                        value={forgotEmail} 
                                        onChange={(e) => setForgotEmail(e.target.value)} 
                                        className="glass-input" 
                                        required 
                                        placeholder="access@sportnet.com"
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 700 }}>Associated Role</label>
                                    <select 
                                        value={forgotRole} 
                                        onChange={(e) => setForgotRole(e.target.value)} 
                                        className="glass-input"
                                        style={{ width: '100%', background: 'var(--bg-deep)', color: 'var(--text-main)', cursor: 'pointer' }}
                                    >
                                        <option value="director">Director</option>
                                        <option value="manager">Manager</option>
                                        <option value="coach">Coach</option>
                                        <option value="captain">Captain</option>
                                        <option value="player">Player</option>
                                    </select>
                                </div>

                                <button type="submit" className="glass-button" disabled={forgotLoading} 
                                    style={{ marginTop: '8px', height: '50px', background: 'var(--accent-primary)', border: 'none', color: 'white', fontSize: '0.9rem', letterSpacing: '0.05em', boxShadow: 'var(--glow-primary)' }}>
                                    {forgotLoading ? 'VERIFYING SYSTEM REGISTRY...' : 'INITIALIZE RECOVERY PROTOCOL'}
                                </button>
                            </form>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center' }}>
                                <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.15)', border: '2px solid var(--accent-success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--accent-success)' }}>
                                    ✓
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Security Key Regenerated</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        A secure temporary access key has been written to the database buffer.
                                    </p>
                                </div>

                                <div style={{
                                    width: '100%', background: 'var(--bg-deep)', border: '1px dashed var(--accent-success)', 
                                    borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    fontFamily: 'monospace', fontSize: '1.2rem', color: 'var(--accent-success)', fontWeight: 'bold', letterSpacing: '0.05em',
                                    boxShadow: '0 0 15px rgba(16, 185, 129, 0.1)'
                                }}>
                                    <span>{recoveredKey}</span>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            navigator.clipboard.writeText(recoveredKey);
                                            alert('Temporary access key copied to clipboard!');
                                        }}
                                        style={{
                                            background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
                                            color: 'var(--accent-success)', fontSize: '0.75rem', padding: '6px 12px', borderRadius: '6px',
                                            cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase'
                                        }}
                                    >
                                        Copy
                                    </button>
                                </div>

                                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic' }}>
                                    Use this temporary security key to establish your connection. Update it later inside profile configurations.
                                </p>

                                <button 
                                    type="button"
                                    onClick={() => {
                                        setPassword(recoveredKey);
                                        setEmail(forgotEmail);
                                        setRole(forgotRole);
                                        setForgotModalOpen(false);
                                        setRecoveredKey('');
                                        setForgotError('');
                                    }} 
                                    className="glass-button" 
                                    style={{ width: '100%', height: '50px', background: 'var(--accent-success)', border: 'none', color: 'white', fontWeight: 700 }}
                                >
                                    AUTO-FILL & CLOSE
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* SECURE HELP MODAL */}
            {helpModalOpen && (
                <div className="modal-overlay" onClick={() => setHelpModalOpen(false)}>
                    <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-dim)', padding: '40px', maxWidth: '640px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>🛡️ Secure Help Desk</h2>
                            <button 
                                type="button"
                                onClick={() => setHelpModalOpen(false)} 
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '8px' }}>Default Operational Credentials</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: '1.5' }}>
                                    SportNet uses a strict role-based organizational model. Below are pre-seeded credentials for development and testing. Click <strong>⚡ QUICK FILL</strong> to immediately populate credentials and start testing.
                                </p>

                                <div className="glass-table-container" style={{ marginTop: '10px', overflowX: 'auto', border: '1px solid var(--border-dim)' }}>
                                    <table className="glass-table" style={{ width: '100%', fontSize: '0.8rem' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ padding: '10px 14px' }}>Role</th>
                                                <th style={{ padding: '10px 14px' }}>Email Address</th>
                                                <th style={{ padding: '10px 14px' }}>Key</th>
                                                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { label: 'Director', icon: '🏗️', email: 'director1@sportnet.com', role: 'director' },
                                                { label: 'Director 2', icon: '🏗️', email: 'director2@sportnet.com', role: 'director' },
                                                { label: 'Manager', icon: '💼', email: 'manager@sportnet.com', role: 'manager' },
                                                { label: 'Coach', icon: '📋', email: 'coach1@sportnet.com', role: 'coach' },
                                                { label: 'Captain', icon: '🎖️', email: 'captain1@sportnet.com', role: 'captain' },
                                                { label: 'Player', icon: '👟', email: 'player1@sportnet.com', role: 'player' }
                                            ].map((cred, idx) => (
                                                <tr key={idx}>
                                                    <td style={{ padding: '10px 14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <span>{cred.icon}</span> <span>{cred.label}</span>
                                                    </td>
                                                    <td style={{ padding: '10px 14px', fontFamily: 'monospace' }}>{cred.email}</td>
                                                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>sportnet123</td>
                                                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                setEmail(cred.email);
                                                                setPassword('sportnet123');
                                                                setRole(cred.role);
                                                                setHelpModalOpen(false);
                                                            }}
                                                            style={{
                                                                background: 'rgba(59, 130, 246, 0.1)',
                                                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                                                color: 'var(--accent-primary)',
                                                                padding: '4px 10px',
                                                                borderRadius: '6px',
                                                                fontSize: '0.7rem',
                                                                fontWeight: 800,
                                                                cursor: 'pointer',
                                                                whiteSpace: 'nowrap',
                                                                transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            ⚡ QUICK FILL
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <hr style={{ borderColor: 'var(--border-dim)', opacity: 0.3 }} />

                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '8px' }}>Access Protocol & System Integrity</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                    <p>
                                        🔑 <strong>Recovering Security Keys:</strong> If a user resets a security key, the system automatically salts and hashes the new key with <code>bcryptjs</code> inside the SportNet secure database schema.
                                    </p>
                                    <p>
                                        🎟️ <strong>Session Validity:</strong> Once verified, the backend issues an encrypted <code>JSON Web Token (JWT)</code> which is preserved locally. It secures all cross-origin requests automatically.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                type="button"
                                onClick={() => setHelpModalOpen(false)} 
                                className="glass-button" 
                                style={{ height: '40px', padding: '0 20px', border: '1px solid var(--border-dim)', background: 'transparent' }}
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;


