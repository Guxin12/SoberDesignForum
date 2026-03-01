window.$ = jQuery

var page = document.querySelector('s-page');
var radioButtons = document.querySelectorAll('s-radio-button[name="theme"]');


function openLoginDialog() {
    const dialog = document.getElementById('LoginUser');
    dialog.showed = false;
    dialog.showed = true;
}



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

function formSumbit() {
    var options = {
        success: submit,
        timeout: 3000,
    }

    function submit(data) {
        var code = JSON.parse(data).code;
        var msg = JSON.parse(data).msg;
        if (code == "200") {
            sober.Snackbar.builder(msg)
            setTimeout(function() {
                window.location.reload();
            }, 1500);
        } else {
            sober.Snackbar.builder(msg)
        }
    };

    $('form').submit(function() {
        $(this).ajaxSubmit(options);
        return false;
    });
}

function getRequestParam(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

function checkMailAddress(v) {
    var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/; //正则表达式
    if (!reg.test(v)) { //正则验证不通过，格式不对
        return false;
    } else {
        return true;
    }
}

// 定义更新应用栏的函数
function updateAppBarAfterLogin(user) {

	// 删除所有未登录按钮（类 auth-dependent）
	document.querySelectorAll('.auth-dependent').forEach(el => el.remove());

	// 删除可能存在的旧头像（防止重复）
	document.querySelectorAll('.user-avatar').forEach(el => el.remove());

	// 创建头像元素
	let avatarElement;
	if (user.avatar) {
		avatarElement = document.createElement('img');
		avatarElement.src = user.avatar;
		avatarElement.style.cssText = 'display:flex; width:40px; height:40px; border-radius:50%; align-items:center; justify-content:center;';
	} else {
		avatarElement = document.createElement('span');
		// 获取用户名首字符（支持中文）
		const firstChar = user.username.charAt(0);
		avatarElement.textContent = firstChar;
		const bgColor = user.avatar_color || 'var(--s-color-primary, #006782)';
		avatarElement.style.cssText = `background: ${bgColor}; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px;`;
	}
	avatarElement.classList.add('user-avatar');
	avatarElement.setAttribute('slot', 'action');

	// 添加到应用栏
	document.querySelector('s-appbar').appendChild(avatarElement);
}

function updateAppBarAfterLogout() {
	// 删除当前头像
	document.querySelectorAll('.user-avatar').forEach(el => el.remove());

	// 检查是否已存在未登录按钮，若不存在则重建
	if (document.querySelectorAll('.auth-dependent').length === 0) {
		// 重建桌面按钮
		const desktopButtons = document.createElement('div');
		desktopButtons.className = 'desktop-buttons auth-dependent';
		desktopButtons.setAttribute('slot', 'action');
		desktopButtons.innerHTML = `
            <s-button class="login-btn" onclick="openLoginDialog()">
                <svg viewBox="0 -960 960 960" slot="start" width="20" height="20">
                    <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"></path>
                </svg>                
                登录
            </s-button>                 
            <s-button type="outlined" class="register-btn" onclick="openLoginDialog()">
                <svg viewBox="0 -960 960 960" slot="start" width="20" height="20">
                    <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"></path>
                </svg>
                注册
            </s-button>
        `;

		// 重建移动菜单
		const mobileMenu = document.createElement('s-popup-menu');
		mobileMenu.className = 'mobile-menu auth-dependent';
		mobileMenu.setAttribute('slot', 'action');
		mobileMenu.innerHTML = `
            <s-icon-button slot="trigger">
                <s-icon name="more_vert"></s-icon>
            </s-icon-button>
            <s-popup-menu-item onclick="openLoginDialog()">
                <svg viewBox="0 -960 960 960" slot="start" width="20" height="20">
                    <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"></path>
                </svg>
                登录
            </s-popup-menu-item>
            <s-popup-menu-item onclick="openLoginDialog()">
                <svg viewBox="0 -960 960 960" slot="start" width="20" height="20">
                    <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"></path>
                </svg>
                注册
            </s-popup-menu-item>
        `;

		const appbar = document.querySelector('s-appbar');
		appbar.appendChild(desktopButtons);
		appbar.appendChild(mobileMenu);
	}
}

$('#exit_login').click(function() {
    var exitLogin = confirm('你真的要退出登录吗？');
    if (exitLogin) {
        fetch('./sdf-public/sdf-data/SDF-index1.php?type=exitLogin')
            .then(response => response.json())
            .then(json => {
                sober.Snackbar.show({
                    text: json.msg,
                    duration: 2000,
                    align: 'top'
                });
                if (json.code == 0) {
                    // 退出成功，恢复未登录界面
                    updateAppBarAfterLogout();
                }
            });
    }
});

$('#submit').click(function() {
    var username = $('#username').val();
    var rawPassword = $('#password').val();
    if (username && rawPassword) {
        var hashedPassword = md5(rawPassword);
        $.ajax({
            url: './sdf-public/sdf-data/SDF-index1.php',
            method: 'POST',
            data: {
                type: 'login',
                username: username,
                password: hashedPassword
            },
            dataType: 'json',  // 直接指定JSON，避免手动解析
            success: function(res) {
                sober.Snackbar.show({
                    text: res.msg,
                    duration: 2000,
                    align: 'top'
                });
                if (res.code == 0) {
                    // 登录成功，局部更新应用栏
                    updateAppBarAfterLogin(res.data);
                }
            },
            error: function() {
                sober.Snackbar.show({
                    text: '网络错误！',
                    duration: 2000,
                    align: 'top'
                });
            }
        });
    } else {
        sober.Snackbar.show({
            text: '请输入完整！',
            duration: 2000,
            align: 'top'
        });
    }
});