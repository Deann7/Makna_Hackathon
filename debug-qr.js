// Debug helper untuk testing QR Code validation
// Buka browser console dan jalankan fungsi ini untuk test

// Import libraries yang diperlukan
const testQRValidation = async () => {
  console.log('🔧 Starting QR Code validation test...');
  
  const testUIDs = [
    '550e8400-e29b-41d4-a716-446655440000', // Borobudur
    '550e8400-e29b-41d4-a716-446655440001', // Prambanan
    'invalid-uid-test'                        // Invalid UID
  ];

  for (const uid of testUIDs) {
    console.log(`\n📋 Testing UID: ${uid}`);
    
    try {
      // Simulate what the app does
      const response = await fetch('/api/validate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCodeData: uid })
      });
      
      const result = await response.json();
      console.log(`✅ Result for ${uid}:`, result);
      
    } catch (error) {
      console.error(`❌ Error testing ${uid}:`, error);
    }
  }
};

// Alternative: Direct Supabase test (jika Supabase client tersedia)
const testSupabaseDirect = async () => {
  if (typeof supabase === 'undefined') {
    console.error('❌ Supabase client not available');
    return;
  }

  console.log('🔧 Testing direct Supabase connection...');
  
  try {
    // Test 1: Get all situs
    console.log('\n📋 Test 1: Fetching all situs...');
    const { data: allSitus, error: allError } = await supabase
      .from('situs')
      .select('*');
    
    console.log('All situs:', allSitus);
    if (allError) console.error('Error:', allError);

    // Test 2: Test specific UID
    const testUID = '550e8400-e29b-41d4-a716-446655440000';
    console.log(`\n📋 Test 2: Testing specific UID: ${testUID}`);
    
    const { data: specificSitus, error: specificError } = await supabase
      .from('situs')
      .select('*')
      .eq('uid', testUID)
      .single();
      
    console.log('Specific situs:', specificSitus);
    if (specificError) console.error('Error:', specificError);

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
};

// Log instructions
console.log(`
🔧 QR Code Debug Helper Loaded!

Available functions:
1. testQRValidation() - Test QR validation through API
2. testSupabaseDirect() - Test direct Supabase queries

Usage:
- Open browser console
- Run: testSupabaseDirect()
- Check the results

Test UIDs:
- Borobudur: 550e8400-e29b-41d4-a716-446655440000
- Prambanan: 550e8400-e29b-41d4-a716-446655440001
`);

// Make functions available globally
window.testQRValidation = testQRValidation;
window.testSupabaseDirect = testSupabaseDirect;
