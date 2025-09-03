# Wake Word Setup Guide

This guide explains how to set up the "Hey Ve" wake word functionality on different operating systems.

## Prerequisites

### Python Installation

The wake word service requires Python 3.7 or higher. Install Python based on your operating system:

#### Windows
1. Download Python from [python.org](https://www.python.org/downloads/)
2. **Important**: Check "Add Python to PATH" during installation
3. Verify installation: Open Command Prompt and run `python --version`

#### macOS
1. Install using Homebrew: `brew install python3`
2. Or download from [python.org](https://www.python.org/downloads/)
3. Verify installation: Open Terminal and run `python3 --version`

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3 python3-pip
```
Verify installation: `python3 --version`

### Python Dependencies

The app will automatically install required Python packages:
- `pyaudio` - Audio processing
- `numpy` - Numerical computing
- `onnxruntime` - Machine learning inference

## How It Works

### Cross-Platform Python Detection

The app automatically detects the best Python command for your system:

**Windows:**
- Tries: `python` → `py` → `python3` → `python.exe`

**macOS/Linux:**
- Tries: `python3` → `python` → `python3.11` → `python3.10` → `python3.9`

### Wake Word Models

The service uses ONNX models for efficient wake word detection:
- `hey_ve_ee.onnx` - Main wake word model
- `melspectrogram.onnx` - Audio feature extraction
- `embedding_model.onnx` - Voice embedding

## Troubleshooting

### Python Not Found
If you see "Python not found" errors:

1. **Verify Python Installation:**
   ```bash
   # Windows
   python --version
   
   # macOS/Linux
   python3 --version
   ```

2. **Check PATH Environment Variable:**
   - Windows: Add Python installation directory to PATH
   - macOS/Linux: Ensure Python is in `/usr/bin/` or `/usr/local/bin/`

3. **Reinstall Python:**
   - Make sure to check "Add to PATH" during installation

### Audio Issues
If wake word detection doesn't work:

1. **Check Microphone Permissions:**
   - Windows: Settings → Privacy → Microphone
   - macOS: System Preferences → Security & Privacy → Microphone
   - Linux: Check PulseAudio/ALSA configuration

2. **Test Audio Input:**
   ```bash
   # Test if microphone is working
   python -c "import pyaudio; print('Audio system OK')"
   ```

### Permission Errors
If you get permission errors:

1. **Windows:** Run as Administrator
2. **macOS:** Grant microphone permissions in System Preferences
3. **Linux:** Add user to audio group: `sudo usermod -a -G audio $USER`

## Development Notes

### File Structure
```
electron/
├── wakeWord/
│   ├── custom_hey_ve_detector.py    # Main wake word detector
│   ├── hey_ve_ee.onnx              # Wake word model
│   ├── melspectrogram.onnx         # Audio features model
│   ├── embedding_model.onnx        # Voice embedding model
│   └── requirements.txt            # Python dependencies
└── wakeWordService.js              # Node.js service wrapper
```

### Build Process
The Vite build process automatically:
1. Copies wake word files to `dist-electron/wakeWord/`
2. Installs Python dependencies
3. Sets up cross-platform Python detection

### Testing
To test the wake word service:
1. Start the app: `npm run dev`
2. Check logs for "Wake word detection service started successfully"
3. Say "Hey Ve" to trigger Dynamic Island voice mode

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify Python installation and PATH configuration
3. Ensure microphone permissions are granted
4. Try running the Python script directly: `python electron/wakeWord/custom_hey_ve_detector.py`
