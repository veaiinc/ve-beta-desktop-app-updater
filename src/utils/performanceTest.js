// 🧪 Performance Test Utility
// Run this to test memory stability over time

class PerformanceTest {
    constructor() {
        this.startTime = Date.now();
        this.initialMemory = this.getMemoryUsage();
        this.testInterval = null;
        this.results = [];
    }

    getMemoryUsage() {
        if (window.performance && window.performance.memory) {
            return {
                used: Math.round(window.performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(window.performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(window.performance.memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    }

    startTest(durationMinutes = 30) {
        console.log('🧪 Starting performance test...');
        console.log(`📊 Initial memory: ${this.initialMemory?.used || 'N/A'}MB`);
        
        this.testInterval = setInterval(() => {
            const currentMemory = this.getMemoryUsage();
            const elapsedMinutes = (Date.now() - this.startTime) / 60000;
            
            if (currentMemory) {
                const result = {
                    time: elapsedMinutes.toFixed(1),
                    memory: currentMemory.used,
                    growth: currentMemory.used - this.initialMemory.used
                };
                
                this.results.push(result);
                console.log(`⏱️ ${result.time}min: ${result.memory}MB (${result.growth > 0 ? '+' : ''}${result.growth}MB)`);
                
                // Alert if memory grows too much
                if (result.growth > 100) {
                    console.warn(`⚠️ Memory growth: ${result.growth}MB - this might indicate a leak`);
                }
            }
            
            // Stop test after duration
            if (elapsedMinutes >= durationMinutes) {
                this.stopTest();
            }
        }, 60000); // Check every minute
    }

    stopTest() {
        if (this.testInterval) {
            clearInterval(this.testInterval);
            this.testInterval = null;
        }
        
        const finalMemory = this.getMemoryUsage();
        const totalGrowth = finalMemory ? finalMemory.used - this.initialMemory.used : 0;
        
        console.log('🏁 Performance test completed!');
        console.log(`📊 Final memory: ${finalMemory?.used || 'N/A'}MB`);
        console.log(`📈 Total growth: ${totalGrowth}MB`);
        console.log(`⏱️ Test duration: ${((Date.now() - this.startTime) / 60000).toFixed(1)} minutes`);
        
        // Grade the performance
        if (totalGrowth < 50) {
            console.log('✅ EXCELLENT: Memory usage is stable!');
        } else if (totalGrowth < 100) {
            console.log('✅ GOOD: Memory usage is acceptable');
        } else if (totalGrowth < 200) {
            console.log('⚠️ FAIR: Some memory growth detected');
        } else {
            console.log('❌ POOR: Significant memory leaks detected');
        }
        
        return {
            initialMemory: this.initialMemory,
            finalMemory: finalMemory,
            totalGrowth: totalGrowth,
            duration: (Date.now() - this.startTime) / 60000,
            results: this.results
        };
    }
}

// Export for use in console
window.PerformanceTest = PerformanceTest;

// Quick test function
window.testPerformance = (minutes = 30) => {
    const test = new PerformanceTest();
    test.startTest(minutes);
    return test;
};

console.log('🧪 Performance test utility loaded!');
console.log('💡 Usage: testPerformance(30) // Test for 30 minutes');
console.log('💡 Or: new PerformanceTest().startTest(60) // Test for 60 minutes');

