const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '../../src/data/db.json');

function readDb() {
    const data = fs.readFileSync(dbFilePath, 'utf-8');
    return JSON.parse(data);
}

function writeDb(data) {
    try {
        fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing to db.json:', error);
        throw error;
    }
}

exports.register = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = readDb();
    const existingUser = db.users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email đã được đăng ký' });
    }

    // Password validation
    if (password.length < 8) {
        return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 8 ký tự' });
    }
    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ message: 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa' });
    }

    const newUser = {
        id: db.users.length + 1,
        name,
        email,
        password
    };
    db.users.push(newUser);
    writeDb(db);

    res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
};

exports.login = (req, res) => {
    const { email, password } = req.query;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
    }
    const db = readDb();
    const user = db.users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    res.status(200).json({ message: 'Đăng nhập thành công', user });
};
