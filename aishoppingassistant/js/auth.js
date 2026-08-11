const AUTH_USERS_KEY = 'shopai_users';
const AUTH_CURRENT_USER_KEY = 'shopai_current_user';

function getStoredUsers() {
    try {
        const stored = localStorage.getItem(AUTH_USERS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading users from localStorage:', error);
        return [];
    }
}

function saveUsers(users) {
    try {
        localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error('Error saving users to localStorage:', error);
    }
}

function registerUser(userData) {
    const users = getStoredUsers();
    const existingUser = users.find((user) => user.email.toLowerCase() === userData.email.toLowerCase());

    if (existingUser) {
        return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
        id: Date.now(),
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password
    };

    users.push(newUser);
    saveUsers(users);
    localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(newUser));

    return { success: true, user: newUser, message: 'Account created successfully.' };
}

function loginUser(credentials) {
    const users = getStoredUsers();
    const user = users.find((entry) => entry.email.toLowerCase() === credentials.email.trim().toLowerCase());

    if (!user || user.password !== credentials.password) {
        return { success: false, message: 'Invalid email or password.' };
    }

    localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, user, message: 'Login successful.' };
}

function logoutUser() {
    localStorage.removeItem(AUTH_CURRENT_USER_KEY);
    return { success: true, message: 'Logged out.' };
}

function getCurrentUser() {
    try {
        const currentUser = localStorage.getItem(AUTH_CURRENT_USER_KEY);
        return currentUser ? JSON.parse(currentUser) : null;
    } catch (error) {
        console.error('Error reading current user:', error);
        return null;
    }
}

if (typeof module !== 'undefined') {
    module.exports = {
        registerUser,
        loginUser,
        logoutUser,
        getCurrentUser,
        AUTH_USERS_KEY,
        AUTH_CURRENT_USER_KEY
    };
}
