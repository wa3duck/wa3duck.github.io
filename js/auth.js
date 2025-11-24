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
    alert('用户名或密码错误');
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
    
    // 创建用户个人资料
    const userProfile = {
        joinDate: new Date().toISOString().split('T')[0],
        addedLinks: [],
        email: email
    };
    
    // 保存用户资料
    const savedProfiles = localStorage.getItem('userProfiles');
    const profiles = savedProfiles ? JSON.parse(savedProfiles) : {};
    profiles[username] = userProfile;
    localStorage.setItem('userProfiles', JSON.stringify(profiles));
    
    setCurrentUser(newUser);
    return true;
}

function changePassword(oldPassword, newPassword) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('请先登录');
        return false;
    }
    
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
    
    alert('密码修改成功');
    return true;
}

function logout() {
    setCurrentUser(null);
    alert('已退出登录');
}
