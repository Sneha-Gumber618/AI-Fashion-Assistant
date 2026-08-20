const AUTH_USERS_KEY = 'shopai_users';
const AUTH_CURRENT_USER_KEY = 'shopai_current_user';
const ADMIN_USERS_KEY = 'shopai_admin_users';
const APPROVED_ADMIN_IDS = ['admin'];

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

function getStoredAdmins() {
    try {
        const stored = localStorage.getItem(ADMIN_USERS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading admin accounts from localStorage:', error);
        return [];
    }
}

function saveAdmins(admins) {
    try {
        localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(admins));
    } catch (error) {
        console.error('Error saving admin accounts to localStorage:', error);
    }
}

function registerAdmin(adminData) {
    const admins = getStoredAdmins();
    const adminId = adminData.adminId.trim().toLowerCase();

    if (!APPROVED_ADMIN_IDS.includes(adminId)) {
        return { success: false, message: 'This admin ID is not approved for Seller Studio.' };
    }

    const existingAdmin = admins.find((admin) => admin.adminId === adminId);

    if (existingAdmin) {
        return { success: false, message: 'That admin ID is already registered.' };
    }

    const newAdmin = {
        id: Date.now(),
        name: adminData.name.trim(),
        adminId,
        password: adminData.password,
        role: 'admin'
    };

    admins.push(newAdmin);
    saveAdmins(admins);
    return { success: true, user: newAdmin, message: 'Admin account registered. You can now log in.' };
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

function loginAdmin(credentials) {
    const adminId = credentials.adminId.trim().toLowerCase();

    if (!APPROVED_ADMIN_IDS.includes(adminId)) {
        return { success: false, message: 'This admin ID is not approved for Seller Studio.' };
    }

    const admin = getStoredAdmins().find((entry) => entry.adminId === adminId && entry.password === credentials.password);

    if (!admin) {
        return { success: false, message: 'Invalid admin ID or password.' };
    }

    localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(admin));
    return { success: true, user: admin, message: 'Admin login successful.' };
}

function isAdmin() {
    const currentUser = getCurrentUser();
    return Boolean(currentUser && currentUser.role === 'admin');
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

