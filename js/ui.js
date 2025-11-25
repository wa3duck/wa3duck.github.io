// UI相关功能

// 更新UI为已登录状态
function updateUIForLoggedInUser() {
    if (currentUser) {
        document.getElementById('userBtn').innerHTML = `<i class="fas fa-user"></i> ${currentUser.username}`;
    }
}

// 显示用户模态框
function showUserModal() {
    if (currentUser) {
        // 如果已登录，直接显示个人中心
        showProfile();
    } else {
        document.getElementById('userModal').classList.add('active');
        // 清空登录消息
        document.getElementById('loginMessage').textContent = '';
    }
}

// 显示个人中心
function showProfile() {
    document.getElementById('profileSection').classList.add('active');
    
    if (currentUser) {
        // 更新用户信息
        document.getElementById('profileUserName').textContent = currentUser.username;
        document.getElementById('profileUserEmail').textContent = currentUser.email || '未设置邮箱';
        document.getElementById('profileUserRole').textContent = currentUser.role === 'admin' ? '管理员' : '普通用户';
        document.getElementById('profileUsername').value = currentUser.username;
        document.getElementById('profileEmail').value = currentUser.email || '';
        document.getElementById('profileJoinDate').value = currentUser.joinDate || '2023-05-15';
        
        // 更新统计数据
        document.getElementById('blogsCount').textContent = currentUser.blogsCount || '0';
        document.getElementById('linksCount').textContent = currentUser.linksCount || '0';
        document.getElementById('joinDays').textContent = currentUser.joinDays || '245';
        
        // 更新用户按钮
        document.getElementById('userBtn').innerHTML = `<i class="fas fa-user"></i> ${currentUser.username}`;
    }
}

// 隐藏个人中心
function hideProfile() {
    document.getElementById('profileSection').classList.remove('active');
}

// 切换用户模式（登录/注册）
function switchUserMode() {
    const title = document.getElementById('userModalTitle');
    const switchBtn = document.getElementById('switchMode');
    const submitBtn = document.querySelector('#userForm button[type="submit"]');
    const emailGroup = document.getElementById('emailGroup');
    
    // 清空登录消息
    document.getElementById('loginMessage').textContent = '';
    
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

// 主题切换
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('#themeToggle i');
    if (document.body.classList.contains('dark-theme')) {
        icon.className = 'fas fa-sun';
        saveToStorage('theme', 'dark');
    } else {
        icon.className = 'fas fa-moon';
        saveToStorage('theme', 'light');
    }
}

// 加载链接数据
function loadLinks() {
    for (const category in sampleLinks) {
        const linksContainer = document.getElementById(`${category}-links`);
        if (linksContainer) {
            // 如果有用户登录且该用户有自定义链接，则使用用户自定义链接
            const userCategoryLinks = currentUser && userLinks[currentUser.username] ? 
                userLinks[currentUser.username][category] : null;
            
            const linksToShow = userCategoryLinks || sampleLinks[category];
            
            linksContainer.innerHTML = '';
            
            // 加载链接
            linksToShow.forEach((link, index) => {
                const linkItem = document.createElement('li');
                linkItem.className = 'link-item';
                linkItem.setAttribute('data-category', category);
                linkItem.setAttribute('data-index', index);
                linkItem.innerHTML = `
                    <div class="link-icon">
                        <i class="${link.icon}"></i>
                    </div>
                    <div class="link-content">
                        <div class="link-title">${link.title}</div>
                        <div class="link-description">${link.description}</div>
                    </div>
                `;
                linkItem.addEventListener('click', (e) => {
                    window.open(link.url, '_blank');
                });
                linksContainer.appendChild(linkItem);
            });
        }
    }
}
