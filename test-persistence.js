// Test script for data persistence
const BASE_URL = 'http://localhost:3001/api';

async function testPersistence() {
  console.log('🧪 Testing Data Persistence...\n');

  try {
    // 1. Get initial scenarios count
    console.log('1. Getting initial scenarios...');
    const initialResponse = await fetch(`${BASE_URL}/scenarios`);
    const initialScenarios = await initialResponse.json();
    console.log(`   Initial count: ${initialScenarios.length} scenarios`);

    // 2. Create a new scenario
    console.log('\n2. Creating new scenario...');
    const createResponse = await fetch(`${BASE_URL}/scenarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Persistence Test ${Date.now()}`,
        periods: [
          { id: 1, startDate: '2025-01-01', endDate: '2025-01-31' }
        ]
      })
    });
    
    if (createResponse.ok) {
      const newScenario = await createResponse.json();
      console.log(`   ✅ Created scenario: ${newScenario.id}`);

      // 3. Verify it was persisted
      console.log('\n3. Verifying persistence...');
      const verifyResponse = await fetch(`${BASE_URL}/scenarios`);
      const updatedScenarios = await verifyResponse.json();
      console.log(`   Updated count: ${updatedScenarios.length} scenarios`);
      
      if (updatedScenarios.length === initialScenarios.length + 1) {
        console.log('   ✅ Scenario successfully persisted!');
      } else {
        console.log('   ❌ Persistence failed!');
      }

      // 4. Update the scenario name
      console.log('\n4. Testing scenario update...');
      const updateResponse = await fetch(`${BASE_URL}/scenarios/${newScenario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Updated Persistence Test ${Date.now()}`
        })
      });
      
      if (updateResponse.ok) {
        console.log('   ✅ Scenario name updated successfully!');
      }

      // 5. Duplicate the scenario
      console.log('\n5. Testing scenario duplication...');
      const duplicateResponse = await fetch(`${BASE_URL}/scenarios/${newScenario.id}/duplicate`, {
        method: 'POST'
      });
      
      if (duplicateResponse.ok) {
        const duplicatedScenario = await duplicateResponse.json();
        console.log(`   ✅ Scenario duplicated: ${duplicatedScenario.id}`);
      }

      // 6. Final count check
      console.log('\n6. Final verification...');
      const finalResponse = await fetch(`${BASE_URL}/scenarios`);
      const finalScenarios = await finalResponse.json();
      console.log(`   Final count: ${finalScenarios.length} scenarios`);
      
      console.log('\n📊 Persistence Test Results:');
      console.log(`   - Initial: ${initialScenarios.length} scenarios`);
      console.log(`   - After create: ${updatedScenarios.length} scenarios`);
      console.log(`   - Final: ${finalScenarios.length} scenarios`);
      console.log(`   - Expected final: ${initialScenarios.length + 2} scenarios`);
      
      if (finalScenarios.length === initialScenarios.length + 2) {
        console.log('   ✅ All persistence operations successful!');
      } else {
        console.log('   ❌ Some persistence operations failed!');
      }

    } else {
      console.log('   ❌ Failed to create scenario');
    }

  } catch (error) {
    console.error('❌ Error testing persistence:', error.message);
  }
}

// Run the test
testPersistence();