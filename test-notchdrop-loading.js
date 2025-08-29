const path = require('path');

console.log('🧪 Testing NotchDrop Addon Loading...\n');

try {
    console.log('1. Testing direct require...');
    const NotchDropAddonWrapper = require('./notchdrop-addon/index.js');
    console.log('✅ Direct require successful');
    
    console.log('2. Creating instance...');
    const notchDrop = new NotchDropAddonWrapper();
    console.log('✅ Instance created successfully');
    
    console.log('3. Initializing...');
    notchDrop.initialize();
    console.log('✅ Initialization successful');
    
    console.log('4. Testing show...');
    notchDrop.show();
    console.log('✅ Show command successful');
    
    console.log('5. Checking visibility...');
    const isVisible = notchDrop.isVisible();
    console.log(`   - Is visible: ${isVisible}`);
    
    console.log('6. Getting status...');
    const status = notchDrop.getStatus();
    console.log(`   - Status: ${status}`);
    
    console.log('\n🎉 All tests passed! NotchDrop should be visible now.');
    console.log('Press Ctrl+C to exit...');
    
} catch (error) {
    console.error('❌ Error:', error);
    console.error('Stack trace:', error.stack);
}
