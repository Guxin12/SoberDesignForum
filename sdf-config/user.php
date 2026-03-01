<?php
return $db->query("SELECT user_id,username,avatar,avatar_color FROM `sdf-user`")->fetch_all(MYSQLI_ASSOC);
// 这会返回一个包含所有行的关联数组