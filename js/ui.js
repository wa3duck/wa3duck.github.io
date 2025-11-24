// js/ui.js
// 渲染功能
function renderLinks() {
    const links = getLinks();
    
    document.querySelectorAll('.links').forEach(list => {
        list.innerHTML = '';
    });
    
    for (const category in links) {
        const list = document.getElementById(`${category}-links`);
        if (list) {
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
                                <button class="like-btn ${userLiked ? 'liked' : ''}" data-category="${category}" data-index="${index}">
                                    <i class="fas fa-heart"></i> ${likesCount}
                                </button>
                                <div class="rating">
                                    ${[1, 2, 3, 4, 5].map(star => `
                                        <span class="star ${star <= userRating ? 'fas fa-star' : 'far fa-star'}" 
                                              data-rating="${star}" data-category="${category}" data-index="${index}"></span>
                                    `).join('')}
                                    <span style="margin-left: 5px;">${avgRating}</span>
                                </div>
                            </div>
                            <div class="link-stats">
                                <span>${link.addedBy || '匿名用户'}</span>
                            </div>
                        </div>
                    </a>
                    <button class="delete-btn" data-category="${category}" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                list.appendChild(li);
            });
        }
    }
    
    bindLinkEvents();
}

function bindLinkEvents() {
    // 点赞事件
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const category = this.dataset.category;
            const index = parseInt(this.dataset.index);
            likeLink(category, index);
        });
    });
    
    // 评分事件
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const category = this.dataset.category;
            const index = parseInt(this.dataset.index);
            const rating = parseInt(this.dataset.rating);
            rateLink(category, index, rating);
        });
    });
    
    // 删除事件
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            const index = parseInt(this.dataset.index);
            deleteLink(category, index);
        });
    });
}

function renderBlogs() {
    const blogs = getBlogs();
    const blogList = document.getElementById('blogList');
    const blogListAdmin = document.getElementById('blogListAdmin');
    const currentUser = getCurrentUser();
    
    if (blogList) blogList.innerHTML = '';
    if (blogListAdmin) blogListAdmin.innerHTML = '';
    
    blogs.forEach(blog => {
        const canEdit = currentUser && (currentUser.isAdmin || blog.author === currentUser.username);
        
        const blogElement = document.createElement('div');
        blogElement.className = 'blog-post';
        blogElement.innerHTML = `
            <h3 class="blog-post-title">${blog.title}</h3>
            <div class="blog-post-meta">
                <span><i class="fas fa-user"></i> ${blog.author}</span>
                <span><i class="fas fa-calendar"></i> ${blog.date}</span>
            </div>
            <div class="blog-post-content">${blog.content}</div>
            ${canEdit ? `
            <div class="blog-post-actions">
                <button class="btn btn-primary edit-blog" data-id="${blog.id}">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="btn btn-danger delete-blog" data-id="${blog.id}">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
            ` : ''}
        `;
        
        if (blogList) blogList.appendChild(blogElement.cloneNode(true));
        
        if (blogListAdmin && currentUser && currentUser.isAdmin) {
            const adminBlogElement = document.createElement('li');
            adminBlogElement.className = 'blog-item';
            adminBlogElement.innerHTML = `
                <div class="blog-info">
                    <h4>${blog.title}</h4>
                    <p>作者: ${blog.author} | 日期: ${blog.date}</p>
                </div>
                <div class="blog-actions">
                    <button class="btn btn-primary edit-blog" data-id="${blog.id}">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-danger delete-blog" data-id="${blog.id}">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            `;
            blogListAdmin.appendChild(adminBlogElement);
        }
    });
    
    // 博客事件绑定
    document.querySelectorAll('.edit-blog').forEach(btn => {
        btn.addEventListener('click', function() {
            const blogId = parseInt(this.dataset.id);
            editBlog(blogId);
        });
    });
    
    document.querySelectorAll('.delete-blog').forEach(btn => {
        btn.addEventListener('click', function() {
            const blogId = parseInt(this.dataset.id);
            deleteBlog(blogId);
        });
    });
}

// UI更新功能
function updateUI() {
    const currentUser = getCurrentUser();
    const userBtn = document.getElementById('userBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const adminPanelBtn = document.getElementById('adminPanelBtn');
    const adminPanel = document.getElementById('adminPanel');
    const addBlogBtnUser = document.getElementById('addBlogBtnUser');
    const profileBtn = document.getElementById('profileBtn');
    
    if (currentUser) {
        userBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        userName.textContent = currentUser.username;
        profileBtn.style.display = 'block';
        
        if (currentUser.isAdmin) {
            adminPanelBtn.style.display = 'block';
            addBlogBtnUser.style.display = 'block';
        } else {
            adminPanelBtn.style.display = 'none';
            adminPanel.style.display = 'none';
            addBlogBtnUser.style.display = 'block';
        }
    } else {
        userBtn.style.display = 'block';
        userMenu.style.display = 'none';
        adminPanelBtn.style.display = 'none';
        adminPanel.style.display = 'none';
        addBlogBtnUser.style.display = 'none';
        profileBtn.style.display = 'none';
        hideProfile();
    }
    
    renderBlogs();
    renderUsers();
}

// 模态框功能
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 个人中心功能
function showProfile() {
    document.getElementById('profileSection').style.display = 'block';
    renderProfile();
}

function hideProfile() {
    document.getElementById('profileSection').style.display = 'none';
}

// 编辑模式功能
function toggleEditMode() {
    const isEditing = document.body.classList.toggle('editing');
    const toggleBtn = document.getElementById('toggleEdit');
    const addBtn = document.getElementById('addLink');
    const resetBtn = document.getElementById('resetData');
    
    if (isEditing) {
        toggleBtn.innerHTML = '<i class="fas fa-times"></i> 退出编辑';
        addBtn.style.display = 'flex';
        resetBtn.style.display = 'flex';
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.style.opacity = '1';
        });
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-edit"></i> 编辑模式';
        addBtn.style.display = 'none';
        resetBtn.style.display = 'none';
        document.getElementById('addLinkForm').style.display = 'none';
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.style.opacity = '0';
        });
    }
}

// 添加链接表单功能
function showAddLinkForm() {
    document.getElementById('addLinkForm').style.display = 'block';
}

function hideAddLinkForm() {
    document.getElementById('addLinkForm').style.display = 'none';
    document.getElementById('linkForm').reset();
}

// 主题功能
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const themeIcon = document.getElementById('themeToggle').querySelector('i');
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const themeIcon = document.getElementById('themeToggle').querySelector('i');
        themeIcon.className = 'fas fa-sun';
    }
}
