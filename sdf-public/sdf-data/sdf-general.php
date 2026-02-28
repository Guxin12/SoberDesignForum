<?php
require 'init.php';
$type = $_REQUEST['type'];
/* 用switch判断类型 */
switch($type){

    /* 获取全部话题数据 */
	case 'getAllTopics' :
		$sql = 'SELECT * FROM `sdf-topic` order by 1 asc';
		$result = $db->query($sql);
		if($result){
			$result = $result->fetch_all(MYSQLI_ASSOC);
			if(!$result){
				jsonError(-1, '暂无话题');
			}
			foreach($result as $v){
				$arr[] = array(
					'topic_id' => $v['topic_id'],
					'user_id' => $v['user_id'],
					'name' => $v['name'],
					'cover' => $v['cover'],
					'description' => $v['description'],
					'article_count' => $v['article_count'],
					'question_count' => $v['question_count'],
					'follower_count' => $v['follower_count'],
					'follower_user_id' => $v['follower_user_id'],
					'create_time' => date('Y-m-d h:i:s', $v['create_time']),
					'update_time' => date('Y-m-d h:i:s', $v['update_time'])				
				);
			}
			json(0, '获取成功', $arr);
		}else{
			jsonError(-1, '获取数据失败');
		}
		break;
		
}