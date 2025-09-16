#!/usr/bin/env node

/**
 * Enhanced Development Server with Swift File Watching
 * Runs Vite dev server alongside Swift file watcher for seamless development
 */

const { spawn } = require('child_process');
const path = require('path');
const SwiftWatcher = require('./swift-watcher');

const COLORS = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
};

class DevServer {
	constructor() {
		this.processes = [];
		this.swiftWatcher = null;
	}

	log(level, message, prefix = 'DevServer') {
		const timestamp = new Date().toLocaleTimeString();
		const logPrefix = `[${timestamp}] [${prefix}]`;

		switch (level) {
			case 'info':
				console.log(`${COLORS.blue}${logPrefix}${COLORS.reset} ${message}`);
				break;
			case 'success':
				console.log(`${COLORS.green}${logPrefix}${COLORS.reset} ${message}`);
				break;
			case 'warning':
				console.log(`${COLORS.yellow}${logPrefix}${COLORS.reset} ${message}`);
				break;
			case 'error':
				console.log(`${COLORS.red}${logPrefix}${COLORS.reset} ${message}`);
				break;
			default:
				console.log(`${logPrefix} ${message}`);
		}
	}

	async startViteServer() {
		return new Promise((resolve, reject) => {
			this.log('info', 'Starting Vite development server...');

			const viteProcess = spawn('npm', ['run', 'dev'], {
				stdio: ['inherit', 'pipe', 'pipe'],
				cwd: process.cwd(),
			});

			this.processes.push(viteProcess);

			// Pipe output with prefixes
			viteProcess.stdout.on('data', (data) => {
				const lines = data
					.toString()
					.split('\n')
					.filter((line) => line.trim());
				lines.forEach((line) => {
					console.log(`${COLORS.cyan}[Vite]${COLORS.reset} ${line}`);
				});
			});

			viteProcess.stderr.on('data', (data) => {
				const lines = data
					.toString()
					.split('\n')
					.filter((line) => line.trim());
				lines.forEach((line) => {
					console.log(`${COLORS.red}[Vite Error]${COLORS.reset} ${line}`);
				});
			});

			viteProcess.on('close', (code) => {
				if (code === 0) {
					this.log('info', 'Vite server stopped normally');
				} else {
					this.log('error', `Vite server exited with code ${code}`);
				}
			});

			viteProcess.on('error', (error) => {
				this.log('error', `Failed to start Vite server: ${error.message}`);
				reject(error);
			});

			// Consider Vite started after a short delay
			setTimeout(() => {
				this.log('success', 'Vite development server started');
				resolve(viteProcess);
			}, 2000);
		});
	}

	async startSwiftWatcher() {
		try {
			this.log('info', 'Starting Swift file watcher...');
			this.swiftWatcher = new SwiftWatcher();
			this.swiftWatcher.start();
			this.log('success', 'Swift file watcher started');
		} catch (error) {
			this.log('error', `Failed to start Swift watcher: ${error.message}`);
			throw error;
		}
	}

	async start() {
		this.log('info', 'Starting enhanced development environment...');
		this.log('info', '='.repeat(50));

		try {
			// Start both services
			await Promise.all([this.startViteServer(), this.startSwiftWatcher()]);

			this.log('success', 'Development environment ready!');
			this.log('info', '📝 Edit React/JS files → Vite hot reload');
			this.log('info', '🔧 Edit Swift files → Automatic addon rebuild');
			this.log('info', 'Press Ctrl+C to stop all services');
		} catch (error) {
			this.log('error', `Failed to start development environment: ${error.message}`);
			this.cleanup();
			process.exit(1);
		}
	}

	cleanup() {
		this.log('info', 'Cleaning up processes...');

		this.processes.forEach((process) => {
			if (process && !process.killed) {
				process.kill('SIGTERM');
			}
		});

		if (this.swiftWatcher) {
			// Swift watcher handles its own cleanup
		}
	}
}

// Handle process termination
process.on('SIGINT', () => {
	console.log('\n'); // New line for clean output
	const devServer = global.devServerInstance;
	if (devServer) {
		devServer.log('info', 'Received SIGINT, shutting down...');
		devServer.cleanup();
	}
	process.exit(0);
});

process.on('SIGTERM', () => {
	const devServer = global.devServerInstance;
	if (devServer) {
		devServer.log('info', 'Received SIGTERM, shutting down...');
		devServer.cleanup();
	}
	process.exit(0);
});

// Start the development server
if (require.main === module) {
	const devServer = new DevServer();
	global.devServerInstance = devServer;
	devServer.start();
}

module.exports = DevServer;
