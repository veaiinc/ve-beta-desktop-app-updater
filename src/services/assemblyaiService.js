/**
 * AssemblyAI Service for uploading audio files to AssemblyAI for transcription
 * This service handles file uploads to AssemblyAI's API
 */

class AssemblyAIService {
	constructor() {
		this.baseUrl = 'https://api.assemblyai.com/v2';
		this.apiKey = null; // Will be set from environment or config
	}

	/**
	 * Set the API key for AssemblyAI
	 */
	setApiKey(apiKey) {
		this.apiKey = apiKey;
	}

	/**
	 * Upload audio file to AssemblyAI
	 * @param {string} filePath - Path to the audio file
	 * @returns {Promise<{success: boolean, uploadUrl?: string, error?: string}>}
	 */
	async uploadFile(filePath) {
		try {
			if (!this.apiKey) {
				throw new Error('AssemblyAI API key not configured');
			}

			if (!window.electronApi || !window.electronApi.fs) {
				throw new Error('Electron APIs not available');
			}

			// Read the audio file as binary data
			const fileResult = await window.electronApi.fs.readFileBinary(filePath);
			if (!fileResult.success) {
				throw new Error(`Failed to read file: ${fileResult.error}`);
			}

			// Prepare headers
			const headers = {
				authorization: this.apiKey,
				'content-type': 'application/octet-stream',
			};

			// Upload to AssemblyAI
			const response = await fetch(`${this.baseUrl}/upload`, {
				method: 'POST',
				headers: headers,
				body: fileResult.data,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`AssemblyAI upload failed: ${response.status} ${errorText}`);
			}

			const result = await response.json();
			console.log('AssemblyAI upload successful:', result.upload_url);

			return {
				success: true,
				uploadUrl: result.upload_url,
			};
		} catch (error) {
			console.error('Error uploading to AssemblyAI:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Upload audio blob directly to AssemblyAI
	 * @param {Blob} audioBlob - Audio blob to upload
	 * @returns {Promise<{success: boolean, uploadUrl?: string, error?: string}>}
	 */
	async uploadBlob(audioBlob) {
		try {
			if (!this.apiKey) {
				throw new Error('AssemblyAI API key not configured');
			}

			// Prepare headers
			const headers = {
				authorization: this.apiKey,
				'content-type': audioBlob.type || 'application/octet-stream',
			};

			// Upload to AssemblyAI
			const response = await fetch(`${this.baseUrl}/upload`, {
				method: 'POST',
				headers: headers,
				body: audioBlob,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`AssemblyAI upload failed: ${response.status} ${errorText}`);
			}

			const result = await response.json();
			console.log('AssemblyAI upload successful:', result.upload_url);

			return {
				success: true,
				uploadUrl: result.upload_url,
			};
		} catch (error) {
			console.error('Error uploading blob to AssemblyAI:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Start transcription job with AssemblyAI
	 * @param {string} uploadUrl - The upload URL from AssemblyAI
	 * @param {Object} options - Transcription options
	 * @returns {Promise<{success: boolean, transcriptionId?: string, error?: string}>}
	 */
	async startTranscription(uploadUrl, options = {}) {
		try {
			if (!this.apiKey) {
				throw new Error('AssemblyAI API key not configured');
			}

			const transcriptionData = {
				audio_url: uploadUrl,
				...options,
			};

			const response = await fetch(`${this.baseUrl}/transcript`, {
				method: 'POST',
				headers: {
					authorization: this.apiKey,
					'content-type': 'application/json',
				},
				body: JSON.stringify(transcriptionData),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`AssemblyAI transcription start failed: ${response.status} ${errorText}`,
				);
			}

			const result = await response.json();
			console.log('AssemblyAI transcription started:', result.id);

			return {
				success: true,
				transcriptionId: result.id,
			};
		} catch (error) {
			console.error('Error starting AssemblyAI transcription:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Get transcription status and results
	 * @param {string} transcriptionId - The transcription ID
	 * @returns {Promise<{success: boolean, status?: string, text?: string, error?: string}>}
	 */
	async getTranscription(transcriptionId) {
		try {
			if (!this.apiKey) {
				throw new Error('AssemblyAI API key not configured');
			}

			const response = await fetch(`${this.baseUrl}/transcript/${transcriptionId}`, {
				headers: {
					authorization: this.apiKey,
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`AssemblyAI transcription fetch failed: ${response.status} ${errorText}`,
				);
			}

			const result = await response.json();
			console.log('AssemblyAI transcription status:', result.status);

			return {
				success: true,
				status: result.status,
				text: result.text,
				confidence: result.confidence,
				words: result.words,
			};
		} catch (error) {
			console.error('Error getting AssemblyAI transcription:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Send audio URL to ngrok endpoint for meeting analytics
	 * @param {string} meetingId - The meeting ID
	 * @param {string} audioUrl - The AssemblyAI audio URL
	 * @param {string} jwtToken - JWT token for authentication
	 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
	 */
	async sendToWorkspaceAPI(meetingId, audioUrl, jwtToken) {
		try {
			if (!jwtToken) {
				throw new Error('JWT token is required');
			}

			const workspaceId = localStorage.getItem('workspaceId');
			if (!workspaceId) {
				throw new Error('Workspace ID not found');
			}

			// Get audio duration from audioStorageService
			let audioDurationSeconds = 0;
			try {
				// Import audioStorageService dynamically to avoid circular dependency
				const { default: audioStorageService } = await import('./audioStorageService.js');
				const audioResult = await audioStorageService.getAudio(meetingId);
				
				if (audioResult.success && audioResult.audioBlob) {
					// Create audio element to get duration
					const audio = new Audio();
					audio.preload = 'metadata';
					
					// Create blob URL
					const blobUrl = URL.createObjectURL(audioResult.audioBlob);
					audio.src = blobUrl;
					
					// Wait for metadata to load
					await new Promise((resolve, reject) => {
						audio.onloadedmetadata = () => {
							const durationSeconds = audio.duration;
							if (durationSeconds && !isNaN(durationSeconds) && isFinite(durationSeconds)) {
								// Use total seconds as integer
								audioDurationSeconds = Math.floor(durationSeconds);
								console.log('🎵 Audio duration calculated:', {
									durationSeconds,
									audioDurationSeconds
								});
							}
							URL.revokeObjectURL(blobUrl); // Clean up blob URL
							resolve();
						};
						audio.onerror = () => {
							URL.revokeObjectURL(blobUrl); // Clean up blob URL
							reject(new Error('Failed to load audio metadata'));
						};
					});
				}
			} catch (durationError) {
				console.warn('⚠️ Could not get audio duration:', durationError.message);
				// Continue without duration if we can't get it
			}

			const ngrokUrl = `https://lively-expert-deer.ngrok-free.app/${workspaceId}/generate_meeting_analytics`;

			const payload = {
				meeting_id: meetingId,
				audio_url: audioUrl,
				audio_duration_seconds: audioDurationSeconds
			};

			console.log('🔍 Ngrok API call details:', {
				workspaceId,
				meetingId,
				audioUrl,
				audioDurationSeconds,
				ngrokUrl,
				payload
			});

			// Send to ngrok endpoint
			const response = await fetch(ngrokUrl, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${jwtToken}`,
					'Content-Type': 'application/json',
					'ngrok-skip-browser-warning': 'true' // Skip ngrok browser warning
				},
				body: JSON.stringify(payload)
			});

			console.log('📡 Ngrok API response status:', response.status);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('❌ Ngrok API failed:', response.status, errorText);
				throw new Error(`HTTP ${response.status}: ${errorText}`);
			}

			const result = await response.json();
			console.log('✅ Ngrok API success:', result);

			return {
				success: true,
				result,
			};
		} catch (error) {
			console.error('Error sending to ngrok API:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}
}

// Create singleton instance
const assemblyAIService = new AssemblyAIService();

export default assemblyAIService;
