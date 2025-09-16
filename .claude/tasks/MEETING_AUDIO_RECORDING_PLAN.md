# Meeting Audio Recording & Playback Implementation Plan

## Overview

Implement a comprehensive audio recording and playback system for meetings that captures user microphone audio during meetings, saves it locally, and provides playback functionality with download options.

## Current Architecture Analysis

### Existing Audio Infrastructure

-   **Audio Recording**: Multiple existing hooks (`useAssemblyTranscription`, `useVoiceAgent`, `useNote`) handle real-time audio capture
-   **Meeting Structure**: Meetings are handled through `MeetBotContainer` with tabs for Summary, Transcript, and Meeting Intelligence
-   **Transcription Tabs**: `TranscriptionTabs` component manages tab navigation
-   **Electron Integration**: App runs in Electron with access to file system APIs

### Key Components Identified

1. **MeetBotContainer** (`src/views/features/meetBot/meetBotContainer.jsx`) - Main meeting interface
2. **TranscriptionTabs** (`src/views/components/notes/TranscriptionTabs.jsx`) - Tab navigation
3. **Audio Recording Hooks** - Existing infrastructure for microphone access
4. **Electron Main Process** - For file system operations

## Implementation Plan

### Phase 1: Audio Recording Infrastructure

1. **Create `useMeetingAudioRecorder` Hook**

    - Capture microphone audio during meetings
    - Save audio data in chunks to prevent memory issues
    - Handle recording start/stop/pause functionality
    - Integrate with existing meeting flow

2. **Implement Local Audio Storage Service**
    - Use Electron's file system APIs to save audio files locally
    - Create organized folder structure: `meetings/{meetingId}/audio/`
    - Support multiple audio formats (WebM, MP3)
    - Handle file naming with timestamps

### Phase 2: UI Integration

3. **Add "Play Audio" Tab**

    - Extend `TranscriptionTabs` component to include audio tab
    - Show tab only when audio recording is available for the meeting
    - Maintain consistent styling with existing tabs

4. **Create Audio Playback Component**
    - Custom audio player with play/pause/seek controls
    - Display audio duration and current position
    - Show download button for audio file
    - Handle audio loading states and errors

### Phase 3: Meeting Integration

5. **Integrate with MeetBotContainer**

    - Add audio recording state management
    - Handle audio tab rendering logic
    - Connect audio recording with meeting lifecycle
    - Store audio metadata with meeting data

6. **Electron Main Process Support**
    - Add IPC handlers for audio file operations
    - Implement secure file storage paths
    - Handle file permissions and cleanup

### Phase 4: Data Management

7. **Audio Metadata System**
    - Store audio file paths linked to meeting IDs
    - Track recording start/end times
    - Handle audio file cleanup for deleted meetings
    - Implement audio file size management

## Technical Specifications

### Audio Recording

-   **Format**: WebM with Opus codec (browser native)
-   **Quality**: 16kHz sample rate, mono channel
-   **Storage**: Local file system via Electron
-   **Chunking**: 5-second audio chunks to prevent memory issues

### File Structure

```
app-data/
  meetings/
    {meetingId}/
      audio/
        recording.webm
        metadata.json
```

### API Design

```javascript
// useMeetingAudioRecorder hook
const {
  isRecording,
  startRecording,
  stopRecording,
  pauseRecording,
  audioFile,
  recordingDuration,
  error
} = useMeetingAudioRecorder(meetingId);

// Audio storage service
const audioStorage = {
  saveAudio: (meetingId, audioBlob) => Promise<string>,
  getAudio: (meetingId) => Promise<AudioFile>,
  deleteAudio: (meetingId) => Promise<void>,
  getAudioMetadata: (meetingId) => Promise<AudioMetadata>
};
```

## Implementation Steps

### Step 1: Create Audio Recording Hook

-   Implement `useMeetingAudioRecorder` with MediaRecorder API
-   Handle microphone permissions and errors
-   Integrate with existing meeting state management

### Step 2: Build Audio Storage Service

-   Create Electron IPC handlers for file operations
-   Implement secure file storage with proper permissions
-   Add error handling and cleanup mechanisms

### Step 3: Extend UI Components

-   Add "Play Audio" tab to `TranscriptionTabs`
-   Create `AudioPlayback` component with full controls
-   Integrate with existing meeting interface

### Step 4: Connect Everything

-   Wire audio recording to meeting lifecycle
-   Handle audio file metadata storage
-   Implement download functionality
-   Add proper error handling and user feedback

## Success Criteria

1. ✅ Audio recording starts automatically when meeting begins
2. ✅ Audio files are saved locally and linked to meeting IDs
3. ✅ "Play Audio" tab appears in meeting interface
4. ✅ Users can play/pause/seek through recorded audio
5. ✅ Download functionality works for audio files
6. ✅ Audio files persist across app restarts
7. ✅ Proper cleanup when meetings are deleted

## Risk Mitigation

-   **Memory Management**: Use chunked recording to prevent memory issues
-   **File Permissions**: Implement proper Electron file system security
-   **Browser Compatibility**: Use MediaRecorder API with fallbacks
-   **Storage Limits**: Implement audio file cleanup and size management
-   **User Experience**: Provide clear feedback for recording states

## Future Enhancements

-   Audio compression and optimization
-   Multiple audio format support
-   Audio transcription synchronization
-   Cloud storage integration
-   Audio sharing capabilities
