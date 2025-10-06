#!/usr/bin/env node

/**
 * Performance Testing Script
 * Tests the app performance after optimizations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Performance Test Suite...\n');

// Test configurations
const tests = [
	{
		name: 'Build Performance',
		command: 'npm run build',
		timeout: 300000, // 5 minutes
		description: 'Tests build time and bundle size'
	},
	{
		name: 'Development Start',
		command: 'timeout 30s npm run dev || true',
		timeout: 60000, // 1 minute
		description: 'Tests development server startup time'
	},
	{
		name: 'NotchDrop Build',
		command: 'npm run build:notchdrop:all',
		timeout: 120000, // 2 minutes
		description: 'Tests NotchDrop native addon build performance'
	}
];

// Performance metrics
const metrics = {
	startTime: Date.now(),
	tests: [],
	summary: {
		passed: 0,
		failed: 0,
		totalTime: 0
	}
};

// Run individual test
async function runTest(test) {
	console.log(`\n📋 Running: ${test.name}`);
	console.log(`📝 ${test.description}`);
	console.log(`⏱️  Timeout: ${test.timeout / 1000}s`);
	
	const testStartTime = Date.now();
	
	try {
		const result = execSync(test.command, {
			timeout: test.timeout,
			encoding: 'utf8',
			cwd: process.cwd()
		});
		
		const testDuration = Date.now() - testStartTime;
		
		console.log(`✅ PASSED: ${test.name} (${testDuration}ms)`);
		
		metrics.tests.push({
			name: test.name,
			status: 'PASSED',
			duration: testDuration,
			output: result
		});
		
		metrics.summary.passed++;
		
	} catch (error) {
		const testDuration = Date.now() - testStartTime;
		
		console.log(`❌ FAILED: ${test.name} (${testDuration}ms)`);
		console.log(`Error: ${error.message}`);
		
		metrics.tests.push({
			name: test.name,
			status: 'FAILED',
			duration: testDuration,
			error: error.message
		});
		
		metrics.summary.failed++;
	}
}

// Analyze bundle size
function analyzeBundleSize() {
	console.log('\n📊 Analyzing Bundle Size...');
	
	const buildDir = path.join(process.cwd(), 'build');
	
	if (!fs.existsSync(buildDir)) {
		console.log('❌ Build directory not found. Run build first.');
		return;
	}
	
	const files = fs.readdirSync(buildDir, { recursive: true });
	let totalSize = 0;
	const fileSizes = [];
	
	files.forEach(file => {
		const filePath = path.join(buildDir, file);
		if (fs.statSync(filePath).isFile()) {
			const size = fs.statSync(filePath).size;
			totalSize += size;
			fileSizes.push({
				name: file,
				size: size,
				sizeKB: Math.round(size / 1024)
			});
		}
	});
	
	// Sort by size
	fileSizes.sort((a, b) => b.size - a.size);
	
	console.log(`📦 Total Bundle Size: ${Math.round(totalSize / 1024 / 1024)}MB`);
	console.log('\n📋 Largest Files:');
	fileSizes.slice(0, 10).forEach(file => {
		console.log(`  ${file.name}: ${file.sizeKB}KB`);
	});
	
	// Check for performance issues
	const jsFiles = fileSizes.filter(f => f.name.endsWith('.js'));
	const largeJsFiles = jsFiles.filter(f => f.sizeKB > 500);
	
	if (largeJsFiles.length > 0) {
		console.log('\n⚠️  Large JavaScript files detected:');
		largeJsFiles.forEach(file => {
			console.log(`  ${file.name}: ${file.sizeKB}KB`);
		});
	}
	
	return {
		totalSize,
		fileSizes,
		largeFiles: largeJsFiles
	};
}

// Check for performance anti-patterns
function checkPerformanceAntiPatterns() {
	console.log('\n🔍 Checking for Performance Anti-patterns...');
	
	const issues = [];
	
	// Check for excessive @Published properties in Swift
	const swiftFiles = findFiles('notchdrop-addon/src', '.swift');
	swiftFiles.forEach(file => {
		const content = fs.readFileSync(file, 'utf8');
		const publishedCount = (content.match(/@Published/g) || []).length;
		
		if (publishedCount > 20) {
			issues.push({
				type: 'Swift Performance',
				file: file,
				issue: `Too many @Published properties: ${publishedCount}`,
				severity: publishedCount > 50 ? 'HIGH' : 'MEDIUM'
			});
		}
	});
	
	// Check for excessive useEffect in React
	const reactFiles = findFiles('src', '.jsx');
	reactFiles.forEach(file => {
		const content = fs.readFileSync(file, 'utf8');
		const useEffectCount = (content.match(/useEffect/g) || []).length;
		
		if (useEffectCount > 10) {
			issues.push({
				type: 'React Performance',
				file: file,
				issue: `Too many useEffect hooks: ${useEffectCount}`,
				severity: useEffectCount > 20 ? 'HIGH' : 'MEDIUM'
			});
		}
	});
	
	// Check for synchronous file operations in Electron
	const electronFiles = findFiles('electron', '.js');
	electronFiles.forEach(file => {
		const content = fs.readFileSync(file, 'utf8');
		const syncOps = (content.match(/fs\.(readFileSync|writeFileSync|existsSync|statSync)/g) || []).length;
		
		if (syncOps > 5) {
			issues.push({
				type: 'Electron Performance',
				file: file,
				issue: `Too many synchronous file operations: ${syncOps}`,
				severity: syncOps > 10 ? 'HIGH' : 'MEDIUM'
			});
		}
	});
	
	if (issues.length > 0) {
		console.log('\n⚠️  Performance Issues Found:');
		issues.forEach(issue => {
			console.log(`  [${issue.severity}] ${issue.type}: ${issue.file}`);
			console.log(`    ${issue.issue}`);
		});
	} else {
		console.log('✅ No major performance anti-patterns detected');
	}
	
	return issues;
}

// Helper function to find files
function findFiles(dir, extension) {
	const files = [];
	
	function walkDir(currentPath) {
		const items = fs.readdirSync(currentPath);
		
		items.forEach(item => {
			const fullPath = path.join(currentPath, item);
			const stat = fs.statSync(fullPath);
			
			if (stat.isDirectory()) {
				walkDir(fullPath);
			} else if (item.endsWith(extension)) {
				files.push(fullPath);
			}
		});
	}
	
	walkDir(dir);
	return files;
}

// Generate performance report
function generateReport() {
	const totalTime = Date.now() - metrics.startTime;
	metrics.summary.totalTime = totalTime;
	
	console.log('\n📊 Performance Test Report');
	console.log('=' .repeat(50));
	console.log(`⏱️  Total Time: ${Math.round(totalTime / 1000)}s`);
	console.log(`✅ Passed: ${metrics.summary.passed}`);
	console.log(`❌ Failed: ${metrics.summary.failed}`);
	
	console.log('\n📋 Test Results:');
	metrics.tests.forEach(test => {
		const status = test.status === 'PASSED' ? '✅' : '❌';
		console.log(`  ${status} ${test.name}: ${test.duration}ms`);
	});
	
	// Save report to file
	const reportPath = path.join(process.cwd(), 'performance-report.json');
	fs.writeFileSync(reportPath, JSON.stringify(metrics, null, 2));
	console.log(`\n📄 Report saved to: ${reportPath}`);
}

// Main execution
async function main() {
	try {
		// Run performance tests
		for (const test of tests) {
			await runTest(test);
		}
		
		// Analyze bundle size
		analyzeBundleSize();
		
		// Check for anti-patterns
		checkPerformanceAntiPatterns();
		
		// Generate report
		generateReport();
		
		console.log('\n🎉 Performance testing completed!');
		
	} catch (error) {
		console.error('\n💥 Performance testing failed:', error.message);
		process.exit(1);
	}
}

// Run if called directly
if (require.main === module) {
	main();
}

module.exports = {
	runTest,
	analyzeBundleSize,
	checkPerformanceAntiPatterns,
	generateReport
};
