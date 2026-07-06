import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';

// Sport-specific positions
const SPORT_POSITIONS = {
    Football:   ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Striker'],
    Cricket:    ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'],
    Volleyball: ['Setter', 'Libero', 'Outside Hitter', 'Middle Blocker', 'Opposite Hitter'],
    Basketball: ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
    Swimming:   ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Individual Medley'],
    Tennis:     ['Singles', 'Doubles'],
    Badminton:  ['Singles', 'Doubles', 'Mixed Doubles'],
    Rugby:      ['Prop', 'Hooker', 'Lock', 'Flanker', 'Number 8', 'Scrum-half', 'Fly-half', 'Wing', 'Centre', 'Fullback'],
};
const DEFAULT_POSITIONS = ['Forward', 'Midfielder', 'Defender', 'Captain', 'Substitute'];

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        gender: 'Male',
        age: '',
        sport_category: '',
        position: '',
    });
    const [sports, setSports] = useState([]);
    const [positions, setPositions] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [sportsLoading, setSportsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/sports/public')
            .then(r => {
                setSports(r.data.sports || []);
                setSportsLoading(false);
            })
            .catch(() => {
                setSports([]);
                setSportsLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'sport_category') {
            setFormData(prev => ({ ...prev, sport_category: value, position: '' }));
            setPositions(SPORT_POSITIONS[value] || DEFAULT_POSITIONS);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const email = formData.email.toLowerCase();
        const isCampusEmail = email.endsWith('.edu') || email.endsWith('.ac.lk') || email.endsWith('.edu.lk') || email.endsWith('@sportnet.com');
        if (!isCampusEmail) {
            setError('Please use a valid campus email address (ending with .edu, .ac.lk, or .edu.lk).');
            setLoading(false);
            return;
        }

        if (!formData.sport_category) {
            setError('Please select your sport category.');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/register', formData);
            setSuccess(response.data.message);
            setTimeout(() => { navigate('/login'); }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '14px 18px', color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' };
    const labelStyle = { fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', textTransform: 'uppercase' };

    return (
        <div className="login-bg">
            <div className="glass-panel login-card fade-in" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-dim)', maxWidth: '560px', width: '100%' }}>
                {/* Header */}
                <div className="login-header" style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '2.8rem', marginBottom: '8px' }}>🏟️</div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: 0 }}>
                        Player Registration
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.9rem' }}>
                        Use your campus email. Your account will be reviewed by a coach.
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div style={{ padding: '14px 20px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', marginBottom: '24px', fontWeight: 600, fontSize: '0.88rem' }}>
                        ⚠ {error}
                    </div>
                )}
                {success && (
                    <div style={{ padding: '14px 20px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--accent-success)', color: 'var(--accent-success)', marginBottom: '24px', fontWeight: 600, fontSize: '0.88rem' }}>
                        ✓ {success} Redirecting to login...
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Full Name */}
                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} required placeholder="Enter your full name" className="glass-input" />
                    </div>

                    {/* Email */}
                    <div>
                        <label style={labelStyle}>Campus Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required placeholder="yourname@campus.edu" className="glass-input" />
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                            Must end with .edu, .ac.lk, or .edu.lk
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label style={labelStyle}>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} required placeholder="Create a strong password" className="glass-input" />
                    </div>

                    {/* Gender + Age */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle} className="glass-input">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} style={inputStyle} required placeholder="e.g. 22" min="14" max="50" className="glass-input" />
                        </div>
                    </div>

                    {/* Sport Category */}
                    <div>
                        <label style={labelStyle}>
                            🏆 Sport Category
                            {sportsLoading && <span style={{ marginLeft: '8px', opacity: 0.5 }}>Loading...</span>}
                        </label>
                        <select name="sport_category" value={formData.sport_category} onChange={handleChange} style={inputStyle} required className="glass-input">
                            <option value="">— Select Your Sport —</option>
                            {sports.filter(s => s.status === 'Active').map(s => (
                                <option key={s.sport_id} value={s.sport_name}>{s.sport_name} ({s.sport_type})</option>
                            ))}
                        </select>
                        {sports.length === 0 && !sportsLoading && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--accent-warning)', marginTop: '6px' }}>
                                No sports configured yet. Please contact your director.
                            </div>
                        )}
                    </div>

                    {/* Position — shown only once a sport is chosen */}
                    {formData.sport_category && (
                        <div className="fade-in">
                            <label style={labelStyle}>🎯 Your Position / Role</label>
                            <select name="position" value={formData.position} onChange={handleChange} style={inputStyle} className="glass-input">
                                <option value="">— Select Position —</option>
                                {positions.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="glass-button"
                        disabled={loading || !formData.sport_category}
                        style={{ marginTop: '8px', height: '56px', background: 'var(--accent-primary)', border: 'none', color: 'white', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.05em', borderRadius: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}
                    >
                        {loading ? '⏳ REGISTERING...' : '🚀 REGISTER NOW'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                        <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
                            Already have an account? <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Login →</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
