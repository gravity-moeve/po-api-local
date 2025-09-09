// Simple test script to verify API endpoints
const BASE_URL = 'http://localhost:3001/api';

async function testEndpoints() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test GET /scenarios
    console.log('1. Testing GET /scenarios');
    const scenariosResponse = await fetch(`${BASE_URL}/scenarios`);
    console.log(`   Status: ${scenariosResponse.status}`);
    if (scenariosResponse.ok) {
      const scenarios = await scenariosResponse.json();
      console.log(`   Found ${scenarios.length} scenarios`);
    }

    // Test GET /scenarios/statuses
    console.log('\n2. Testing GET /scenarios/statuses');
    const statusesResponse = await fetch(`${BASE_URL}/scenarios/statuses`);
    console.log(`   Status: ${statusesResponse.status}`);

    // Test POST /scenarios (create new scenario)
    console.log('\n3. Testing POST /scenarios');
    const createResponse = await fetch(`${BASE_URL}/scenarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Scenario API Update',
        periods: [
          { id: 1, startDate: '2025-01-01', endDate: '2025-01-31' }
        ]
      })
    });
    console.log(`   Status: ${createResponse.status}`);
    
    if (createResponse.ok) {
      const newScenario = await createResponse.json();
      console.log(`   Created scenario with ID: ${newScenario.id}`);
      
      // Test PUT /scenarios/{id} (update scenario name)
      console.log('\n4. Testing PUT /scenarios/{id}');
      const updateResponse = await fetch(`${BASE_URL}/scenarios/${newScenario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Updated Test Scenario Name'
        })
      });
      console.log(`   Status: ${updateResponse.status}`);
      
      // Test POST /scenarios/{id}/duplicate
      console.log('\n5. Testing POST /scenarios/{id}/duplicate');
      const duplicateResponse = await fetch(`${BASE_URL}/scenarios/${newScenario.id}/duplicate`, {
        method: 'POST'
      });
      console.log(`   Status: ${duplicateResponse.status}`);
      
      // Test POST /scenarios/{id}/run
      console.log('\n6. Testing POST /scenarios/{id}/run');
      const runResponse = await fetch(`${BASE_URL}/scenarios/${newScenario.id}/run`, {
        method: 'POST'
      });
      console.log(`   Status: ${runResponse.status}`);
      
      // Test POST /scenarios/{id}/cancel
      console.log('\n7. Testing POST /scenarios/{id}/cancel');
      const cancelResponse = await fetch(`${BASE_URL}/scenarios/${newScenario.id}/cancel`, {
        method: 'POST'
      });
      console.log(`   Status: ${cancelResponse.status}`);
    }

    console.log('\n✅ API testing completed!');
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

// Run tests
testEndpoints();