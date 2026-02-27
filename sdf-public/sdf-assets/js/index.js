window.$ = jQuery

var page = document.querySelector('s-page');
var radioButtons = document.querySelectorAll('s-radio-button[name="theme"]');

//以下是滑块颜色主题

// 初始化颜色
if (localStorage.getItem('colour')) {
    colour(localStorage.getItem('colour'));
} else {
    colour("#006EFF");
}

function colour(color) {
    if (!/^#/.test(color)) {
        sober.theme.createScheme('#006EFF', { page: document.querySelector('s-page') });
        localStorage.setItem('colour', '#006EFF');
        // 同时更新savedHue
        const hue = hexToHue('#006EFF');
        localStorage.setItem('savedHue', hue);
        localStorage.setItem('savedHex', '#006EFF');
    } else {
        sober.theme.createScheme(color, { page: document.querySelector('s-page') });
        localStorage.setItem('colour', color);
        // 同时更新savedHue
        const hue = hexToHue(color);
        localStorage.setItem('savedHue', hue);
        localStorage.setItem('savedHex', color);
    }
    // 更新滑块位置
    const slider = document.getElementById('hue-slider');
    slider.value = localStorage.getItem('savedHue');
}

// 选择预设颜色
function selectPresetColor(color) {
    colour(color);
}

// 十六进制颜色转色调值函数
function hexToHue(hex) {
    // 移除#号
    hex = hex.replace('#', '');
    
    // 转换为RGB
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h;
    
    if (max === min) {
        h = 0;
    } else if (max === r) {
        h = ((g - b) / (max - min)) % 6;
    } else if (max === g) {
        h = (b - r) / (max - min) + 2;
    } else {
        h = (r - g) / (max - min) + 4;
    }
    
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    return h;
}

// HSL转HEX函数
function hslToHex(h) {
    // 确保h在0-360范围内
    h = Math.max(0, Math.min(360, h)) / 360;
    let r, g, b;

    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };

    const s = 1;
    const l = 0.5;

    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('hue-slider');

    // 尝试从localStorage加载保存的颜色
    const savedHue = localStorage.getItem('savedHue');
    const savedHex = localStorage.getItem('savedHex');
    const savedColour = localStorage.getItem('colour');
    
    if (savedHue) {
        slider.value = savedHue;
    }
   
    // 监听滑块变化 - 使用Soiber UI滑块的正确事件
    slider.addEventListener('input', function(e) {
        const hueValue = e.target.value;
        const hexColor = hslToHex(hueValue);
        colour(hexColor);
        
        // 存储当前值
        localStorage.setItem('savedHue', hueValue);
        localStorage.setItem('savedHex', hexColor);
    });
});

//以上是滑块颜色主题

//以下是主题代码

// 初始化主题设置
function initTheme() {
    var theme = localStorage.getItem('theme');

    // 如果没有设置，使用默认值
    if (!theme) {
        theme = 'bySystem';
        localStorage.setItem('theme', theme);
    }

    // 应用主题设置
    if (theme === 'bySystem') {
        page.toggle('auto');
    } else if (theme === 'disabled') {
        page.toggle('light');
    } else if (theme === 'enabled') {
        page.toggle('dark');
    } else if (theme === 'byTime') {
        listenTime();
    }
}

// 监听时间变化
function listenTime() {
    var hours = new Date().getHours();
    if ((hours >= 18 && hours < 24) || (hours >= 0 && hours < 6)) {
        page.toggle('dark');
    } else {
        page.toggle('light');
    }

    // 每分钟检查一次
    setTimeout(listenTime, 60000);
}

// 设置主题
function setTheme(value) {
    localStorage.setItem('theme', value);

    if (value === 'bySystem') {
        page.toggle('auto');
    } else if (value === 'disabled') {
        page.toggle('light');
    } else if (value === 'enabled') {
        page.toggle('dark');
    } else if (value === 'byTime') {
        listenTime();
    }
}

// 添加事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题
    initTheme();
});

//以上是主题代码


//以下是快速返回顶部

document.addEventListener('DOMContentLoaded', () => {
    // 获取组件引用
    const fab = document.getElementById('backToTopFab');
    const scrollView = document.querySelector('s-scroll-view');

    // 监听滚动事件
    const scrollContainer = scrollView || window;
    let isScrolling;
    let isReturningToTop = false;

    scrollContainer.addEventListener('scroll', () => {
        // 清除之前的计时器
        clearTimeout(isScrolling);

        // 判断滚动位置
        const scrollTop = scrollView ? scrollView.scrollTop : window.pageYOffset;
        const showButton = scrollTop > 100;

        // 使用CSS类控制显示/隐藏，而不是hidden属性
        if (showButton) {
            fab.classList.remove('hidden');
        } else {
            fab.classList.add('hidden');
        }

        // 检查是否到达顶部（当从返回顶部操作中）
        if (isReturningToTop && scrollTop < 10) {
            isReturningToTop = false;
            // 显示snackbar提示
            if (typeof sober !== 'undefined' && sober.Snackbar) {
                sober.Snackbar.show({
                    text: '吖，撞到头辣QAQ',
                    duration: 2000,
                    align: 'top'
                });
            } else {
                // 降级方案：使用原生alert
                setTimeout(() => alert('吖，撞到头辣QAQ'), 100);
            }
        }

        // 设置一个新的计时器
        isScrolling = setTimeout(() => {
            // 滚动停止后的处理
        }, 66);
    });

    // 点击返回顶部
    fab.addEventListener('click', () => {
        // 标记正在返回顶部
        isReturningToTop = true;

        // 使用Sober内置的scroll-behavior
        if (scrollView) {
            scrollView.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // 降级方案
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
});


