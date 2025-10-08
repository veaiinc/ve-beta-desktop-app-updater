/**
 * ⚡ ULTRA OPTIMIZATION: IPC Throttling & Batching Service
 * 
 * Prevents IPC message spam by throttling high-frequency updates
 * and batching multiple messages together.
 * 
 * This prevents CPU waste and potential message queue overflow
 * especially for transcription and live intelligence updates.
 */

const log = require('electron-log');

class IPCThrottleService {
	constructor() {
		// Store pending messages by channel
		this.pendingMessages = new Map();
		// Store last send time by channel
		this.lastSendTime = new Map();
		// Store throttle timers by channel
		this.throttleTimers = new Map();
		// Configuration per channel type
		this.config = {
			// High-frequency transcription updates - batch aggressively
			transcription: {
				throttleMs: 100, // Only send every 100ms max
				batchSize: 10, // Batch up to 10 messages
				maxWaitMs: 500, // But force send after 500ms
			},
			// Live intelligence - less frequent
			intelligence: {
				throttleMs: 200,
				batchSize: 5,
				maxWaitMs: 1000,
			},
			// Voice status updates - moderate throttling
			voiceStatus: {
				throttleMs: 50,
				batchSize: 1, // Don't batch status updates
				maxWaitMs: 200,
			},
			// Default for other channels
			default: {
				throttleMs: 16, // ~60fps
				batchSize: 1,
				maxWaitMs: 100,
			},
		};
	}

	/**
	 * Get configuration for a specific channel
	 */
	getConfig(channel) {
		if (channel.includes('transcription')) return this.config.transcription;
		if (channel.includes('intelligence')) return this.config.intelligence;
		if (channel.includes('voice')) return this.config.voiceStatus;
		return this.config.default;
	}

	/**
	 * Throttle and optionally batch IPC messages
	 * @param {BrowserWindow} window - Target window
	 * @param {string} channel - IPC channel name
	 * @param {any} data - Data to send
	 * @param {boolean} forceSend - Force immediate send
	 */
	sendThrottled(window, channel, data, forceSend = false) {
		if (!window || window.isDestroyed()) {
			return;
		}

		const config = this.getConfig(channel);
		const now = Date.now();
		const lastSend = this.lastSendTime.get(channel) || 0;
		const timeSinceLastSend = now - lastSend;

		// If forcing send or throttle period has elapsed
		if (forceSend || timeSinceLastSend >= config.throttleMs) {
			// Send immediately
			this.flushChannel(window, channel);
			
			// Add new message and send
			this.addMessage(channel, data);
			this.flushChannel(window, channel);
			
			return;
		}

		// Add to pending messages
		this.addMessage(channel, data);

		// Check if we should flush due to batch size or max wait time
		const pending = this.pendingMessages.get(channel) || [];
		const oldestMessage = pending[0];
		const waitTime = oldestMessage ? now - oldestMessage.timestamp : 0;

		if (pending.length >= config.batchSize || waitTime >= config.maxWaitMs) {
			this.flushChannel(window, channel);
			return;
		}

		// Schedule a flush if not already scheduled
		if (!this.throttleTimers.has(channel)) {
			const timer = setTimeout(() => {
				this.flushChannel(window, channel);
			}, config.throttleMs);
			this.throttleTimers.set(channel, timer);
		}
	}

	/**
	 * Add message to pending queue
	 */
	addMessage(channel, data) {
		if (!this.pendingMessages.has(channel)) {
			this.pendingMessages.set(channel, []);
		}

		const pending = this.pendingMessages.get(channel);
		pending.push({
			data,
			timestamp: Date.now(),
		});
	}

	/**
	 * Flush all pending messages for a channel
	 */
	flushChannel(window, channel) {
		if (!window || window.isDestroyed()) {
			return;
		}

		// Clear any pending timer
		const timer = this.throttleTimers.get(channel);
		if (timer) {
			clearTimeout(timer);
			this.throttleTimers.delete(channel);
		}

		// Get pending messages
		const pending = this.pendingMessages.get(channel);
		if (!pending || pending.length === 0) {
			return;
		}

		// Clear pending queue
		this.pendingMessages.delete(channel);

		// Update last send time
		this.lastSendTime.set(channel, Date.now());

		// If batching is enabled (batchSize > 1), send as batch
		const config = this.getConfig(channel);
		if (config.batchSize > 1 && pending.length > 1) {
			// Send batched data
			const batchedData = pending.map(msg => msg.data);
			try {
				window.webContents.send(channel, batchedData);
				log.debug(`📦 Sent ${batchedData.length} batched messages on ${channel}`);
			} catch (error) {
				log.error(`❌ Error sending batched IPC on ${channel}:`, error);
			}
		} else {
			// Send individually
			pending.forEach(msg => {
				try {
					window.webContents.send(channel, msg.data);
				} catch (error) {
					log.error(`❌ Error sending IPC on ${channel}:`, error);
				}
			});
		}
	}

	/**
	 * Flush all pending messages for all channels
	 */
	flushAll(window) {
		const channels = Array.from(this.pendingMessages.keys());
		channels.forEach(channel => {
			this.flushChannel(window, channel);
		});
	}

	/**
	 * Clear all pending messages and timers
	 */
	cleanup() {
		// Clear all timers
		this.throttleTimers.forEach(timer => clearTimeout(timer));
		this.throttleTimers.clear();

		// Clear all pending messages
		this.pendingMessages.clear();
		this.lastSendTime.clear();

		log.info('🧹 IPC Throttle Service cleaned up');
	}

	/**
	 * Get statistics about pending messages
	 */
	getStats() {
		const stats = {};
		this.pendingMessages.forEach((messages, channel) => {
			stats[channel] = {
				pending: messages.length,
				oldestAge: messages.length > 0 ? Date.now() - messages[0].timestamp : 0,
			};
		});
		return stats;
	}
}

// Export singleton instance
module.exports = new IPCThrottleService();
