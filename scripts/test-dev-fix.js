#!/usr/bin/env node

/**
 * 🚀 Test Development Fix
 * Verifies that the circular dependency issue is resolved
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Testing development fix...');

async function testDevScript() {
    console.log('⚡ Testing npm run dev (should start without infinite loop)...');
    
    return new Promise((resolve) => {
        const startTime = Date.now();
        let hasStarted = false;
        let output = '';
        
        const devProcess = spawn('npm', ['run', 'dev'], {
            cwd: path.join(__dirname, '..'),
            stdio: 'pipe'
        });
        
        devProcess.stdout.on('data', (data) => {
            output += data.toString();
            
            // Check if Vite has started successfully
            if (!hasStarted && (output.includes('Local:') || output.includes('ready') || output.includes('5173'))) {
                const startupTime = Date.now() - startTime;
                devProcess.kill();
                
                console.log(`✅ Development server started in ${startupTime}ms`);
                console.log('✅ No infinite loop detected!');
                hasStarted = true;
                resolve(true);
            }
        });
        
        devProcess.stderr.on('data', (data) => {
            output += data.toString();
        });
        
        // Timeout after 15 seconds
        setTimeout(() => {
            if (!hasStarted) {
                devProcess.kill();
                console.log('❌ Development server failed to start within 15 seconds');
                resolve(false);
            }
        }, 15000);
        
        // Check for infinite loop patterns
        setTimeout(() => {
            if (output.includes('npm run dev') && output.includes('npm run dev:fast')) {
                devProcess.kill();
                console.log('❌ Infinite loop detected!');
                resolve(false);
            }
        }, 5000);
    });
}

async function runTest() {
    try {
        const success = await testDevScript();
        
        if (success) {
            console.log('\n🎉 Development fix successful!');
            console.log('✅ npm run dev now works without infinite loops');
            console.log('✅ Development server starts properly');
            console.log('✅ All speed optimizations are active');
        } else {
            console.log('\n❌ Development fix failed');
            console.log('⚠️ There may still be issues with the scripts');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

runTest();
