<?php
error_reporting(E_ERROR);

// 获取行为GET参数
$action = $_GET['action'];

// 检测论坛系统是否安装
if(!file_exists(__CONFIG_DIR__.'/install.lock') && $action != 'install'){
	jump('?action=install');
}

if ($action != 'admin' && $action != 'install') {
	addAccess(); // 调用统计访问
	is_spider(); // 调用统计蜘蛛
}

// 检测站点是否开启防CC功能
if($config['cc_protect'] == '1' && $action != 'admin'){
	include __INCLUDE_DIR__.'/Firewall/CCProtect.php';
}

// 检测站点是否开启防SQL注入功能
if($config['fire_wall'] == '1' && $action != 'admin'){
	include __INCLUDE_DIR__.'/Firewall/DisSQL.php';
}

// 行为与文件名的映射关系
$actionMap = [
    'topics' => 'Topics.php',
    'onetopic' => 'OneTopic.php',
    'questions' => 'Questions.php',
    'onequestion' => 'OneQuestion.php',
    'articles'         => 'Articles.php',
    'onearticle'         => 'OneArticle.php',
    'users' => 'Users.php',
    'oneuser' => 'OneUser.php',
    'notifications' => 'Notifications',
    'friendlinks' => 'Friendlinks.php',
    'about'       => 'About.php',
    'install'     => 'Install.php',
    'settings' => 'Settings',
];

// 如果 $action 在映射中，加载对应文件；否则加载首页
if (isset($actionMap[$action])) {
    include __DIR__ . '/' . $actionMap[$action];
} else {
    include __DIR__ . '/Home.php';
}