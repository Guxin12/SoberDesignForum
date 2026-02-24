<?php
return $db->query("SELECT title,subtitle,description,keywords,favicon,email,qq,url,icp,copyright,qqqrcode,vxqrcode,aliqrcode,post_id,cc_protect,fire_wall FROM `sdf_config`")->fetch_assoc();

//标题,副标题,网站描述,关键词,网站图标,电子邮件,QQ号码,网站地址,ICP备案,网站版权,QQ二维码,微信二维码,支付宝二维码,公共ID,CC防护,防火墙
