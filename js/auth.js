// 认证相关功能

// 当前用户状态
let currentUser = null;

// 用户数据存储
let usersData = getFromStorage('usersData') || {};
let userLinks = getFromStorage('userLinks') || {};

// 记忆功能 - 保存当前登录用户
let rememberedUser = getFromStorage('rememberedUser');

// 处理用户表单提交
function handleUserFormSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const isLoginMode = document.getElementById('userModalTitle').textContent === '用户登录';
    const loginMessage = document.getElementById('loginMessage');
    
    if (isLoginMode) {
        // 登录逻辑
        if (username === adminAccount.username && password === adminAccount.password) {
            currentUser = {
                username: adminAccount.username,
                role: adminAccount.role,
                email: 'admin@example.com',
                joinDate: '2023-01-01',
                blogsCount: '11',
                linksCount: '5',
                joinDays: '245'
            };
            
            // 记忆登录状态
            saveToStorage('rememberedUser', currentUser);
            
            loginMessage.textContent = '管理员登录成功！';
            loginMessage.style.color = '#2ecc71'; // 成功时显示绿色
            setTimeout(() => {
                document.getElementById('userModal').classList.remove('active');
                updateUIForLoggedInUser();
                showProfile();
            }, 1000);
        } else if (usersData[username] && usersData[username].password === password) {
            currentUser = {
                username: username,
                role: 'user',
                email: usersData[username].email,
                joinDate: usersData[username].joinDate,
                blogsCount: usersData[username].blogsCount || '0',
                linksCount: usersData[username].linksCount || '0',
                joinDays: usersData[username].joinDays || '1'
            };
            
            // 记忆登录状态
            saveToStorage('rememberedUser', currentUser);
            
            loginMessage.textContent = '登录成功！';
            loginMessage.style.color = '#2ecc71'; // 成功时显示绿色
            setTimeout(() => {
                document.getElementById('userModal').classList.remove('active');
                updateUIForLoggedInUser();
                showProfile();
            }, 1000);
        } else {
            loginMessage.textContent = '用户名或密码错误！';
            loginMessage.style.color = '#e74c3c'; // 失败时显示红色
        }
    } else {
        // 注册逻辑
        if (usersData[username]) {
            loginMessage.textContent = '用户名已存在！';
            loginMessage.style.color = '#e74c3c';
        } else {
            usersData[username] = {
                password: password,
                email: email,
                joinDate: formatDate(new Date()),
                blogsCount: '0',
                linksCount: '0',
                joinDays: '1'
            };
            saveToStorage('usersData', usersData);
            
            currentUser = {
                username: username,
                role: 'user',
                email: email,
                joinDate: formatDate(new Date()),
                blogsCount: '0',
                linksCount: '0',
                joinDays: '1'
            };
            
            // 记忆登录状态
            saveToStorage('rememberedUser', currentUser);
            
            loginMessage.textContent = '注册成功！';
            loginMessage.style.color = '#2ecc71';
            setTimeout(() => {
                document.getElementById('userModal').classList.remove('active');
                updateUIForLoggedInUser();
                showProfile();
            }, 1000);
        }
    }
    
    // 重置表单
    document.getElementById('userForm').reset();
}

// 处理个人设置表单提交
function handleProfileSettingsSubmit(e) {
    e.preventDefault();
    if (currentUser) {
        currentUser.email = document.getElementById('profileEmail').value;
        // 更新存储的用户数据
        if (usersData[currentUser.username]) {
            usersData[currentUser.username].email = currentUser.email;
            saveToStorage('usersData', usersData);
        }
        // 更新记忆的用户数据
        saveToStorage('rememberedUser', currentUser);
        alert('设置保存成功！');
    }
}

// 处理退出登录
function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        currentUser = null;
        document.getElementById('userBtn').innerHTML = '<i class="fas fa-user"></i> 登录/注册';
        
        // 清除记忆的登录状态
        localStorage.removeItem('rememberedUser');
        
        hideProfile();
        alert('已成功退出登录！');
    }
}

// 获取当前用户
function getCurrentUser() {
    return currentUser;
}

// 设置当前用户
function setCurrentUser(user) {
    currentUser = user;
}
