/**
 * Audio Storage Service for managing meeting audio files locally
 * Uses Electron's file system APIs for secure local storage
 */

import assemblyAIService from './assemblyaiService.js';

class AudioStorageService {
	constructor() {
		this.isElectron = window.electronApi && window.electronApi.fs;
		this.basePath = ''; // Base path is already handled by Electron main process
	}

	/**
	 * Get the audio directory path for a specific meeting
	 */
	getAudioDirectoryPath(meetingId) {
		return `${meetingId}/audio`;
	}

	/**
	 * Get the audio file path for a specific meeting
	 */
	getAudioFilePath(meetingId) {
		return `${this.getAudioDirectoryPath(meetingId)}/recording.webm`;
	}

	/**
	 * Get the metadata file path for a specific meeting
	 */
	getMetadataFilePath(meetingId) {
		return `${this.getAudioDirectoryPath(meetingId)}/metadata.json`;
	}

	/**
	 * Save audio blob to local file system
	 */
	async saveAudio(meetingId, audioBlob) {
		try {
			if (!this.isElectron) {
				throw new Error('Electron APIs not available');
			}

			const audioDir = this.getAudioDirectoryPath(meetingId);
			const audioFilePath = this.getAudioFilePath(meetingId);
			const metadataPath = this.getMetadataFilePath(meetingId);

			// Create directory if it doesn't exist
			await window.electronApi.fs.ensureDir(audioDir);

			// Convert blob to buffer
			const arrayBuffer = await audioBlob.arrayBuffer();
			const buffer = new Uint8Array(arrayBuffer);

			// Save audio file
			await window.electronApi.fs.writeFile(audioFilePath, buffer);

			// Create and save metadata
			// Determine file extension and format from blob type
			const mimeType = audioBlob.type || 'audio/webm';
			const format = mimeType.includes('webm')
				? 'webm'
				: mimeType.includes('mp4')
				? 'mp4'
				: mimeType.includes('wav')
				? 'wav'
				: 'webm';
			const extension =
				format === 'webm'
					? 'webm'
					: format === 'mp4'
					? 'm4a'
					: format === 'wav'
					? 'wav'
					: 'webm';

			const metadata = {
				meetingId,
				fileName: `recording.${extension}`,
				filePath: audioFilePath,
				fileSize: audioBlob.size,
				format: format,
				mimeType: mimeType,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			const metadataJson = JSON.stringify(metadata, null, 2);
			console.log('AudioStorageService: Writing metadata JSON:', metadataJson);
			// Write as string directly
			await window.electronApi.fs.writeFile(metadataPath, metadataJson);

			console.log('Audio saved successfully:', audioFilePath);
			return {
				success: true,
				filePath: audioFilePath,
				metadata,
			};
		} catch (error) {
			console.error('Error saving audio:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Get audio file for a specific meeting
	 */
	async getAudio(meetingId) {
		try {
			if (!this.isElectron) {
				throw new Error('Electron APIs not available');
			}

			const audioFilePath = this.getAudioFilePath(meetingId);
			const metadataPath = this.getMetadataFilePath(meetingId);

			// Check if files exist
			const audioExistsResult = await window.electronApi.fs.exists(audioFilePath);
			const metadataExistsResult = await window.electronApi.fs.exists(metadataPath);
			const audioExists = audioExistsResult.success && audioExistsResult.exists;
			const metadataExists = metadataExistsResult.success && metadataExistsResult.exists;

			if (!audioExists || !metadataExists) {
				return {
					success: false,
					error: 'Audio file not found',
				};
			}

			// Read metadata
			const metadataResult = await window.electronApi.fs.readFile(metadataPath);
			if (!metadataResult.success) {
				throw new Error(metadataResult.error || 'Failed to read metadata');
			}
			// Data is now returned as string from main process
			let metadataString = metadataResult.data;

			console.log('AudioStorageService: Raw metadata string:', metadataString);
			console.log('AudioStorageService: Raw metadata length:', metadataString.length);

			// Trim any whitespace and newlines
			metadataString = metadataString.trim();

			// Fix common JSON issues
			// Remove extra closing braces at the end
			metadataString = metadataString.replace(/}+$/, '}');
			// Remove any trailing commas before closing braces
			metadataString = metadataString.replace(/,(\s*[}\]])/g, '$1');

			let metadata;
			try {
				metadata = JSON.parse(metadataString);
			} catch (parseError) {
				console.error('AudioStorageService: JSON parse error:', parseError);
				console.error(
					'AudioStorageService: Raw data that failed to parse:',
					JSON.stringify(metadataString),
				);
				console.error(
					'AudioStorageService: Character at position 306:',
					metadataString.charAt(306),
				);
				console.error(
					'AudioStorageService: Characters around position 306:',
					metadataString.substring(300, 310),
				);
				throw new Error(`Failed to parse metadata JSON: ${parseError.message}`);
			}

			// Read audio file as binary
			const audioResult = await window.electronApi.fs.readFileBinary(audioFilePath);
			if (!audioResult.success) {
				throw new Error(audioResult.error || 'Failed to read audio file');
			}
			console.log('AudioStorageService: Audio file data type:', typeof audioResult.data);
			console.log('AudioStorageService: Audio file data length:', audioResult.data?.length);
			const audioBlob = new Blob([audioResult.data], {
				type: metadata.mimeType || 'audio/webm',
			});
			console.log('AudioStorageService: Created audio blob size:', audioBlob.size);

			return {
				success: true,
				audioBlob,
				metadata,
				// Note: audioUrl will be created in the component to ensure it's fresh
			};
		} catch (error) {
			console.error('Error getting audio:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Get audio metadata for a specific meeting
	 */
	async getAudioMetadata(meetingId) {
		try {
			if (!this.isElectron) {
				throw new Error('Electron APIs not available');
			}

			const metadataPath = this.getMetadataFilePath(meetingId);
			const existsResult = await window.electronApi.fs.exists(metadataPath);
			const exists = existsResult.success && existsResult.exists;

			if (!exists) {
				return {
					success: false,
					error: 'Metadata not found',
				};
			}

			const metadataResult = await window.electronApi.fs.readFile(metadataPath);
			if (!metadataResult.success) {
				throw new Error(metadataResult.error || 'Failed to read metadata');
			}
			// Data is now returned as string from main process
			let metadataString = metadataResult.data;

			console.log('AudioStorageService: Raw metadata string (getMetadata):', metadataString);
			console.log(
				'AudioStorageService: Raw metadata length (getMetadata):',
				metadataString.length,
			);

			// Trim any whitespace and newlines
			metadataString = metadataString.trim();

			// Fix common JSON issues
			// Remove extra closing braces at the end
			metadataString = metadataString.replace(/}+$/, '}');
			// Remove any trailing commas before closing braces
			metadataString = metadataString.replace(/,(\s*[}\]])/g, '$1');

			let metadata;
			try {
				metadata = JSON.parse(metadataString);
			} catch (parseError) {
				console.error('AudioStorageService: JSON parse error (getMetadata):', parseError);
				console.error(
					'AudioStorageService: Raw data that failed to parse (getMetadata):',
					JSON.stringify(metadataString),
				);
				throw new Error(`Failed to parse metadata JSON: ${parseError.message}`);
			}

			return {
				success: true,
				metadata,
			};
		} catch (error) {
			console.error('Error getting audio metadata:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Check if audio exists for a specific meeting
	 */
	async hasAudio(meetingId) {
		try {
			if (!this.isElectron) {
				console.log('AudioStorageService: Not in Electron environment');
				return false;
			}

			console.log('AudioStorageService: Checking if audio exists for meeting:', meetingId);
			const audioFilePath = this.getAudioFilePath(meetingId);
			const metadataPath = this.getMetadataFilePath(meetingId);
			console.log('AudioStorageService: Audio file path:', audioFilePath);
			console.log('AudioStorageService: Metadata file path:', metadataPath);

			const audioExistsResult = await window.electronApi.fs.exists(audioFilePath);
			const metadataExistsResult = await window.electronApi.fs.exists(metadataPath);
			const audioExists = audioExistsResult.success && audioExistsResult.exists;
			const metadataExists = metadataExistsResult.success && metadataExistsResult.exists;

			console.log(
				'AudioStorageService: Audio exists:',
				audioExists,
				'Metadata exists:',
				metadataExists,
			);
			return audioExists && metadataExists;
		} catch (error) {
			console.error('Error checking audio existence:', error);
			return false;
		}
	}

	/**
	 * Delete audio files for a specific meeting
	 */
	async deleteAudio(meetingId) {
		try {
			if (!this.isElectron) {
				throw new Error('Electron APIs not available');
			}

			const audioDir = this.getAudioDirectoryPath(meetingId);
			const existsResult = await window.electronApi.fs.exists(audioDir);
			const exists = existsResult.success && existsResult.exists;

			if (exists) {
				await window.electronApi.fs.remove(audioDir);
				console.log('Audio deleted successfully for meeting:', meetingId);
			}

			return {
				success: true,
			};
		} catch (error) {
			console.error('Error deleting audio:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Get download URL for audio file
	 */
	async getDownloadUrl(meetingId) {
		try {
			const result = await this.getAudio(meetingId);

			if (!result.success) {
				return {
					success: false,
					error: result.error,
				};
			}

			return {
				success: true,
				downloadUrl: result.audioUrl,
				fileName: `meeting-${meetingId}-recording.webm`,
				metadata: result.metadata,
			};
		} catch (error) {
			console.error('Error getting download URL:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Get all meetings with audio recordings
	 */
	async getAllMeetingsWithAudio() {
		try {
			if (!this.isElectron) {
				return {
					success: false,
					error: 'Electron APIs not available',
				};
			}

			const meetingsDir = '.'; // Root directory since base path is handled by Electron
			const existsResult = await window.electronApi.fs.exists(meetingsDir);
			const exists = existsResult.success && existsResult.exists;

			if (!exists) {
				return {
					success: true,
					meetings: [],
				};
			}

			const readdirResult = await window.electronApi.fs.readdir(meetingsDir);
			if (!readdirResult.success) {
				throw new Error(readdirResult.error || 'Failed to read directory');
			}
			const meetingDirs = readdirResult.files;
			const meetingsWithAudio = [];

			for (const meetingId of meetingDirs) {
				const hasAudio = await this.hasAudio(meetingId);
				if (hasAudio) {
					const metadataResult = await this.getAudioMetadata(meetingId);
					if (metadataResult.success) {
						meetingsWithAudio.push({
							meetingId,
							metadata: metadataResult.metadata,
						});
					}
				}
			}

			return {
				success: true,
				meetings: meetingsWithAudio,
			};
		} catch (error) {
			console.error('Error getting meetings with audio:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Upload audio file to AssemblyAI for transcription
	 * @param {string} meetingId - Meeting ID
	 * @param {string} apiKey - AssemblyAI API key
	 * @returns {Promise<{success: boolean, uploadUrl?: string, error?: string}>}
	 */
	async uploadToAssemblyAI(meetingId, apiKey) {
		try {
			if (!this.isElectron) {
				throw new Error('Electron APIs not available');
			}

			// Check if audio exists for this meeting
			const hasAudio = await this.hasAudio(meetingId);
			if (!hasAudio) {
				throw new Error('No audio recording found for this meeting');
			}

			// Get the audio file path
			const audioFilePath = this.getAudioFilePath(meetingId);

			// Set API key in AssemblyAI service
			assemblyAIService.setApiKey(apiKey);

			// Upload to AssemblyAI
			const uploadResult = await assemblyAIService.uploadFile(audioFilePath);

			if (uploadResult.success) {
				console.log('Audio uploaded to AssemblyAI successfully:', uploadResult.uploadUrl);

				// Update metadata with AssemblyAI upload info
				const metadataResult = await this.getAudioMetadata(meetingId);
				if (metadataResult.success) {
					const updatedMetadata = {
						...metadataResult.metadata,
						assemblyaiUploadUrl: uploadResult.uploadUrl,
						assemblyaiUploadedAt: new Date().toISOString(),
					};

					const metadataPath = this.getMetadataFilePath(meetingId);
					const metadataJson = JSON.stringify(updatedMetadata, null, 2);
					await window.electronApi.fs.writeFile(metadataPath, metadataJson);
				}
			}

			return uploadResult;
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
	 * @param {string} apiKey - AssemblyAI API key
	 * @returns {Promise<{success: boolean, uploadUrl?: string, error?: string}>}
	 */
	async uploadBlobToAssemblyAI(audioBlob, apiKey) {
		try {
			// Set API key in AssemblyAI service
			assemblyAIService.setApiKey(apiKey);

			// Upload to AssemblyAI
			const uploadResult = await assemblyAIService.uploadBlob(audioBlob);

			if (uploadResult.success) {
				console.log(
					'Audio blob uploaded to AssemblyAI successfully:',
					uploadResult.uploadUrl,
				);
			}

			return uploadResult;
		} catch (error) {
			console.error('Error uploading blob to AssemblyAI:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Start AssemblyAI transcription for a meeting
	 * @param {string} meetingId - Meeting ID
	 * @param {string} apiKey - AssemblyAI API key
	 * @param {Object} options - Transcription options
	 * @returns {Promise<{success: boolean, transcriptionId?: string, error?: string}>}
	 */
	async startAssemblyAITranscription(meetingId, apiKey, options = {}) {
		try {
			// First upload the audio if not already uploaded
			const uploadResult = await this.uploadToAssemblyAI(meetingId, apiKey);
			if (!uploadResult.success) {
				return uploadResult;
			}

			// Set API key in AssemblyAI service
			assemblyAIService.setApiKey(apiKey);

			// Start transcription
			const transcriptionResult = await assemblyAIService.startTranscription(
				uploadResult.uploadUrl,
				options,
			);

			if (transcriptionResult.success) {
				console.log(
					'AssemblyAI transcription started:',
					transcriptionResult.transcriptionId,
				);

				// Update metadata with transcription ID
				const metadataResult = await this.getAudioMetadata(meetingId);
				if (metadataResult.success) {
					const updatedMetadata = {
						...metadataResult.metadata,
						assemblyaiTranscriptionId: transcriptionResult.transcriptionId,
						assemblyaiTranscriptionStartedAt: new Date().toISOString(),
					};

					const metadataPath = this.getMetadataFilePath(meetingId);
					const metadataJson = JSON.stringify(updatedMetadata, null, 2);
					await window.electronApi.fs.writeFile(metadataPath, metadataJson);
				}
			}

			return transcriptionResult;
		} catch (error) {
			console.error('Error starting AssemblyAI transcription:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Get AssemblyAI transcription results
	 * @param {string} meetingId - Meeting ID
	 * @param {string} apiKey - AssemblyAI API key
	 * @returns {Promise<{success: boolean, status?: string, text?: string, error?: string}>}
	 */
	async getAssemblyAITranscription(meetingId, apiKey) {
		try {
			// Get metadata to find transcription ID
			const metadataResult = await this.getAudioMetadata(meetingId);
			if (!metadataResult.success || !metadataResult.metadata.assemblyaiTranscriptionId) {
				throw new Error('No AssemblyAI transcription ID found for this meeting');
			}

			// Set API key in AssemblyAI service
			assemblyAIService.setApiKey(apiKey);

			// Get transcription results
			const transcriptionResult = await assemblyAIService.getTranscription(
				metadataResult.metadata.assemblyaiTranscriptionId,
			);

			if (transcriptionResult.success) {
				console.log('AssemblyAI transcription status:', transcriptionResult.status);
			}

			return transcriptionResult;
		} catch (error) {
			console.error('Error getting AssemblyAI transcription:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}
}

// Create singleton instance
const audioStorageService = new AudioStorageService();

export default audioStorageService;
