import axios from 'axios';

const BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (email, password, role) =>
    api.post('/auth/login', { email, password, role });
export const forgotKey = (email, role) =>
    api.post('/auth/forgot-key', { email, role });

// ── Users ─────────────────────────────────────────────────────────────────────
export const getAllUsers    = ()       => api.get('/users');
export const createUser    = (data)   => api.post('/users', data);
export const deleteUser    = (id)     => api.delete(`/users/${id}`);
export const getMyPlayers  = ()       => api.get('/users/my-players');
export const getMyCaptains = ()       => api.get('/users/my-captains');
export const getAllCoaches  = ()       => api.get('/users/all-coaches');
export const getAllCaptains = ()       => api.get('/users/all-captains');
export const getAllPlayers  = ()       => api.get('/users/all-players');
export const listCoaches   = ()       => api.get('/users/list/coaches');
export const listCaptains  = ()       => api.get('/users/list/captains');
export const listDirectors = ()       => api.get('/users/list/directors');
export const listManagers  = ()       => api.get('/users/list/managers');
export const getAuditLogs   = ()       => api.get('/users/audit-logs');
export const getPendingPlayers = () => api.get('/users/coach/pending-players');
export const approvePlayer = (id, data) => api.put(`/users/coach/approve-player/${id}`, data);
export const coachAddPlayer = (data) => api.post('/users/coach/add-player', data);
export const getMyTeammates = () => api.get('/users/player/my-teammates');
export const getDirectorTeamTree = () => api.get('/users/director/team-tree');
export const getManagerSportView = () => api.get('/users/manager/my-sport');
export const updatePlayerPerformance = (id, data) => api.put(`/users/coach/player-performance/${id}`, data);
export const uploadProfilePhoto = (formData) => api.post('/users/profile-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// ── Reports ───────────────────────────────────────────────────────────────────
export const submitPlayerReports   = (data)      => api.post('/reports/player', data);
export const getCaptainSquadReports = ()          => api.get('/reports/player/my-squad');
export const getCaptainSubmissionStatus = ()      => api.get('/reports/player/submission-status');
export const getPlayerReportsForCoach = ()        => api.get('/reports/player/for-coach');
export const approvePlayerReport   = (id, data)  => api.put(`/reports/player/${id}/approve`, data);
export const bulkApproveByCaption  = (capId)     => api.put(`/reports/player/bulk-approve/${capId}`);
export const getMyCaptainReports   = ()           => api.get('/reports/captain/my-captains');
export const submitCaptainReport   = (data)       => api.post('/reports/captain', data);
export const getDirectorOverview   = ()           => api.get('/reports/overview/director');
export const getManagerOverview    = ()           => api.get('/reports/overview/manager');
export const getCaptainOverview    = ()           => api.get('/reports/overview/captain');
export const getCoachOverview      = ()           => api.get('/reports/overview/coach');
export const getPlayerReports      = ()           => api.get('/reports/player/my-reports');

// ── Sports Management ──────────────────────────────────────────────────────────
export const getPublicSports       = ()           => api.get('/sports/public');
export const getActiveSports       = ()           => axios.get(`${BASE}/sports/public`); // no auth
export const getAllSports         = ()           => api.get('/sports');
export const createSport          = (data)       => api.post('/sports', data);
export const updateSport          = (id, data)   => api.put(`/sports/${id}`, data);
export const deleteSport          = (id)         => api.delete(`/sports/${id}`);

// ── Player Adding Flow Requests ────────────────────────────────────────────────
export const submitPlayerRequest   = (data)       => api.post('/player-requests', data);
export const getCaptainRequests    = ()           => api.get('/player-requests/captain');
export const removePlayerRequest   = (id)         => api.delete(`/player-requests/${id}/remove`);
export const getCoachRequests      = ()           => api.get('/player-requests/coach');
export const reviewPlayerRequest   = (id, decision) => api.put(`/player-requests/${id}/review`, { decision });

// ── Private Player-Coach Comments ──────────────────────────────────────────────
export const addComment            = (data)       => api.post('/comments', data);
export const getComments           = (playerId = '') => api.get(`/comments${playerId ? `?player_id=${playerId}` : ''}`);
export const editComment           = (id, data)   => api.put(`/comments/${id}`, data);
export const deleteComment         = (id)         => api.delete(`/comments/${id}`);
export const replyComment          = (id, reply_message) => api.put(`/comments/${id}/reply`, { reply_message });
export const resolveComment        = (id)         => api.put(`/comments/${id}/resolve`);

export default api;
