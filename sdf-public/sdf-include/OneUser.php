<?php

// 获取ID
$user_id=intval($_REQUEST["user_id"]);

// 根据ID查询接口是否是正常
$result = $db->query("SELECT username FROM `sdf-user` WHERE `user_id`='{$user_id}';")->fetch_assoc();

// 载入单用户页面
include __TEMPLATE_DIR__.'/Home/oneuser.html';