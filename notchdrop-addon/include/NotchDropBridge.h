#ifndef NotchDropBridge_h
#define NotchDropBridge_h

#import <Foundation/Foundation.h>

@interface NotchDropBridge : NSObject

// Core NotchDrop functionality
+ (void)initializeNotchDrop;
+ (void)showNotchDrop;
+ (void)hideNotchDrop;
+ (void)toggleNotchDrop;
+ (BOOL)isNotchDropVisible;

// NotchDrop state management
+ (void)setNotchDropStatus:(NSString*)status;
+ (NSString*)getNotchDropStatus;
+ (void)setNotchDropContentType:(NSString*)contentType;
+ (NSString*)getNotchDropContentType;

// File handling
+ (void)handleDroppedFiles:(NSArray*)filePaths;
+ (NSArray*)getCurrentItems;
+ (void)clearAllItems;

// Settings
+ (void)setHapticFeedback:(BOOL)enabled;
+ (BOOL)getHapticFeedback;
+ (void)setNotchVisible:(BOOL)visible;
+ (BOOL)getNotchVisible;
+ (void)setInteractionEnabled:(BOOL)enabled;

// Callbacks
+ (void)setNotchDropStatusChangedCallback:(void(^)(NSString*))callback;
+ (void)setFileDroppedCallback:(void(^)(NSString*))callback;
+ (void)setItemAddedCallback:(void(^)(NSString*))callback;
+ (void)setItemRemovedCallback:(void(^)(NSString*))callback;
+ (void)setSwiftActionCallback:(void(^)(NSString*, NSString*))callback;
+ (void)setIncomingActionCallback:(void(^)(NSString*, NSString*))callback;

// Swift Action Methods
+ (void)triggerSwiftAction:(NSString*)action data:(NSString*)data;

// Advanced SwiftUI Components
+ (void)showAdvancedView;
+ (void)hideAdvancedView;
+ (void)addNotification:(NSString*)text;
+ (void)updateProgress:(double)progress;
+ (void)setProcessing:(BOOL)processing;

// Window positioning
+ (NSDictionary*)getWindowPosition;

// Advanced NotchDropLatest functionality
+ (void)showMenu;
+ (void)showSettings;
+ (void)showNormal;
+ (void)setAutoOpen:(BOOL)enabled;
+ (BOOL)getAutoOpen;
+ (void)setLanguage:(NSString*)language;
+ (NSString*)getLanguage;
+ (NSInteger)getTrayItemCount;
+ (void)clearTrayItems;
+ (NSString*)getStatusString;
+ (NSString*)getContentTypeString;
+ (void)setContentTypeFromString:(NSString*)contentType;

// Overlay State Integration
+ (void)onOverlayStateChange:(NSDictionary*)state;

// Voice Assistant Integration
+ (void)configureVoice:(NSString*)url token:(NSString*)token;
+ (void)connectVoiceAssistant;
+ (void)disconnectVoiceAssistant;
+ (NSString*)getVoiceConnectionStatus;
+ (void)updateVoiceConnectionState:(NSString*)status;
+ (void)updateVoiceMuteState:(BOOL)isMuted;
+ (void)addVoiceMessage:(NSString*)messageJson;
+ (void)addTranscriptionData:(NSString*)messageJson;
+ (void)sendLiveIntelligenceData:(NSString*)messageJson;
 + (void)replaceTranscriptions:(NSString*)messagesJson;
// Toggle panel mode during recording ("transcription" | "live-intel")
 + (void)setRecordingPanelMode:(NSString*)mode;
+ (void)clearLiveIntelligenceData;
+ (void)updateStealthModeState:(BOOL)isEnabled;

// External Recording State Management
+ (void)handleExternalRecordingStateChange:(BOOL)isRecording isPaused:(BOOL)isPaused;

// Wake Word Detection Integration
+ (void)handleWakeWordDetected:(float)score;

@end

#endif /* NotchDropBridge_h */
