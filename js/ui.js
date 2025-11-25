// 更新UI为已登录状态
function updateUIForLoggedInUser() {
    if (currentUser) {
        document.getElementById('userBtn').innerHTML = `<i class="fas fa-user"></i> ${currentUser.username}`;
    }
}

// 显示个人中心
function showProfile() {
    document.getElementById('profileSection').classList.add('active');
    
    if (currentUser) {
        document.getElementById('profileUserName').textContent = currentUser.username;
        document.getElementById('profileUserEmail').textContent = currentUser.email || '未设置邮箱';
        document.getElementById('profileUserRole').textContent = currentUser.role === 'admin' ? '管理员' : '普通用户';
        document.getElementById('profileUsername').value = currentUser.username;
        document.getElementById('profileEmail').value = currentUser.email || '';
        document.getElementById('profileJoinDate').value = currentUser.joinDate || '2023-05-15';
        
        document.getElementById('blogsCount').textContent = currentUser.blogsCount || '0';
        document.getElementById('linksCount').textContent = currentUser.linksCount || '0';
        document.getElementById('joinDays').textContent = currentUser.joinDays || '245';
    }
}

// 隐藏个人中心
function hideProfile() {
    document.getElementById('profileSection').classList.remove('active');
}

// 显示用户模态框
function showUserModal() {
    if (currentUser) {
        showProfile();
    } else {
        document.getElementById('userModal').classList.add('active');
        document.getElementById('loginMessage').textContent = '';
    }
}
