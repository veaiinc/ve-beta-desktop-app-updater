#!/usr/bin/env node

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
        console.log(`🚀 Startup Time: ${this.metrics.startupTime}ms`);
        console.log(`💾 Memory Usage: ${this.metrics.memoryUsage}MB`);
        
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

module.exports = PerformanceMonitor;