// 示例链接数据
const sampleLinks = {
    tools: [
        { title: "GitHub", description: "全球最大的代码托管平台", url: "https://github.com", icon: "fab fa-github" },
        { title: "Stack Overflow", description: "程序员问答社区", url: "https://stackoverflow.com", icon: "fab fa-stack-overflow" },
        { title: "CodePen", description: "前端代码在线编辑与展示", url: "https://codepen.io", icon: "fab fa-codepen" },
        { title: "Canva", description: "在线设计工具", url: "https://canva.com", icon: "fas fa-palette" }
    ],
    ai: [
        { title: "ChatGPT", description: "OpenAI的对话AI", url: "https://chat.openai.com", icon: "fas fa-robot" },
        { title: "Midjourney", description: "AI图像生成工具", url: "https://midjourney.com", icon: "fas fa-palette" },
        { title: "Hugging Face", description: "AI模型分享平台", url: "https://huggingface.co", icon: "fas fa-brain" },
        { title: "Claude", description: "Anthropic的AI助手", url: "https://claude.ai", icon: "fas fa-comment" }
    ],
    video: [
        { title: "YouTube", description: "全球最大的视频分享平台", url: "https://youtube.com", icon: "fab fa-youtube" },
        { title: "Bilibili", description: "知名视频弹幕网站", url: "https://bilibili.com", icon: "fas fa-play-circle" },
        { title: "Netflix", description: "全球流媒体服务平台", url: "https://netflix.com", icon: "fas fa-film" },
        { title: "Vimeo", description: "高质量视频分享平台", url: "https://vimeo.com", icon: "fas fa-video" }
    ],
    games: [
        { title: "Steam", description: "全球最大的游戏平台", url: "https://store.steampowered.com", icon: "fab fa-steam" },
        { title: "Epic Games", description: "知名游戏发行平台", url: "https://epicgames.com", icon: "fas fa-gamepad" },
        { title: "NVIDIA GeForce Now", description: "云游戏服务平台", url: "https://nvidia.com/geforce-now", icon: "fas fa-cloud" },
        { title: "itch.io", description: "独立游戏平台", url: "https://itch.io", icon: "fas fa-gamepad" }
    ],
    proxy: [
        { title: "Clash", description: "规则驱动的代理客户端", url: "https://github.com/Dreamacro/clash", icon: "fas fa-shield-alt" },
        { title: "V2Ray", description: "网络代理工具", url: "https://v2ray.com", icon: "fas fa-network-wired" },
        { title: "Shadowsocks", description: "轻量级代理工具", url: "https://shadowsocks.org", icon: "fas fa-user-secret" }
    ],
    learning: [
        { title: "Coursera", description: "在线课程平台", url: "https://coursera.org", icon: "fas fa-graduation-cap" },
        { title: "Khan Academy", description: "免费在线学习资源", url: "https://khanacademy.org", icon: "fas fa-book" },
        { title: "Duolingo", description: "语言学习应用", url: "https://duolingo.com", icon: "fas fa-language" },
        { title: "Wikipedia", description: "免费的百科全书", url: "https://wikipedia.org", icon: "fab fa-wikipedia-w" }
    ]
};

// 管理员账号
const adminAccount = {
    username: "waduck",
    password: "w1847236328",
    role: "admin"
};

// 本地数据
let usersData = JSON.parse(localStorage.getItem('usersData')) || {};
let userLinks = JSON.parse(localStorage.getItem('userLinks')) || {};
let rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
let currentUser = null;
