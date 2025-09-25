const spawn = require('cross-spawn');
const path = require('path');
const log = require('electron-log');
const { execSync } = require('child_process');

// TODO: PERFORMANCE - Python process spawning could be optimized with process pooling
// TODO: PERFORMANCE - Consider implementing process health monitoring and auto-restart
class WakeWordService {
	constructor() {
		this.process = null;
		this.isRunning = false;
		this.listeners = new Set();
		this.pythonPath = path.join(__dirname, 'wakeWord', 'custom_hey_ve_detector.py');
		this.modelsPath = path.join(__dirname, 'wakeWord');
	}

	findPythonCommand() {
		// Define Python commands to try based on platform
		let pythonCommands;
		if (process.platform === 'win32') {
			pythonCommands = [
				'python', // Standard python command
				'py', // Windows Python launcher
				'python3', // Alternative python3 command
				'python.exe', // Direct executable
			];
		} else {
			// Unix-like systems (macOS, Linux)
			pythonCommands = [
				'python3', // Preferred on Unix systems
				'python', // Fallback
				'python3.11', // Specific version
				'python3.10', // Alternative version
				'python3.9', // Another alternative
			];
		}

		// TODO: PERFORMANCE - Multiple execSync calls with 5s timeout each could block startup
		// Try each command to see which one works
		for (const cmd of pythonCommands) {
			try {
				// Test if the command exists and works
				execSync(`${cmd} --version`, {
					stdio: 'pipe',
					timeout: 5000, // 5 second timeout
				});
				log.info(`Found working Python command: ${cmd}`);
				return cmd;
			} catch (error) {
				// Command doesn't work, try next one
				log.debug(`Python command '${cmd}' not available:`, error.message);
			}
		}

		// If no command works, return the first one and let cross-spawn handle the error
		log.warn('No Python command found, using fallback:', pythonCommands[0]);
		return pythonCommands[0];
	}

	start() {
		if (this.isRunning) {
			log.info('Wake word service already running');
			return;
		}

		try {
			// Find the best Python command for this platform
			const pythonCommand = this.findPythonCommand();

			log.info('Starting wake word detection service...');
			log.info('Python script path:', this.pythonPath);
			log.info('Models path:', this.modelsPath);
			log.info('Python command:', pythonCommand);
			log.info('Environment PATH:', process.env.PATH);

			// Use cross-spawn with full Python path directly (no shell)
			this.process = spawn(pythonCommand, [this.pythonPath], {
				cwd: this.modelsPath,
				stdio: ['pipe', 'pipe', 'pipe'],
				env: { ...process.env }, // Pass through environment variables
			});

			this.process.stdout.on('data', (data) => {
				const lines = data.toString().split('\n');
				lines.forEach((line) => {
					if (line.trim()) {
						try {
							const event = JSON.parse(line);
							if (event.type === 'wake_word_detected') {
								log.info('Wake word detected:', event);
								this.notifyListeners(event);
							}
						} catch (e) {
							// Ignore non-JSON output
						}
					}
				});
			});

			this.process.stderr.on('data', (data) => {
				const message = data.toString().trim();
				if (message) {
					log.info('Wake word service:', message);
				}
			});

			this.process.on('close', (code) => {
				log.info(`Wake word service exited with code ${code}`);
				this.isRunning = false;
			});

			this.process.on('error', (error) => {
				log.error('Wake word service error:', error);
				this.isRunning = false;

				// Provide helpful error messages for common issues
				if (error.code === 'ENOENT') {
					log.error(
						"Python not found. Please install Python 3.7+ and ensure it's in your PATH.",
					);
					log.error('Visit https://www.python.org/downloads/ to install Python.');
				} else if (error.code === 'EACCES') {
					log.error(
						'Permission denied. Please check Python installation and permissions.',
					);
				} else {
					log.error('Unknown error starting wake word service:', error.message);
				}
			});

			this.isRunning = true;
			log.info('Wake word detection service started successfully');
		} catch (error) {
			log.error('Failed to start wake word service:', error);
		}
	}

	stop() {
		if (this.process && this.isRunning) {
			log.info('Stopping wake word detection service...');
			this.process.kill('SIGTERM');
			this.isRunning = false;
		}
	}

	addListener(callback) {
		this.listeners.add(callback);
	}

	removeListener(callback) {
		this.listeners.delete(callback);
	}

	notifyListeners(event) {
		this.listeners.forEach((callback) => {
			try {
				callback(event);
			} catch (error) {
				log.error('Error in wake word listener:', error);
			}
		});
	}
}

module.exports = { WakeWordService };
