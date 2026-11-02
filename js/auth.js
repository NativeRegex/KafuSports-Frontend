/**
 * KAFU Sports — Authentication helpers
 * Stores JWT token in localStorage; provides isLoggedIn/logout/requireAuth.
 */

const TOKEN_KEY = 'kafu_token';
const USER_KEY  = 'kafu_user';

const Auth = {
    // Save token after successful login
    save: function (token, user) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    // Get the JWT token (or null)
    getToken: function () {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Get the logged-in user info (or null)
    getUser: function () {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    },

    // Is someone logged in?
    isLoggedIn: function () {
        return !!this.getToken();
    },

    // Logout
    logout: function () {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    // Redirect to /admin.html if not logged in
    requireAuth: function () {
        if (!this.isLoggedIn()) {
            window.location.href = '/admin.html';
            return false;
        }
        return true;
    }
};
