<?php
// 获取所有用户及其信息
$result=@$db->query("SELECT user_id,username,avatar,headline FROM `sdf-user`;")->fetch_all(MYSQLI_ASSOC);

// 载入友链页面
require_once __TEMPLATE_DIR__.'/Home/users.html';