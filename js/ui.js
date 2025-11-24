// 在 ui.js 中添加以下函数：

function renderUsers() {
    const users = getUsers();
    const userList = document.getElementById('userList');
    const currentUser = getCurrentUser();
    
    if (!userList) return;
    
    userList.innerHTML = '';
    
    users.forEach((user, index) => {
        const userElement = document.createElement('li');
        userElement.className = 'user-item';
        userElement.innerHTML = `
            <div class="user-info">
                <span class="username">${user.username}</span>
                <span class="user-email">${user.email}</span>
                <span class="user-status">
                    ${user.isAdmin ? '<span class="badge admin">管理员</span>' : ''}
                    ${user.isBlocked ? '<span class="badge blocked">已封禁</span>' : '<span class="badge active">活跃</span>'}
                </span>
            </div>
            <div class="user-actions">
                ${currentUser && currentUser.isAdmin ? `
                    <button class="btn btn-warning toggle-admin" data-index="${index}">
                        ${user.isAdmin ? '取消管理员' : '设为管理员'}
                    </button>
                    <button class="btn btn-danger toggle-block" data-index="${index}">
                        ${user.isBlocked ? '解封' : '封禁'}
                    </button>
                ` : ''}
            </div>
        `;
        userList.appendChild(userElement);
    });
    
    // 绑定用户管理事件
    document.querySelectorAll('.toggle-admin').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            toggleAdminStatus(index);
        });
    });
    
    document.querySelectorAll('.toggle-block').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            toggleBlockStatus(index);
        });
    });
}

function renderProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const profileContent = document.getElementById('profileContent');
    if (!profileContent) return;
    
    const userProfile = getUserProfile(currentUser.username);
    
    profileContent.innerHTML = `
        <div class="profile-info">
            <h3><i class="fas fa-user"></i> 个人信息</h3>
            <p><strong>用户名:</strong> ${currentUser.username}</p>
            <p><strong>邮箱:</strong> ${userProfile.email}</p>
            <p><strong>加入日期:</strong> ${userProfile.joinDate}</p>
            <p><strong>添加链接数:</strong> ${userProfile.addedLinks ? userProfile.addedLinks.length : 0}</p>
        </div>
        <div class="profile-actions">
            <button class="btn btn-primary" onclick="showChangePasswordForm()">
                <i class="fas fa-key"></i> 修改密码
            </button>
        </div>
    `;
}

function showChangePasswordForm() {
    document.getElementById('changePasswordForm').style.display = 'block';
}

function hideChangePasswordForm() {
    document.getElementById('changePasswordForm').style.display = 'none';
}

// 用户管理功能
function toggleAdminStatus(userIndex) {
    const users = getUsers();
    const currentUser = getCurrentUser();
    
    if (!currentUser || !currentUser.isAdmin) {
        alert('没有权限执行此操作');
        return;
    }
    
    users[userIndex].isAdmin = !users[userIndex].isAdmin;
    saveUsers(users);
    renderUsers();
}

function toggleBlockStatus(userIndex) {
    const users = getUsers();
    const currentUser = getCurrentUser();
    
    if (!currentUser || !currentUser.isAdmin) {
        alert('没有权限执行此操作');
        return;
    }
    
    users[userIndex].isBlocked = !users[userIndex].isBlocked;
    saveUsers(users);
    
    // 如果封禁的是当前用户，强制退出登录
    if (users[userIndex].username === currentUser.username && users[userIndex].isBlocked) {
        logout();
    }
    
    renderUsers();
}
