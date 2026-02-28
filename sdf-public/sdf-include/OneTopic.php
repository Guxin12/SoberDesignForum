<?php
// 获取ID
$topic_id=intval($_REQUEST["topic_id"]);

// 根据ID查询接口是否是正常
$result = $db->query("SELECT name FROM `sdf-topic` WHERE `topic_id`='{$topic_id}';")->fetch_assoc();

// 载入单用户页面
include __TEMPLATE_DIR__.'/Home/onetopic.html';