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

// Callbacks
+ (void)setNotchDropStatusChangedCallback:(void(^)(NSString*))callback;
+ (void)setFileDroppedCallback:(void(^)(NSString*))callback;
+ (void)setItemAddedCallback:(void(^)(NSString*))callback;
+ (void)setItemRemovedCallback:(void(^)(NSString*))callback;
+ (void)setSwiftActionCallback:(void(^)(NSString*, NSString*))callback;

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
+ (void)addVoiceMessage:(NSString*)messageJson;

@end

#endif /* NotchDropBridge_h */
