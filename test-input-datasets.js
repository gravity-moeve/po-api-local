// Quick test for input datasets persistence
const BASE_URL = 'http://localhost:3001';

async function testInputDatasetPersistence() {
  console.log('🧪 Testing Input Dataset Persistence...\n');

  try {
    // Test 1: Try to get a dataset that doesn't exist
    console.log('1. Testing GET for non-existent dataset...');
    const getResponse1 = await fetch(`${BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset`);
    console.log(`   Status: ${getResponse1.status}`);
    if (getResponse1.status === 404) {
      console.log('   ✅ Correctly returns 404 for non-existent dataset\n');
    } else {
      console.log('   ❌ Expected 404 but got different status\n');
    }

    // Test 2: Save a dataset
    console.log('2. Testing PUT to save dataset...');
    const testDataset = {
      tableId: 'domesticDemandForecast',
      title: 'Test Domestic Demand Forecast',
      rows: [
        { period: 1, location: 'Madrid', product: 'Gasoline', volume: 1000, price: 1.5, minVolume: 500 },
        { period: 2, location: 'Barcelona', product: 'Diesel', volume: 2000, price: 1.3, minVolume: 800 }
      ]
    };

    const putResponse = await fetch(`${BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testDataset)
    });

    console.log(`   Status: ${putResponse.status}`);
    if (putResponse.ok) {
      const putData = await putResponse.json();
      console.log('   ✅ Dataset saved successfully');
      console.log(`   📊 Saved ${putData.rowCount} rows at ${putData.updatedAt}\n`);
    } else {
      const error = await putResponse.text();
      console.log(`   ❌ Failed to save dataset: ${error}\n`);
    }

    // Test 3: Retrieve the saved dataset
    console.log('3. Testing GET for saved dataset...');
    const getResponse2 = await fetch(`${BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset`);
    console.log(`   Status: ${getResponse2.status}`);
    
    if (getResponse2.ok) {
      const getData = await getResponse2.json();
      console.log('   ✅ Dataset retrieved successfully');
      console.log(`   📊 Retrieved ${getData.rows.length} rows`);
      console.log(`   📝 Title: ${getData.title}\n`);
    } else {
      console.log('   ❌ Failed to retrieve dataset\n');
    }

    // Test 4: Test validation - tableId mismatch
    console.log('4. Testing validation - tableId mismatch...');
    const invalidDataset = {
      tableId: 'importOpportunities', // Different from URL
      title: 'Invalid Dataset',
      rows: []
    };

    const validationResponse = await fetch(`${BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidDataset)
    });

    console.log(`   Status: ${validationResponse.status}`);
    if (validationResponse.status === 400) {
      console.log('   ✅ Correctly validates tableId mismatch\n');
    } else {
      console.log('   ❌ Expected 400 for tableId mismatch\n');
    }

    console.log('🎉 Input Dataset Persistence tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testInputDatasetPersistence();