<?php
// 载入目录配置文件
require_once __DIR__ . '/pathdef.php';
// 载入公共函数文件
require_once __INCLUDE_DIR__ . '/Common.php';

if(file_exists(__CONFIG_DIR__.'/install.lock')){
	if(file_exists(__CONFIG_DIR__.'/database.php')){
		// 连接数据库
		require_once __CONFIG_DIR__.'/database.php';		
		$server = include __CONFIG_DIR__.'/server.php';	
		$websetting = include __CONFIG_DIR__.'/webSet.php';
		//网站配置信息
		$config = array_merge($server, $websetting);
	}
}