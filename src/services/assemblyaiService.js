/**
 * AssemblyAI Service for uploading audio files to AssemblyAI for transcription
 * This service handles file uploads to AssemblyAI's API
 */

import getBaseUrl from './baseUrls.js';
import { storeActions } from '../store/store.js';

class AssemblyAIService {
	constructor() {
		this.baseUrl = 'https://api.assemblyai.com/v2';
		this.apiKey = 'f603256738e841169e8262b8b591f1bb'; // Static API key
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
	 * Send meeting ID to meeting summary API endpoint for meeting analytics
	 * @param {string} meetingId - The meeting ID
	 * @param {string} jwtToken - JWT token for authentication
	 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
	 */
	async sendToWorkspaceAPI(meetingId, jwtToken) {
		console.log('🚀 ===== SEND TO WORKSPACE API STARTED =====');
		console.log('🚀 Function called at:', new Date().toISOString());
		console.log('📋 Input parameters:', {
			meetingId,
			hasJwtToken: !!jwtToken,
			jwtTokenLength: jwtToken ? jwtToken.length : 0,
		});

		try {
			if (!jwtToken) {
				console.error('❌ JWT token is missing');
				throw new Error('JWT token is required');
			}

			const workspaceId = localStorage.getItem('workspaceId');
			console.log('🏢 Workspace ID from localStorage:', workspaceId);

			if (!workspaceId) {
				console.error('❌ Workspace ID not found in localStorage');
				console.log('🔍 Available localStorage keys:', Object.keys(localStorage));
				throw new Error('Workspace ID not found');
			}

			const meetingSummaryApiUrl = getBaseUrl({ type: 'meeting_summary_api' });
			const apiUrl = `${meetingSummaryApiUrl}/${workspaceId}/generate_meeting_analytics`;

			console.log('🏗️ ===== API URL DEBUG =====');
			console.log('🏗️ meetingSummaryApiUrl:', meetingSummaryApiUrl);
			console.log('🏗️ workspaceId:', workspaceId);
			console.log('🏗️ Full API URL:', apiUrl);
			console.log('🏗️ ==========================');

			console.log('🏗️ ===== BUILDING PAYLOAD =====');
			console.log('🏗️ meeting_id:', meetingId);

			const payload = {
				meeting_id: meetingId,
			};

			console.log('🏗️ ===== PAYLOAD CREATED =====');
			console.log('🏗️ Full payload object:', payload);
			console.log('🏗️ JSON stringified payload:', JSON.stringify(payload, null, 2));
			console.log('🏗️ =============================');

			if (window?.zubridge && window?.electronApi) {
				window.zubridge.dispatch({
					type: storeActions.meeting.ADD_SUMMARY_IN_PROGRESS,
					payload: meetingId,
				});
			}

			// Send to meeting summary API endpoint
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${jwtToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			if (window?.zubridge && window?.electronApi) {
				window.zubridge.dispatch({
					type: storeActions.meeting.REMOVE_SUMMARY_IN_PROGRESS,
					payload: meetingId,
				});
			}

			console.log('📡 Meeting Summary API response status:', response.status);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('❌ Meeting Summary API failed:', response.status, errorText);
				throw new Error(`HTTP ${response.status}: ${errorText}`);
			}

			const result = await response.json();
			console.log('✅ Meeting Summary API success:', result);

			return {
				success: true,
				result,
			};
		} catch (error) {
			console.error('Error sending to meeting summary API:', error);
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
