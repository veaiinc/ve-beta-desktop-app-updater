#!/usr/bin/env node

/**
 * LIGHTNING FAST Performance Test
 * Tests the performance optimizations
 */

const { spawn } = require('child_process');
const path = require('path');

async function testPerformance() {
    console.log('🧪 Testing performance optimizations...');
    
    const tests = [
        {
            name: 'Startup Speed Test',
            command: ['npm', ['run', 'dev:fast']],
            timeout: 15000,
            success: 'App started in under 15 seconds'
        },
        {
            name: 'Memory Usage Test',
            command: ['node', ['scripts/performance-monitor.js']],
            timeout: 10000,
            success: 'Memory usage is optimized'
        },
        {
            name: 'IPC Response Test',
            command: ['node', ['scripts/test-app-responsiveness.js']],
            timeout: 5000,
            success: 'IPC responses are fast'
        }
    ];
    
    for (const test of tests) {
        console.log(`\n🔍 Running ${test.name}...`);
        
        try {
            const result = await runTest(test);
            if (result.success) {
                console.log(`✅ ${test.success}`);
            } else {
                console.log(`❌ ${test.name} failed: ${result.error}`);
            }
        } catch (error) {
            console.log(`❌ ${test.name} failed: ${error.message}`);
        }
    }
    
    console.log('\n🎉 Performance testing completed!');
}

function runTest(test) {
    return new Promise((resolve) => {
        const process = spawn(test.command[0], test.command[1], {
            cwd: path.join(__dirname, '..'),
            stdio: 'pipe'
        });
        
        let output = '';
        let errorOutput = '';
        
        process.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        process.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        const timeout = setTimeout(() => {
            process.kill();
            resolve({ success: false, error: 'Test timeout' });
        }, test.timeout);
        
        process.on('close', (code) => {
            clearTimeout(timeout);
            resolve({ 
                success: code === 0, 
                error: code !== 0 ? errorOutput : null,
                output 
            });
        });
    });
}

if (require.main === module) {
    testPerformance().catch(console.error);
}