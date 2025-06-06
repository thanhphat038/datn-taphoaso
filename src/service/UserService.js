const USER_STORAGE_KEY = 'users';

function getUsers() {
    const usersJson = localStorage.getItem(USER_STORAGE_KEY);
    if (usersJson) {
        return JSON.parse(usersJson);
    }
    return [];
}

function saveUsers(users) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

export function registerUser({ name, email, password }) {
    const users = getUsers();
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        throw new Error('Email đã được đăng ký');
    }
    const newUser = { name, email, password };
    users.push(newUser);
    saveUsers(users);
    return newUser;
}

export function loginUser({ email, password }) {
    const users = getUsers();
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }
    return user;
}
