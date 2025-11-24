// js/utils.js
// 扩展默认数据
function extendDefaultData() {
    if (!localStorage.getItem("linkLikes")) {
        localStorage.setItem("linkLikes", JSON.stringify({}));
    }

    if (!localStorage.getItem("linkRatings")) {
        localStorage.setItem("linkRatings", JSON.stringify({}));
    }

    if (!localStorage.getItem("userFollows")) {
        localStorage.setItem("userFollows", JSON.stringify({}));
    }

    if (!localStorage.getItem("userFavorites")) {
        localStorage.setItem("userFavorites", JSON.stringify({}));
    }
}

// 链接唯一标识
function getLinkId(category, index) {
    return `${category}-${index}`;
}

// 点赞功能
function likeLink(category, index) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('请先登录后再点赞');
        return;
    }

    const linkId = getLinkId(category, index);
    const likes = JSON.parse(localStorage.getItem("linkLikes"));

    if (!likes[linkId]) {
        likes[linkId] = [];
    }

    const userIndex = likes[linkId].indexOf(currentUser.username);

    if (userIndex === -1) {
        likes[linkId].push(currentUser.username);
    } else {
        likes[linkId].splice(userIndex, 1);
    }

    localStorage.setItem("linkLikes", JSON.stringify(likes));
    renderLinks();
}

function getLinkLikes(category, index) {
    const linkId = getLinkId(category, index);
    const likes = JSON.parse(localStorage.getItem("linkLikes"));
    return likes[linkId] ? likes[linkId].length : 0;
}

function hasUserLiked(category, index) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;

    const linkId = getLinkId(category, index);
    const likes = JSON.parse(localStorage.getItem("linkLikes"));

    return likes[linkId] && likes[linkId].includes(currentUser.username);
}

// 评分功能
function rateLink(category, index, rating) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('请先登录后再评分');
        return;
    }

    const linkId = getLinkId(category, index);
    const ratings = JSON.parse(localStorage.getItem("linkRatings"));

    if (!ratings[linkId]) {
        ratings[linkId] = {};
    }

    ratings[linkId][currentUser.username] = rating;
    localStorage.setItem("linkRatings", JSON.stringify(ratings));
    renderLinks();
}

function getLinkRating(category, index) {
    const linkId = getLinkId(category, index);
    const ratings = JSON.parse(localStorage.getItem("linkRatings"));

    if (!ratings[linkId]) return 0;

    const userRatings = Object.values(ratings[linkId]);
    if (userRatings.length === 0) return 0;

    const sum = userRatings.reduce((a, b) => a + b, 0);
    return (sum / userRatings.length).toFixed(1);
}

function getUserRating(category, index) {
    const currentUser = getCurrentUser();
    if (!currentUser) return 0;

    const linkId = getLinkId(category, index);
    const ratings = JSON.parse(localStorage.getItem("linkRatings"));

    return ratings[linkId] && ratings[linkId][currentUser.username] || 0;
}

// 搜索功能
function performSearch(query) {
    if (!query.trim()) {
        renderLinks();
        renderBlogs();
        return;
    }

    const lowerQuery = query.toLowerCase();

    // 搜索链接
    const links = getLinks();
    for (const category in links) {
        const list = document.getElementById(`${category}-links`);
        if (list) {
            list.innerHTML = '';

            links[category].forEach((link, index) => {
                const titleMatch = link.title.toLowerCase().includes(lowerQuery);
                const descMatch = link.desc.toLowerCase().includes(lowerQuery);

                if (titleMatch || descMatch) {
                    const li = document.createElement('li');
                    const likesCount = getLinkLikes(category, index);
                    const userLiked = hasUserLiked(category, index);
                    const avgRating = getLinkRating(category, index);
                    const userRating = getUserRating(category, index);

                    li.innerHTML = `
                        <a href="${link.url}" target="_blank">
                            <div class="link-icon"><i class="${link.icon}"></i></div>
                            <div class="link-text">
                                <div class="link-title">${link.title}</div>
                                <div class="link-desc">${link.desc}</div>
                                <div class="link-actions">
                                    <button class="like-btn ${userLiked ? 'liked' : ''}" onclick="likeLink('${category}', ${index})">
                                        <i class="fas fa-heart"></i> ${likesCount}
                                    </button>
                                    <div class="rating">
                                        ${[1, 2, 3, 4, 5].map(star => `
                                            <span class="star ${star <= userRating ? 'fas fa-star' : 'far fa-star'}" 
                                                  onclick="rateLink('${category}', ${index}, ${star})"></span>
                                        `).join('')}
                                        <span style="margin-left: 5px;">${avgRating}</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                        <button class="delete-btn" onclick="deleteLink('${category}', ${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    list.appendChild(li);
                }
            });
        }
    }

    // 搜索博客
    const blogs = getBlogs();
    const blogList = document.getElementById('blogList');
    if (blogList) {
        blogList.innerHTML = '';

        blogs.forEach(blog => {
            const titleMatch = blog.title.toLowerCase().includes(lowerQuery);
            const contentMatch = blog.content.toLowerCase().includes(lowerQuery);
            const authorMatch = blog.author.toLowerCase().includes(lowerQuery);

            if (titleMatch || contentMatch || authorMatch) {
                const blogElement = document.createElement('div');
                blogElement.className = 'blog-post';
                blogElement.innerHTML = `
                    <h3 class="blog-post-title">${blog.title}</h3>
                    <div class="blog-post-meta">
                        <span><i class="fas fa-user"></i> ${blog.author}</span>
                        <span><i class="fas fa-calendar"></i> ${blog.date}</span>
                    </div>
                    <div class="blog-post-content">${blog.content}</div>
                    ${getCurrentUser() && (getCurrentUser().isAdmin || getCurrentUser().username === blog.author) ? `
                        <div class="blog-post-actions">
                            <button class="btn btn-warning" onclick="editBlog(${blog.id})">
                                <i class="fas fa-edit"></i> 编辑
                            </button>
                            <button class="btn btn-danger" onclick="deleteBlog(${blog.id})">
                                <i class="fas fa-trash"></i> 删除
                            </button>
                        </div>
                    ` : ''}
                `;
                blogList.appendChild(blogElement);
            }
        });
    }
}

// 链接管理功能
function deleteLink(category, index) {
    if (!confirm('确定要删除这个链接吗？')) return;

    const links = getLinks();
    if (links[category] && links[category][index]) {
        links[category].splice(index, 1);
        saveLinks(links);
        renderLinks();
    }
}

function addLink(formData) {
    const links = getLinks();
    const currentUser = getCurrentUser();

    if (!links[formData.category]) {
        links[formData.category] = [];
    }

    const newLink = {
        title: formData.title,
        desc: formData.description,
        url: formData.url,
        icon: formData.icon,
        addedBy: currentUser ? currentUser.username : '匿名用户'
    };

    links[formData.category].push(newLink);
    saveLinks(links);

    // 更新用户个人资料中的链接记录
    if (currentUser) {
        const userProfile = getUserProfile(currentUser.username);
        if (!userProfile.addedLinks) {
            userProfile.addedLinks = [];
        }
        userProfile.addedLinks.push({
            ...newLink,
            category: formData.category
        });
        updateUserProfile(currentUser.username, userProfile);
    }

    renderLinks();
}

// 博客管理功能
function addBlog(formData) {
    const blogs = getBlogs();
    const currentUser = getCurrentUser();

    const newBlog = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        author: currentUser ? currentUser.username : '匿名用户',
        date: new Date().toISOString().split('T')[0]
    };

    blogs.push(newBlog);
    saveBlogs(blogs);
    renderBlogs();
}

function updateBlog(blogId, formData) {
    const blogs = getBlogs();
    const blogIndex = blogs.findIndex(b => b.id === blogId);

    if (blogIndex !== -1) {
        blogs[blogIndex].title = formData.title;
        blogs[blogIndex].content = formData.content;
        saveBlogs(blogs);
        renderBlogs();
    }
}

function editBlog(blogId) {
    const blogs = getBlogs();
    const blog = blogs.find(b => b.id === blogId);

    if (!blog) return;

    document.getElementById('blogTitle').value = blog.title;
    document.getElementById('blogContent').value = blog.content;
    document.getElementById('blogForm').dataset.editingId = blogId;
    document.getElementById('blogModalTitle').textContent = '编辑博客';
    showModal('blogModal');
}

function deleteBlog(blogId) {
    if (!confirm('确定要删除这篇博客吗？')) return;

    const blogs = getBlogs();
    const blogIndex = blogs.findIndex(b => b.id === blogId);

    if (blogIndex !== -1) {
        blogs.splice(blogIndex, 1);
        saveBlogs(blogs);
        renderBlogs();
    }
}

// 数据重置功能
function resetData() {
    if (!confirm('确定要重置所有数据吗？此操作不可逆！')) return;

    localStorage.removeItem('navLinks');
    localStorage.removeItem('navBlogs');
    localStorage.removeItem('navUsers');
    localStorage.removeItem('linkLikes');
    localStorage.removeItem('linkRatings');
    localStorage.removeItem('userProfiles');

    // 重新初始化数据
    extendDefaultData();

    renderLinks();
    renderBlogs();
    alert('数据重置成功！');
}

// 主题功能
function initTheme() {
    const isDark = localStorage.getItem('darkTheme') === 'true';
    if (isDark) {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDark);
    
    const icon = document.querySelector('#themeToggle i');
    if (isDark) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// 渲染功能
function renderLinks() {
    const links = getLinks();
    const categories = ['tools', 'ai', 'video', 'games', 'proxy'];
    
    categories.forEach(category => {
        const list = document.getElementById(`${category}-links`);
        if (list) {
            list.innerHTML = '';
            
            if (links[category]) {
                links[category].forEach((link, index) => {
                    const li = document.createElement('li');
                    const likesCount = getLinkLikes(category, index);
                    const userLiked = hasUserLiked(category, index);
                    const avgRating = getLinkRating(category, index);
                    const userRating = getUserRating(category, index);
                    
                    li.innerHTML = `
                        <a href="${link.url}" target="_blank">
                            <div class="link-icon"><i class="${link.icon}"></i></div>
                            <div class="link-text">
                                <div class="link-title">${link.title}</div>
                                <div class="link-desc">${link.desc}</div>
                                <div class="link-actions">
                                    <button class="like-btn ${userLiked ? 'liked' : ''}" onclick="likeLink('${category}', ${index})">
                                        <i class="fas fa-heart"></i> ${likesCount}
                                    </button>
                                    <div class="rating">
                                        ${[1,2,3,4,5].map(star => `
                                            <span class="star ${star <= userRating ? 'fas fa-star' : 'far fa-star'}" 
                                                  onclick="rateLink('${category}', ${index}, ${star})"></span>
                                        `).join('')}
                                        <span style="margin-left: 5px;">${avgRating}</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                        <button class="delete-btn" onclick="deleteLink('${category}', ${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    list.appendChild(li);
                });
            }
        }
    });
}

function renderBlogs() {
    const blogs = getBlogs();
    const blogList = document.getElementById('blogList');
    const currentUser = getCurrentUser();
    
    if (blogList) {
        blogList.innerHTML = '';
        
        blogs.forEach(blog => {
            const blogElement = document.createElement('div');
            blogElement.className = 'blog-post';
            blogElement.innerHTML = `
                <h3 class="blog-post-title">${blog.title}</h3>
                <div class="blog-post-meta">
                    <span><i class="fas fa-user"></i> ${blog.author}</span>
                    <span><i class="fas fa-calendar"></i> ${blog.date}</span>
                </div>
                <div class="blog-post-content">${blog.content}</div>
                ${currentUser && (currentUser.isAdmin || currentUser.username === blog.author) ? `
                    <div class="blog-post-actions">
                        <button class="btn btn-warning" onclick="editBlog(${blog.id})">
                            <i class="fas fa-edit"></i> 编辑
                        </button>
                        <button class="btn btn-danger" onclick="deleteBlog(${blog.id})">
                            <i class="fas fa-trash"></i> 删除
                        </button>
                    </div>
                ` : ''}
            `;
            blogList.appendChild(blogElement);
        });
    }
}

// 模态框功能
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 编辑模式功能
function toggleEditMode() {
    document.body.classList.toggle('editing');
    const isEditing = document.body.classList.contains('editing');
    
    document.getElementById('addLink').style.display = isEditing ? 'inline-block' : 'none';
    document.getElementById('resetData').style.display = isEditing ? 'inline-block' : 'none';
}

function showAddLinkForm() {
    document.getElementById('addLinkForm').style.display = 'block';
}

function hideAddLinkForm() {
    document.getElementById('addLinkForm').style.display = 'none';
    document.getElementById('linkForm').reset();
}

// 个人中心功能
function showProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('请先登录');
        return;
    }
    
    document.getElementById('profileSection').style.display = 'block';
    updateProfileInfo();
}

function hideProfile() {
    document.getElementById('profileSection').style.display = 'none';
}

function updateProfileInfo() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const userProfile = getUserProfile(currentUser.username);
    
    // 更新基本信息
    document.getElementById('profileUserName').textContent = currentUser.username;
    document.getElementById('profileUserEmail').textContent = userProfile.email || '未设置';
    document.getElementById('profileUserRole').textContent = currentUser.isAdmin ? '管理员' : '普通用户';
    
    // 更新统计信息
    const blogs = getBlogs();
    const userBlogs = blogs.filter(blog => blog.author === currentUser.username);
    document.getElementById('blogsCount').textContent = userBlogs.length;
    document.getElementById('linksCount').textContent = userProfile.addedLinks ? userProfile.addedLinks.length : 0;
    
    // 计算加入天数
    const joinDate = new Date(userProfile.joinDate);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById('joinDays').textContent = diffDays;
    
    // 更新设置表单
    document.getElementById('profileUsername').value = currentUser.username;
    document.getElementById('profileEmail').value = userProfile.email || '';
    document.getElementById('profileJoinDate').value = userProfile.joinDate;
    
    // 渲染我的博客和链接
    renderMyBlogs();
    renderMyLinks();
}

function renderMyBlogs() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const blogs = getBlogs();
    const userBlogs = blogs.filter(blog => blog.author === currentUser.username);
    const myBlogsList = document.getElementById('myBlogsList');
    
    if (myBlogsList) {
        myBlogsList.innerHTML = '';
        
        userBlogs.forEach(blog => {
            const li = document.createElement('li');
            li.className = 'blog-item';
            li.innerHTML = `
                <div class="blog-info">
                    <h4>${blog.title}</h4>
                    <p>${blog.date}</p>
                </div>
                <div class="blog-actions">
                    <button class="btn btn-warning" onclick="editBlog(${blog.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-danger" onclick="deleteBlog(${blog.id})">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            `;
            myBlogsList.appendChild(li);
        });
    }
}

function renderMyLinks() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const userProfile = getUserProfile(currentUser.username);
    const myLinksList = document.getElementById('myLinksList');
    
    if (myLinksList && userProfile.addedLinks) {
        myLinksList.innerHTML = '';
        
        userProfile.addedLinks.forEach((link, index) => {
            const li = document.createElement('li');
            li.className = 'link-item';
            li.innerHTML = `
                <div class="link-info">
                    <h4>${link.title}</h4>
                    <p>${link.desc}</p>
                    <small>分类: ${link.category}</small>
                </div>
                <div class="link-actions">
                    <a href="${link.url}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i> 访问
                    </a>
                </div>
            `;
            myLinksList.appendChild(li);
        });
    }
}

// UI更新功能
function updateUI() {
    const currentUser = getCurrentUser();
    const userBtn = document.getElementById('userBtn');
    const userMenu = document.getElementById('userMenu');
    const adminPanelBtn = document.getElementById('adminPanelBtn');
    const addBlogBtnUser = document.getElementById('addBlogBtnUser');
    
    if (currentUser) {
        userBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.username}`;
        userMenu.style.display = 'block';
        
        if (currentUser.isAdmin) {
            adminPanelBtn.style.display = 'inline-block';
        } else {
            adminPanelBtn.style.display = 'none';
        }
        
        addBlogBtnUser.style.display = 'inline-block';
    } else {
        userBtn.innerHTML = '<i class="fas fa-user"></i> 登录/注册';
        userMenu.style.display = 'none';
        adminPanelBtn.style.display = 'none';
        addBlogBtnUser.style.display = 'none';
        document.getElementById('profileSection').style.display = 'none';
    }
    
    // 渲染用户列表（管理员功能）
    if (currentUser && currentUser.isAdmin) {
        renderUsers();
    }
}
