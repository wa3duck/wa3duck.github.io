// js/auth.js
// 用户认证功能
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
    updateUI();
}

function login(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        if (user.isBlocked) {
            alert('该账号已被封禁，无法登录');
            return false;
        }
        setCurrentUser(user);
        return true;
    }
    return false;
}

function register(username, password, email, code) {
    if (code !== "123456") {
        alert('验证码错误');
        return false;
    }
    
    const users = getUsers();
    
    if (users.find(u => u.username === username)) {
        alert('用户名已存在');
        return false;
    }
    
    if (users.find(u => u.email === email)) {
        alert('邮箱已被注册');
        return false;
    }
    
    const newUser = {
        username,
        password,
        email,
        isAdmin: false,
        isBlocked: false
    };
    
    users.push(newUser);
    saveUsers(users);
    
    getUserProfile(username);
    updateUserProfile(username, { email: email });
    
    setCurrentUser(newUser);
    return true;
}

function changePassword(oldPassword, newPassword) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    
    if (userIndex === -1) return false;
    
    if (users[userIndex].password !== oldPassword) {
        alert('当前密码错误');
        return false;
    }
    
    users[userIndex].password = newPassword;
    saveUsers(users);
    
    currentUser.password = newPassword;
    setCurrentUser(currentUser);
    
    return true;
}

function logout() {
    setCurrentUser(null);
}
