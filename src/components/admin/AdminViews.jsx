const handleCreate = async (e) => {
    e.preventDefault(); setMsg(''); setErr('');
    try {
        await createUser(form);
        setMsg(`Identity established for ${form.email}`);
        setShowForm(false);
        setForm({
            email: '', password: '', role: 'player',
            name: '', gender: 'Male', age: '',
            qualification: '', managed_by_id: '',
            sport_specialization: ''
        });
        load();
    } catch (ex) {
        setErr(ex.response?.data?.message || 'Identity creation failure');
    }
};

const handleDelete = async (uid, email) => {
    if (!window.confirm(`Permanently revoke access for ${email}?`)) return;
    try {
        await deleteUser(uid);
        setMsg('Access revoked');
        load();
    } catch {
        setErr('Revocation failed');
    }
};

const filtered = filter === 'all'
    ? users
    : users.filter(u => u.role === filter);