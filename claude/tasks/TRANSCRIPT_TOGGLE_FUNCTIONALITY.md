# Transcript Toggle Functionality Implementation Plan

## Problem Statement
The transcript panel is not opening when clicking "Show Transcript" button in the LiveIntelligencePanel component.

## Research Phase
1. **Current Implementation Analysis**
   - LiveIntelligencePanel has "Show Transcript" button that calls `onShowTranscript` prop
   - OverlayApp passes `handleShowTranscript` function that sets `activePanel` to 'transcript'
   - TranscriptPanel should render when `activePanel === 'transcript'`

2. **Potential Issues to Investigate**
   - Event handler not firing correctly
   - State not updating properly
   - Prop passing issues
   - Component rendering conditions

## Implementation Plan
1. **Debug Current Flow**
   - Add console logs to trace the click event
   - Verify state changes are happening
   - Check if TranscriptPanel renders conditionally

2. **Potential Solutions**
   - Fix event handler if broken
   - Ensure proper prop passing
   - Consider state lifting if component communication is the issue
   - Add proper error boundaries

3. **Testing Strategy**
   - Test button click functionality
   - Verify panel switching works both ways
   - Ensure proper cleanup when switching panels

## Questions for User
1. Are there any console errors when clicking the button?
2. Does the Live Intelligence panel close when clicking "Show Transcript"?
3. Any specific behavior you observe vs expected behavior?

## Success Criteria
- Clicking "Show Transcript" in LiveIntelligencePanel opens TranscriptPanel
- Clicking "Show Live Intelligence" in TranscriptPanel switches back
- Smooth state transitions without errors