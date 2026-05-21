import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        gender: 'Male',
        age: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const response = await api.post('/auth/register', formData);
            setSuccess(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-bg">
            <div className="glass-panel login-card fade-in" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-dim)' }}>
                <div className="login-header">
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)' }}>Player Registration</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Join SportNet and await coach approval.</p>
                </div>
                
                {error && <div style={{ padding: '14px 20px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', marginBottom: '24px', fontWeight: 600 }}>⚠ {error}</div>}
                {success && <div style={{ padding: '14px 20px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-success)', color: 'var(--accent-success)', marginBottom: '24px', fontWeight: 600 }}>✓ {success} Redirecting to login...</div>}
                
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="glass-input" required style={{ width: '100%' }} />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="glass-input" required style={{ width: '100%' }} />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="glass-input" required style={{ width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="glass-input" style={{ width: '100%', background: 'var(--bg-deep)', color: 'var(--text-main)' }}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className="glass-input" required style={{ width: '100%' }} />
                        </div>
                    </div>
                    <button type="submit" className="glass-button" disabled={loading} style={{ marginTop: '12px', height: '56px', background: 'var(--accent-primary)', border: 'none', color: 'white', fontWeight: 'bold' }}>
                        {loading ? 'REGISTERING...' : 'REGISTER'}
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>Already have an account? Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Register;
