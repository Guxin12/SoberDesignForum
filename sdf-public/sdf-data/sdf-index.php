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
		
    /* 获取全部关注话题人ID，头像，名字 */	
    case 'getAllTopicsfollow' :
        $sql = 'SELECT * FROM `sdf-topic` ORDER BY 1 ASC';
        $result = $db->query($sql);
        if ($result) {
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            if (!$rows) {
                jsonError(-1, '暂无话题');
            }
            $data = [];
            foreach ($rows as $v) {
                $followerIds = json_decode($v['follower_user_id'], true);
                if (!is_array($followerIds)) {
                    $followerIds = []; // 如果解析失败，置为空数组
                }
                
                // 批量查询用户信息（如果ID列表不为空）
                $followers = [];
                if (!empty($followerIds)) {
                    // 将ID数组转为逗号分隔的字符串，注意防止SQL注入（这里ID是数字，相对安全，但建议使用参数化查询）
                    $ids = implode(',', array_map('intval', $followerIds));
                    $userSql = "SELECT `user_id`, `username`, `avatar`, `avatar-color` FROM `sdf-user` WHERE `user_id` IN ($ids)";
                    $userResult = $db->query($userSql);
                    if ($userResult) {
                        while ($user = $userResult->fetch_assoc()) {
                            $followers[] = [
                                'user_id' => $user['user_id'],
                                'username' => $user['username'],
                                'avatar' => $user['avatar'],
                                'avatar-color' => $user['avatar-color']
                            ];
                        }
                    }
                }
                
                // 组装当前话题的数据
                $data[] = [
                    'topic_id' => $v['topic_id'],
                    'followers' => $followers,      // 关注者详情列表
                    // 如果你还需要原始ID字段，可以保留
                    // 'follower_user_id' => $v['follower_user_id']
                ];
            }
            json(0, '获取成功', $data);
        } else {
            jsonError(-1, '获取数据失败');
        }
        break;
		
}