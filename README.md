# Ulgen Control And Command Server

**Ulgen Control And Command Server** basit bir Command & Control (C2) sunucusu uygulamasıdır. Bu proje, hedef sistemlerle iletişim kurup komut gönderebilen ve gelen yanıtları işleyebilen temel bir kontrol sunucu yapısı sağlar.

> ⚙️ Bu repository hâlen geliştirme aşamasındadır — ihtiyaçlarınıza göre genişletilebilir.

---

## 🧠 Proje Hakkında

**Ulgen Control And Command Server**, uzaktaki istemciler ile merkezi komut ve kontrol (C2) iletişimi kurmak için tasarlanmış örnek bir sunucu yapısıdır.

Komut & kontrol sunucuları (C2), genellikle merkezi bir sunucu üzerinden birden fazla bağlantılı istemci ile iletişim kurmak ve komutlar göndermek için kullanılır. Bu tür mimariler, siber güvenlik, botnet yönetimi veya test hedefli ağ kontrol senaryolarında yer alabilir. :contentReference[oaicite:2]{index=2}

---

## 📸 Ekran Görüntüleri

<div align="center">
  
### 🔐 Giriş Ekranı
<img src="https://github.com/user-attachments/assets/3ca9605c-ab01-4151-8c67-e085929d49f2" width="800" alt="Giriş Ekranı"/>

### 🎮 Yönetici Paneli (Dashboard)
<img src="https://github.com/user-attachments/assets/f2dbcc2f-955b-4656-9b33-f475d54470a6" width="800" alt="Dashboard"/>

<img src="https://github.com/user-attachments/assets/2c7836e8-94dc-4ef0-953b-a112a152e110" width="800" alt="Dosya Yönetimi"/>

### 📁 Dosya Yönetimi (Files)
<img src="https://github.com/user-attachments/assets/b4845b8f-41b3-480d-a364-634e1cadcbdc" width="800" alt="Dosya Transferi"/>

</div>

---

| Panel | Açıklama |
|-------|----------|
| **🔐 Giriş Ekranı** | Yönetici paneli giriş sayfası |
| **🎮 Dashboard** | Ajan listesi, komut gönderme arayüzü, canlı güncellemeler |
| **📁 Dosya Yönetimi** | Transfer edilen dosyaların listesi ve indirme butonları |

---

## ⚖️ Sorumluluk Reddi

Bu yazılım **sadece eğitim amaçlıdır**. İzin alınmış sistemlerde test yapmak için tasarlanmıştır. Kötüye kullanımı yasal sorumluluk doğurur. Geliştiriciler, bu yazılımın yasa dışı kullanımından sorumlu tutulamaz.

**Kullanmadan önce yerel yasalarınızı kontrol edin.**

---

## 🗂️ Özellikler

- Basit TCP/HTTP tabanlı sunucu mimarisi
- Uzaktan komut gönderme desteği
- İstemcilerden cevap alma ve işlem
- İstemcilerden dosya çekip gönderme
- Genişletilebilir modüler tasarım

*(Bu listeyi proje özelliklerine göre güncelleyebilirsin.)*

---

## 🚀 Kurulum

### Gereksinimler

- Node.js 14
- NPM / Yarn

## Adımlar

### 1. Sunucuya Bağlanma

<p>Öncelikle kiraladığın VPS'e SSH ile bağlanman gerekiyor.</p>

```bash
ssh root@sunucu_ip_adresin
# veya root değilse
ssh kullanici_adin@sunucu_ip_adresin
```

<p>Şifreni gir (girerken görünmez, bu normal). İlk kez bağlanıyorsan "Are you sure you want to continue connecting?" diye sorar, yes yaz ve Enter'a bas</p>

### 2. Sistemi Güncelleme

<p>Sunucuya bağlandıktan sonra ilk iş, sistem paketlerini güncellemek.</p>

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Node.js Kurulumu

<p>Node.js'i kurmak için Node Version Manager (nvm) kullanacağız. Bu, istediğin Node versiyonunu kolayca yönetmeni sağlar.</p>

```bash
# nvm'yi kur
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash

# nvm'yi aktifleştir
. "$HOME/.nvm/nvm.sh"

# Node.js'in en son LTS sürümünü kur
nvm install --lts

# Kurulumu kontrol et
node --version
npm --version
```

### 4. Gerekli Klasörleri Oluşturma ve Dosyaları Yükleme

<p>C2 sunucun için gerekli klasör yapısını oluştur.</p>

```bash
# Proje klasörünü oluştur
mkdir -p ~/c2-server
cd ~/c2-server

# Klasör yapısını oluştur
mkdir -p certs public uploads downloads
```

<p>Şimdi, kendi bilgisayarından aşağıdaki dosyaları VPS'ine yüklemen gerekiyor. Bunun için scp komutunu kullanabilirsin (kendi bilgisayarının terminalinde çalıştır).</p>

```bash
# Kendi bilgisayarından VPS'ine dosya yükleme
scp -r /kendi_bilgisayarindaki/c2-server/server.js root@sunucu_ip_adresin:~/c2-server/
scp -r /kendi_bilgisayarindaki/c2-server/package.json root@sunucu_ip_adresin:~/c2-server/
scp -r /kendi_bilgisayarindaki/c2-server/public root@sunucu_ip_adresin:~/c2-server/
```

<p>Eğer dosyalar GitHub'daysa, VPS üzerinden direkt klonlamak daha kolay</p>

```bash
# GitHub'dan clone (kendi repo adresinle değiştir)
git clone https://github.com/Subutay-CyberSecurity/Ulgen-Control-And-Commad-Server.git ~/c2-server
cd ~/c2-server```

### 5. SSL Sertifikası Oluşturma

<p>HTTPS için self-signed SSL sertifikası oluştur.</p>

```bash
cd ~/c2-server/certs
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes

# Aşağıdaki sorulara cevap ver (boş geçebilirsin ama Common Name'e sunucu IP'ni yaz)
# Country Name: TR
# State: Istanbul
# Locality Name: Istanbul
# Organization Name: C2 Server
# Organizational Unit Name: IT
# Common Name: sunucu_ip_adresin   (ÖNEMLİ!)
# Email Address: admin@example.com

cd ~/c2-server
```
### 6. Bağımlılıkları Yükleme ve Test Etme

<p>Node.js bağımlılıklarını yükle ve sunucuyu test et.</p>

```bash
cd ~/c2-server
npm install

# Test için çalıştır (root yetkisi gerekebilir)
sudo node server.js
```

<p>Eğer her şey yolundaysa şu çıktıyı görmelisin:</p>


```bash
🚀 C2 Sunucusu başlatılıyor...
📂 Uploads klasörü taranıyor...
✅ Uploads klasöründen X dosya yüklendi.
🎯 443 PORTU - C2 SUNUCU API
🕹️ 9998 PORTU - YÖNETİCİ PANELİ
   → https://sunucu_ip_adresin:9998
   → Şifre: mow0BEBWgooxBLCiAVTm
```

<p>Test etmek için başka bir terminalden şu komutu dene:</p>

```bash
curl -k https://sunucu_ip_adresin:443/test
```

### 7. PM2 ile Kalıcı Çalıştırma (EN ÖNEMLİ KISIM!)

<p>Terminali kapattığında sunucunun durmaması için PM2 kullanacağız.</p>

```bash
# PM2'yi global kur
npm install -g pm2

# Sunucuyu PM2 ile başlat
cd ~/c2-server
pm2 start server.js --name c2-server

# PM2'yi açılışta otomatik başlat
pm2 startup
# Yukarıdaki komut sana bir komut verecek, onu kopyala ve çalıştır (örneğin: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root)

# Mevcut PM2 konfigürasyonunu kaydet
pm2 save

# PM2 durumunu kontrol et
pm2 status
pm2 logs c2-server  # Canlı logları görmek için
```

### 8. Güvenlik Duvarı (Firewall) Ayarları

<p>Sunucunun güvenlik duvarında gerekli portları aç.</p>

```bash
# UFW (Uncomplicated Firewall) kur ve aktifleştir
sudo apt install ufw -y

# Portları aç
sudo ufw allow 22/tcp        # SSH
sudo ufw allow 443/tcp        # C2 API
sudo ufw allow 9998/tcp       # Yönetici Paneli

# UFW'yi aktifleştir
sudo ufw --force enable

# Durumu kontrol et
sudo ufw status verbose
```

## 🎯 Kurulum Sonrası Erişim

| Servis | Adres | Açıklama |
|--------|-------|----------|
| **Yönetici Paneli** | `https://sunucu_ip_adresin:9998` | Şifre: `mow0BEBWgooxBLCiAVTm` |
| **Ajan API** | `https://sunucu_ip_adresin:443` | Ajanların bağlanacağı adres |
| **Test Endpoint** | `https://sunucu_ip_adresin:443/test` | JSON yanıtı döner |

## ⚠️ ÖNEMLİ NOTLAR

- **Varsayılan şifreyi değiştir!** `server.js` dosyasındaki `PASSWORD` sabitini kendi güçlü şifrenle değiştir.
- **443 portu root yetkisi ister:** PM2 ile root yetkisiyle çalıştırdığın için sorun olmaz.
- **Dosyalar kalıcı mı?** Evet, `uploads/` klasöründeki dosyalar sunucu restartında kaybolmaz. Sistem her başladığında `uploads/` klasörünü tarar ve dosyaları listeler.
- **Güncelleme yaparken:** Kodları güncellediğinde PM2'yi restart et:
  ```bash
  pm2 restart c2-server
  ```

  ## 🚨 Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| **EACCES hatası** | Port 443 için root yetkisi gerekir: `sudo pm2 start server.js --name c2-server` |
| **SSL sertifika hatası** | Sertifikaların doğru yerde olduğunu kontrol et: `ls -la ~/c2-server/certs/` |
| **Bağlantı reddediliyor** | Güvenlik duvarında portların açık olduğunu kontrol et: `sudo ufw status` |
| **Ajan bağlanamıyor** | Self-signed sertifika için `verify=False` kullanıldığından emin ol |

---

Artık C2 sunucun 7/24 çalışır durumda! Yönetici paneline girip ajanlarını yönetebilir, komut gönderebilir ve dosya transferi yapabilirsin. 🚀
