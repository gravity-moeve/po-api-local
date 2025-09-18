// Test CSV upload functionality
const BASE_URL = 'http://localhost:3001';

async function testCsvUpload() {
  console.log('🧪 Testing CSV Upload Functionality...\n');

  try {
    // Test 1: Upload CSV with JSON payload
    console.log('1. Testing CSV upload with JSON payload...');
    const csvData = `period,location,product,volume,price,minVolume
1,Madrid,Gasoline,1500,1.45,750
2,Barcelona,Diesel,2200,1.32,900
3,Valencia,Gasoline,1800,1.48,800`;

    const jsonResponse = await fetch(`${BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset/upload-csv`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvData })
    });

    console.log(`   Status: ${jsonResponse.status}`);
    if (jsonResponse.ok) {
      const result = await jsonResponse.json();
      console.log('   ✅ CSV uploaded successfully via JSON');
      console.log(`   📊 Processed: ${result.processed}, Replaced: ${result.replaced}`);
      console.log(`   ⚠️  Errors: ${result.errors.length}, Warnings: ${result.warnings.length}\n`);
    } else {
      const error = await jsonResponse.text();
      console.log(`   ❌ Failed to upload CSV: ${error}\n`);
    }

    // Test 2: Verify the data was saved
    console.log('2. Verifying uploaded data...');
    const getResponse = await fetch(`${BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset`);
    
    if (getResponse.ok) {
      const dataset = await getResponse.json();
      console.log('   ✅ Data retrieved successfully');
      console.log(`   📊 Rows: ${dataset.rows.length}`);
      console.log(`   📝 Title: ${dataset.title}`);
      console.log(`   🔍 First row:`, dataset.rows[0]);
    } else {
      console.log('   ❌ Failed to retrieve uploaded data');
    }

    // Test 3: Upload CSV with direct text/csv content
    console.log('\n3. Testing CSV upload with direct CSV content...');
    const directCsvData = `period,location,product,volume,price,minVolume
1,Sevilla,Gasoline,1200,1.50,600
2,Bilbao,Diesel,1900,1.35,850`;

    const directResponse = await fetch(`${BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset/upload-csv`, {
      method: 'PUT',
      headers: { 'Content-Type': 'text/csv' },
      body: directCsvData
    });

    console.log(`   Status: ${directResponse.status}`);
    if (directResponse.ok) {
      const result = await directResponse.json();
      console.log('   ✅ CSV uploaded successfully via direct content');
      console.log(`   📊 Processed: ${result.processed}, Replaced: ${result.replaced}\n`);
    } else {
      const error = await directResponse.text();
      console.log(`   ❌ Failed to upload CSV: ${error}\n`);
    }

    // Test 4: Test error handling - invalid CSV
    console.log('4. Testing error handling with invalid CSV...');
    const invalidCsv = `period,location,product
1,Madrid
2,Barcelona,Diesel,Extra,Column`;

    const errorResponse = await fetch(`${BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset/upload-csv`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvData: invalidCsv })
    });

    console.log(`   Status: ${errorResponse.status}`);
    if (errorResponse.ok) {
      const result = await errorResponse.json();
      console.log('   ✅ Error handling works correctly');
      console.log(`   ⚠️  Errors: ${result.errors.length}`);
      console.log(`   📝 Error messages:`, result.errors.slice(0, 3));
    }

    // Test 5: Test with empty CSV
    console.log('\n5. Testing with empty CSV...');
    const emptyResponse = await fetch(`${BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset/upload-csv`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvData: '' })
    });

    if (emptyResponse.ok) {
      const result = await emptyResponse.json();
      console.log('   ✅ Empty CSV handled correctly');
      console.log(`   📝 Errors:`, result.errors);
    }

    console.log('\n🎉 CSV Upload tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCsvUpload();