<?php
session_start();
require_once("twitteroauth/twitteroauth.php"); //Path to twitteroauth library
 
$twitteruser = "username";
$hashtag = "%23ala2013 OR %23ala13"; //Enter search term(s) here
$notweets = 100; //Number of tweets to display
$consumerkey = "12345678910";
$consumersecret = "12345678910";
$accesstoken = "12345678910";
$accesstokensecret = "12345678910";
 
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}
  
$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
$tweets = $connection->get("https://api.twitter.com/1.1/search/tweets.json?q=".$hashtag."&count=".$notweets);
 
// Comment out to begin caching
echo json_encode($tweets);

// Uncomment to begin caching
/*
$file = $twitteruser."-tweets.txt";
$fh = fopen($file, 'w') or die("can't open file");
fwrite($fh, json_encode($tweets));
fclose($fh);
 
if (file_exists($file)) {
    echo $file . " successfully written (" .round(filesize($file)/1024)."KB)";
}
*/
}
?>
