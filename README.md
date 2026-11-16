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
## 🌐 Yayınlama (Deployment) Rehberi

### Vercel / Netlify / Cloudflare Pages
1. Yeni proje oluşturun ve bu repoyu bağlayın.
2. Siteniz statik HTML/CSS/JS olarak anında canlıya çıkar.

---

## 📞 Kurumsal Satış & İletişim Kanalları

Tüm satış ve kurumsal bilgi talepleri `https://www.birimoedu.com/iletisim` sayfası üzerinden doğrudan yetkili satış hattına yönlendirilir:
- **Müşteri & Satış Hattı:** 0 545 855 00 89
- **Kurumsal E-posta:** destek@birimoedu.com

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
