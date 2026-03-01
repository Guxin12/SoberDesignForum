<?php
require 'init.php';
$type = $_REQUEST['type'];
/* 用switch判断类型 */
switch($type){

    /* 获取全部用户数据 */
	case 'getAllUsers' :
		$sql = 'SELECT * FROM `sdf-user` order by 1 asc';
		$result = $db->query($sql);
		if($result){
			$result = $result->fetch_all(MYSQLI_ASSOC);
			if(!$result){
				jsonError(-1, '暂无用户');
			}
			foreach($result as $v){
				$arr[] = array(
					'user_id' => $v['user_id'],
					'username' => $v['username'],
					'avatar' => $v['avatar'],
					'avatar_color' => $v['avatar_color'],
					'headline' => $v['headline']			
				);
			}
			json(0, '获取成功', $arr);
		}else{
			jsonError(-1, '获取数据失败');
		}
		break;		
		
}