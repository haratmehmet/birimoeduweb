# 🌟 Birimo — Bağımsız Kurumsal Web Sitesi & Satış Talebi Altyapısı

Bu klasör (`website/`), **Birimo — Birebir Eğitim, Rehberlik ve Ödev Sistemi** için özel olarak hazırlanmış, ana Next.js uygulamasından tamamen bağımsız, sıradışı ve yüksek dönüşüm odaklı kurumsal vitrin sitesidir.

---

## 🚀 Öne Çıkan Özellikler & Sıradışı Mimari

1. **%100 Bağımsız ve Taşınabilir (Zero Dependency / No Build Step):**
   - Herhangi bir `npm install` veya `npm run build` sürecine ihtiyaç duymaz.
   - Klasörü dilediğiniz sunucuya (cPanel, Plesk, Nginx, Apache, Vercel, Netlify veya FTP) sürükleyip bıraktığınız anda eksiksiz çalışır.

2. **Kurumsal Marka Bütünlüğü:**
   - Orijinal Birimo logo renkleri: **Derin Lacivert (`#0e284d`)**, **Edu Mercan/Turuncu (`#fc4c39`, `#e83926`)** ve cam morfolojisi (glassmorphism) ile modern eğitim teknolojisi standardında tasarlandı.

3. **İnteraktif Kurumsal Kazanç & ROI Simülatörü:**
   - VIP kurs ve etüt merkezi yöneticilerinin öğrenci sayısı, haftalık ders saati ve seans ücretini kaydırarak **aylık önlenen gelir kaybını (₺)** ve **yıllık idari zaman tasarrufunu (saat)** canlı hesaplayabildiği interaktif simülatör.

4. **Etkileşimli Haftalık Ders Matrisi:**
   - Hero bölümünde yer alan canlı ders programı kartlarına tıklandığında seans durumları (`TAMAMLANDI`, `PLANLANDI`, `MAZERETLİ`) anında değişir ve atomik bakiye düşüşünü simüle eder.

5. **PostgreSQL Müşteri & Satış Talebi Veritabanı:**
   - Formlardan gelen satış talepleri doğrudan PostgreSQL veritabanına kaydedilir.
   - Sıkılaştırılmış güvenlik, Honeypot bot tuzağı, rate limiting ve XSS korumalı altyapı içerir.

---

## 📁 Klasör ve Dosya Hiyerarşisi

```text
website/
├── index.html               # Ana web sitesi (Tüm bölümler, modüller, FAQ ve formlar)
├── .htaccess                # Apache / LiteSpeed önbellek, Gzip ve güvenlik kuralları
├── README.md                # Kurulum ve yayınlama dokümantasyonu (Bu dosya)
│
├── css/
│   └── style.css            # Özel efektler, cam morfolojisi, gradyanlar ve animasyonlar
│
├── js/
│   └── main.js              # ROI simülatörü, dinamik matris, modal ve API entegrasyonu
│
├── assets/
│   ├── logo.png             # Orijinal kurumsal Birimo logosu (Şeffaf arka plan)
│   ├── logo.svg             # Vektörel Birimo amblemi
│   ├── favicon.png          # Yüksek çözünürlüklü favicon
│   ├── teacher.png          # Öğretmen arayüzü görseli
│   ├── student.png          # Öğrenci & Veli arayüzü görseli
│   ├── admin.png            # Kurucu & Yönetici arayüzü görseli
│   └── hero_sketch.jpg      # Kurumsal arkaplan skeç görseli
│
└── api/
    ├── demo_request.sql     # PostgreSQL (pgsql) tablo ve indeks kurulum dosyası
    ├── config.php           # Veritabanı bağlantı ayarları
    ├── submit_demo.php      # Güvenli PHP PostgreSQL demo kayıt endpoint'i
    ├── submit_demo.js       # Node.js / Express ortamları için alternatif backend handler
    └── .htaccess            # API yedeklerini ve konfigürasyonu dış erişime kapatan kalkan
```

---

## 🌐 Yayınlama (Deployment) Rehberi

### Senaryo 1: cPanel / Paylaşımlı Hosting / FTP (Örn: `birimoedu.com`)
1. cPanel Dosya Yöneticisi (File Manager) veya FileZilla ile sunucunuza bağlanın.
2. Domaininizin kök dizini olan `public_html` içine girin.
3. `website/` klasörünün **içindeki tüm dosya ve klasörleri** doğrudan `public_html` içine yükleyin.
4. Siteniz hemen `https://birimoedu.com` üzerinde canlıya çıkacaktır!

### Senaryo 2: Vercel / Netlify / Cloudflare Pages
1. Yeni proje oluşturun ve bu repoyu bağlayın.
2. **Root Directory** veya **Publish Directory** olarak `website` yazın.
3. **Build Command** alanını boş bırakın (statik sitedir).
4. Deploy butonuna basın; siteniz saniyeler içinde yayında!

### Senaryo 3: Nginx / VPS Sunucusu
Nginx konfigürasyonunuza şu bloğu eklemeniz yeterlidir:
```nginx
server {
    listen 80;
    server_name birimoedu.com www.birimoedu.com;
    root /var/www/birimo/website;
    index index.html index.php;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    }

    location ^~ /api/leads_backup.json {
        deny all;
    }
}
```

---

## 🗄️ PostgreSQL ("pysql") Veritabanı Kurulumu

Demo taleplerinin PostgreSQL veritabanınıza otomatik akması için:

1. **Tabloyu Oluşturun:**
   - pgAdmin, DBeaver veya terminal üzerinden PostgreSQL veritabanınıza bağlanın:
   ```bash
   psql -U postgres -d mentoros -f website/api/demo_request.sql
   ```
   Bu komut `website_demo_requests` tablosunu ve performans indekslerini oluşturur.

2. **Bağlantı Bilgilerini Girin:**
   - `website/api/config.php` dosyasını açıp veritabanı bilgilerinizi düzenleyin:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_PORT', '5432');
   define('DB_NAME', 'mentoros');
   define('DB_USER', 'postgres');
   define('DB_PASS', 'sifreniz');
   ```
   *(Veya sunucunuzda `DATABASE_URL` ortam değişkeni tanımlıysa, script bunu otomatik tanır).*

3. **Gelen Talepleri İnceleme Sorgusu:**
   ```sql
   SELECT full_name, institution_name, phone, student_capacity, created_at, status 
   FROM website_demo_requests 
   ORDER BY created_at DESC;
   ```

---

## 🔗 Yönetim Paneli ile Web Sitesini Birleştirme

Web sitesinin sağ üst köşesindeki ve altındaki **"Yönetim Paneli Girişi"** butonları varsayılan olarak `/login` yoluna yönlendirir.

Eğer ana yönetim panelinizi farklı bir subdomain üzerinde çalıştırıyorsanız (örneğin: `https://app.birimoedu.com` veya `https://panel.birimoedu.com`):
1. `website/index.html` dosyasını açın.
2. `href="/login"` geçen yerleri `href="https://app.birimoedu.com/login"` veya `href="https://panel.birimoedu.com/login"` olarak güncelleyin.

---

## 💻 Lokalde Hemen İnceleme ve Test

Web sitesini bilgisayarınızda canlı olarak görüntülemek için terminalden şu komutlardan birini çalıştırabilirsiniz:

```bash
# Python ile anında test:
python3 -m http.server 8080 --directory website

# Veya Node.js npx ile:
npx serve website
```
Ardından tarayıcınızdan `http://localhost:8080` adresine girerek hazırlanan kurumsal tasarımı, animasyonları ve simülatörü test edebilirsiniz.
