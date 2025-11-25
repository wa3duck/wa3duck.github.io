// 工具函数

// 从localStorage获取数据
function getFromStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (e) {
        console.error(`Error parsing data from localStorage for key: ${key}`, e);
        return null;
    }
}

// 保存数据到localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error(`Error saving data to localStorage for key: ${key}`, e);
        return false;
    }
}

// 格式化日期
function formatDate(date) {
    return new Date(date).toISOString().split('T')[0];
}

// 计算天数差
function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
