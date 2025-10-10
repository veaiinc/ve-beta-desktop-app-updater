#import "NotchDropBridge.h"
#import "notchdrop_addon-Swift.h"
#import <Foundation/Foundation.h>

@implementation NotchDropBridge

static void (^statusChangedCallback)(NSString*);
static void (^fileDroppedCallback)(NSString*);
static void (^itemAddedCallback)(NSString*);
static void (^itemRemovedCallback)(NSString*);
static void (^swiftActionCallback)(NSString*, NSString*);
static void (^incomingActionCallback)(NSString*, NSString*);

// MARK: - Core NotchDrop functionality
+ (void)initializeNotchDrop {
    [NotchDropCore.shared initializeNotchDrop];
}

+ (void)showNotchDrop {
    [NotchDropCore.shared showNotchDrop];
}

+ (void)hideNotchDrop {
    [NotchDropCore.shared hideNotchDrop];
}

+ (void)toggleNotchDrop {
    [NotchDropCore.shared toggleNotchDrop];
}

+ (BOOL)isNotchDropVisible {
    return [NotchDropCore.shared isNotchDropVisible];
}

// MARK: - NotchDrop state management
+ (void)setNotchDropStatus:(NSString*)status {
    [NotchDropCore.shared setNotchDropStatus:status];
}

+ (NSString*)getNotchDropStatus {
    return [NotchDropCore.shared getNotchDropStatus];
}

+ (void)setNotchDropContentType:(NSString*)contentType {
    [NotchDropCore.shared setNotchDropContentType:contentType];
}

+ (NSString*)getNotchDropContentType {
    return [NotchDropCore.shared getNotchDropContentType];
}

// MARK: - File handling
+ (void)handleDroppedFiles:(NSArray*)filePaths {
    [NotchDropCore.shared handleDroppedFiles:filePaths];
}

+ (NSArray*)getCurrentItems {
    return [NotchDropCore.shared getCurrentItems];
}

+ (void)clearAllItems {
    [NotchDropCore.shared clearAllItems];
}

// MARK: - Settings
+ (void)setHapticFeedback:(BOOL)enabled {
    [NotchDropCore.shared setHapticFeedback:enabled];
}

+ (BOOL)getHapticFeedback {
    return [NotchDropCore.shared getHapticFeedback];
}

+ (void)setNotchVisible:(BOOL)visible {
    [NotchDropCore.shared setNotchVisible:visible];
}

+ (BOOL)getNotchVisible {
    return [NotchDropCore.shared getNotchVisible];
}

+ (NSDictionary*)getWindowPosition {
    return [NotchDropCore.shared getWindowPosition];
}

// MARK: - Callback setters
+ (void)setNotchDropStatusChangedCallback:(void(^)(NSString*))callback {
    statusChangedCallback = callback;
    [NotchDropCore.shared setNotchDropStatusChangedCallback:callback];
}

+ (void)setFileDroppedCallback:(void(^)(NSString*))callback {
    fileDroppedCallback = callback;
    [NotchDropCore.shared setFileDroppedCallback:callback];
}

+ (void)setItemAddedCallback:(void(^)(NSString*))callback {
    itemAddedCallback = callback;
    [NotchDropCore.shared setItemAddedCallback:callback];
}

+ (void)setItemRemovedCallback:(void(^)(NSString*))callback {
    itemRemovedCallback = callback;
    [NotchDropCore.shared setItemRemovedCallback:callback];
}

// MARK: - Swift Action Callback
+ (void)setSwiftActionCallback:(void(^)(NSString*, NSString*))callback {
    swiftActionCallback = callback;
    [NotchDropCore.shared setSwiftActionCallback:callback];
}

+ (void)setIncomingActionCallback:(void(^)(NSString*, NSString*))callback {
    incomingActionCallback = callback;
    [NotchDropCore.shared setIncomingActionCallback:callback];
}

+ (void)triggerSwiftAction:(NSString*)action data:(NSString*)data {
    [NotchDropCore.shared handleIncomingAction:action data:data];
}

// MARK: - Overlay State Integration
+ (void)onOverlayStateChange:(NSDictionary*)state {
    [NotchDropCore.shared onOverlayStateChange:state];
}

// MARK: - Voice Assistant Integration
+ (void)configureVoice:(NSString*)url token:(NSString*)token {
    [NotchDropCore.shared configureVoice:url token:token];
}

+ (void)connectVoiceAssistant {
    [NotchDropCore.shared connectVoiceAssistant];
}

+ (void)disconnectVoiceAssistant {
    [NotchDropCore.shared disconnectVoiceAssistant];
}

+ (NSString*)getVoiceConnectionStatus {
    return [NotchDropCore.shared getVoiceConnectionStatus];
}

+ (void)updateVoiceConnectionState:(NSString*)status {
    [NotchDropCore.shared updateVoiceConnectionState:status];
}

+ (void)updateVoiceMuteState:(BOOL)isMuted {
    [NotchDropCore.shared updateVoiceMuteState:isMuted];
}

+ (void)addVoiceMessage:(NSString*)messageJson {
    [NotchDropCore.shared addVoiceMessage:messageJson];
}

+ (void)addTranscriptionData:(NSString*)messageJson {
    NSLog(@"📝 Objective-C Bridge: Received transcription data: %@", messageJson);
    [NotchDropCore.shared addTranscriptionData:messageJson];
    NSLog(@"📝 Objective-C Bridge: Forwarded to Swift Core");
}

+ (void)sendLiveIntelligenceData:(NSString*)messageJson {
    NSLog(@"🧠 Objective-C Bridge: Received live intelligence data: %@", messageJson);
    [NotchDropCore.shared sendLiveIntelligenceData:messageJson];
    NSLog(@"🧠 Objective-C Bridge: Forwarded to Swift Core");
}

+ (void)replaceTranscriptions:(NSString*)messagesJson {
    NSLog(@"📝 Objective-C Bridge: Replace transcriptions: %@", messagesJson);
    [NotchDropCore.shared replaceTranscriptions:messagesJson];
}

// Toggle recording panel mode
+ (void)setRecordingPanelMode:(NSString*)mode {
    NSLog(@"🧭 Objective-C Bridge: setRecordingPanelMode=%@", mode);
    [NotchDropCore.shared setRecordingPanelMode:mode];
}

+ (void)clearLiveIntelligenceData {
    NSLog(@"🧠 Objective-C Bridge: Clearing live intelligence data");
    [NotchDropCore.shared clearLiveIntelligenceData];
}

+ (void)updateStealthModeState:(BOOL)isEnabled {
    [NotchDropCore.shared updateStealthModeState:isEnabled];
}

+ (void)handleExternalRecordingStateChange:(BOOL)isRecording isPaused:(BOOL)isPaused {
    NSLog(@"🔒 Objective-C Bridge: External recording state - isRecording: %@, isPaused: %@", 
          isRecording ? @"YES" : @"NO", isPaused ? @"YES" : @"NO");
    [NotchDropCore.shared handleExternalRecordingStateChange:isRecording isPaused:isPaused];
}

// MARK: - Advanced SwiftUI Components (stub implementations for missing methods)
+ (void)showAdvancedView {
    // Method not implemented in NotchDropCore - stub implementation
    NSLog(@"showAdvancedView called but not implemented in NotchDropCore");
}

+ (void)hideAdvancedView {
    // Method not implemented in NotchDropCore - stub implementation
    NSLog(@"hideAdvancedView called but not implemented in NotchDropCore");
}

+ (void)addNotification:(NSString*)text {
    // Method not implemented in NotchDropCore - stub implementation
    NSLog(@"addNotification called but not implemented in NotchDropCore");
}

+ (void)updateProgress:(double)progress {
    // Method not implemented in NotchDropCore - stub implementation
    NSLog(@"updateProgress called but not implemented in NotchDropCore");
}

+ (void)setProcessing:(BOOL)processing {
    // Method not implemented in NotchDropCore - stub implementation
    NSLog(@"setProcessing called but not implemented in NotchDropCore");
}

// MARK: - Advanced NotchDropLatest functionality
+ (void)showMenu {
    // Method not implemented in NotchDropCore - stub implementation
    NSLog(@"showMenu called but not implemented in NotchDropCore");
}

+ (void)showSettings {
    // Method not implemented in NotchDropCore - stub implementation
    NSLog(@"showSettings called but not implemented in NotchDropCore");
}

+ (void)showNormal {
    [NotchDropCore.shared showNormal];
}

+ (void)setAutoOpen:(BOOL)enabled {
    [NotchDropCore.shared setAutoOpen:enabled];
}

+ (BOOL)getAutoOpen {
    return [NotchDropCore.shared getAutoOpen];
}

+ (void)setLanguage:(NSString*)language {
    [NotchDropCore.shared setLanguage:language];
}

+ (NSString*)getLanguage {
    return [NotchDropCore.shared getLanguage];
}

+ (NSInteger)getTrayItemCount {
    return [NotchDropCore.shared getTrayItemCount];
}

+ (void)clearTrayItems {
    [NotchDropCore.shared clearTrayItems];
}

+ (NSString*)getStatusString {
    return [NotchDropCore.shared getStatusString];
}

+ (NSString*)getContentTypeString {
    return [NotchDropCore.shared getContentTypeString];
}

+ (void)setContentTypeFromString:(NSString*)contentType {
    [NotchDropCore.shared setContentTypeFromString:contentType];
}

// MARK: - Wake Word Detection Methods
+ (void)handleWakeWordDetected:(float)score {
    [NotchDropCore.shared handleWakeWordDetected:score];
}

@end
