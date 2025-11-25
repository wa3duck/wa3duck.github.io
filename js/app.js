// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否有记忆的登录用户
    if (rememberedUser) {
        currentUser = rememberedUser;
        updateUIForLoggedInUser();
    }

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

    // 用户表单提交
    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;

        if (document.getElementById('userModalTitle').textContent === '用户登录') {
            handleLogin(username, password);
        } else {
            handleRegister(username, password, email);
        }
    });
}
