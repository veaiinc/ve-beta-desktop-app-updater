#!/usr/bin/env node

/**
 * Swift File Watcher for NotchDrop Addon
 * Automatically rebuilds the native addon when Swift files change
 */

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const chokidar = require('chokidar');

// Load configuration
let config;
try {
    const configPath = path.join(__dirname, '..', 'swift-watcher.config.js');
    config = require(configPath);
} catch (error) {
    // Use default configuration if config file doesn't exist
    config = {
        debounceDelay: 1000,
        watchPaths: ['src/**/*.swift', 'include/**/*.h', 'include/**/*.hpp'],
        ignorePaths: ['**/.DS_Store', '**/Thumbs.db', '**/*.tmp', '**/*.temp'],
        buildCommand: 'npm run build',
        verbose: true,
        initialBuild: false,
        customBuildScript: null,
        notifications: { enabled: true, onSuccess: true, onError: true },
        colors: {
            info: '\x1b[34m',
            success: '\x1b[32m',
            warning: '\x1b[33m',
            error: '\x1b[31m',
            build: '\x1b[35m',
            reset: '\x1b[0m'
        }
    };
}

const COLORS = config.colors;

class SwiftWatcher {
    constructor() {
        this.isBuilding = false;
        this.buildQueue = [];
        this.debounceTimer = null;
        this.debounceDelay = config.debounceDelay;
        this.addonPath = path.join(__dirname, '..', 'notchdrop-addon');
        this.swiftSrcPath = path.join(this.addonPath, 'src');
        
        // Check if addon directory exists
        if (!fs.existsSync(this.addonPath)) {
            this.log('error', `NotchDrop addon directory not found: ${this.addonPath}`);
            process.exit(1);
        }
        
        if (!fs.existsSync(this.swiftSrcPath)) {
            this.log('error', `Swift source directory not found: ${this.swiftSrcPath}`);
            process.exit(1);
        }
    }

    log(level, message) {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [SwiftWatcher]`;
        
        switch (level) {
            case 'info':
                console.log(`${COLORS.blue}${prefix}${COLORS.reset} ${message}`);
                break;
            case 'success':
                console.log(`${COLORS.green}${prefix}${COLORS.reset} ${message}`);
                break;
            case 'warning':
                console.log(`${COLORS.yellow}${prefix}${COLORS.reset} ${message}`);
                break;
            case 'error':
                console.log(`${COLORS.red}${prefix}${COLORS.reset} ${message}`);
                break;
            case 'build':
                console.log(`${COLORS.magenta}${prefix}${COLORS.reset} ${message}`);
                break;
            default:
                console.log(`${prefix} ${message}`);
        }
    }

    async buildAddon() {
        if (this.isBuilding) {
            this.log('warning', 'Build already in progress, queuing...');
            return new Promise((resolve) => {
                this.buildQueue.push(resolve);
            });
        }

        this.isBuilding = true;
        this.log('build', 'Building NotchDrop addon...');

        return new Promise((resolve, reject) => {
            const buildProcess = spawn('npm', ['run', 'build'], {
                cwd: this.addonPath,
                stdio: 'pipe'
            });

            let output = '';
            let errorOutput = '';

            buildProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            buildProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            buildProcess.on('close', (code) => {
                this.isBuilding = false;

                if (code === 0) {
                    this.log('success', 'NotchDrop addon rebuilt successfully!');
                    resolve();
                } else {
                    this.log('error', `Build failed with code ${code}`);
                    if (errorOutput) {
                        console.log(`${COLORS.red}Build Error:${COLORS.reset}\n${errorOutput}`);
                    }
                    reject(new Error(`Build failed with code ${code}`));
                }

                // Process queued builds
                if (this.buildQueue.length > 0) {
                    this.log('info', `Processing ${this.buildQueue.length} queued build(s)...`);
                    const queuedResolvers = [...this.buildQueue];
                    this.buildQueue = [];
                    
                    // Build once for all queued requests
                    this.buildAddon().then(() => {
                        queuedResolvers.forEach(resolver => resolver());
                    }).catch((error) => {
                        queuedResolvers.forEach(resolver => resolver(error));
                    });
                }
            });

            buildProcess.on('error', (error) => {
                this.isBuilding = false;
                this.log('error', `Failed to start build process: ${error.message}`);
                reject(error);
            });
        });
    }

    debouncedBuild(filePath) {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            this.log('info', `Swift file changed: ${path.relative(this.swiftSrcPath, filePath)}`);
            this.buildAddon().catch((error) => {
                this.log('error', `Build failed: ${error.message}`);
            });
        }, this.debounceDelay);
    }

    start() {
        this.log('info', `Watching Swift files in: ${this.swiftSrcPath}`);
        this.log('info', `Debounce delay: ${this.debounceDelay}ms`);

        const watcher = chokidar.watch(config.watchPaths, {
            cwd: this.addonPath,
            ignored: config.ignorePaths,
            persistent: true,
            ignoreInitial: !config.initialBuild
        });

        watcher
            .on('change', (filePath) => {
                const fullPath = path.join(this.swiftSrcPath, filePath);
                this.debouncedBuild(fullPath);
            })
            .on('add', (filePath) => {
                const fullPath = path.join(this.swiftSrcPath, filePath);
                this.log('info', `New Swift file detected: ${filePath}`);
                this.debouncedBuild(fullPath);
            })
            .on('unlink', (filePath) => {
                this.log('info', `Swift file removed: ${filePath}`);
                this.debouncedBuild(path.join(this.swiftSrcPath, filePath));
            })
            .on('error', (error) => {
                this.log('error', `Watcher error: ${error.message}`);
            })
            .on('ready', () => {
                this.log('success', 'Swift file watcher is ready!');
                this.log('info', 'Make changes to Swift files to trigger automatic rebuilds...');
            });

        // Handle process termination
        process.on('SIGINT', () => {
            this.log('info', 'Stopping Swift file watcher...');
            watcher.close().then(() => {
                this.log('success', 'Swift file watcher stopped.');
                process.exit(0);
            });
        });

        return watcher;
    }
}

// CLI interface
if (require.main === module) {
    const watcher = new SwiftWatcher();
    watcher.start();
}

module.exports = SwiftWatcher;
