# WebSocket Debugging Guide for Windows

## Overview
This guide will help you debug WebSocket payloads in the VE Desktop App on Windows. The app includes multiple windows that use WebSocket connections for real-time communication.

## Quick Start

### Method 1: Using the Built-in Debug Helper (Recommended)

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Look for the WebSocket Debug Helper**:
   - A blue "WebSocket Debug" button will appear in the bottom-right corner of the main app
   - This button is only visible in development mode

3. **Open Developer Tools**:
   - Click the "WebSocket Debug" button
   - Choose which window to debug:
     - **Current Window** - Main application window
     - **Overlay Window** - Recording overlay (if visible)
     - **Ask AI Window** - Ask AI interface (if visible)

4. **Enable WebSocket Logging**:
   - Click "Copy Debug Script to Clipboard"
   - Open Developer Tools (they should open automatically)
   - Go to the **Console** tab
   - Paste the script and press **Enter**
   - All WebSocket traffic will now be logged to the console!

### Method 2: Using Keyboard Shortcuts

#### Windows Shortcuts:
- **F12** - Toggle Developer Tools for the active window (if available)
- **Ctrl+F12** - Alternative if F12 is used by another application
- **Ctrl+Shift+I** - Alternative shortcut for Developer Tools
- **Note**: If F12 fails to register, the app automatically tries Ctrl+F12 as a fallback

#### How it works:
1. The shortcuts automatically detect which window is active/visible
2. Priority order: Overlay Window → Ask AI Window → Main Window
3. Developer tools open in detached mode for better debugging

## WebSocket Connections in the App

The VE Desktop App uses WebSocket connections in several places:

### 1. Chat Streaming (`src/hooks/useChatStream.js`)
- **Purpose**: Real-time chat with AI agents
- **URL Pattern**: `wss://api.domain.com/{workspaceId}/{sessionId}/{agentType}?token={token}`
- **Message Types**: Chat messages, AI responses, typing indicators

### 2. Voice Agent (`src/views/features/voiceAgent/useVoiceAgent.js`)
- **Purpose**: Real-time voice processing and transcription
- **Message Types**: Audio data, transcription results, voice commands

### 3. Assembly Transcription (`src/hooks/useAssemblyTranscription.js`)
- **Purpose**: Live audio transcription during meetings
- **URL Pattern**: `wss://transcription.api.com/{meetingId}?token={token}`
- **Message Types**: Audio chunks, transcription text, confidence scores

### 4. Recall Stream (`src/hooks/useRecallStream.js`)
- **Purpose**: Meeting recording and intelligence
- **URL Pattern**: `wss://meeting.api.com/frontend/ws/{meetingId}?token={token}`
- **Message Types**: Meeting events, recording status, AI insights

## Debugging WebSocket Payloads

### Using the Debug Script

Once you've copied and pasted the debug script, you'll see detailed logs for:

#### Outgoing Messages (📤):
```javascript
📤 WebSocket Message Sent
URL: wss://api.example.com/workspace/session/agent?token=...
Data: {"type":"chat","message":"Hello","timestamp":1234567890}
Parsed JSON: {type: "chat", message: "Hello", timestamp: 1234567890}
```

#### Incoming Messages (📨):
```javascript
📨 WebSocket Message Received
URL: wss://api.example.com/workspace/session/agent?token=...
Raw Data: {"type":"response","content":"Hello! How can I help?","id":"msg123"}
Parsed JSON: {type: "response", content: "Hello! How can I help?", id: "msg123"}
```

#### Connection Events:
```javascript
✅ WebSocket Connected: wss://api.example.com/...
❌ WebSocket Disconnected: wss://api.example.com/... Code: 1000 Reason: Normal closure
🚨 WebSocket Error: wss://api.example.com/... [Error details]
```

### Advanced Debugging

#### Filtering Messages
Use the Console filter to focus on specific types:
- Type `WebSocket` to see only WebSocket-related logs
- Type `📨` to see only incoming messages
- Type `📤` to see only outgoing messages

#### Network Tab
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Filter by **WS** (WebSocket)
4. Refresh the page or trigger a new connection
5. Click on any WebSocket connection to see:
   - Headers and handshake details
   - All messages in real-time
   - Message timing and sizes

### Common Issues and Solutions

#### Issue: "Developer tools not opening"
**Solution**: 
- Make sure you're running in development mode (`npm start`)
- Try all available shortcuts: F12, Ctrl+F12, or Ctrl+Shift+I
- If F12 is used by another app (common on Windows), use Ctrl+F12 or Ctrl+Shift+I
- Use the WebSocket Debug Helper button to open tools programmatically
- Check the console logs to see which shortcuts were successfully registered

#### Issue: "No WebSocket connections visible"
**Solution**:
- Make sure you're logged in and have an active session
- Try triggering actions that use WebSocket (sending a chat message, starting recording)
- Check the Console for connection errors

#### Issue: "Debug script not working"
**Solution**:
- Make sure you pasted the script in the correct Console tab
- Refresh the page after pasting the script to catch new connections
- Check that the script executed without errors

#### Issue: "Can't see overlay window in debugger"
**Solution**:
- First make the overlay window visible (use Ctrl+\ shortcut)
- Then use F12 to open developer tools for the overlay
- The overlay window has its own separate developer tools instance

## Manual WebSocket Monitoring

If you prefer to manually monitor WebSocket connections without the debug script:

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Filter by **WS** (WebSocket) 
4. Look for connections with these patterns:
   - Chat: `wss://*/chat/*`
   - Transcription: `wss://*/transcription/*` 
   - Meeting: `wss://*/meeting/*`
5. Click on any connection to see real-time message flow

## Troubleshooting WebSocket Issues

### Connection Problems
- Check network connectivity
- Verify authentication tokens in localStorage
- Look for CORS or firewall issues in console errors

### Message Format Issues
- Ensure JSON messages are properly formatted
- Check for required fields in outgoing messages
- Validate message types match expected formats

### Performance Issues
- Monitor message frequency and size
- Check for message queue buildup
- Look for connection drops and reconnection attempts

## Getting Help

If you're still having trouble debugging WebSocket payloads:

1. Check the Console for any error messages
2. Take screenshots of the WebSocket traffic in the Network tab
3. Note which specific feature or window you're trying to debug
4. Include information about your Windows version and browser details

## Additional Resources

- [Electron DevTools Documentation](https://www.electronjs.org/docs/latest/tutorial/devtools)
- [Chrome DevTools WebSocket Guide](https://developer.chrome.com/docs/devtools/network/#websockets)
- [WebSocket API Reference](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
