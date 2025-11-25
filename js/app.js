// 主应用程序逻辑

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否有记忆的登录用户
    if (rememberedUser) {
        currentUser = rememberedUser;
        updateUIForLoggedInUser();
    }
    
    // 加载链接数据
    loadLinks();
    
    // 初始化事件监听器
    initEventListeners();
});

// 初始化事件监听器
function initEventListeners() {
    // 主题切换
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // 用户按钮
    document.getElementById('userBtn').addEventListener('click', showUserModal);
    
    // 关闭个人中心
    document.getElementById('closeProfile').addEventListener('click', hideProfile);
    
    // 切换登录/注册模式
    document.getElementById('switchMode').addEventListener('click', switchUserMode);
    
    // 关闭模态框
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    // 个人中心标签切换
    document.querySelectorAll('.profile-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 更新活动标签
            document.querySelectorAll('.profile-nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应标签页
            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.profile-tab').forEach(tab => tab.classList.remove('active'));
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    // 表单提交
    document.getElementById('userForm').addEventListener('submit', handleUserFormSubmit);
    document.getElementById('profileSettingsForm').addEventListener('submit', handleProfileSettingsSubmit);
    
    // 退出登录
    document.getElementById('confirmLogout').addEventListener('click', handleLogout);
}

// 页面加载时检查主题设置
const savedTheme = getFromStorage('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    document.querySelector('#themeToggle i').className = 'fas fa-sun';
}
