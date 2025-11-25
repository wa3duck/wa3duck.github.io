// 登录处理
function handleLogin(username, password) {
    const loginMessage = document.getElementById('loginMessage');
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
        saveToLocalStorage('rememberedUser', currentUser);
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
        saveToLocalStorage('rememberedUser', currentUser);
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
}

// 处理注册
function handleRegister(username, password, email) {
    const loginMessage = document.getElementById('loginMessage');
    if (usersData[username]) {
        loginMessage.textContent = '用户名已存在！';
        loginMessage.style.color = '#e74c3c';
    } else {
        usersData[username] = {
            password: password,
            email: email,
            joinDate: new Date().toISOString().split('T')[0],
            blogsCount: '0',
            linksCount: '0',
            joinDays: '1'
        };
        saveToLocalStorage('usersData', usersData);
        currentUser = {
            username: username,
            role: 'user',
            email: email,
            joinDate: new Date().toISOString().split('T')[0],
            blogsCount: '0',
            linksCount: '0',
            joinDays: '1'
        };
        saveToLocalStorage('rememberedUser', currentUser);
        loginMessage.textContent = '注册成功！';
        loginMessage.style.color = '#2ecc71'; // 成功时显示绿色
        setTimeout(() => {
            document.getElementById('userModal').classList.remove('active');
            updateUIForLoggedInUser();
            showProfile();
        }, 1000);
    }
}

// 切换登录/注册模式
function switchUserMode() {
    const title = document.getElementById('userModalTitle');
    const switchBtn = document.getElementById('switchMode');
    const submitBtn = document.querySelector('#userForm button[type="submit"]');
    const emailGroup = document.getElementById('emailGroup');
    
    if (title.textContent === '用户登录') {
        title.textContent = '用户注册';
        switchBtn.textContent = '切换到登录';
        submitBtn.textContent = '注册';
        emailGroup.style.display = 'block';
    } else {
        title.textContent = '用户登录';
        switchBtn.textContent = '切换到注册';
        submitBtn.textContent = '登录';
        emailGroup.style.display = 'none';
    }
}
