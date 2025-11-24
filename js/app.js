// js/app.js
// 主应用逻辑和事件绑定
document.addEventListener('DOMContentLoaded', function() {
    // 扩展默认数据
    extendDefaultData();
    
    // 初始化主题
    initTheme();
    
    // 渲染初始数据
    renderLinks();
    renderBlogs();
    updateUI();
    
    // 编辑模式事件
    document.getElementById('toggleEdit').addEventListener('click', toggleEditMode);
    document.getElementById('addLink').addEventListener('click', showAddLinkForm);
    document.getElementById('resetData').addEventListener('click', resetData);
    document.getElementById('cancelAdd').addEventListener('click', hideAddLinkForm);
    
    // 用户相关事件
    document.getElementById('userBtn').addEventListener('click', function() {
        document.getElementById('userModalTitle').textContent = '用户登录';
        document.getElementById('emailGroup').style.display = 'none';
        document.getElementById('codeGroup').style.display = 'none';
        document.getElementById('switchMode').textContent = '切换到注册';
        document.getElementById('userForm').querySelector('button[type="submit"]').textContent = '登录';
        showModal('userModal');
    });
    
    document.getElementById('switchMode').addEventListener('click', function() {
        const isLogin = document.getElementById('userModalTitle').textContent === '用户登录';
        
        if (isLogin) {
            document.getElementById('userModalTitle').textContent = '用户注册';
            document.getElementById('emailGroup').style.display = 'block';
            document.getElementById('codeGroup').style.display = 'block';
            this.textContent = '切换到登录';
            document.getElementById('userForm').querySelector('button[type="submit"]').textContent = '注册';
        } else {
            document.getElementById('userModalTitle').textContent = '用户登录';
            document.getElementById('emailGroup').style.display = 'none';
            document.getElementById('codeGroup').style.display = 'none';
            this.textContent = '切换到注册';
            document.getElementById('userForm').querySelector('button[type="submit"]').textContent = '登录';
        }
    });
    
    document.getElementById('sendCode').addEventListener('click', function() {
        alert('验证码已发送到您的邮箱：123456');
    });
    
    document.getElementById('changePasswordBtn').addEventListener('click', function() {
        showModal('passwordModal');
    });
    
    document.getElementById('logoutBtn').addEventListener('click', function() {
        logout();
    });
    
    document.getElementById('adminPanelBtn').addEventListener('click', function() {
        const adminPanel = document.getElementById('adminPanel');
        adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
    });
    
    // 个人中心事件
    document.getElementById('profileBtn').addEventListener('click', showProfile);
    document.getElementById('closeProfile').addEventListener('click', hideProfile);
    
    // 个人中心导航
    document.querySelectorAll('.profile-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('.profile-nav a').forEach(a => a.classList.remove('active'));
            document.querySelectorAll('.profile-tab').forEach(tab => tab.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.dataset.tab;
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    // 博客相关事件
    document.getElementById('addBlogBtn').addEventListener('click', function() {
        document.getElementById('blogModalTitle').textContent = '添加博客';
        document.getElementById('blogForm').reset();
        delete document.getElementById('blogForm').dataset.editingId;
        showModal('blogModal');
    });
    
    document.getElementById('addBlogBtnUser').addEventListener('click', function() {
        document.getElementById('blogModalTitle').textContent = '添加博客';
        document.getElementById('blogForm').reset();
        delete document.getElementById('blogForm').dataset.editingId;
        showModal('blogModal');
    });
    
    document.getElementById('addBlogBtnProfile').addEventListener('click', function() {
        document.getElementById('blogModalTitle').textContent = '添加博客';
        document.getElementById('blogForm').reset();
        delete document.getElementById('blogForm').dataset.editingId;
        showModal('blogModal');
        hideProfile();
    });
    
    // 管理员选项卡
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.dataset.tab;
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    // 关闭模态框
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // 点击模态框外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // 搜索功能
    document.getElementById('searchBtn').addEventListener('click', function() {
        const query = document.getElementById('searchInput').value;
        performSearch(query);
    });
    
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const query = this.value;
            performSearch(query);
        }
    });
    
    // 主题切换
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // 用户主页关闭
    document.getElementById('closeUserProfile').addEventListener('click', function() {
        document.getElementById('userProfilePage').style.display = 'none';
    });
    
    // 表单提交处理
    document.getElementById('linkForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            category: document.getElementById('category').value,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            url: document.getElementById('url').value,
            icon: document.getElementById('icon').value
        };
        
        addLink(formData);
        hideAddLinkForm();
    });
    
    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (document.getElementById('userModalTitle').textContent === '用户登录') {
            if (login(username, password)) {
                hideModal('userModal');
                alert('登录成功！');
            } else {
                alert('用户名或密码错误！');
            }
        } else {
            const email = document.getElementById('email').value;
            const code = document.getElementById('code').value;
            
            if (register(username, password, email, code)) {
                hideModal('userModal');
                alert('注册成功！');
            }
        }
    });
    
    document.getElementById('passwordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            alert('两次输入的新密码不一致');
            return;
        }
        
        if (changePassword(oldPassword, newPassword)) {
            hideModal('passwordModal');
            alert('密码修改成功！');
        }
    });
    
    document.getElementById('blogForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('blogTitle').value,
            content: document.getElementById('blogContent').value
        };
        
        const editingId = this.dataset.editingId;
        
        if (editingId) {
            updateBlog(parseInt(editingId), formData);
        } else {
            addBlog(formData);
        }
        
        hideModal('blogModal');
    });
    
    // 个人中心设置表单
    document.getElementById('profileSettingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentUser = getCurrentUser();
        if (!currentUser) return;
        
        const newEmail = document.getElementById('profileEmail').value;
        
        const users = getUsers();
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        
        if (userIndex !== -1) {
            users[userIndex].email = newEmail;
            saveUsers(users);
            
            currentUser.email = newEmail;
            setCurrentUser(currentUser);
            
            updateUserProfile(currentUser.username, { email: newEmail });
            
            alert('设置已保存！');
            renderProfile();
        }
    });
    
    // 系统设置
    document.getElementById('saveSettings').addEventListener('click', function() {
        const siteTitle = document.getElementById('siteTitle').value;
        const siteDescription = document.getElementById('siteDescription').value;
        
        document.querySelector('h1').textContent = siteTitle;
        document.querySelector('.description').textContent = siteDescription;
        
        alert('设置已保存！');
    });
});
