/**
 * Birimo — Node.js / Express / Standalone PostgreSQL Satış Talebi Handler
 * 
 * Kullanım (Express içinde):
 *   const { handleDemoRequest } = require('./api/submit_demo.js');
 *   app.post('/api/submit_demo', handleDemoRequest);
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const os = require('os');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mentoros',
  ssl: process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL?.includes('localhost') 
    ? { rejectUnauthorized: false } 
    : false
});

async function handleDemoRequest(req, res) {
  try {
    const { fullName, institutionName, phone, email, city, studentCapacity, studentCount, notes, website_hp } = req.body || {};
    const capacityVal = studentCount || studentCapacity || '51-150';

    // 1. Honeypot Kontrolü (Spam Bot Tuzağı)
    if (website_hp && String(website_hp).trim().length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Satış talebiniz başarıyla alındı. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.'
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

    const ipAddress = req.headers['cf-connecting-ip'] || req.socket.remoteAddress || 'UNKNOWN';
    const userAgent = req.headers['user-agent'] || 'UNKNOWN';

    let dbSaved = false;

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
        ipAddress,
        userAgent.substring(0, 255)
      ];

      await pool.query(query, values);
      dbSaved = true;
    } catch (dbErr) {
      console.error('PostgreSQL Lead Insert Error:', dbErr.message);
    }

    // Güvenli Yedekleme (Web kök dizini DIŞINDA korumalı sistem geçici alanında tutulur)
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

module.exports = { handleDemoRequest };
