# QR Code Testing Guide - MAKNA Heritage App

## 📱 Perubahan Sistem QR Code

Sistem QR code telah diperbarui agar **QR code berisi UID situs** secara langsung, bukan kode string seperti sebelumnya.

### ✅ Sekarang (Benar):
- QR Code berisi: `550e8400-e29b-41d4-a716-446655440000` (UID situs)
- Sistem mencari situs berdasarkan kolom `uid` di tabel `public.situs`

### ❌ Sebelumnya (Salah):
- QR Code berisi: `BOROBUDUR_QR_2024` (string custom)
- Sistem mencari berdasarkan kolom `qr_code_data`

## 🧪 Cara Testing

### 1. Testing di Web (Manual Input)
```
1. Buka aplikasi di browser: http://localhost:8081
2. Klik tab QR Scanner
3. Masukkan UID berikut:
   - Borobudur: 550e8400-e29b-41d4-a716-446655440000
   - Prambanan: 550e8400-e29b-41d4-a716-446655440001
4. Atau gunakan tombol "Quick Test"
```

### 2. Testing di Mobile (Scan QR)
```
1. Buka file qr-generator.html di browser
2. Print atau tampilkan QR code di layar
3. Buka aplikasi MAKNA di Expo Go
4. Scan QR code yang telah di-generate
```

### 3. Generate QR Code Sendiri
Gunakan online QR generator dengan data:
- **Borobudur**: `550e8400-e29b-41d4-a716-446655440000`
- **Prambanan**: `550e8400-e29b-41d4-a716-446655440001`

## 🔧 Perubahan Teknis

### Database Schema
```sql
-- QR code sekarang menyimpan UID langsung
INSERT INTO public.situs (
  uid, 
  nama_situs, 
  qr_code_data
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Candi Borobudur',
  '550e8400-e29b-41d4-a716-446655440000'  -- UID sama dengan primary key
);
```

### API Changes
```javascript
// TripService.validateQRCode() sekarang mencari berdasarkan UID
static async validateQRCode(qrCodeData) {
  const { data, error } = await supabase
    .from('situs')
    .select('*')
    .eq('uid', qrCodeData)  // Cari berdasarkan UID, bukan qr_code_data
    .single();
}
```

### Function Changes
```sql
-- start_trip() function diupdate
CREATE OR REPLACE FUNCTION start_trip(p_profile_id uuid, p_qr_code_data text)
-- p_qr_code_data sekarang adalah UID situs langsung
v_situs_uid := p_qr_code_data::uuid;  -- Convert string to UUID
```

## 📋 Testing Checklist

- [ ] Web version dapat memvalidasi UID dengan benar
- [ ] Mobile version dapat scan QR code berisi UID
- [ ] Detail situs muncul setelah scan/input UID valid
- [ ] Error message muncul untuk UID yang tidak valid
- [ ] Trip dapat dimulai setelah konfirmasi di detail screen
- [ ] Database menyimpan trip dengan benar

## 🚀 Expected Flow

1. **Scan QR Code** → UID terdeteksi (misal: `550e8400-e29b-41d4-a716-446655440000`)
2. **Validate UID** → System cek di tabel `situs` dengan kolom `uid`
3. **Show Detail** → Tampilkan `SitusQRDetailScreen` dengan info lengkap
4. **Start Trip** → User konfirmasi dan trip dimulai

## 🐛 Troubleshooting

### "QR Code Tidak Valid"
- Pastikan UID format benar (36 karakter UUID)
- Cek apakah UID ada di database tabel `situs`
- Gunakan UID test yang disediakan

### "Situs tidak ditemukan"
- Pastikan database sudah di-setup dengan data sample
- Jalankan script `setup-clean.sql` untuk reset data

### Error saat start trip
- Pastikan user sudah login atau gunakan mock user
- Cek koneksi database Supabase
