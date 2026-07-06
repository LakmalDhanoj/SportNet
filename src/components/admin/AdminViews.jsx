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

    const ManagedByDropdown = () => {
    if (!['coach','captain','player'].includes(form.role)) return null;

    let options = [];
    let label = '';

    if (form.role === 'coach') {
        options = dropdowns.managers;
        label = 'Department Manager';
    } else if (form.role === 'captain') {
        options = dropdowns.coaches;
        label = 'Operational Coach';
    } else if (form.role === 'player') {
        options = dropdowns.captains;
        label = 'Lead Captain';
    }

    return (
        <div className="form-group">
            <label>{label}</label>
            <select
                className="glass-input"
                value={form.managed_by_id}
                onChange={e => setForm({ ...form, managed_by_id: e.target.value })}
            >
                <option value="">— Unassigned —</option>
                {options.map(o => {
                    const id = o[Object.keys(o)[0]];
                    const extra = o.sport_specialization
                        ? ` (${o.sport_specialization})`
                        : (o.sport_category ? ` (${o.sport_category})` : '');
                    return (
                        <option key={id} value={id}>
                            {o.name}{extra}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};