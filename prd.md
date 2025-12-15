# PRD – İnteraktif Rastgele Seçim Çarkı Uygulaması

## 1. Ürün Özeti

- [x] Kullanıcının kendi seçeneklerini girerek animasyonlu bir çark üzerinden rastgele ve adil bir seçim yapmasını sağlayan, tek HTML dosyası içinde çalışan, responsive bir web uygulaması.

---

## 2. Hedef Kullanıcılar

- [x] Karar vermekte zorlanan bireysel kullanıcılar
- [x] Ekip toplantılarında seçim yapmak isteyen ekipler
- [x] Eğlence, çekiliş veya eğitim amaçlı kullanıcılar

---

## 3. Ürün Amaçları

- [x] Hızlı ve adil rastgele seçim sağlamak
- [x] Görsel olarak tatmin edici ve eğlenceli bir deneyim sunmak
- [x] Kurulum gerektirmeden her cihazda çalışmak

---

## 4. Teknik Kapsam ve Kısıtlar

- [x] HTML, CSS ve Vanilla JavaScript kullanılacak
- [x] Harici JS/CSS kütüphaneleri kullanılmayacak
- [x] Tüm kod tek bir `.html` dosyasında yer alacak
- [x] Modern tarayıcılarla uyumlu olacak

---

## 5. Temel Fonksiyonel Gereksinimler

- [x] Kullanıcıdan çoklu seçenek girişi alma (textarea veya input)
- [x] "Çarkı Döndür" butonu
- [x] Butona basıldığında animasyonlu çark dönüşü
- [x] Rastgele bir seçeneğin belirlenmesi
- [x] Sonucun çark üzerinde görsel olarak gösterilmesi
- [x] Sonucun metin olarak ayrıca belirtilmesi

---

## 6. Gelişmiş Fonksiyonel Özellikler

- [x] Boş girişte kullanıcıyı uyaran hata mesajı
- [x] Tek seçenek girildiğinde uyarı gösterilmesi
- [x] Aynı seçeneklerin otomatik olarak filtrelenmesi
- [x] Çark dönerken ses efekti
- [x] Ses efektini aç/kapat seçeneği
- [x] Önceki sonuçların listelendiği "Geçmiş" alanı
- [x] Son seçimin hangi açıya denk geldiğini gösteren mini debug modu
- [x] Debug modunun açılıp kapatılabilmesi
- [x] Çark dilim renklerinin otomatik ve kontrastlı atanması

---

## 7. UX / UI Gereksinimleri

- [x] Mobil ve masaüstü uyumlu (responsive) tasarım
- [x] Yumuşak easing kullanan dönüş animasyonu
- [x] Rastgele ama gerçekçi dönüş süresi (ör. 3–6 sn)
- [x] Sonuç geldiğinde konfeti veya vurgulama efekti
- [x] Okunabilir tipografi ve yeterli kontrast
- [x] Tek elle mobil kullanım dostu arayüz

---

## 8. Adalet ve Güven Algısı

- [x] Seçimin matematiksel olarak rastgele yapıldığının açıklanması
- [x] Açısal hesaplamanın debug modunda gösterilmesi
- [x] Görsel çark ile matematiksel sonuçların birebir eşleşmesi

---

## 9. Performans ve Kullanılabilirlik

- [x] Anında etkileşim (düşük gecikme)
- [x] Minimum DOM güncellemesi
- [x] Animasyonların düşük cihazlarda da akıcı çalışması

---

## 10. Başarı Kriterleri (Success Metrics)

- [x] Çark dönüşünde doğru ve tekil sonuç elde edilmesi
- [x] Hatalı girişlerde kullanıcıyı doğru yönlendirme
- [x] Mobil ve masaüstünde tutarlı deneyim
- [x] Kullanıcının sonucu "adil" olarak algılaması

---

## 11. Gelecekteki Geliştirme Önerileri

- [ ] Çark tasarımlarını kaydetme / paylaşma
- [ ] Çark sonucunu link olarak paylaşma
- [ ] Çok dilli (i18n) destek