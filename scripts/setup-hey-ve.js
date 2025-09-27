#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎤 Setting up Hey Ve wake word feature...\n');

// Function to check if a command exists
function commandExists(command) {
    try {
        execSync(`which ${command}`, { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

// Find available Python command
function findPythonCommand() {
    const pythonCommands = ['python3', 'python', 'py'];
    
    for (const cmd of pythonCommands) {
        if (commandExists(cmd)) {
            try {
                const version = execSync(`${cmd} --version`, { encoding: 'utf8' });
                console.log(`✅ Found Python: ${cmd} (${version.trim()})`);
                return cmd;
            } catch (error) {
                continue;
            }
        }
    }
    return null;
}

// Check if ONNX models exist
function checkModels() {
    const modelsDir = path.join(__dirname, '..', 'electron', 'wakeWord');
    const requiredModels = [
        'hey_ve_ee.onnx',
        'melspectrogram.onnx', 
        'embedding_model.onnx'
    ];
    
    const missingModels = [];
    
    for (const model of requiredModels) {
        const modelPath = path.join(modelsDir, model);
        if (!fs.existsSync(modelPath)) {
            missingModels.push(model);
        }
    }
    
    return { missing: missingModels, total: requiredModels.length };
}

// Install Python dependencies
function installPythonDeps(pythonCmd) {
    const requirementsPath = path.join(__dirname, '..', 'electron', 'wakeWord', 'requirements.txt');
    
    if (!fs.existsSync(requirementsPath)) {
        console.log('❌ requirements.txt not found at:', requirementsPath);
        return false;
    }
    
    console.log('📦 Installing Python dependencies...');
    
    // Check for common PyAudio issues on macOS
    if (process.platform === 'darwin') {
        console.log('🍎 Checking macOS system dependencies...');
        
        // Check if PortAudio is available via Homebrew
        try {
            execSync('brew list portaudio', { stdio: 'ignore' });
            console.log('✅ PortAudio found via Homebrew');
        } catch (error) {
            console.log('⚠️ PortAudio not found. Installing via Homebrew...');
            try {
                execSync('brew install portaudio', { stdio: 'inherit' });
                console.log('✅ PortAudio installed successfully');
            } catch (brewError) {
                console.log('❌ Failed to install PortAudio via Homebrew');
                console.log('💡 You may need to install Homebrew first: https://brew.sh');
                console.log('💡 Then run: brew install portaudio');
            }
        }
    }
    
    try {
        // Try installing with pip
        execSync(`${pythonCmd} -m pip install -r "${requirementsPath}"`, {
            stdio: 'inherit',
            cwd: path.dirname(requirementsPath)
        });
        console.log('✅ Python dependencies installed successfully');
        return true;
    } catch (error) {
        console.log('⚠️ Standard pip install failed, trying alternatives...');
        
        // Try with --user flag
        try {
            execSync(`${pythonCmd} -m pip install --user -r "${requirementsPath}"`, {
                stdio: 'inherit',
                cwd: path.dirname(requirementsPath)
            });
            console.log('✅ Python dependencies installed with --user flag');
            return true;
        } catch (userError) {
            // Try installing packages individually (some might succeed)
            console.log('⚠️ Trying to install packages individually...');
            
            const packages = ['numpy==1.24.3', 'onnxruntime==1.16.3'];
            let partialSuccess = false;
            
            for (const pkg of packages) {
                try {
                    execSync(`${pythonCmd} -m pip install --user "${pkg}"`, {
                        stdio: 'inherit',
                        cwd: path.dirname(requirementsPath)
                    });
                    console.log(`✅ ${pkg} installed successfully`);
                    partialSuccess = true;
                } catch (pkgError) {
                    console.log(`❌ Failed to install ${pkg}`);
                }
            }
            
            // Try PyAudio with special handling
            console.log('🎤 Attempting PyAudio installation with alternatives...');
            const pyaudioAlternatives = [
                'pyaudio==0.2.14',
                'pyaudio --only-binary=all',
                'PyAudio'
            ];
            
            let pyaudioInstalled = false;
            for (const pyaudioCmd of pyaudioAlternatives) {
                try {
                    execSync(`${pythonCmd} -m pip install --user ${pyaudioCmd}`, {
                        stdio: 'inherit',
                        cwd: path.dirname(requirementsPath)
                    });
                    console.log('✅ PyAudio installed successfully');
                    pyaudioInstalled = true;
                    break;
                } catch (pyaudioError) {
                    console.log(`❌ PyAudio install failed with: ${pyaudioCmd}`);
                }
            }
            
            if (partialSuccess && !pyaudioInstalled) {
                console.log('⚠️ Partial installation completed (missing PyAudio)');
                console.log('💡 Hey Ve might work without PyAudio in some configurations');
                console.log('💡 To install PyAudio manually:');
                if (process.platform === 'darwin') {
                    console.log('   brew install portaudio');
                    console.log(`   ${pythonCmd} -m pip install --user pyaudio`);
                } else if (process.platform === 'win32') {
                    console.log('   pip install pipwin && pipwin install pyaudio');
                } else {
                    console.log('   sudo apt install python3-pyaudio  # Ubuntu/Debian');
                }
                return partialSuccess;
            } else if (!partialSuccess) {
                console.log('❌ Failed to install Python dependencies');
                console.log('💡 Manual installation steps:');
                console.log(`   cd electron/wakeWord && ${pythonCmd} -m pip install -r requirements.txt`);
                return false;
            }
            
            return pyaudioInstalled && partialSuccess;
        }
    }
}

// Test Python dependencies
function testPythonDeps(pythonCmd) {
    console.log('🧪 Testing Python dependencies...');
    
    const testScript = `
import sys
try:
    import numpy
    import onnxruntime
    import pyaudio
    print("✅ All Python dependencies available")
    print(f"   numpy: {numpy.__version__}")
    print(f"   onnxruntime: {onnxruntime.__version__}")
    print(f"   pyaudio: {pyaudio.__version__}")
    sys.exit(0)
except ImportError as e:
    print(f"❌ Missing dependency: {e}")
    sys.exit(1)
`;
    
    try {
        execSync(`${pythonCmd} -c "${testScript}"`, { stdio: 'inherit' });
        return true;
    } catch (error) {
        return false;
    }
}

// Main setup function
async function setupHeyVe() {
    try {
        console.log('🔍 Checking Hey Ve feature requirements...\n');
        
        // Check if we're on a supported platform
        if (process.platform === 'win32') {
            console.log('⚠️ Hey Ve feature has limited support on Windows');
        }
        
        // Find Python
        const pythonCmd = findPythonCommand();
        if (!pythonCmd) {
            console.log('❌ Python not found in PATH');
            console.log('💡 Please install Python 3.7+ and ensure it\'s in your PATH');
            console.log('   - macOS: brew install python3');
            console.log('   - Windows: Download from python.org');
            console.log('   - Linux: sudo apt install python3 python3-pip');
            return;
        }
        
        // Check ONNX models
        const modelCheck = checkModels();
        if (modelCheck.missing.length > 0) {
            console.log(`❌ Missing ONNX models (${modelCheck.missing.length}/${modelCheck.total}):`);
            modelCheck.missing.forEach(model => console.log(`   - ${model}`));
            console.log('💡 These models should be included in the repository or downloaded');
        } else {
            console.log(`✅ All ONNX models present (${modelCheck.total}/${modelCheck.total})`);
        }
        
        // Install and test Python dependencies
        const installed = installPythonDeps(pythonCmd);
        if (installed) {
            const tested = testPythonDeps(pythonCmd);
            if (tested) {
                console.log('\n🎉 Hey Ve feature setup completed successfully!');
                console.log('💡 Run "npm run dev" to start development with Hey Ve enabled');
            }
        }
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    }
}

// Run setup
setupHeyVe();
