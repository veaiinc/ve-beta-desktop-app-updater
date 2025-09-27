#!/usr/bin/env python3
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
