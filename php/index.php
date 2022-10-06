<?php
include('./vendor/autoload.php');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

use Twilio\Jwt\AccessToken;
use Twilio\Jwt\Grants\VideoGrant;
use Twilio\Jwt\Grants\ChatGrant;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$TWILIO_ACCOUNT_SID = $_ENV['TWILIO_ACCOUNT_SID'];
$TWILIO_API_KEY = $_ENV['TWILIO_API_KEY'];
$TWILIO_API_SECRET = $_ENV['TWILIO_API_SECRET'];
$serviceSid = $_ENV['TWILIO_CHAT_SERVICE_ID'];
// Use identity and room from query string if provided
$identity = isset($_GET["identity"]) ? $_GET["identity"] : "identity";
$room = isset($_GET["room"]) ? $_GET["room"] :  "";

// Create access token, which we will serialize and send to the client
$token = new AccessToken(
    $TWILIO_ACCOUNT_SID, 
    $TWILIO_API_KEY, 
    $TWILIO_API_SECRET, 
    3600, 
    $identity
);

if(empty($room)){
    // Create Chat grant
    $chatGrant = new ChatGrant();
    $chatGrant->setServiceSid($serviceSid);

    // Add grant to token
    $token->addGrant($chatGrant);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['token' => $token->toJWT()]);
}else{
    // Grant access to Video
    $grant = new VideoGrant();
    $grant->setRoom($room);
    $token->addGrant($grant);
    echo $token->toJWT();
}


