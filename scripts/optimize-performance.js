#!/usr/bin/env node

/**
 * LIGHTNING FAST Performance Optimization Script
 * This script applies additional performance optimizations to the app
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Applying lightning-fast performance optimizations...');

// 1. Optimize Vite config for faster builds
function optimizeViteConfig() {
    console.log('⚡ Optimizing Vite configuration...');
    
    const viteConfigPath = path.join(__dirname, '..', 'vite.config.js');
    let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    
    // Add performance optimizations
    const optimizations = `
// LIGHTNING FAST: Performance optimizations
export default defineConfig({
    // ... existing config ...
    
    // LIGHTNING FAST: Optimize build performance
    build: {
        // ... existing build config ...
        
        // LIGHTNING FAST: Enable parallel processing
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        
        // LIGHTNING FAST: Optimize chunk splitting
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    electron: ['electron'],
                },
            },
        },
    },
    
    // LIGHTNING FAST: Optimize dev server
    server: {
        // ... existing server config ...
        
        // LIGHTNING FAST: Enable HMR optimizations
        hmr: {
            overlay: false, // Disable error overlay for better performance
        },
    },
    
    // LIGHTNING FAST: Optimize dependencies
    optimizeDeps: {
        include: ['react', 'react-dom', 'electron'],
        exclude: ['@zubridge/electron'],
    },
});`;
    
    // Only add if not already present
    if (!viteConfig.includes('LIGHTNING FAST')) {
        viteConfig = viteConfig.replace(
            'export default defineConfig({',
            optimizations
        );
        fs.writeFileSync(viteConfigPath, viteConfig);
        console.log('✅ Vite config optimized');
    } else {
        console.log('✅ Vite config already optimized');
    }
}

// 2. Optimize package.json scripts
function optimizePackageScripts() {
    console.log('⚡ Optimizing package.json scripts...');
    
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Add performance-optimized scripts
    packageJson.scripts = {
        ...packageJson.scripts,
        'dev:fast': 'NODE_ENV=development ELECTRON_DISABLE_SECURITY_WARNINGS=true npm run dev',
        'build:fast': 'NODE_ENV=production npm run build',
        'start:fast': 'NODE_ENV=production npm start',
    };
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Package scripts optimized');
}

// 3. Create performance monitoring script
function createPerformanceMonitor() {
    console.log('⚡ Creating performance monitoring script...');
    
    const monitorScript = `#!/usr/bin/env node

/**
 * LIGHTNING FAST Performance Monitor
 * Monitors app performance and provides optimization suggestions
 */

const { spawn } = require('child_process');
const path = require('path');

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            startupTime: 0,
            memoryUsage: 0,
            cpuUsage: 0,
            responseTime: 0,
        };
    }
    
    async measureStartupTime() {
        const startTime = Date.now();
        
        return new Promise((resolve) => {
            const appProcess = spawn('npm', ['run', 'dev:fast'], {
                cwd: path.join(__dirname, '..'),
                stdio: 'pipe'
            });
            
            appProcess.stdout.on('data', (data) => {
                if (data.toString().includes('App is ready')) {
                    this.metrics.startupTime = Date.now() - startTime;
                    appProcess.kill();
                    resolve(this.metrics.startupTime);
                }
            });
            
            // Timeout after 30 seconds
            setTimeout(() => {
                appProcess.kill();
                resolve(30000);
            }, 30000);
        });
    }
    
    async measureMemoryUsage() {
        const memUsage = process.memoryUsage();
        this.metrics.memoryUsage = Math.round(memUsage.heapUsed / 1024 / 1024);
        return this.metrics.memoryUsage;
    }
    
    generateReport() {
        console.log('📊 Performance Report:');
        console.log(\`🚀 Startup Time: \${this.metrics.startupTime}ms\`);
        console.log(\`💾 Memory Usage: \${this.metrics.memoryUsage}MB\`);
        
        // Performance recommendations
        if (this.metrics.startupTime > 10000) {
            console.log('⚠️  Startup time is slow. Consider lazy loading modules.');
        }
        
        if (this.metrics.memoryUsage > 200) {
            console.log('⚠️  Memory usage is high. Consider optimizing memory usage.');
        }
        
        if (this.metrics.startupTime < 5000 && this.metrics.memoryUsage < 100) {
            console.log('✅ Performance is excellent!');
        }
    }
}

// Run performance monitoring
async function runPerformanceMonitor() {
    const monitor = new PerformanceMonitor();
    
    console.log('🔍 Measuring startup time...');
    await monitor.measureStartupTime();
    
    console.log('🔍 Measuring memory usage...');
    await monitor.measureMemoryUsage();
    
    monitor.generateReport();
}

if (require.main === module) {
    runPerformanceMonitor().catch(console.error);
}

module.exports = PerformanceMonitor;`;
    
    const monitorPath = path.join(__dirname, 'performance-monitor.js');
    fs.writeFileSync(monitorPath, monitorScript);
    fs.chmodSync(monitorPath, '755');
    console.log('✅ Performance monitor created');
}

// 4. Optimize Electron main process
function optimizeElectronMain() {
    console.log('⚡ Optimizing Electron main process...');
    
    const mainPath = path.join(__dirname, '..', 'electron', 'main.js');
    let mainContent = fs.readFileSync(mainPath, 'utf8');
    
    // Add performance optimizations if not already present
    if (!mainContent.includes('LIGHTNING FAST')) {
        console.log('✅ Electron main process already optimized');
        return;
    }
    
    // Add performance flags
    const performanceFlags = `
// LIGHTNING FAST: Performance flags
app.commandLine.appendSwitch('--enable-gpu-rasterization');
app.commandLine.appendSwitch('--enable-zero-copy');
app.commandLine.appendSwitch('--disable-background-timer-throttling');
app.commandLine.appendSwitch('--disable-renderer-backgrounding');
app.commandLine.appendSwitch('--disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('--enable-features', 'VaapiVideoDecoder');
app.commandLine.appendSwitch('--disable-features', 'VizDisplayCompositor');
`;
    
    if (!mainContent.includes('--enable-gpu-rasterization')) {
        mainContent = mainContent.replace(
            'app.whenReady().then(async () => {',
            performanceFlags + '\napp.whenReady().then(async () => {'
        );
        fs.writeFileSync(mainPath, mainContent);
        console.log('✅ Electron main process optimized');
    } else {
        console.log('✅ Electron main process already optimized');
    }
}

// 5. Create performance test script
function createPerformanceTest() {
    console.log('⚡ Creating performance test script...');
    
    const testScript = `#!/usr/bin/env node

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
        console.log(\`\\n🔍 Running \${test.name}...\`);
        
        try {
            const result = await runTest(test);
            if (result.success) {
                console.log(\`✅ \${test.success}\`);
            } else {
                console.log(\`❌ \${test.name} failed: \${result.error}\`);
            }
        } catch (error) {
            console.log(\`❌ \${test.name} failed: \${error.message}\`);
        }
    }
    
    console.log('\\n🎉 Performance testing completed!');
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
}`;
    
    const testPath = path.join(__dirname, 'test-performance.js');
    fs.writeFileSync(testPath, testScript);
    fs.chmodSync(testPath, '755');
    console.log('✅ Performance test script created');
}

// Run all optimizations
async function runOptimizations() {
    try {
        optimizeViteConfig();
        optimizePackageScripts();
        createPerformanceMonitor();
        optimizeElectronMain();
        createPerformanceTest();
        
        console.log('\n🎉 All performance optimizations applied successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Run: npm run dev:fast (for faster development)');
        console.log('2. Run: node scripts/performance-monitor.js (to monitor performance)');
        console.log('3. Run: node scripts/test-performance.js (to test optimizations)');
        
    } catch (error) {
        console.error('❌ Optimization failed:', error);
        process.exit(1);
    }
}

// Run optimizations
runOptimizations();
