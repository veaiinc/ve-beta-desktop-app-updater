/**
 * Utility functions for handling browser permissions
 */

export const checkMicrophonePermission = async () => {
	try {
		// Check if navigator.permissions is available
		if (navigator.permissions) {
			const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
			return {
				granted: permissionStatus.state === 'granted',
				denied: permissionStatus.state === 'denied',
				prompt: permissionStatus.state === 'prompt',
				state: permissionStatus.state
			};
		}
		
		// Fallback: try to access microphone directly
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			stream.getTracks().forEach(track => track.stop());
			return { granted: true, state: 'granted' };
		} catch (error) {
			return { granted: false, denied: true, state: 'denied' };
		}
	} catch (error) {
		console.error('Error checking microphone permission:', error);
		return { granted: false, state: 'unknown' };
	}
};

export const requestMicrophonePermission = async (constraints = { audio: true }) => {
	try {
		console.log('Requesting microphone permission with constraints:', constraints);
		const stream = await navigator.mediaDevices.getUserMedia(constraints);
		
		// Stop the stream immediately - we just needed permission
		stream.getTracks().forEach(track => track.stop());
		console.log('Microphone permission granted successfully');
		
		return { success: true, stream: null };
	} catch (error) {
		console.error('Microphone permission request failed:', error);
		
		let errorMessage = 'Microphone access denied. ';
		
		if (error.name === 'NotAllowedError') {
			errorMessage += 'Please allow microphone access in your browser settings and try again.';
		} else if (error.name === 'NotFoundError') {
			errorMessage += 'No microphone found. Please connect a microphone and try again.';
		} else if (error.name === 'NotReadableError') {
			errorMessage += 'Microphone is being used by another application. Please close other applications and try again.';
		} else {
			errorMessage += 'Please check your microphone settings and try again.';
		}
		
		return { 
			success: false, 
			error: error.name,
			message: errorMessage
		};
	}
};

export const getMicrophoneDevices = async () => {
	try {
		const devices = await navigator.mediaDevices.enumerateDevices();
		return devices.filter(device => device.kind === 'audioinput');
	} catch (error) {
		console.error('Error getting microphone devices:', error);
		return [];
	}
};

export const requestAndTestMicrophoneAccess = async () => {
	console.log('=== Requesting and Testing Microphone Access ===');
	
	// 1. Check if getUserMedia is available
	console.log('navigator.mediaDevices available:', !!navigator.mediaDevices);
	console.log('getUserMedia available:', !!navigator.mediaDevices?.getUserMedia);
	
	if (!navigator.mediaDevices?.getUserMedia) {
		return {
			success: false,
			error: { name: 'NotSupportedError', message: 'getUserMedia is not supported in this browser' },
			needsPermission: false
		};
	}
	
	// 2. Check current permission state (if available)
	let currentPermissionState = 'unknown';
	if (navigator.permissions) {
		try {
			const permission = await navigator.permissions.query({ name: 'microphone' });
			currentPermissionState = permission.state;
			console.log('Current permission state:', permission.state);
		} catch (e) {
			console.log('Permission query failed, will attempt direct access:', e.message);
		}
	}
	
	// 3. If permission is already denied, inform user they need to manually enable it
	if (currentPermissionState === 'denied') {
		return {
			success: false,
			error: { 
				name: 'PermissionPreviouslyDenied', 
				message: 'Microphone permission was previously denied. Please enable it manually in your browser or system settings.' 
			},
			needsPermission: true,
			needsManualEnable: true
		};
	}
	
	// 4. Attempt to request microphone access (this will prompt user if needed)
	try {
		console.log('Requesting microphone access with LiveKit constraints...');
		const stream = await navigator.mediaDevices.getUserMedia({ 
			audio: {
				sampleRate: 16000,
				channelCount: 1,
				echoCancellation: true,
				noiseSuppression: true,
				autoGainControl: true,
			}
		});
		
		console.log('✅ Microphone access successful');
		console.log('Audio tracks:', stream.getAudioTracks().length);
		
		// Log track details
		stream.getAudioTracks().forEach((track, index) => {
			console.log(`Track ${index}:`, {
				kind: track.kind,
				label: track.label,
				enabled: track.enabled,
				muted: track.muted,
				readyState: track.readyState,
				settings: track.getSettings?.() || 'Not available',
				constraints: track.getConstraints?.() || 'Not available'
			});
		});
		
		// Test audio activity detection briefly
		if (stream.getAudioTracks().length > 0) {
			try {
				const audioContext = new (window.AudioContext || window.webkitAudioContext)();
				const source = audioContext.createMediaStreamSource(stream);
				const analyser = audioContext.createAnalyser();
				source.connect(analyser);
				
				const dataArray = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(dataArray);
				const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
				console.log('Audio activity level:', average);
				
				await audioContext.close();
			} catch (audioError) {
				console.log('Audio context test failed, but microphone access successful:', audioError);
			}
		}
		
		// Clean up the test stream
		stream.getTracks().forEach(track => track.stop());
		
		return { success: true, needsPermission: false };
		
	} catch (error) {
		console.log('❌ Microphone access failed:');
		console.log('Error name:', error.name);
		console.log('Error message:', error.message);
		console.log('Error constraint:', error.constraint);
		
		// Analyze the error and provide appropriate response
		let needsPermission = false;
		let needsManualEnable = false;
		let troubleshootingTips = [];
		
		if (error.name === 'NotAllowedError') {
			needsPermission = true;
			// If user just denied the permission prompt, they need to enable it manually
			needsManualEnable = true;
			troubleshootingTips.push('🔧 Microphone permission denied');
			troubleshootingTips.push('🔧 Look for a microphone icon in your browser\'s address bar and click "Allow"');
			troubleshootingTips.push('🔧 On macOS: System Preferences > Privacy & Security > Microphone');
			troubleshootingTips.push('🔧 You may need to restart the app after granting system permissions');
		} else if (error.name === 'NotFoundError') {
			troubleshootingTips.push('🔧 No microphone device found');
			troubleshootingTips.push('🔧 Check if microphone is properly connected');
			troubleshootingTips.push('🔧 Try a different microphone or USB port');
		} else if (error.name === 'NotReadableError') {
			troubleshootingTips.push('🔧 Microphone is being used by another application');
			troubleshootingTips.push('🔧 Close other apps that might be using the microphone');
			troubleshootingTips.push('🔧 Check for background recording apps');
		} else if (error.name === 'OverconstrainedError') {
			troubleshootingTips.push('🔧 Microphone constraints not supported');
			troubleshootingTips.push('🔧 Try with different audio settings');
		} else {
			troubleshootingTips.push('🔧 Unknown error - check browser console for details');
		}
		
		console.log('Troubleshooting tips:');
		troubleshootingTips.forEach(tip => console.log(tip));
		
		return { 
			success: false, 
			error, 
			troubleshootingTips, 
			needsPermission,
			needsManualEnable
		};
	}
};

// Keep the original debug function for troubleshooting
export const debugMicrophoneAccess = requestAndTestMicrophoneAccess;

export const checkClipboardPermission = async () => {
	try {
		// Check if navigator.permissions is available
		if (navigator.permissions) {
			const permissionStatus = await navigator.permissions.query({ name: 'clipboard-write' });
			return {
				granted: permissionStatus.state === 'granted',
				denied: permissionStatus.state === 'denied',
				prompt: permissionStatus.state === 'prompt',
				state: permissionStatus.state
			};
		}
		
		// Fallback: check if clipboard API is available
		if (navigator.clipboard && navigator.clipboard.writeText) {
			return { granted: true, state: 'granted' };
		}
		
		return { granted: false, state: 'unknown' };
	} catch (error) {
		console.error('Error checking clipboard permission:', error);
		return { granted: false, state: 'unknown' };
	}
};

export const requestClipboardPermission = async () => {
	try {
		console.log('Requesting clipboard permission...');
		
		// Try to write a test string to clipboard
		await navigator.clipboard.writeText('test');
		console.log('Clipboard permission granted successfully');
		
		return { success: true };
	} catch (error) {
		console.error('Clipboard permission request failed:', error);
		
		let errorMessage = 'Clipboard access denied. ';
		
		if (error.name === 'NotAllowedError') {
			errorMessage += 'Please allow clipboard access in your browser settings and try again.';
		} else {
			errorMessage += 'Please check your browser settings and try again.';
		}
		
		return { 
			success: false, 
			error: error.name,
			message: errorMessage
		};
	}
};

export const requestAndTestClipboardAccess = async () => {
	console.log('=== Requesting and Testing Clipboard Access ===');
	
	// 1. Check if clipboard API is available
	console.log('navigator.clipboard available:', !!navigator.clipboard);
	console.log('clipboard.writeText available:', !!navigator.clipboard?.writeText);
	
	if (!navigator.clipboard?.writeText) {
		return {
			success: false,
			error: { name: 'NotSupportedError', message: 'Clipboard API is not supported in this browser' },
			needsPermission: false
		};
	}
	
	// 2. Check current permission state (if available)
	let currentPermissionState = 'unknown';
	if (navigator.permissions) {
		try {
			const permission = await navigator.permissions.query({ name: 'clipboard-write' });
			currentPermissionState = permission.state;
			console.log('Current clipboard permission state:', permission.state);
		} catch (e) {
			console.log('Clipboard permission query failed, will attempt direct access:', e.message);
		}
	}
	
	// 3. If permission is already denied, inform user they need to manually enable it
	if (currentPermissionState === 'denied') {
		return {
			success: false,
			error: { 
				name: 'PermissionPreviouslyDenied', 
				message: 'Clipboard permission was previously denied. Please enable it manually in your browser settings.' 
			},
			needsPermission: true,
			needsManualEnable: true
		};
	}
	
	// 4. Attempt to request clipboard access (this will prompt user if needed)
	try {
		console.log('Requesting clipboard access...');
		await navigator.clipboard.writeText(''); // Empty string test
		
		console.log('✅ Clipboard access successful');
		return { success: true, needsPermission: false };
		
	} catch (error) {
		console.log('❌ Clipboard access failed:');
		console.log('Error name:', error.name);
		console.log('Error message:', error.message);
		
		// Analyze the error and provide appropriate response
		let needsPermission = false;
		let needsManualEnable = false;
		let troubleshootingTips = [];
		
		if (error.name === 'NotAllowedError') {
			needsPermission = true;
			needsManualEnable = true;
			troubleshootingTips.push('🔧 Clipboard permission denied');
			troubleshootingTips.push('🔧 Look for a clipboard icon in your browser\'s address bar and click "Allow"');
			troubleshootingTips.push('🔧 Check your browser\'s site permissions settings');
		} else {
			troubleshootingTips.push('🔧 Unknown error - check browser console for details');
		}
		
		console.log('Troubleshooting tips:');
		troubleshootingTips.forEach(tip => console.log(tip));
		
		return { 
			success: false, 
			error, 
			troubleshootingTips, 
			needsPermission,
			needsManualEnable
		};
	}
};

export const testLiveKitCompatibility = async () => {
	console.log('=== LiveKit Compatibility Test ===');
	
	try {
		// Test LiveKit-specific constraints
		const liveKitConstraints = {
			audio: {
				sampleRate: 16000,
				channelCount: 1,
				echoCancellation: true,
				noiseSuppression: true,
				autoGainControl: true,
			}
		};
		
		console.log('Testing with LiveKit constraints:', liveKitConstraints);
		const stream = await navigator.mediaDevices.getUserMedia(liveKitConstraints);
		
		const audioTrack = stream.getAudioTracks()[0];
		if (audioTrack) {
			const settings = audioTrack.getSettings();
			console.log('✅ LiveKit compatible settings achieved:', {
				sampleRate: settings.sampleRate,
				channelCount: settings.channelCount,
				echoCancellation: settings.echoCancellation,
				noiseSuppression: settings.noiseSuppression,
				autoGainControl: settings.autoGainControl,
			});
			
			// Check if settings match what was requested
			const settingsMatch = {
				sampleRate: settings.sampleRate === 16000,
				channelCount: settings.channelCount === 1,
				echoCancellation: settings.echoCancellation === true,
				noiseSuppression: settings.noiseSuppression === true,
				autoGainControl: settings.autoGainControl === true,
			};
			
			console.log('Settings compatibility:', settingsMatch);
			const allMatch = Object.values(settingsMatch).every(match => match);
			console.log(allMatch ? '✅ All LiveKit constraints satisfied' : '⚠️ Some constraints not fully satisfied');
		}
		
		stream.getTracks().forEach(track => track.stop());
		return { success: true, compatible: true };
		
	} catch (error) {
		console.log('❌ LiveKit compatibility test failed:', error.name, error.message);
		return { success: false, error };
	}
};