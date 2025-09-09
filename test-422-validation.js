// Test script specifically for 422 validation errors
const BASE_URL = 'http://localhost:3001/api';

async function test422Validation() {
  console.log('🧪 Testing 422 Validation Errors...\n');

  try {
    // 1. Create a scenario with a unique name first
    console.log('1. Creating initial scenario...');
    const uniqueName = `Test Scenario ${Date.now()}`;
    const createResponse = await fetch(`${BASE_URL}/scenarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: uniqueName,
        periods: [
          { id: 1, startDate: '2025-01-01', endDate: '2025-01-31' }
        ]
      })
    });
    
    if (createResponse.ok) {
      const newScenario = await createResponse.json();
      console.log(`   ✅ Created scenario: ${newScenario.id} with name: "${uniqueName}"`);

      // 2. Try to create another scenario with the same name (should get 422)
      console.log('\n2. Testing duplicate name on CREATE (should return 422)...');
      const duplicateCreateResponse = await fetch(`${BASE_URL}/scenarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: uniqueName, // Same name as above
          periods: [
            { id: 1, startDate: '2025-02-01', endDate: '2025-02-28' }
          ]
        })
      });
      
      console.log(`   Status: ${duplicateCreateResponse.status}`);
      if (duplicateCreateResponse.status === 422) {
        const errorResponse = await duplicateCreateResponse.json();
        console.log(`   ✅ Correct 422 response: ${errorResponse.message}`);
        console.log(`   ✅ Error code: ${errorResponse.code}`);
      } else {
        console.log(`   ❌ Expected 422, got ${duplicateCreateResponse.status}`);
      }

      // 3. Create another scenario with a different name
      console.log('\n3. Creating second scenario with different name...');
      const secondName = `Second Test Scenario ${Date.now()}`;
      const secondCreateResponse = await fetch(`${BASE_URL}/scenarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: secondName,
          periods: [
            { id: 1, startDate: '2025-03-01', endDate: '2025-03-31' }
          ]
        })
      });
      
      if (secondCreateResponse.ok) {
        const secondScenario = await secondCreateResponse.json();
        console.log(`   ✅ Created second scenario: ${secondScenario.id} with name: "${secondName}"`);

        // 4. Try to update second scenario to have the same name as first (should get 422)
        console.log('\n4. Testing duplicate name on UPDATE (should return 422)...');
        const duplicateUpdateResponse = await fetch(`${BASE_URL}/scenarios/${secondScenario.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: uniqueName // Same name as first scenario
          })
        });
        
        console.log(`   Status: ${duplicateUpdateResponse.status}`);
        if (duplicateUpdateResponse.status === 422) {
          const errorResponse = await duplicateUpdateResponse.json();
          console.log(`   ✅ Correct 422 response: ${errorResponse.message}`);
          console.log(`   ✅ Error code: ${errorResponse.code}`);
        } else {
          console.log(`   ❌ Expected 422, got ${duplicateUpdateResponse.status}`);
        }

        // 5. Try to update scenario to its own name (should succeed)
        console.log('\n5. Testing update to same name (should succeed)...');
        const sameNameUpdateResponse = await fetch(`${BASE_URL}/scenarios/${secondScenario.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: secondName // Same as its current name
          })
        });
        
        console.log(`   Status: ${sameNameUpdateResponse.status}`);
        if (sameNameUpdateResponse.status === 200) {
          console.log(`   ✅ Successfully updated scenario to its own name`);
        } else {
          console.log(`   ❌ Expected 200, got ${sameNameUpdateResponse.status}`);
        }

        // 6. Test name length validation (should get 400)
        console.log('\n6. Testing name length validation (should return 400)...');
        const longName = 'A'.repeat(96); // 96 characters, exceeds 95 limit
        const longNameResponse = await fetch(`${BASE_URL}/scenarios/${secondScenario.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: longName
          })
        });
        
        console.log(`   Status: ${longNameResponse.status}`);
        if (longNameResponse.status === 400) {
          const errorResponse = await longNameResponse.json();
          console.log(`   ✅ Correct 400 response: ${errorResponse.message}`);
        } else {
          console.log(`   ❌ Expected 400, got ${longNameResponse.status}`);
        }
      }

    } else {
      console.log('   ❌ Failed to create initial scenario');
    }

    console.log('\n📊 422 Validation Test Summary:');
    console.log('   - Duplicate name on CREATE should return 422');
    console.log('   - Duplicate name on UPDATE should return 422');
    console.log('   - Update to same name should return 200');
    console.log('   - Name too long should return 400');
    console.log('   - Error message should match: "Validation error occurred while creating scenario: name already exists"');

  } catch (error) {
    console.error('❌ Error testing 422 validation:', error.message);
  }
}

// Run the test
test422Validation();