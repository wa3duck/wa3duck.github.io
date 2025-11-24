// js/utils.js
// 扩展默认数据
function extendDefaultData() {
    if (!localStorage.getItem('linkLikes')) {
        localStorage.setItem('linkLikes', JSON.stringify({}));
    }
    
    if (!localStorage.getItem('linkRatings')) {
        localStorage.setItem('linkRatings', JSON.stringify({}));
    }
    
    if (!localStorage.getItem('userFollows')) {
        localStorage.setItem('userFollows', JSON.stringify({}));
    }
    
    if (!localStorage.getItem('userFavorites')) {
        localStorage.setItem('userFavorites', JSON.stringify({}));
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
    const likes = JSON.parse(localStorage.getItem('linkLikes'));
    
    if (!likes[linkId]) {
        likes[linkId] = [];
    }
    
    const userIndex = likes[linkId].indexOf(currentUser.username);
    
    if (userIndex === -1) {
        likes[linkId].push(currentUser.username);
    } else {
        likes[linkId].splice(userIndex, 1);
    }
    
    localStorage.setItem('linkLikes', JSON.stringify(likes));
    renderLinks();
}

function getLinkLikes(category, index) {
    const linkId = getLinkId(category, index);
    const likes = JSON.parse(localStorage.getItem('linkLikes'));
    return likes[linkId] ? likes[linkId].length : 0;
}

function hasUserLiked(category, index) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    const linkId = getLinkId(category, index);
    const likes = JSON.parse(localStorage.getItem('linkLikes'));
    
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
    const ratings = JSON.parse(localStorage.getItem('linkRatings'));
    
    if (!ratings[linkId]) {
        ratings[linkId] = {};
    }
    
    ratings[linkId][currentUser.username] = rating;
    localStorage.setItem('linkRatings', JSON.stringify(ratings));
    renderLinks();
}

function getLinkRating(category, index) {
    const linkId = getLinkId(category, index);
    const ratings = JSON.parse(localStorage.getItem('linkRatings'));
    
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
    const ratings = JSON.parse(localStorage.getItem('linkRatings'));
    
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
                            </div>
                        </a>
                        <button class="delete-btn" data-category="${category}" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    list.appendChild(li);
                }
            });
            
            // 重新绑定事件
            setTimeout(() => {
                bindLinkEvents();
            }, 0);
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

function addLink(category, title, desc, url, icon) {
    const links = getLinks();
    
    if (!links[category]) {
        links[category] = [];
    }
    
    const newLink = {
        title,
        desc,
        url,
        icon,
        addedBy: getCurrentUser() ? getCurrentUser().username : '匿名用户'
    };
    
    links[category].push(newLink);
    saveLinks(links);
    renderLinks();
    hideAddLinkForm();
}

// 博客管理功能
function addBlog(title, content) {
    const blogs = getBlogs();
    const currentUser = getCurrentUser();
    
    const newBlog = {
        id: Date.now(),
        title,
        content,
        author: currentUser ? currentUser.username : '匿名用户',
        date: new Date().toISOString().split('T')[0]
    };
    
    blogs.push(newBlog);
    saveBlogs(blogs);
    renderBlogs();
    hideModal('addBlogModal');
}

function editBlog(blogId) {
    const blogs = getBlogs();
    const blog = blogs.find(b => b.id === blogId);
    
    if (!blog) return;
    
    document.getElementById('editBlogTitle').value = blog.title;
    document.getElementById('editBlogContent').value = blog.content;
    document.getElementById('editBlogId').value = blogId;
    
    showModal('editBlogModal');
}

function updateBlog() {
    const blogId = parseInt(document.getElementById('editBlogId').value);
    const title = document.getElementById('editBlogTitle').value;
    const content = document.getElementById('editBlogContent').value;
    
    const blogs = getBlogs();
    const blogIndex = blogs.findIndex(b => b.id === blogId);
    
    if (blogIndex !== -1) {
        blogs[blogIndex].title = title;
        blogs[blogIndex].content = content;
        saveBlogs(blogs);
        renderBlogs();
        hideModal('editBlogModal');
    }
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
