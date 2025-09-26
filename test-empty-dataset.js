// Test the new empty dataset behavior
const BASE_URL = 'http://localhost:3001';

async function testEmptyDatasetBehavior() {
  console.log('🧪 Testing Empty Dataset with Selectors...\n');

  try {
    // Test 1: Get a dataset that doesn't exist (should return empty with selectors)
    console.log('1. Testing GET for non-existent dataset (should return empty with selectors)...');
    const response = await fetch(`${BASE_URL}/api/scenarios/scenario_1758622924016/inputs/domesticDemandForecast/dataset`);
    
    console.log(`   Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Success! Got response with selectors');
      console.log(`   📊 Table ID: ${data.tableId}`);
      console.log(`   📝 Title: ${data.title}`);
      console.log(`   📋 Rows count: ${data.rows.length}`);
      console.log(`   🎛️  Selectors available: ${Object.keys(data.selectors || {}).join(', ')}`);
      
      if (data.rows.length === 0 && data.selectors) {
        console.log('   ✅ Perfect! Empty rows but selectors are present');
      } else {
        console.log('   ⚠️  Unexpected: Either has rows or missing selectors');
      }
    } else {
      const error = await response.text();
      console.log(`   ❌ Failed: ${error}`);
    }

    // Test 2: Test with invalid scenario (should return 404)
    console.log('\n2. Testing with invalid scenario (should return 404)...');
    const invalidResponse = await fetch(`${BASE_URL}/api/scenarios/nonexistent/inputs/domesticDemandForecast/dataset`);
    
    console.log(`   Status: ${invalidResponse.status}`);
    if (invalidResponse.status === 404) {
      console.log('   ✅ Correctly returns 404 for invalid scenario');
    } else {
      console.log('   ❌ Expected 404 for invalid scenario');
    }

    // Test 3: Test with invalid table ID (should return 400)
    console.log('\n3. Testing with invalid table ID (should return 400)...');
    const invalidTableResponse = await fetch(`${BASE_URL}/api/scenarios/scenario_1758622924016/inputs/invalidTable/dataset`);
    
    console.log(`   Status: ${invalidTableResponse.status}`);
    if (invalidTableResponse.status === 400) {
      console.log('   ✅ Correctly returns 400 for invalid table ID');
    } else {
      console.log('   ❌ Expected 400 for invalid table ID');
    }

    console.log('\n🎉 Empty Dataset with Selectors tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testEmptyDatasetBehavior();