// js/data.js
// 默认数据
const defaultLinks = {
    tools: [
        { title: "GitHub", desc: "全球最大的代码托管平台", url: "https://github.com/dashboard", icon: "fab fa-github" },
        { title: "MoeMail邮箱", desc: "简洁美观的在线邮箱服务", url: "https://moemail.app/zh-CN/moe", icon: "fas fa-envelope" },
        { title: "4K高清壁纸", desc: "海量免费4K高清壁纸资源", url: "https://haowallpaper.com/wallpaperForum", icon: "fas fa-image" },
        { title: "678辅助网", desc: "实用的辅助工具与资源", url: "https://www.678cv.com", icon: "fas fa-hands-helping" }
    ],
    ai: [
        { title: "DeepSeek", desc: "强大的AI对话助手", url: "https://chat.deepseek.com", icon: "fas fa-brain" },
        { title: "豆包", desc: "字节跳动推出的AI助手", url: "https://www.doubao.com/chat/", icon: "fas fa-bolt" },
        { title: "Grok", desc: "xAI开发的AI聊天机器人", url: "https://grok.com", icon: "fas fa-bolt-lightning" },
        { title: "ChatGPT", desc: "OpenAI开发的AI对话模型", url: "https://chatgpt.com", icon: "fas fa-comment-dots" }
    ],
    video: [
        { title: "樱之空", desc: "优质的在线视频观看平台", url: "https://skr.skrcc.cc:666/?ref=www.zjnav.com", icon: "fas fa-film" },
        { title: "咕咕番", desc: "丰富的动漫与影视资源", url: "https://www.gugufans.cc", icon: "fas fa-play-circle" }
    ],
    games: [
        { title: "Switch520", desc: "Switch游戏资源分享平台", url: "https://www.gamer520.com", icon: "fas fa-dice" },
        { title: "科伊索", desc: "游戏资源与社区平台", url: "https://koyso.com", icon: "fas fa-joystick" }
    ],
    proxy: [
        { title: "DigitalPlat 面板", desc: "域名管理与控制面板", url: "https://dash.domain.digitalplat.org/panel/main", icon: "fas fa-tachometer-alt" },
        { title: "UUID 生成器", desc: "在线生成唯一标识符", url: "https://1024tools.com/uuid", icon: "fas fa-key" },
        { title: "Spaceship低价域名", desc: "全球知名的低价域名注册商", url: "https://www.spaceship.com/zh/", icon: "fas fa-rocket" },
        { title: "玉豆分享", desc: "优质资源分享平台", url: "https://www.yudou.us", icon: "fas fa-share-alt" }
    ]
};

// 默认博客数据
const defaultBlogs = [
    {
        id: 1,
        title: "欢迎使用实用资源导航",
        content: "这是一个精心设计的资源导航页面，汇集了各类实用工具和网站，帮助您提高工作效率和生活质量。",
        author: "管理员",
        date: new Date().toISOString().split('T')[0]
    },
    {
        id: 2,
        title: "如何高效使用本导航",
        content: "您可以根据分类快速找到需要的资源，也可以使用搜索功能定位特定工具。登录后还可以自定义添加您常用的网站链接。",
        author: "管理员",
        date: new Date().toISOString().split('T')[0]
    }
];

// 默认用户数据
const defaultUsers = [
    {
        username: "waduck",
        password: "w1847236328",
        email: "admin@example.com",
        isAdmin: true,
        isBlocked: false
    }
];

// 数据管理函数
function getLinks() {
    const savedLinks = localStorage.getItem('navLinks');
    return savedLinks ? JSON.parse(savedLinks) : defaultLinks;
}

function saveLinks(links) {
    localStorage.setItem('navLinks', JSON.stringify(links));
}

function getBlogs() {
    const savedBlogs = localStorage.getItem('navBlogs');
    return savedBlogs ? JSON.parse(savedBlogs) : defaultBlogs;
}

function saveBlogs(blogs) {
    localStorage.setItem('navBlogs', JSON.stringify(blogs));
}

function getUsers() {
    const savedUsers = localStorage.getItem('navUsers');
    return savedUsers ? JSON.parse(savedUsers) : defaultUsers;
}

function saveUsers(users) {
    localStorage.setItem('navUsers', JSON.stringify(users));
}

// 用户个人资料功能
function getUserProfile(username) {
    const savedProfiles = localStorage.getItem('userProfiles');
    const profiles = savedProfiles ? JSON.parse(savedProfiles) : {};
    
    if (!profiles[username]) {
        profiles[username] = {
            joinDate: new Date().toISOString().split('T')[0],
            addedLinks: [],
            email: username + '@example.com'
        };
        localStorage.setItem('userProfiles', JSON.stringify(profiles));
    }
    
    return profiles[username];
}

function updateUserProfile(username, profileData) {
    const savedProfiles = localStorage.getItem('userProfiles');
    const profiles = savedProfiles ? JSON.parse(savedProfiles) : {};
    
    profiles[username] = { ...profiles[username], ...profileData };
    localStorage.setItem('userProfiles', JSON.stringify(profiles));
}
