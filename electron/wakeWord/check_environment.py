#!/usr/bin/env python3
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
