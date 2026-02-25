<?php
return $db->query("SELECT title,subtitle,description,keywords,favicon,url,icp,copyright,cc_protect,fire_wall FROM `sdf-config`")->fetch_assoc();

//标题,副标题,网站描述,关键词,网站图标,网站地址,ICP备案,网站版权,CC防护,防火墙
