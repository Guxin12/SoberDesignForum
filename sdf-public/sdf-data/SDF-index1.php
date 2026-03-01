<?php
/* 初始化 */
require 'init.php';

$req = $_REQUEST;
switch ($req["type"]) {

	/* 用户登录 */
	case 'login':
        $username = trim($req["username"] ?? '');
        $password = trim($req["password"] ?? '');
    
        if ($username && $password) {
            // 修改SQL：支持用户名或邮箱
            $stmt = $db->prepare("SELECT user_id, username, password, avatar, avatar_color FROM `sdf-user` WHERE username = ? OR email = ?");
            $stmt->bind_param("ss", $username, $username);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
    
            if ($result) {
                if ($password == $result["password"]) {
                    $_SESSION['login'] = 'login';
                    $_SESSION['user_id'] = $result['user_id'];
    
                    $userData = [
                        'user_id' => $result['user_id'],
                        'username' => $result['username'],
                        'avatar' => $result['avatar'],
                        'avatar_color' => $result['avatar_color']
                    ];
                    json(0, '登录成功', $userData);
                } else {
                    jsonError(-1, '用户名/邮箱或密码错误');
                }
            } else {
                jsonError(-1, '用户名/邮箱或密码错误');
            }
            $stmt->close();
        } else {
            jsonError(-1, '请输入完整');
        }
        break;
    
    /* 退出登录 */
	case 'exitLogin':
		session_start();
		if($_SESSION['login'] == 'login'){
			unset($_SESSION['login']);
			unset($_SESSION['user_id']);
			jsonError(0, '退出登录成功');
		}else{
			jsonError(-1, '用户未登录');
		}
		break;
	
	case 'add_link':
		if (!isAdmin()) {
			jsonError(-1, '用户未登录');
		}
		$name = $req["name"];
		$desc = $req["desc"];
		$url = $req["url"];
		$picurl = $req["picurl"];
		$time = time();
		if ($name && $desc && $url && $picurl) {
			$result = $db->query("INSERT INTO `mxgapi_friendlinks`(`id`, `name`, `desc`, `url`, `picurl`, `time`) VALUES (NULL,'{$name}','{$desc}','{$url}','{$picurl}','{$time}')");
			if ($result) {
				jsonError(0, '添加成功');
			} else {
				jsonError(-1, '添加失败');
			}
		} else {
			jsonError(-1, '请输入完整');
		}
		break;
	
	
	/* 关注话题 */
	case 'FollowTopic':	
    // 1. 获取登录用户
    if (!isLogin()) {
			jsonError(-1, '用户未登录');
		}
    $user_id = (int)$_SESSION['user_id'];

    // 2. 获取参数
    $topic_id = $req['topic_id'];
    if ($topic_id <= 0) {
        jsonError(-1, '参数错误');
    }

    // 3. 查询当前话题
    $stmt = $db->prepare("SELECT follower_count, follower_user_id FROM `sdf-topic` WHERE topic_id = ?");
    $stmt->bind_param("i", $topic_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        jsonError(-1, '话题不存在');
    }

    $row = $result->fetch_assoc();
    $follower_count = (int)$row['follower_count'];
    $followers = json_decode($row['follower_user_id'] ?? '[]', true);
    if (!is_array($followers)) $followers = [];

    $is_following = in_array($user_id, $followers);
    $update_time = time();

    if ($is_following) {
        // 取消关注
        $followers = array_values(array_filter($followers, fn($id) => $id != $user_id));
        $follower_count = max(0, $follower_count - 1);
        $success_msg = '取消关注成功';
        $fail_msg    = '取消关注失败';
    } else {
        // 关注
        if (!in_array($user_id, $followers)) {
            $followers[] = $user_id;
        }
        $follower_count++;
        $success_msg = '关注成功';
        $fail_msg    = '关注失败';
    }

    $new_follower_user_id = json_encode(array_values($followers));

    // 4. 更新数据库
    $up_stmt = $db->prepare("UPDATE `sdf-topic` SET 
        follower_count = ?, 
        follower_user_id = ?, 
        update_time = ? 
        WHERE topic_id = ?");

    $up_stmt->bind_param("issi", $follower_count, $new_follower_user_id, $update_time, $topic_id);

    if ($up_stmt->execute()) {
        jsonError(0, $success_msg);        // 成功只返回消息
    } else {
        jsonError(-1, $fail_msg);     // 失败返回对应失败消息
    }
    break;
		
		
		
		
		
		
}