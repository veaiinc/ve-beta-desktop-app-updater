/**
 * Simple test file for AssemblyAI Service
 * Tests basic functionality without complex mocking
 */

import { describe, it, expect, beforeEach } from 'vitest';
import assemblyAIService from '../../services/assemblyaiService.js';

describe('AssemblyAI Service - Basic Tests', () => {
	beforeEach(() => {
		// Reset the service state
		assemblyAIService.setApiKey(null);
	});

	describe('setApiKey', () => {
		it('should set the API key', () => {
			assemblyAIService.setApiKey('test-api-key');
			expect(assemblyAIService.apiKey).toBe('test-api-key');
		});

		it('should handle null API key', () => {
			assemblyAIService.setApiKey(null);
			expect(assemblyAIService.apiKey).toBe(null);
		});
	});

	describe('uploadBlob - Error Handling', () => {
		it('should handle missing API key', async () => {
			const mockBlob = new Blob(['test audio data'], { type: 'audio/webm' });

			const result = await assemblyAIService.uploadBlob(mockBlob);

			expect(result.success).toBe(false);
			expect(result.error).toBe('AssemblyAI API key not configured');
		});
	});

	describe('startTranscription - Error Handling', () => {
		it('should handle missing API key', async () => {
			const result = await assemblyAIService.startTranscription('https://example.com/upload');

			expect(result.success).toBe(false);
			expect(result.error).toBe('AssemblyAI API key not configured');
		});
	});

	describe('getTranscription - Error Handling', () => {
		it('should handle missing API key', async () => {
			const result = await assemblyAIService.getTranscription('transcription-123');

			expect(result.success).toBe(false);
			expect(result.error).toBe('AssemblyAI API key not configured');
		});
	});
});
