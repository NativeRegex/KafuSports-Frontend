/**
 * KAFU Sports — API Client
 * All calls to the backend go through this file.
 */

// Detect local dev (localhost, 127.0.0.1, 0.0.0.0, or any IP-based local address)
const _host = window.location.hostname;
const _isLocal = _host === 'localhost'
              || _host === '127.0.0.1'
              || _host === '0.0.0.0'
              || _host === ''
              || _host.startsWith('192.168.')
              || _host.startsWith('10.');

const API_BASE = _isLocal
    ? 'http://localhost:8080'
    : 'https://kafusports-api.onrender.com';

console.log('[KAFU] API base:', API_BASE, '(host:', _host + ')');

// ---------- Helpers ----------
async function apiGet(path) {
    const res = await fetch(API_BASE + path);
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
}

async function apiPost(path, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch(API_BASE + path, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`POST ${path} failed: ${res.status} ${text}`);
    }
    return res.json();
}

async function apiDelete(path, token) {
    const headers = {};
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch(API_BASE + path, { method: 'DELETE', headers });
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
    return res.status === 204 ? null : res.json();
}

// ---------- Public endpoints ----------
const API = {
    health:       () => apiGet('/api/health'),
    getLeague:    () => apiGet('/api/league'),
    getTeams:     () => apiGet('/api/teams'),
    getTeam:      (id) => apiGet('/api/teams/' + id),
    getFixtures:  () => apiGet('/api/fixtures'),
    getResults:   () => apiGet('/api/results'),
    getPlayers:   () => apiGet('/api/players'),
    getStats:     () => apiGet('/api/stats'),

    login: (username, password) =>
        apiPost('/api/auth/login', { username, password }),
    me: (token) => apiGet('/api/auth/me'),

    createTeam:    (data, token) => apiPost('/api/admin/teams', data, token),
    deleteTeam:    (id, token)   => apiDelete('/api/admin/teams/' + id, token),

    createFixture: (data, token) => apiPost('/api/admin/fixtures', data, token),
    deleteFixture: (id, token)   => apiDelete('/api/admin/fixtures/' + id, token),

    createResult:  (data, token) => apiPost('/api/admin/results', data, token),
    deleteResult:  (id, token)   => apiDelete('/api/admin/results/' + id, token),

    createPlayer:  (data, token) => apiPost('/api/admin/players', data, token),
    deletePlayer:  (id, token)   => apiDelete('/api/admin/players/' + id, token)
};
