<?php
/**
 * Birimo — Web Sitesi API Yapılandırması
 * PostgreSQL (pgsql) Bağlantı Ayarları
 */

// Doğrudan erişimi kısıtla
if (!defined('BIRIMO_API')) {
    define('BIRIMO_API', true);
}

// Hata Raporlama (Canlıda 0 yapınız)
error_reporting(0);
ini_set('display_errors', '0');

// PostgreSQL Veritabanı Bilgileri
// Projenizdeki PostgreSQL bilgileriyle veya sunucu ortam değişkenleriyle doldurunuz
$db_url = getenv('DATABASE_URL');

if ($db_url) {
    // DATABASE_URL formatı: postgres://user:password@host:port/dbname
    $db_parts = parse_url($db_url);
    define('DB_HOST', $db_parts['host'] ?? 'localhost');
    define('DB_PORT', $db_parts['port'] ?? '5432');
    define('DB_NAME', ltrim($db_parts['path'] ?? '', '/'));
    define('DB_USER', $db_parts['user'] ?? 'postgres');
    define('DB_PASS', $db_parts['pass'] ?? '');
} else {
    // Standart Tanımlar (Burayı kendi PostgreSQL bilgilerinizle güncelleyebilirsiniz)
    define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
    define('DB_PORT', getenv('DB_PORT') ?: '5432');
    define('DB_NAME', getenv('DB_NAME') ?: 'mentoros');
    define('DB_USER', getenv('DB_USER') ?: 'postgres');
    define('DB_PASS', getenv('DB_PASS') ?: 'postgres');
}

// Bildirim E-postası (Opsiyonel: Yeni satış talebi geldiğinde e-posta bildirimi)
define('NOTIFICATION_EMAIL', 'info@birimoedu.com');
define('ENABLE_EMAIL_NOTIFICATION', false);

/**
 * PostgreSQL PDO Bağlantısı Oluşturur
 */
function getDbConnection() {
    try {
        $dsn = sprintf(
            "pgsql:host=%s;port=%s;dbname=%s;options='--client_encoding=UTF8'",
            DB_HOST,
            DB_PORT,
            DB_NAME
        );
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 5
        ]);
        return $pdo;
    } catch (PDOException $e) {
        // Hata durumunda log tutulabilir
        error_log("Birimo DB Connection Error: " . $e->getMessage());
        return null;
    }
}
