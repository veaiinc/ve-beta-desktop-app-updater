// Test script for permission overlay
// This can be run in the browser console to test the permission overlay

console.log('🧪 Testing Permission Overlay...');

// Test 1: Check if permission API is available
console.log('1. Checking permission API availability...');
if (window.electronApi?.permission) {
	console.log('✅ Permission API is available');
} else {
	console.log('❌ Permission API is not available');
}

// Test 2: Show permission window
console.log('2. Showing permission window...');
window.electronApi?.permission
	?.showWindow()
	.then((result) => {
		console.log('✅ Permission window shown:', result);
	})
	.catch((error) => {
		console.log('❌ Error showing permission window:', error);
	});

// Test 3: Check window visibility
setTimeout(() => {
	console.log('3. Checking window visibility...');
	window.electronApi?.permission
		?.isWindowVisible()
		.then((result) => {
			console.log('✅ Window visibility:', result);
		})
		.catch((error) => {
			console.log('❌ Error checking visibility:', error);
		});
}, 1000);

// Test 4: Hide window after 5 seconds
setTimeout(() => {
	console.log('4. Hiding permission window...');
	window.electronApi?.permission
		?.hideWindow()
		.then((result) => {
			console.log('✅ Permission window hidden:', result);
		})
		.catch((error) => {
			console.log('❌ Error hiding permission window:', error);
		});
}, 5000);

console.log('🧪 Permission overlay tests completed!');
