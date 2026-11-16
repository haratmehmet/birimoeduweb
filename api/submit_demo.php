<?php
/**
 * Birimo — Satış Talebi API Endpoint'i
 * PostgreSQL Tabanlı Kayıt Sistemi & Güvenli Doğrulama
 */

define('BIRIMO_API', true);
require_once __DIR__ . '/config.php';

// Güvenlik ve CORS Başlıkları
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Kısıtlı & Güvenli CORS Yönetimi
$allowedOrigins = [
    'https://birimoedu.com',
    'https://www.birimoedu.com',
    'https://app.birimoedu.com',
    'https://birimo.com',
    'https://www.birimo.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
} elseif (!empty($origin)) {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $serverHost = $_SERVER['HTTP_HOST'] ?? '';
    if ($originHost && str_contains($serverHost, $originHost)) {
        header("Access-Control-Allow-Origin: $origin");
    }
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

// OPTIONS Preflight İsteğini Yanıtla
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Yalnızca POST isteklerine izin ver
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Yalnızca POST istekleri kabul edilmektedir.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Güvenli İstemci IP ve User-Agent Tespiti (Spoofing Korumalı)
$rawIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$ip = filter_var($rawIp, FILTER_VALIDATE_IP) ? $rawIp : '0.0.0.0';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'UNKNOWN';

// Gelen Veriyi Ayrıştır (JSON veya Form Data)
$rawBody = file_get_contents('php://input');
$inputData = json_decode($rawBody, true);

if (!is_array($inputData)) {
    $inputData = $_POST;
}

// 1. HONEYPOT KONTROLÜ (Otomatik Spam / Bot Tuzağı)
$honeypot = trim($inputData['website_hp'] ?? '');
if (!empty($honeypot)) {
    // Botlar bu gizli alanı doldurur; sessizce 200 dönerek botu oyalar ve veri tabanına yazmaz
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Satış talebiniz başarıyla alındı. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. RATE LIMITING (Hafif ve Güvenli İstek Sınırlandırması - 5 dakikada maks. 5 talep)
$ipHash = md5($ip);
$rateFile = sys_get_temp_dir() . '/birimo_rl_' . $ipHash . '.json';
$now = time();
$rateData = ['count' => 0, 'first_req' => $now];
if (file_exists($rateFile)) {
    $rawRate = @file_get_contents($rateFile);
    $rateData = json_decode($rawRate, true) ?: $rateData;
}
if ($now - ($rateData['first_req'] ?? $now) > 300) {
    $rateData = ['count' => 1, 'first_req' => $now];
} else {
    $rateData['count'] = ($rateData['count'] ?? 0) + 1;
}
@file_put_contents($rateFile, json_encode($rateData), LOCK_EX);

if ($rateData['count'] > 5) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Kısa sürede çok fazla talep gönderildi. Lütfen birkaç dakika sonra tekrar deneyiniz.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Alanları Ayıkla ve Temizle
$fullName        = trim(strip_tags($inputData['fullName'] ?? ''));
$institutionName = trim(strip_tags($inputData['institutionName'] ?? ''));
$phone           = trim(strip_tags($inputData['phone'] ?? ''));
$email           = trim(strip_tags($inputData['email'] ?? ''));
$city            = trim(strip_tags($inputData['city'] ?? ''));
$studentCapacity = trim(strip_tags($inputData['studentCount'] ?? $inputData['studentCapacity'] ?? '51-150'));
$notes           = trim(strip_tags($inputData['notes'] ?? 'Web sitesi üzerinden gelen doğrudan satış talebi.'));

// Temel Doğrulama
if (mb_strlen($fullName) < 2) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Lütfen adınızı ve soyadınızı eksiksiz belirtiniz.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (mb_strlen($institutionName) < 2) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Lütfen kurum adını belirtiniz.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (mb_strlen($phone) < 7) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Lütfen geçerli bir telefon numarası giriniz.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$leadRecord = [
    'full_name'        => $fullName,
    'institution_name' => $institutionName,
    'phone'            => $phone,
    'email'            => $email,
    'city'             => $city,
    'student_capacity' => $studentCapacity,
    'notes'            => $notes,
    'ip_address'       => $ip,
    'user_agent'       => substr($userAgent, 0, 255),
    'created_at'       => date('Y-m-d H:i:s')
];

$dbSaved = false;
$pdo = getDbConnection();

if ($pdo) {
    try {
        $sql = "INSERT INTO website_demo_requests 
                (full_name, institution_name, phone, email, city, student_capacity, notes, ip_address, user_agent, status)
                VALUES 
                (:full_name, :institution_name, :phone, :email, :city, :student_capacity, :notes, :ip_address, :user_agent, 'YENI')";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':full_name'        => $leadRecord['full_name'],
            ':institution_name' => $leadRecord['institution_name'],
            ':phone'            => $leadRecord['phone'],
            ':email'            => $leadRecord['email'],
            ':city'             => $leadRecord['city'],
            ':student_capacity' => $leadRecord['student_capacity'],
            ':notes'            => $leadRecord['notes'],
            ':ip_address'       => $leadRecord['ip_address'],
            ':user_agent'       => $leadRecord['user_agent']
        ]);
        $dbSaved = true;
    } catch (PDOException $e) {
        error_log("Birimo Lead Insert Error: " . $e->getMessage());
        $dbSaved = false;
    }
}

// PostgreSQL bağlantısında geçici kesinti varsa, web kök dizini DIŞINDA korumalı sistem geçici alanına yedekler
if (!$dbSaved) {
    $secureBackupDir = sys_get_temp_dir() . '/birimo_secure_leads';
    if (!is_dir($secureBackupDir)) {
        @mkdir($secureBackupDir, 0700, true);
    }
    $secureBackupFile = $secureBackupDir . '/leads_' . date('Y_m') . '.log';
    $logLine = json_encode($leadRecord, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    @file_put_contents($secureBackupFile, $logLine, FILE_APPEND | LOCK_EX);
}

// Yanıt Dön
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Satış talebiniz başarıyla alındı. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.',
    'db_synced' => $dbSaved
], JSON_UNESCAPED_UNICODE);
