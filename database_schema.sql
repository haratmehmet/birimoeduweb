-- =============================================================================
-- Birimo — Web Sitesi Satış Talepleri & Müşteri İletişim Veritabanı
-- PostgreSQL (pgsql) DDL Şeması
-- =============================================================================

-- 1. UUID Uzantısı
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Satış Talepleri Tablosu
CREATE TABLE IF NOT EXISTS website_demo_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    city VARCHAR(100),
    student_capacity VARCHAR(50) DEFAULT '51-150',
    notes TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status VARCHAR(50) DEFAULT 'YENI', -- 'YENI', 'INCELENDI', 'ULASILDI', 'GORUSME_YAPILDI', 'SATIS_TAMAMLANDI', 'IPTAL'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Performans ve Raporlama İndeksleri
CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON website_demo_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON website_demo_requests(status);
CREATE INDEX IF NOT EXISTS idx_demo_requests_phone ON website_demo_requests(phone);
CREATE INDEX IF NOT EXISTS idx_demo_requests_institution ON website_demo_requests(institution_name);

-- 4. Otomatik Güncelleme Tetikleyicisi (updated_at)
CREATE OR REPLACE FUNCTION update_website_demo_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_website_demo_timestamp ON website_demo_requests;
CREATE TRIGGER trg_update_website_demo_timestamp
BEFORE UPDATE ON website_demo_requests
FOR EACH ROW
EXECUTE FUNCTION update_website_demo_timestamp();

-- 5. Tablo Açıklaması
COMMENT ON TABLE website_demo_requests IS 'Birimo kurumsal web sitesi üzerinden gelen satın alma / satış talepleri ve potansiyel müşteri kayıtları.';
