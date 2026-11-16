/**
 * Birimo Edu — Vercel Serverless PostgreSQL Satış Talebi API Endpoint
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const os = require('os');

let pool;
function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });
  }
  return pool;
}

// In-Memory IP Bazlı Rate Limiting (5 istek / 5 dakika)
const ipRateMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const maxAttempts = 5;

  const record = ipRateMap.get(ip);
  if (!record || now - record.startTime > windowMs) {
    ipRateMap.set(ip, { count: 1, startTime: now });
    return false;
  }

  if (record.count >= maxAttempts) {
    return true;
  }

  record.count += 1;
  return false;
}

async function handleDemoRequest(req, res) {
  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const { fullName, institutionName, phone, email, city, studentCapacity, studentCount, notes, website_hp } = body || {};
    const capacityVal = studentCount || studentCapacity || '51-150';

    // 1. Honeypot Kontrolü (Spam Bot Tuzağı)
    if (website_hp && String(website_hp).trim().length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Satış talebiniz başarıyla alındı. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.'
      });
    }

    const ipAddress = req.headers['x-forwarded-for'] || req.headers['cf-connecting-ip'] || req.socket?.remoteAddress || 'UNKNOWN';
    const userAgent = req.headers['user-agent'] || 'UNKNOWN';

    // 2. IP Rate Limiting
    if (isRateLimited(ipAddress)) {
      return res.status(429).json({
        success: false,
        message: 'Kısa süre içinde çok fazla talep gönderildi. Lütfen 5 dakika sonra tekrar deneyiniz.'
      });
    }

    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Lütfen adınızı ve soyadınızı belirtiniz.' });
    }
    if (!institutionName || institutionName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Lütfen kurum adını belirtiniz.' });
    }
    if (!phone || phone.trim().length < 7) {
      return res.status(400).json({ success: false, message: 'Lütfen geçerli bir telefon numarası giriniz.' });
    }

    let dbSaved = false;
    const dbPool = getPool();

    if (dbPool) {
      try {
        const query = `
          INSERT INTO website_demo_requests 
          (full_name, institution_name, phone, email, city, student_capacity, notes, ip_address, user_agent, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'YENI')
          RETURNING id;
        `;
        const values = [
          fullName.trim(),
          institutionName.trim(),
          phone.trim(),
          email ? email.trim() : null,
          city ? city.trim() : null,
          capacityVal,
          notes || 'Web sitesi üzerinden gelen doğrudan satış talebi.',
          String(ipAddress).slice(0, 100),
          userAgent.substring(0, 255)
        ];

        await dbPool.query(query, values);
        dbSaved = true;
      } catch (dbErr) {
        console.error('PostgreSQL Lead Insert Error:', dbErr.message);
      }
    }

    // Güvenli Sistem Yedekleme Kaydı (/tmp izole dizini)
    if (!dbSaved) {
      try {
        const secureBackupDir = path.join(os.tmpdir(), 'birimo_secure_leads');
        if (!fs.existsSync(secureBackupDir)) {
          fs.mkdirSync(secureBackupDir, { recursive: true, mode: 0o700 });
        }
        const secureFile = path.join(secureBackupDir, `leads_${new Date().toISOString().slice(0, 7)}.log`);
        const backupItem = {
          fullName,
          institutionName,
          phone,
          email,
          city,
          studentCapacity: capacityVal,
          notes,
          ipAddress,
          createdAt: new Date().toISOString()
        };
        fs.appendFileSync(secureFile, JSON.stringify(backupItem) + '\n', 'utf8');
      } catch (logErr) {
        console.error('Backup write error:', logErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Satış talebiniz başarıyla alındı. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.',
      db_synced: dbSaved
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, message: 'Sunucu hatası oluştu.' });
  }
}

module.exports = async function handler(req, res) {
  // CORS Politikası
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    'https://birimoedu.com',
    'https://www.birimoedu.com',
    'https://birimoedu.vercel.app',
    'https://app.birimoedu.com'
  ];

  if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://birimoedu.com');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Yalnızca POST istekleri kabul edilir.' });
  }

  return handleDemoRequest(req, res);
};
