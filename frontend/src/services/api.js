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
export default api;
