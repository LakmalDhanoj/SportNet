const handleCreate = async (e) => { ... }

const handleDelete = async (uid, email) => { ... }

const filtered = filter === 'all' ? users : users.filter(u => u.role === filter);