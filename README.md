# Agora — Modern Topluluk Forumu (Statik Şablon)

Saf **HTML + CSS + JavaScript** ile yapılmış, backend gerektirmeyen modern bir forum sitesi şablonu. Herhangi bir kurulum olmadan, `index.html` dosyasına çift tıklayarak tarayıcıda açabilirsin.

## İçindekiler

| Dosya | Açıklama |
|-------|----------|
| `index.html` | Anasayfa — kategori kartları, istatistikler, son konular listesi |
| `category.html` | Kategori görünümü — konu listesi, filtre/sıralama, sayfalama |
| `topic.html` | Konu detayı — ilk mesaj, cevaplar ve cevap yazma kutusu |
| `css/style.css` | Tüm stiller — açık/koyu tema, duyarlı (responsive) düzen |
| `js/app.js` | Etkileşim — tema, mobil menü, arama, beğeni, cevap ekleme |

## Özellikler

- 🌗 **Açık / koyu tema** — sağ üstteki düğmeyle değişir, tercih tarayıcıda hatırlanır (sistem temasını otomatik algılar)
- 📱 **Tam duyarlı** — masaüstü, tablet ve telefonda düzgün görünür; mobilde kayan kenar menüsü
- 🔍 **Canlı arama** — konu listesinde anında filtreleme (`/` tuşu arama kutusuna odaklanır)
- ❤️ **Beğeni düğmeleri** — tıkla, sayaç artar/azalır
- 💬 **Cevap ekleme** — konu sayfasında yazıp "Gönder" ile cevap eklenir (demo amaçlı, tarayıcıda)
- 🎨 **Modern tasarım** — gradyan avatarlar, kategori rozetleri, kartlar, yumuşak gölgeler
- ⚡ **Sıfır bağımlılık** — sadece Inter yazı tipi internetten yüklenir, o da olmazsa sistem yazı tipine düşer

## Nasıl çalıştırılır?

1. `index.html` dosyasına çift tıkla — tarayıcıda açılır.
2. Veya bir yerel sunucu çalıştır (önerilir):
   ```powershell
   # Python kuruluysa:
   python -m http.server 8000
   # Tarayıcıda: http://localhost:8000
   ```

## Özelleştirme ipuçları

- **Renkler:** `css/style.css` dosyasının en üstündeki `:root` ve `[data-theme="dark"]` değişkenlerini düzenle (özellikle `--primary` ve `--grad`).
- **Forum adı/logo:** Her HTML dosyasındaki `.brand` bölümünü değiştir.
- **İçerik:** Konular `<article class="topic">`, mesajlar `<article class="post">` blokları olarak duruyor; kopyalayıp çoğaltabilirsin.

> Not: Bu statik bir şablondur — gerçek kullanıcı kaydı, kalıcı konu/mesaj kaydı yoktur. Bunlar için bir backend (örn. Node.js + veritabanı) gerekir.
