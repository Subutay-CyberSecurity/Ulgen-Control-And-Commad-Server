# Ulgen Control And Command Server

**Ulgen Control And Command Server** basit bir Command & Control (C2) sunucusu uygulamasıdır. Bu proje, hedef sistemlerle iletişim kurup komut gönderebilen ve gelen yanıtları işleyebilen temel bir kontrol sunucu yapısı sağlar.

> ⚙️ Bu repository hâlen geliştirme aşamasındadır — ihtiyaçlarınıza göre genişletilebilir.

---

## 🧠 Proje Hakkında

**Ulgen Control And Command Server**, uzaktaki istemciler ile merkezi komut ve kontrol (C2) iletişimi kurmak için tasarlanmış örnek bir sunucu yapısıdır.

Komut & kontrol sunucuları (C2), genellikle merkezi bir sunucu üzerinden birden fazla bağlantılı istemci ile iletişim kurmak ve komutlar göndermek için kullanılır. Bu tür mimariler, siber güvenlik, botnet yönetimi veya test hedefli ağ kontrol senaryolarında yer alabilir. :contentReference[oaicite:2]{index=2}

---

## 🗂️ Özellikler

- Basit TCP/HTTP tabanlı sunucu mimarisi
- Uzaktan komut gönderme desteği
- İstemcilerden cevap alma ve işlem
- Genişletilebilir modüler tasarım

*(Bu listeyi proje özelliklerine göre güncelleyebilirsin.)*

---

## 🚀 Kurulum

### Gereksinimler

- Node.js (≥14)
- NPM / Yarn

### Adımlar

```bash
# Depoyu klonla
git clone https://github.com/Subutay-CyberSecurity/Ulgen-Control-And-Commad-Server.git

# Proje dizinine geç
cd Ulgen-Control-And-Commad-Server

# Bağımlılıkları yükle
npm install
