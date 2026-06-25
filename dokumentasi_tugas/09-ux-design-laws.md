# PRD Referensi: Hukum-Hukum UX Design

> **Dokumen ini dirancang sebagai referensi PRD** yang dapat digunakan sebagai prompt input untuk generasi desain UI/UX, desain grafis, dan sistem desain. Setiap hukum disertai prinsip, contoh nyata, dan panduan implementasi yang dapat langsung dijadikan instruksi desain.

---

## Cara Menggunakan Dokumen Ini

Ketika menggunakan dokumen ini sebagai prompt untuk generate desain:
1. **Pilih hukum yang relevan** dengan komponen yang ingin didesain
2. **Ambil bagian "Panduan Implementasi"** sebagai instruksi spesifik
3. **Gunakan Do's & Don'ts** sebagai constraint dalam prompt
4. Kombinasikan 2–3 hukum untuk desain yang lebih komprehensif

---

## Kategori A — Hukum Kognitif

Berkaitan dengan cara otak manusia memproses, mengingat, dan membuat keputusan.

---

### 1. Hick's Law

**Definisi:**
Waktu yang dibutuhkan untuk membuat keputusan meningkat seiring bertambahnya jumlah pilihan yang tersedia.

**Formula:**
`T = b × log₂(n + 1)` — di mana T = waktu keputusan, n = jumlah pilihan, b = konstanta empiris.

**Prinsip Inti:**
Lebih sedikit pilihan = keputusan lebih cepat = pengalaman lebih baik. Menyederhanakan pilihan bukan berarti mengurangi fitur, melainkan menyajikan pilihan secara bertahap dan terstruktur.

**Contoh Nyata dalam UI/UX:**
- **Netflix** — Tidak menampilkan seluruh katalog sekaligus. Konten dikelompokkan dalam kategori horizontal sehingga user fokus pada satu baris dulu.
- **Apple Menu Bar** — Hanya menampilkan item menu yang esensial; item lanjutan tersembunyi di submenu.
- **Onboarding Flow** — Memecah pengaturan awal menjadi langkah-langkah kecil, bukan satu halaman form panjang.
- **Tombol CTA** — Halaman landing page yang efektif hanya punya satu CTA utama, bukan lima.

**Panduan Implementasi:**
- Batasi pilihan navigasi utama maksimal 5–7 item
- Gunakan progressive disclosure: tampilkan opsi lanjutan hanya saat dibutuhkan
- Kelompokkan item serupa agar user scan lebih cepat
- Gunakan rekomendasi atau "pilihan terpopuler" untuk memandu keputusan

**Do's:**
- ✅ Kelompokkan pilihan dengan kategori yang jelas
- ✅ Tampilkan default/rekomendasi untuk memudahkan pilihan
- ✅ Gunakan hierarchy visual untuk membedakan pilihan utama dan sekunder

**Don'ts:**
- ❌ Jangan tampilkan semua fitur sekaligus di layar pertama
- ❌ Jangan buat dropdown dengan 30+ opsi tanpa search/filter
- ❌ Jangan letakkan 3 CTA setara berdampingan di satu halaman

---

### 2. Miller's Law

**Definisi:**
Rata-rata manusia hanya dapat menyimpan **7 ± 2 item** (5 hingga 9) dalam memori kerja (working memory) secara bersamaan.

**Prinsip Inti:**
Bukan berarti antarmuka harus dibatasi 7 item saja — melainkan konten harus di-*chunk* (dikelompokkan) agar tiap kelompok dapat diproses sebagai satu unit informasi.

**Contoh Nyata dalam UI/UX:**
- **Nomor telepon** — Ditulis `0812-3456-7890` bukan `081234567890` — chunking memudahkan pembacaan.
- **Navigasi** — Menu dengan 7 item lebih mudah diingat daripada 12 item tanpa pengelompokan.
- **Form pengisian** — Form dibagi per seksi (Data Pribadi, Alamat, Pembayaran) bukan satu kolom panjang.
- **Password indicator** — Menampilkan syarat password dalam 4–5 poin, bukan kalimat panjang.

**Panduan Implementasi:**
- Kelompokkan konten terkait dalam visual container yang sama (card, section, tab)
- Batasi item dalam satu kelompok navigasi maksimal 7 item
- Gunakan whitespace sebagai pemisah kelompok informasi
- Pada form panjang: gunakan stepper/wizard (max 3–5 langkah yang terlihat)

**Do's:**
- ✅ Gunakan chunking pada angka, kode, dan informasi panjang
- ✅ Beri label jelas pada setiap kelompok konten
- ✅ Pisahkan informasi kompleks ke dalam tab atau accordion

**Don'ts:**
- ❌ Jangan tampilkan 15 filter sekaligus tanpa pengelompokan
- ❌ Jangan buat navigasi flat dengan 12+ item tanpa kategori
- ❌ Jangan gabungkan informasi dari topik berbeda dalam satu blok teks

---

### 3. Serial Position Effect

**Definisi:**
Manusia cenderung lebih mudah mengingat item yang berada di **awal (primacy effect)** dan **akhir (recency effect)** dari sebuah daftar, dibanding item di tengah.

**Prinsip Inti:**
Posisi dalam antarmuka mempengaruhi perhatian dan ingatan user. Elemen yang paling penting harus diletakkan di posisi pertama atau terakhir.

**Contoh Nyata dalam UI/UX:**
- **Navigasi Bar** — Item terpenting (Home, CTA utama) diletakkan di awal atau akhir nav bar.
- **Bottom Navigation Mobile** — Tab yang paling sering diakses ada di posisi pertama dan terakhir.
- **Pricing Page** — Paket "paling populer" sering diletakkan di posisi akhir (atau tengah sebagai anchor).
- **Email Subject** — Kata kunci terpenting di awal kalimat subjek.
- **List Produk** — Produk unggulan tampil di posisi pertama dan terakhir dalam grid.

**Panduan Implementasi:**
- Letakkan aksi utama (CTA) di awal atau akhir halaman/flow
- Jangan letakkan informasi kritis di tengah daftar panjang
- Pada carousel/slider: item pertama dan terakhir mendapat perhatian lebih
- Gunakan posisi terakhir untuk leave a strong impression (summary, next step)

**Do's:**
- ✅ Tempatkan CTA paling penting di header DAN footer
- ✅ Mulai onboarding dengan value proposition terkuat
- ✅ Akhiri flow dengan konfirmasi yang memuaskan (success state)

**Don'ts:**
- ❌ Jangan kubur fitur utama di tengah-tengah halaman
- ❌ Jangan letakkan informasi harga/biaya tersembunyi di tengah paragraf
- ❌ Jangan akhiri flow dengan pesan yang membingungkan

---

### 4. Peak-End Rule

**Definisi:**
Manusia menilai keseluruhan sebuah pengalaman berdasarkan dua momen: **puncak emosi tertinggi** (positif atau negatif) dan **bagaimana pengalaman itu berakhir** — bukan rata-rata keseluruhan durasi.

**Prinsip Inti:**
Desain harus memastikan ada momen "wow" selama perjalanan user, dan pengalaman harus ditutup dengan kesan yang kuat dan positif.

**Contoh Nyata dalam UI/UX:**
- **Duolingo** — Animasi celebrasi setelah menyelesaikan pelajaran (peak) + streak summary di akhir (end).
- **Checkout Flow** — Halaman "Order Confirmed" dengan animasi, ringkasan order, dan next step yang jelas.
- **Onboarding** — Moment "aha" saat user pertama kali berhasil melakukan aksi utama.
- **Error Recovery** — Pesan error yang empatik + solusi langsung menciptakan peak positif dari situasi buruk.

**Panduan Implementasi:**
- Identifikasi momen emosional tertinggi dalam user journey
- Rancang success state yang memuaskan dan berkesan
- Pastikan empty state, error state, dan loading state dirancang dengan baik
- Beri reward/feedback positif di titik pencapaian user

**Do's:**
- ✅ Rancang success screen yang memorable (animasi, konfirmasi, next step)
- ✅ Buat loading state yang tidak membosankan (skeleton, ilustrasi)
- ✅ Tambahkan micro-celebration di milestone penting

**Don'ts:**
- ❌ Jangan akhiri flow penting dengan halaman kosong atau pesan datar
- ❌ Jangan biarkan error state tanpa empati dan solusi
- ❌ Jangan abaikan offboarding experience (logout, unsubscribe)

---

### 5. Zeigarnik Effect

**Definisi:**
Manusia cenderung lebih mudah mengingat **tugas yang belum selesai** dibanding tugas yang sudah diselesaikan.

**Prinsip Inti:**
Ketidaklengkapan menciptakan ketegangan kognitif yang mendorong user untuk kembali dan menyelesaikan. Ini bisa digunakan secara etis untuk meningkatkan engagement.

**Contoh Nyata dalam UI/UX:**
- **LinkedIn Profile Completeness** — "Profil Anda 70% lengkap" mendorong user mengisi sisa data.
- **Progress Bar** — Menampilkan kemajuan yang belum 100% mendorong penyelesaian.
- **Duolingo Streak** — Streak yang hampir putus mendorong user kembali membuka aplikasi.
- **Shopping Cart** — Notifikasi "Anda meninggalkan 3 item di keranjang" memanfaatkan efek ini.
- **Onboarding Checklist** — Daftar langkah setup yang belum selesai.

**Panduan Implementasi:**
- Gunakan progress indicator di semua multi-step flow
- Tunjukkan persentase penyelesaian profil/setup
- Kirim reminder yang relevan untuk tugas yang ditinggalkan (cart abandonment, form terbengkalai)
- Buat checklist onboarding yang visibel dan persistens

**Do's:**
- ✅ Tampilkan progress bar di form multi-langkah
- ✅ Simpan draft otomatis dan tunjukkan ke user saat mereka kembali
- ✅ Gunakan gamification milestone yang belum dicapai sebagai motivator

**Don'ts:**
- ❌ Jangan manipulasi dengan menciptakan "tugas palsu" yang tidak bernilai
- ❌ Jangan sembunyikan progress — selalu tampilkan posisi user dalam sebuah flow
- ❌ Jangan kirim notifikasi berlebihan; pilih momen yang relevan saja

---

## Kategori B — Hukum Visual & Persepsi

Berkaitan dengan cara mata dan otak memproses elemen visual.

---

### 6. Prinsip-Prinsip Gestalt

**Definisi:**
Serangkaian prinsip psikologi yang menjelaskan bagaimana otak manusia secara otomatis **mengorganisasi elemen visual** menjadi pola atau kelompok yang bermakna.

---

#### 6a. Law of Proximity (Kedekatan)

**Prinsip:** Elemen yang berdekatan secara spasial dipersepsikan sebagai satu kelompok.

**Contoh UI:**
- Label form yang dekat dengan input field-nya menunjukkan keduanya berhubungan.
- Icon dan teks yang berdekatan dalam navigation item terasa sebagai satu unit.
- Whitespace yang lebih besar antara dua kelompok konten menandakan pemisahan topik.

**Implementasi:** Gunakan spacing yang konsisten; beri jarak lebih besar antar kelompok daripada jarak dalam kelompok.

---

#### 6b. Law of Similarity (Kesamaan)

**Prinsip:** Elemen yang memiliki tampilan serupa (warna, bentuk, ukuran) dipersepsikan sebagai satu kelompok atau memiliki fungsi yang sama.

**Contoh UI:**
- Semua tombol primary berwarna sama → user tahu itu semua adalah aksi utama.
- Icon yang sama stylenya (filled vs outline) menandakan mereka berada di level hierarki yang sama.
- Link teks yang konsisten underline + warna biru memberi sinyal "ini dapat diklik."

**Implementasi:** Gunakan design tokens yang konsisten; jangan gunakan warna primary untuk elemen dekoratif.

---

#### 6c. Law of Closure (Penutupan)

**Prinsip:** Otak melengkapi bentuk yang tidak lengkap menjadi figur utuh yang familiar.

**Contoh UI:**
- Carousel yang "terpotong" di tepi layar memberi sinyal ada konten lagi jika di-scroll.
- Progress circle yang tidak penuh tetap dibaca sebagai "lingkaran kemajuan."
- Logo dengan bentuk tidak lengkap (seperti WWF atau NBC) tetap dikenali dengan baik.

**Implementasi:** Tunjukkan tepi konten yang terpotong untuk mengindikasikan scrollability; gunakan partial visibility secara strategis.

---

#### 6d. Law of Continuity (Kontinuitas)

**Prinsip:** Mata secara alami mengikuti garis, kurva, atau pola yang mengalir, dan menganggap elemen yang berada dalam alur tersebut saling berhubungan.

**Contoh UI:**
- Timeline vertikal menghubungkan event-event secara naratif.
- Stepper dengan garis horizontal menunjukkan urutan dan kemajuan.
- Scrolling feed membimbing mata ke bawah secara natural.

**Implementasi:** Gunakan garis atau alignment untuk menuntun mata user melalui hierarki informasi.

---

#### 6e. Law of Figure/Ground (Figur & Latar)

**Prinsip:** Otak memisahkan elemen visual menjadi "figur" (fokus) dan "latar" (background).

**Contoh UI:**
- Modal/dialog dengan overlay gelap → modal = figur, background = latar yang tertekan.
- Tooltip yang melayang di atas konten memberi kontras yang jelas antara figur dan latar.
- Card dengan shadow menciptakan ilusi kedalaman, menjadikan card sebagai figur.

**Implementasi:** Gunakan kontras, shadow, dan overlay untuk menentukan hierarki fokus secara jelas.

---

#### 6f. Law of Common Region (Wilayah Bersama)

**Prinsip:** Elemen yang berada dalam batas visual yang sama (border, background, card) dipersepsikan sebagai satu kelompok.

**Contoh UI:**
- Card komponen: semua elemen dalam card = satu entitas informasi.
- Sidebar dengan background berbeda dari main content = area yang berbeda.
- Tag/badge dalam container = bagian dari item tersebut.

**Implementasi:** Gunakan card, divider, dan background warna untuk menandakan pengelompokan konten secara eksplisit.

---

### 7. Law of Prägnanz (Kesederhanaan)

**Definisi:**
Otak manusia secara alami memilih interpretasi yang **paling sederhana dan teratur** dari stimulus visual yang ambigu.

**Prinsip Inti:**
User akan menginterpretasikan antarmuka dengan cara paling sederhana yang memungkinkan. Desain yang rumit memaksa otak bekerja lebih keras dan menimbulkan frustrasi.

**Contoh Nyata dalam UI/UX:**
- **Icon** — Icon yang dikenali secara universal (hamburger menu, magnifying glass) lebih cepat dipahami daripada icon inovatif namun asing.
- **Layout Grid** — Grid yang konsisten lebih mudah dipindai daripada layout asimetris acak.
- **Google Homepage** — Satu search bar di tengah halaman — semua elemen lain diminimalisir.

**Panduan Implementasi:**
- Gunakan icon konvensional yang sudah dikenal user (jangan reinvent)
- Pertahankan grid dan alignment yang konsisten di seluruh halaman
- Kurangi elemen dekoratif yang tidak memberi informasi atau fungsi

**Do's:**
- ✅ Prioritaskan kejelasan di atas kreativitas visual
- ✅ Gunakan pattern yang sudah familiar (login form, checkout flow standar)
- ✅ Reduce visual noise: setiap elemen harus punya alasan untuk ada

**Don'ts:**
- ❌ Jangan gunakan layout yang "unik" hanya demi diferensiasi visual
- ❌ Jangan ciptakan icon baru untuk konsep yang sudah punya simbol universal
- ❌ Jangan tambahkan dekorasi yang membingungkan hierarki informasi

---

### 8. Von Restorff Effect (Isolation Effect)

**Definisi:**
Elemen yang **berbeda secara visual** dari elemen-elemen di sekitarnya akan lebih mudah diingat dan diperhatikan.

**Prinsip Inti:**
Gunakan kontras visual untuk menonjolkan elemen yang paling penting. Satu elemen yang menonjol efektif; terlalu banyak elemen menonjol justru menghilangkan efeknya.

**Contoh Nyata dalam UI/UX:**
- **Tombol CTA** — Warna kontras tinggi di antara elemen abu-abu/putih lainnya.
- **Pricing Plan** — Satu paket di-highlight sebagai "Most Popular" dengan warna/ukuran berbeda.
- **Notification Badge** — Titik merah kecil di atas icon yang semua orang langsung lihat.
- **Sale Tag** — Harga coret merah di antara teks hitam biasa.
- **Error State** — Input field yang error berwarna merah di antara field normal.

**Panduan Implementasi:**
- Pilih SATU elemen yang paling penting untuk diberi perlakuan "berbeda"
- Gunakan warna, ukuran, atau bentuk yang kontras secara signifikan
- Pastikan elemen yang menonjol memang layak mendapat perhatian tertinggi

**Do's:**
- ✅ Gunakan satu warna aksen yang kuat untuk satu CTA utama per halaman
- ✅ Highlight rekomendasi atau pilihan default dengan visual yang berbeda jelas
- ✅ Gunakan tipografi bold/besar untuk informasi paling kritikal

**Don'ts:**
- ❌ Jangan buat 5 tombol dengan 5 warna berbeda (semuanya jadi noise)
- ❌ Jangan gunakan warna mencolok untuk elemen dekoratif
- ❌ Jangan abaikan aksesibilitas — kontras harus tetap memenuhi standar WCAG

---

### 9. Aesthetic-Usability Effect

**Definisi:**
User cenderung **mempersepsikan desain yang indah secara estetis sebagai lebih mudah digunakan**, meskipun secara fungsional tidak lebih baik.

**Prinsip Inti:**
Estetika bukan sekadar "bonus" — ia secara langsung mempengaruhi toleransi user terhadap kesalahan dan kesulitan. Desain yang indah mendapat "keringanan" lebih banyak dari user.

**Contoh Nyata dalam UI/UX:**
- **Apple Products** — User lebih toleran terhadap limitasi iOS karena antarmukanya terasa premium.
- **Airbnb** — Foto-foto berkualitas tinggi membuat user lebih percaya pada platform.
- **Stripe Dashboard** — Tampilan yang bersih dan elegan meningkatkan kepercayaan developer.
- **Notion** — Desain yang minimalis dan estetis membuat learning curve terasa tidak berat.

**Panduan Implementasi:**
- Investasi pada tipografi berkualitas tinggi — ia adalah fondasi estetika digital
- Gunakan sistem warna yang kohesif dan harmonis (tidak acak)
- Perhatikan whitespace — ruang kosong yang terencana adalah tanda desain matang
- Konsistensi visual di seluruh produk memperkuat persepsi kualitas

**Do's:**
- ✅ Gunakan foto/ilustrasi berkualitas tinggi yang relevan
- ✅ Terapkan design system yang konsisten dari komponen terkecil
- ✅ Perhatikan micro-detail: sudut rounded, shadow depth, animasi transisi

**Don'ts:**
- ❌ Jangan korbankan usability demi estetika (form yang "cantik" tapi tidak bisa diisi)
- ❌ Jangan gunakan estetika sebagai kamuflase untuk UX yang buruk
- ❌ Jangan campurkan gaya visual yang tidak konsisten (flat + skeuomorphic bersamaan)

---

## Kategori C — Hukum Interaksi

Berkaitan dengan cara user berinteraksi secara fisik dan behavioral dengan antarmuka.

---

### 10. Fitts's Law

**Definisi:**
Waktu yang dibutuhkan untuk memindahkan kursor/jari ke sebuah target adalah fungsi dari **jarak ke target** dan **ukuran target** — semakin jauh dan semakin kecil target, semakin lama.

**Formula:**
`T = a + b × log₂(2D/W)` — di mana D = jarak ke target, W = ukuran target.

**Prinsip Inti:**
Tombol penting harus besar dan mudah dijangkau. Pada layar mobile, ini berarti mempertimbangkan jangkauan ibu jari.

**Contoh Nyata dalam UI/UX:**
- **Mobile Bottom Navigation** — Diletakkan di bawah layar karena mudah dijangkau ibu jari.
- **FAB (Floating Action Button)** — Besar dan di sudut bawah kanan untuk akses mudah.
- **Tombol "Delete"** — Dibuat kecil dan jauh dari tombol utama untuk mencegah tap yang tidak disengaja.
- **Tepi Layar** — Scroll bar dan menu di tepi layar diakses lebih cepat karena target "infinite" di sisi layar.
- **Touch Target Minimum** — Google Material Design menetapkan minimum 48×48dp untuk touch target.

**Panduan Implementasi:**
- Touch target minimum: 44×44pt (Apple) atau 48×48dp (Google)
- Letakkan aksi yang sering dilakukan dalam zona jangkauan ibu jari (bottom half of screen)
- Beri jarak cukup antara tombol yang berdekatan untuk mencegah misclick
- Letakkan aksi destruktif (hapus, batalkan) jauh dari aksi utama

**Do's:**
- ✅ Buat CTA utama berukuran besar dan kontras tinggi
- ✅ Letakkan aksi primer dalam reach zone ibu jari di mobile
- ✅ Perbesar touch area icon kecil dengan padding yang tidak terlihat

**Don'ts:**
- ❌ Jangan buat tombol kecil (< 44px) untuk aksi penting
- ❌ Jangan letakkan tombol destructive berdampingan dengan tombol utama tanpa separator
- ❌ Jangan taruh navigasi utama hanya di header untuk aplikasi mobile-first

---

### 11. Jakob's Law

**Definisi:**
User menghabiskan sebagian besar waktu mereka di **produk lain** — bukan di produk Anda. Mereka datang dengan ekspektasi yang terbentuk dari produk-produk yang sudah mereka gunakan.

**Prinsip Inti:**
User ingin produk Anda bekerja dengan cara yang sama seperti produk yang sudah mereka kenal. Inovasi tanpa sebab membebani user dengan learning curve yang tidak perlu.

**Contoh Nyata dalam UI/UX:**
- **Hamburger Menu** — Sudah menjadi konvensi universal untuk menu navigasi mobile.
- **Logo di Kiri Atas** — User secara otomatis tahu ini adalah link ke homepage.
- **Ikon Keranjang** — Universalnya ikon keranjang belanja tidak perlu diubah-ubah.
- **Pull-to-Refresh** — Konvensi yang sudah tertanam dalam otot user mobile.
- **Password Tersembunyi** — User sudah terbiasa ketik karakter diganti bintang/titik.

**Panduan Implementasi:**
- Ikuti konvensi platform yang berlaku (iOS Human Interface Guidelines, Material Design)
- Jangan ubah pola interaksi yang sudah dikenal kecuali ada alasan kuat
- Jika harus berinovasi, sediakan onboarding yang menjelaskan cara baru tersebut
- Lakukan riset terhadap "mental model" user dari produk kompetitor

**Do's:**
- ✅ Gunakan pattern navigasi yang sesuai standar platform (iOS vs Android)
- ✅ Tempatkan elemen UI di lokasi yang user ekspektasikan
- ✅ Gunakan label dan terminology yang konsisten dengan industri

**Don'ts:**
- ❌ Jangan ubah posisi back button atau navigasi dasar tanpa alasan kuat
- ❌ Jangan ganti istilah umum dengan branding sendiri (misal: "Simpan" jadi "Abadikan") tanpa konteks
- ❌ Jangan inovasi UX pattern hanya untuk terlihat unik

---

### 12. Doherty Threshold

**Definisi:**
Produktivitas meningkat drastis ketika komputer merespons dalam waktu **kurang dari 400 milidetik** — respons yang lebih lambat memutus flow state user.

**Prinsip Inti:**
Kecepatan respons sistem adalah bagian dari UX. Antarmuka yang lambat — meski memiliki desain indah — merusak pengalaman secara fundamental.

**Contoh Nyata dalam UI/UX:**
- **Optimistic UI** — Tampilkan hasil aksi sebelum server konfirmasi (like/love di media sosial langsung berubah).
- **Skeleton Screen** — Tampilkan placeholder layout saat konten loading untuk mengurangi persepsi lambat.
- **Instant Search** — Google, Algolia menampilkan hasil saat user mengetik, tidak perlu tekan Enter.
- **Prefetching** — Next.js memprefetch halaman yang kemungkinan akan dikunjungi user.
- **Progress Indicator** — Jika tidak bisa cepat, tunjukkan bahwa sesuatu sedang terjadi.

**Panduan Implementasi:**
- Target respons UI: < 100ms (instan), < 400ms (ideal), > 1 detik (perlu feedback)
- Gunakan optimistic updates untuk aksi yang jarang gagal
- Implementasi skeleton screen/shimmer sebagai pengganti spinner
- Lazy load konten yang tidak kritis (gambar di bawah fold)

**Do's:**
- ✅ Tampilkan feedback instan untuk setiap interaksi user (tap/click)
- ✅ Gunakan skeleton screen daripada blank white screen saat loading
- ✅ Implementasi optimistic UI untuk like, bookmark, dan aksi umum

**Don'ts:**
- ❌ Jangan biarkan layar kosong saat loading — selalu beri feedback visual
- ❌ Jangan gunakan full-page spinner untuk aksi yang hanya memuat sebagian konten
- ❌ Jangan blokir interaksi user selama proses background berlangsung

---

### 13. Postel's Law (Robustness Principle)

**Definisi:**
"Bersikaplah konservatif dalam apa yang Anda kirimkan, dan liberal dalam apa yang Anda terima."

**Prinsip Inti:**
Sistem harus menerima input user dalam berbagai format dan kondisi (liberal/toleran), namun menghasilkan output yang terstandar, bersih, dan konsisten (konservatif/ketat).

**Contoh Nyata dalam UI/UX:**
- **Input Nomor Telepon** — Menerima format `08123456789`, `+6281234567890`, `(021) 123-4567` → sistem normalisasi sendiri.
- **Input Email** — Auto-trim spasi di awal/akhir, auto-lowercase sebelum validasi.
- **Input Tanggal** — Terima `01/06/2024`, `1 Juni 2024`, `2024-06-01` → simpan dalam format ISO standar.
- **Search** — Toleran terhadap typo, spasi berlebih, dan perbedaan huruf besar/kecil.
- **Format Harga** — Terima input `50000`, `50.000`, `50,000` → tampilkan sebagai `Rp 50.000`.

**Panduan Implementasi:**
- Jangan paksa user memasukkan data dalam format yang sangat spesifik tanpa alasan teknis
- Auto-format input saat user selesai mengetik (on-blur formatting)
- Normalisasi data di backend, bukan hanya di frontend
- Gunakan pesan error yang menunjukkan format yang diterima, bukan yang menolak

**Do's:**
- ✅ Auto-trim whitespace di semua field input
- ✅ Terima multiple format untuk tanggal dan nomor telepon
- ✅ Fuzzy search yang toleran terhadap typo ringan

**Don'ts:**
- ❌ Jangan tampilkan error "format tidak valid" untuk input yang bisa dinormalisasi
- ❌ Jangan paksa masker input yang kaku jika tidak perlu (misal: harus pakai "-" di nomor HP)
- ❌ Jangan reject email hanya karena ada huruf kapital

---

## Kategori D — Hukum Efisiensi & Desain

Berkaitan dengan prinsip efisiensi dan kesederhanaan dalam pengambilan keputusan desain.

---

### 14. Occam's Razor

**Definisi:**
Di antara beberapa solusi yang bersaing, **solusi yang paling sederhana** — yang membutuhkan asumsi dan kompleksitas paling sedikit — adalah yang terbaik.

**Prinsip Inti:**
Jangan tambahkan fitur, elemen visual, atau langkah interaksi yang tidak benar-benar dibutuhkan. Setiap kompleksitas tambahan harus justified oleh kebutuhan yang jelas.

**Contoh Nyata dalam UI/UX:**
- **Google vs Yahoo** — Google menang bukan karena lebih canggih, tapi karena lebih sederhana.
- **Signup Form** — Hanya minta email + password untuk mulai; data lain dikumpulkan kemudian.
- **Dashboard** — Tampilkan 3 metrik terpenting, bukan 20 chart sekaligus.
- **Konfirmasi Modal** — "Apakah Anda yakin?" → cukup dua tombol: Ya/Tidak. Tidak perlu 4 opsi.

**Panduan Implementasi:**
- Setiap elemen UI harus dapat dijustifikasi: "Apa yang akan hilang jika ini dihapus?"
- Mulai dari versi paling minimal, tambah hanya jika ada kebutuhan nyata
- Audit komponen secara berkala: hapus yang tidak digunakan user
- Terapkan pada copy/text: satu kalimat lebih baik dari satu paragraf jika maknanya sama

**Do's:**
- ✅ Mulai desain dengan menghapus semua yang tidak esensial
- ✅ Gunakan satu modal konfirmasi sederhana, bukan wizard 3 langkah
- ✅ Prioritaskan MVP yang bersih daripada produk penuh tapi cluttered

**Don'ts:**
- ❌ Jangan tambahkan fitur hanya karena kompetitor memilikinya
- ❌ Jangan buat animasi kompleks yang tidak memberi nilai informasional
- ❌ Jangan tampilkan semua opsi konfigurasi di layar utama

---

### 15. Parkinson's Law

**Definisi:**
"Pekerjaan mengembang untuk mengisi waktu yang tersedia untuk penyelesaiannya." Dalam konteks UX: ruang dan waktu yang diberikan akan terisi — baik oleh konten berguna maupun noise.

**Prinsip Inti:**
Batasi ruang dan waktu yang diberikan untuk suatu tugas agar user tetap fokus dan efisien. Form yang panjang akan diisi lambat; form singkat diselesaikan cepat.

**Contoh Nyata dalam UI/UX:**
- **Form Registrasi** — Form 3 field diselesaikan lebih cepat dan lebih sering daripada form 15 field.
- **Search Bar** — Width search bar yang terbatas mendorong query yang lebih presisi.
- **Timer/Countdown** — Batasan waktu di flash sale mendorong keputusan lebih cepat.
- **Character Limit** — Twitter/X 280 karakter mendorong komunikasi yang lebih padat.
- **Wizard Onboarding** — Dibagi 5 langkah singkat lebih mudah diselesaikan daripada 1 halaman panjang.

**Panduan Implementasi:**
- Rancang form sesingkat mungkin — hanya data yang benar-benar dibutuhkan saat itu
- Gunakan batasan karakter untuk mendorong konten yang lebih terfokus
- Pecah tugas besar menjadi sesi-sesi kecil yang dapat diselesaikan dalam 5 menit
- Gunakan deadline yang genuine (bukan palsu) untuk mendorong konversi

**Do's:**
- ✅ Batasi form onboarding hanya pada data esensial
- ✅ Gunakan progress step yang singkat dan jelas untuk proses panjang
- ✅ Tampilkan estimasi waktu penyelesaian ("Selesai dalam 2 menit")

**Don'ts:**
- ❌ Jangan tambahkan field "opsional" yang panjang dalam satu form tanpa pemisahan
- ❌ Jangan buat flow yang bisa diselesaikan dalam 3 langkah menjadi 10 langkah
- ❌ Jangan gunakan countdown timer palsu/evergreen yang restart setiap hari

---

## Ringkasan Referensi Cepat

| # | Hukum | Inti | Diterapkan Pada |
|---|-------|------|-----------------|
| 1 | Hick's Law | Kurangi pilihan | Navigasi, CTA, Form |
| 2 | Miller's Law | Kelompokkan informasi (7±2) | Form, Menu, Konten |
| 3 | Serial Position Effect | Letakkan penting di awal/akhir | List, Nav, Flow |
| 4 | Peak-End Rule | Rancang momen puncak & akhir yang kuat | Onboarding, Checkout, Success State |
| 5 | Zeigarnik Effect | Manfaatkan rasa "belum selesai" | Profil, Progress, Notifikasi |
| 6 | Gestalt Principles | Organisasi visual yang intuitif | Layout, Spacing, Grouping |
| 7 | Law of Prägnanz | Pilih yang paling sederhana | Icon, Layout, Pattern |
| 8 | Von Restorff Effect | Satu elemen berbeda = diingat | CTA, Badge, Error State |
| 9 | Aesthetic-Usability Effect | Desain indah = terasa lebih mudah | Seluruh visual system |
| 10 | Fitts's Law | Target besar & dekat = cepat dijangkau | Tombol, Touch Target, Mobile |
| 11 | Jakob's Law | Ikuti konvensi yang sudah dikenal | Pattern, Terminologi, Posisi |
| 12 | Doherty Threshold | Respons < 400ms | Loading, Feedback, Animation |
| 13 | Postel's Law | Toleran menerima, ketat menghasilkan | Form, Search, Input |
| 14 | Occam's Razor | Solusi termudah adalah terbaik | Fitur, Alur, Copy |
| 15 | Parkinson's Law | Batasi ruang & waktu untuk fokus | Form, Onboarding, Wizard |

---

## Panduan Kombinasi Hukum untuk Skenario Umum

### Desain Form yang Baik
→ Hick's Law + Miller's Law + Postel's Law + Parkinson's Law

### Desain Halaman Landing Page
→ Von Restorff Effect + Serial Position Effect + Aesthetic-Usability + Fitts's Law

### Desain Onboarding Flow
→ Zeigarnik Effect + Peak-End Rule + Hick's Law + Doherty Threshold

### Desain Sistem Navigasi
→ Jakob's Law + Law of Proximity + Miller's Law + Fitts's Law

### Desain Dashboard / Data Viz
→ Occam's Razor + Miller's Law + Gestalt (Similarity + Common Region) + Hick's Law

---

*Dokumen ini adalah living document — dapat diperbarui seiring dengan evolusi best practice UX.*

*Versi: 1.0 | Bahasa: Indonesia | Format: PRD Reference*
