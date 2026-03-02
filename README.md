# 🎯 Ülgen C2 - Komut Kontrol Sunucusu

![Version](https://img.shields.io/badge/version-2.0-blue)
![Node](https://img.shields.io/badge/node-18%2B-green)
![License](https://img.shields.io/badge/license-MIT-orange)

> ⚠️ **Educational Purpose Only**
>
> Bu proje yalnızca eğitim ve güvenlik araştırmaları için geliştirilmiştir.  
> İzinsiz kullanım yasa dışıdır.

---

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Mimari Yapı](#-mimari-yapı)
- [Kurulum](#-kurulum)
- [Docker Kurulumu](#-docker-kurulumu)
- [Kullanım](#-kullanım)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Ajan Geliştirme](#-ajan-geliştirme)
- [Güvenlik Uyarıları](#️-güvenlik-uyarıları)
- [SSS](#-sık-sorulan-sorular)
- [Lisans](#-lisans)

---

# ✨ Özellikler

## 🔧 Temel Özellikler

- Çift Port Mimarisi (443 - Ajan API / 9998 - Admin Panel)
- HTTPS tabanlı iletişim (SSL/TLS)
- Çoklu ajan desteği
- Gerçek zamanlı ajan takibi (SSE)

## 📁 Dosya Yönetimi

- Çift yönlü dosya transferi
- Base64 encoding
- Kalıcı depolama (uploads klasörü)
- Tarayıcıdan tek tık indirme

## 🖥️ Yönetici Paneli

- Koyu tema arayüz
- Canlı ajan listesi
- Komut terminali
- Dosya gezgini
- Dizin gezintisi (cd, ls, pwd)

---

# 🏗️ Mimari Yapı
┌─────────────────┐ 443 ┌──────────────┐
│ Ajanlar │ ◄─────────── │ C2 Sunucu │
│ (Client) │ │ (Node.js) │
└─────────────────┘ └──────┬───────┘
│ 9998
┌────▼──────┐
│ Admin │
│ Panel │
└───────────┘


## Port Yapısı

| Port | Amaç | Açıklama |
|------|------|----------|
| 443  | Ajan API | Komut ve veri transferi |
| 9998 | Admin Panel | Web arayüz erişimi |

---

# 🚀 Kurulum

## Gereksinimler

- Node.js 18+
- npm veya yarn
- OpenSSL
- 443 portu için sudo yetkisi

## Kurulum Adımları

```bash
git clone https://github.com/Subutay-CyberSecurity/Ulgen-Control-And-Commad-Server.git
cd Ulgen-Control-And-Commad-Server
npm install
