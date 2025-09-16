/**
 * Test file for AssemblyAI Service
 * Tests the basic functionality of the AssemblyAI service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import assemblyAIService from '../../services/assemblyaiService.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('AssemblyAI Service', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		assemblyAIService.setApiKey('test-api-key');
	});

	describe('setApiKey', () => {
		it('should set the API key', () => {
			assemblyAIService.setApiKey('new-api-key');
			expect(assemblyAIService.apiKey).toBe('new-api-key');
		});
	});

	describe('uploadBlob', () => {
		it('should upload audio blob successfully', async () => {
			const mockBlob = new Blob(['test audio data'], { type: 'audio/webm' });
			const mockResponse = {
				ok: true,
				json: vi.fn().mockResolvedValue({ upload_url: 'https://example.com/upload' }),
			};

			fetch.mockResolvedValue(mockResponse);

			const result = await assemblyAIService.uploadBlob(mockBlob);

			expect(result.success).toBe(true);
			expect(result.uploadUrl).toBe('https://example.com/upload');
			expect(fetch).toHaveBeenCalledWith(
				'https://api.assemblyai.com/v2/upload',
				expect.objectContaining({
					method: 'POST',
					headers: {
						authorization: 'test-api-key',
						'content-type': 'audio/webm',
					},
					body: mockBlob,
				}),
			);
		});

		it('should handle upload failure', async () => {
			const mockBlob = new Blob(['test audio data'], { type: 'audio/webm' });
			const mockResponse = {
				ok: false,
				status: 400,
				text: vi.fn().mockResolvedValue('Bad Request'),
			};

			fetch.mockResolvedValue(mockResponse);

			const result = await assemblyAIService.uploadBlob(mockBlob);

			expect(result.success).toBe(false);
			expect(result.error).toContain('AssemblyAI upload failed: 400');
		});

		it('should handle missing API key', async () => {
			assemblyAIService.setApiKey(null);
			const mockBlob = new Blob(['test audio data'], { type: 'audio/webm' });

			const result = await assemblyAIService.uploadBlob(mockBlob);

			expect(result.success).toBe(false);
			expect(result.error).toBe('AssemblyAI API key not configured');
		});
	});

	describe('startTranscription', () => {
		it('should start transcription successfully', async () => {
			const uploadUrl = 'https://example.com/upload';
			const options = { language_code: 'en' };
			const mockResponse = {
				ok: true,
				json: vi.fn().mockResolvedValue({ id: 'transcription-123' }),
			};

			fetch.mockResolvedValue(mockResponse);

			const result = await assemblyAIService.startTranscription(uploadUrl, options);

			expect(result.success).toBe(true);
			expect(result.transcriptionId).toBe('transcription-123');
			expect(fetch).toHaveBeenCalledWith(
				'https://api.assemblyai.com/v2/transcript',
				expect.objectContaining({
					method: 'POST',
					headers: {
						authorization: 'test-api-key',
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						audio_url: uploadUrl,
						...options,
					}),
				}),
			);
		});
	});

	describe('getTranscription', () => {
		it('should get transcription results successfully', async () => {
			const transcriptionId = 'transcription-123';
			const mockResponse = {
				ok: true,
				json: vi.fn().mockResolvedValue({
					status: 'completed',
					text: 'Hello world',
					confidence: 0.95,
				}),
			};

			fetch.mockResolvedValue(mockResponse);

			const result = await assemblyAIService.getTranscription(transcriptionId);

			expect(result.success).toBe(true);
			expect(result.status).toBe('completed');
			expect(result.text).toBe('Hello world');
			expect(result.confidence).toBe(0.95);
			expect(fetch).toHaveBeenCalledWith(
				'https://api.assemblyai.com/v2/transcript/transcription-123',
				expect.objectContaining({
					headers: {
						authorization: 'test-api-key',
					},
				}),
			);
		});
	});
});
