/**
 * Swift Watcher Configuration
 * Customize the behavior of the Swift file watcher
 */

module.exports = {
    // Debounce delay in milliseconds (time to wait after last change before rebuilding)
    debounceDelay: 1000,
    
    // Paths to watch (relative to notchdrop-addon directory)
    watchPaths: [
        'src/**/*.swift',
        'include/**/*.h',
        'include/**/*.hpp'
    ],
    
    // Files to ignore
    ignorePaths: [
        '**/.DS_Store',
        '**/Thumbs.db',
        '**/*.tmp',
        '**/*.temp'
    ],
    
    // Build command to run when files change
    buildCommand: 'npm run build',
    
    // Whether to show verbose output
    verbose: true,
    
    // Whether to perform initial build on startup
    initialBuild: false,
    
    // Custom build script path (optional)
    customBuildScript: null, // e.g., './build.sh'
    
    // Notification settings
    notifications: {
        enabled: true,
        onSuccess: true,
        onError: true
    },
    
    // Colors for console output
    colors: {
        info: '\x1b[34m',     // blue
        success: '\x1b[32m',  // green
        warning: '\x1b[33m',  // yellow
        error: '\x1b[31m',    // red
        build: '\x1b[35m',    // magenta
        reset: '\x1b[0m'      // reset
    }
};
