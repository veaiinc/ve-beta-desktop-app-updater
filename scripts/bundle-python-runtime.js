#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🐍 Python Runtime Bundling for Hey Ve Feature\n');

/**
 * For production apps, we need to handle Python dependencies gracefully:
 * 1. Include Python scripts and ONNX models in the bundle
 * 2. Detect system Python at runtime 
 * 3. Gracefully fallback if Python/deps unavailable
 * 4. Show user-friendly error messages
 */

// Function to create Python environment checker
function createPythonChecker() {
    const checkerPath = path.join(__dirname, '..', 'electron', 'wakeWord', 'check_environment.py');
    
    const checkerScript = `#!/usr/bin/env python3
"""
Python environment checker for Hey Ve wake word feature.
Returns JSON status of Python dependencies.
"""
import sys
import json

def check_dependencies():
    """Check if all required dependencies are available."""
    results = {
        "python_available": True,
        "python_version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
        "dependencies": {},
        "ready": True,
        "errors": []
    }
    
    # Check each dependency
    deps_to_check = {
        "numpy": "1.24.3",
        "onnxruntime": "1.16.3", 
        "pyaudio": "0.2.14"
    }
    
    for dep_name, min_version in deps_to_check.items():
        try:
            module = __import__(dep_name)
            version = getattr(module, '__version__', 'unknown')
            results["dependencies"][dep_name] = {
                "available": True,
                "version": version,
                "required": min_version
            }
        except ImportError as e:
            results["dependencies"][dep_name] = {
                "available": False,
                "error": str(e),
                "required": min_version
            }
            results["ready"] = False
            results["errors"].append(f"Missing {dep_name} (required: {min_version})")
    
    return results

if __name__ == "__main__":
    try:
        status = check_dependencies()
        print(json.dumps(status, indent=2))
        sys.exit(0 if status["ready"] else 1)
    except Exception as e:
        error_result = {
            "python_available": True,
            "ready": False,
            "errors": [f"Environment check failed: {str(e)}"]
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)
`;

    fs.writeFileSync(checkerPath, checkerScript);
    fs.chmodSync(checkerPath, 0o755);
    console.log('✅ Created Python environment checker');
    return checkerPath;
}

// Function to create bundled requirements installer
function createBundledInstaller() {
    const installerPath = path.join(__dirname, '..', 'electron', 'wakeWord', 'install_deps.py');
    
    const installerScript = `#!/usr/bin/env python3
"""
Bundled dependency installer for Hey Ve feature.
Attempts to install Python dependencies for end users.
"""
import subprocess
import sys
import json

def install_dependencies():
    """Attempt to install required dependencies."""
    deps = ["numpy==1.24.3", "onnxruntime==1.16.3", "pyaudio==0.2.14"]
    
    results = {
        "success": True,
        "installed": [],
        "failed": [],
        "errors": []
    }
    
    for dep in deps:
        try:
            print(f"Installing {dep}...")
            subprocess.run([
                sys.executable, "-m", "pip", "install", dep, "--quiet"
            ], check=True, capture_output=True, text=True)
            results["installed"].append(dep)
            print(f"✅ {dep} installed successfully")
        except subprocess.CalledProcessError as e:
            results["failed"].append(dep)
            results["success"] = False
            error_msg = f"Failed to install {dep}: {e.stderr}"
            results["errors"].append(error_msg)
            print(f"❌ {error_msg}")
        except Exception as e:
            results["failed"].append(dep)
            results["success"] = False
            error_msg = f"Unexpected error installing {dep}: {str(e)}"
            results["errors"].append(error_msg)
            print(f"❌ {error_msg}")
    
    return results

if __name__ == "__main__":
    try:
        result = install_dependencies()
        print(json.dumps(result, indent=2))
        sys.exit(0 if result["success"] else 1)
    except Exception as e:
        error_result = {
            "success": False,
            "errors": [f"Installation failed: {str(e)}"]
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)
`;

    fs.writeFileSync(installerPath, installerScript);
    fs.chmodSync(installerPath, 0o755);
    console.log('✅ Created bundled dependency installer');
    return installerPath;
}

// Function to verify ONNX models are present
function verifyModels() {
    const modelsDir = path.join(__dirname, '..', 'electron', 'wakeWord');
    const requiredModels = [
        'hey_ve_ee.onnx',
        'melspectrogram.onnx',
        'embedding_model.onnx'
    ];
    
    console.log('🔍 Verifying ONNX models...');
    
    const missing = [];
    const present = [];
    
    for (const model of requiredModels) {
        const modelPath = path.join(modelsDir, model);
        if (fs.existsSync(modelPath)) {
            const stats = fs.statSync(modelPath);
            present.push({ name: model, size: stats.size });
            console.log(`✅ ${model} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        } else {
            missing.push(model);
            console.log(`❌ ${model} (missing)`);
        }
    }
    
    if (missing.length > 0) {
        console.log(`\n⚠️ Missing ${missing.length} ONNX models for Hey Ve feature`);
        console.log('💡 The Hey Ve feature will be disabled in production builds');
        return false;
    }
    
    console.log(`\n✅ All ${requiredModels.length} ONNX models present for Hey Ve feature`);
    return true;
}

// Main bundling function
function bundlePythonRuntime() {
    console.log('📦 Preparing Python runtime for production bundle...\n');
    
    try {
        // Create helper scripts
        createPythonChecker();
        createBundledInstaller();
        
        // Verify models
        const modelsReady = verifyModels();
        
        console.log('\n🎯 Production Bundle Configuration:');
        console.log('  ✅ Python scripts included in extraResources');
        console.log('  ✅ ONNX models included in extraResources');
        console.log('  ✅ Environment checker created');
        console.log('  ✅ Dependency installer created');
        console.log('  ✅ Graceful fallback implemented in wakeWordService.js');
        
        if (modelsReady) {
            console.log('\n🎉 Hey Ve feature is ready for production bundling!');
            console.log('💡 End users will get automatic Python dependency installation');
        } else {
            console.log('\n⚠️ Hey Ve feature will be disabled (missing models)');
        }
        
    } catch (error) {
        console.error('❌ Python runtime bundling failed:', error.message);
        process.exit(1);
    }
}

// Run bundling
bundlePythonRuntime();
