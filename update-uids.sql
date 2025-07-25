-- Update script untuk memastikan UID sesuai dengan yang ditest
-- Jalankan di Supabase SQL Editor

-- Update UID untuk Candi Borobudur
UPDATE public.situs 
SET uid = '01234567-89ab-cdef-0123-456789abcdef'
WHERE nama = 'Candi Borobudur';

-- Update UID untuk Candi Prambanan  
UPDATE public.situs 
SET uid = 'fedcba98-7654-3210-fedc-ba9876543210'
WHERE nama = 'Candi Prambanan';

-- Verify the updates
SELECT uid, nama, deskripsi 
FROM public.situs 
ORDER BY nama;

-- Check if UIDs are exactly as expected
SELECT 
  uid,
  nama,
  CASE 
    WHEN uid = '01234567-89ab-cdef-0123-456789abcdef' THEN '✅ Borobudur UID Correct'
    WHEN uid = 'fedcba98-7654-3210-fedc-ba9876543210' THEN '✅ Prambanan UID Correct'
    ELSE '❌ UID Mismatch'
  END as status
FROM public.situs;
