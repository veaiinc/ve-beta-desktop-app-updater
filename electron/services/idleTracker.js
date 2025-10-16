const { powerMonitor } = require('electron');
const { EventEmitter } = require('node:events');

const DEFAULT_IDLE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_CHECK_INTERVAL_MS = 60 * 1000; // 1 minute

class IdleTracker extends EventEmitter {
	constructor() {
		super();
		this._intervalId = null;
		this._idleThresholdMs = null;
		this._idleThresholdSeconds = null;
		this._checkIntervalMs = DEFAULT_CHECK_INTERVAL_MS;
		this._isIdle = false;
		this._lastIdleMs = 0;
		this._lastCheckTs = 0;

		this._handleUserDidBecomeIdle = this._handleUserDidBecomeIdle.bind(this);
		this._handleUserDidBecomeActive = this._handleUserDidBecomeActive.bind(this);
	}

	start({ idleThresholdMs, checkIntervalMs = DEFAULT_CHECK_INTERVAL_MS } = {}) {
		if (this._intervalId) {
			return;
		}

		this._idleThresholdMs = idleThresholdMs || DEFAULT_IDLE_THRESHOLD_MS;
		this._idleThresholdSeconds = Math.max(
			1,
			Math.floor(this._idleThresholdMs / 1000),
		);
		this._checkIntervalMs = Math.max(5000, checkIntervalMs);

		try {
			powerMonitor.setIdleDetectionInterval(this._idleThresholdSeconds);
		} catch (error) {
			// setIdleDetectionInterval may not exist on very old Electron versions
		}

		powerMonitor.on('user-did-become-idle', this._handleUserDidBecomeIdle);
		powerMonitor.on('user-did-become-active', this._handleUserDidBecomeActive);

		this._intervalId = setInterval(() => this._pollIdleState(), this._checkIntervalMs);
		this._pollIdleState(); // initial check
	}

	stop() {
		if (this._intervalId) {
			clearInterval(this._intervalId);
			this._intervalId = null;
		}

		powerMonitor.removeListener('user-did-become-idle', this._handleUserDidBecomeIdle);
		powerMonitor.removeListener('user-did-become-active', this._handleUserDidBecomeActive);
	}

	_handleUserDidBecomeIdle() {
		this._lastIdleMs = Math.max(this._idleThresholdMs, this._lastIdleMs);
		this._lastCheckTs = Date.now();
		this._updateIdleState(true);
	}

	_handleUserDidBecomeActive() {
		this._lastIdleMs = 0;
		this._lastCheckTs = Date.now();
		this._updateIdleState(false);
	}

	_pollIdleState() {
		if (typeof powerMonitor.getSystemIdleTime !== 'function') {
			return;
		}

		const idleSeconds = powerMonitor.getSystemIdleTime();
		this._lastIdleMs = idleSeconds * 1000;
		this._lastCheckTs = Date.now();

		const isIdle = this._lastIdleMs >= this._idleThresholdMs;
		this._updateIdleState(isIdle);
	}

	_updateIdleState(isIdle) {
		if (this._isIdle === isIdle) {
			return;
		}

		this._isIdle = isIdle;
		this.emit('idle-state-changed', {
			isIdle,
			idleDurationMs: this._lastIdleMs,
			thresholdMs: this._idleThresholdMs,
			timestamp: Date.now(),
		});
	}

	isIdle(thresholdMs) {
		if (typeof thresholdMs === 'number' && thresholdMs > 0) {
			return this.getIdleDurationMs() >= thresholdMs;
		}
		return this._isIdle;
	}

	getIdleDurationMs() {
		if (typeof powerMonitor.getSystemIdleTime !== 'function') {
			return this._lastIdleMs;
		}

		const idleSeconds = powerMonitor.getSystemIdleTime();
		this._lastIdleMs = idleSeconds * 1000;
		this._lastCheckTs = Date.now();
		return this._lastIdleMs;
	}

	getLastCheckTimestamp() {
		return this._lastCheckTs;
	}
}

module.exports = new IdleTracker();
