#import <Foundation/Foundation.h>
#import "NotchDropBridge.h"
#include <napi.h>

class NotchDropAddon : public Napi::ObjectWrap<NotchDropAddon> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports) {
        Napi::Function func = DefineClass(env, "NotchDropAddon", {
            InstanceMethod("initialize", &NotchDropAddon::Initialize),
            InstanceMethod("show", &NotchDropAddon::Show),
            InstanceMethod("hide", &NotchDropAddon::Hide),
            InstanceMethod("toggle", &NotchDropAddon::Toggle),
            InstanceMethod("isVisible", &NotchDropAddon::IsVisible),
            InstanceMethod("setStatus", &NotchDropAddon::SetStatus),
            InstanceMethod("getStatus", &NotchDropAddon::GetStatus),
            InstanceMethod("setContentType", &NotchDropAddon::SetContentType),
            InstanceMethod("getContentType", &NotchDropAddon::GetContentType),
            InstanceMethod("handleDroppedFiles", &NotchDropAddon::HandleDroppedFiles),
            InstanceMethod("getCurrentItems", &NotchDropAddon::GetCurrentItems),
            InstanceMethod("clearAllItems", &NotchDropAddon::ClearAllItems),
            InstanceMethod("setHapticFeedback", &NotchDropAddon::SetHapticFeedback),
            InstanceMethod("getHapticFeedback", &NotchDropAddon::GetHapticFeedback),
            InstanceMethod("setNotchVisible", &NotchDropAddon::SetNotchVisible),
            InstanceMethod("getNotchVisible", &NotchDropAddon::GetNotchVisible),
            InstanceMethod("getWindowPosition", &NotchDropAddon::GetWindowPosition),
            InstanceMethod("configureVoice", &NotchDropAddon::ConfigureVoice),
            InstanceMethod("connectVoiceAssistant", &NotchDropAddon::ConnectVoiceAssistant),
            InstanceMethod("disconnectVoiceAssistant", &NotchDropAddon::DisconnectVoiceAssistant),
            InstanceMethod("getVoiceConnectionStatus", &NotchDropAddon::GetVoiceConnectionStatus),
            InstanceMethod("updateVoiceConnectionState", &NotchDropAddon::UpdateVoiceConnectionState),
            InstanceMethod("updateVoiceMuteState", &NotchDropAddon::UpdateVoiceMuteState),
            InstanceMethod("addVoiceMessage", &NotchDropAddon::AddVoiceMessage),
            InstanceMethod("addTranscriptionData", &NotchDropAddon::AddTranscriptionData),
            InstanceMethod("sendLiveIntelligenceData", &NotchDropAddon::SendLiveIntelligenceData),
  InstanceMethod("replaceTranscriptions", &NotchDropAddon::ReplaceTranscriptions),
            InstanceMethod("setRecordingPanelMode", &NotchDropAddon::SetRecordingPanelMode),
            InstanceMethod("clearLiveIntelligenceData", &NotchDropAddon::ClearLiveIntelligenceData),
            InstanceMethod("updateStealthModeState", &NotchDropAddon::UpdateStealthModeState),
            InstanceMethod("handleWakeWordDetected", &NotchDropAddon::HandleWakeWordDetected),
            InstanceMethod("triggerSwiftAction", &NotchDropAddon::TriggerSwiftAction),
            InstanceMethod("on", &NotchDropAddon::On)
        });

        exports.Set("NotchDropAddon", func);
        return exports;
    }

    struct CallbackData {
        std::string eventType;
        std::string payload;
        NotchDropAddon* addon;
    };

    NotchDropAddon(const Napi::CallbackInfo& info)
        : Napi::ObjectWrap<NotchDropAddon>(info)
        , env_(info.Env())
        , emitter(Napi::Persistent(Napi::Object::New(info.Env())))
        , callbacks(Napi::Persistent(Napi::Object::New(info.Env())))
        , tsfn_(nullptr) {

        napi_status status = napi_create_threadsafe_function(
            env_,
            nullptr,
            nullptr,
            Napi::String::New(env_, "NotchDropCallback"),
            0,
            1,
            nullptr,
            nullptr,
            this,
            [](napi_env env, napi_value js_callback, void* context, void* data) {
                auto* callbackData = static_cast<CallbackData*>(data);
                if (!callbackData) return;

                Napi::Env napi_env(env);
                Napi::HandleScope scope(napi_env);

                auto addon = static_cast<NotchDropAddon*>(context);
                if (!addon) {
                    delete callbackData;
                    return;
                }

                try {
                    auto callback = addon->callbacks.Value().Get(callbackData->eventType).As<Napi::Function>();
                    if (callback.IsFunction()) {
                        callback.Call(addon->emitter.Value(), {Napi::String::New(napi_env, callbackData->payload)});
                    }
                } catch (...) {}

                delete callbackData;
            },
            &tsfn_
        );

        if (status != napi_ok) {
            Napi::Error::New(env_, "Failed to create threadsafe function").ThrowAsJavaScriptException();
            return;
        }

        auto makeCallback = [this](const char* eventType) {
            return ^(NSString* payload) {
                if (tsfn_ != nullptr) {
                    auto* data = new CallbackData{
                        eventType,
                        std::string([payload UTF8String]),
                        this
                    };
                    napi_call_threadsafe_function(tsfn_, data, napi_tsfn_blocking);
                }
            };
        };

        // Set up callbacks for NotchDrop events
        [NotchDropBridge setNotchDropStatusChangedCallback:makeCallback("statusChanged")];
        [NotchDropBridge setFileDroppedCallback:makeCallback("fileDropped")];
        [NotchDropBridge setItemAddedCallback:makeCallback("itemAdded")];
        [NotchDropBridge setItemRemovedCallback:makeCallback("itemRemoved")];
        
        // Set up Swift action callback - THIS WAS MISSING!
        [NotchDropBridge setSwiftActionCallback:^(NSString* action, NSString* data) {
            if (tsfn_ != nullptr) {
                // Combine action and data into a single string for JavaScript
                NSString* actionData = [NSString stringWithFormat:@"%@:%@", action, data];
                auto* callbackData = new CallbackData{
                    "swiftAction",
                    std::string([actionData UTF8String]),
                    this
                };
                napi_call_threadsafe_function(tsfn_, callbackData, napi_tsfn_blocking);
            }
        }];
        
        // Set up incoming action callback (for actions from JavaScript to Swift)
        [NotchDropBridge setIncomingActionCallback:^(NSString* action, NSString* data) {
            // This callback is not used in the current implementation
            // The triggerSwiftAction method directly calls handleIncomingAction
        }];
    }

    ~NotchDropAddon() {
        if (tsfn_ != nullptr) {
            napi_release_threadsafe_function(tsfn_, napi_tsfn_release);
            tsfn_ = nullptr;
        }
    }

private:
    Napi::Env env_;
    Napi::ObjectReference emitter;
    Napi::ObjectReference callbacks;
    napi_threadsafe_function tsfn_;

    Napi::Value Initialize(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        [NotchDropBridge initializeNotchDrop];
        return env.Undefined();
    }

    Napi::Value Show(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        [NotchDropBridge showNotchDrop];
        return env.Undefined();
    }

    Napi::Value Hide(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        [NotchDropBridge hideNotchDrop];
        return env.Undefined();
    }

    Napi::Value Toggle(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        [NotchDropBridge toggleNotchDrop];
        return env.Undefined();
    }

    Napi::Value IsVisible(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        BOOL isVisible = [NotchDropBridge isNotchDropVisible];
        return Napi::Boolean::New(env, isVisible);
    }

    Napi::Value SetStatus(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsString()) {
            Napi::TypeError::New(env, "Expected string argument").ThrowAsJavaScriptException();
            return env.Null();
        }
        std::string status = info[0].As<Napi::String>();
        NSString* nsStatus = [NSString stringWithUTF8String:status.c_str()];
        [NotchDropBridge setNotchDropStatus:nsStatus];
        return env.Undefined();
    }

    Napi::Value GetStatus(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        NSString* status = [NotchDropBridge getNotchDropStatus];
        return Napi::String::New(env, [status UTF8String]);
    }

    Napi::Value SetContentType(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsString()) {
            Napi::TypeError::New(env, "Expected string argument").ThrowAsJavaScriptException();
            return env.Null();
        }
        std::string contentType = info[0].As<Napi::String>();
        NSString* nsContentType = [NSString stringWithUTF8String:contentType.c_str()];
        [NotchDropBridge setNotchDropContentType:nsContentType];
        return env.Undefined();
    }

    Napi::Value GetContentType(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        NSString* contentType = [NotchDropBridge getNotchDropContentType];
        return Napi::String::New(env, [contentType UTF8String]);
    }

    Napi::Value HandleDroppedFiles(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsArray()) {
            Napi::TypeError::New(env, "Expected array argument").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        Napi::Array jsArray = info[0].As<Napi::Array>();
        NSMutableArray* filePaths = [NSMutableArray array];
        
        for (uint32_t i = 0; i < jsArray.Length(); i++) {
            Napi::Value item = jsArray.Get(i);
            if (item.IsString()) {
                std::string filePath = item.As<Napi::String>();
                NSString* nsFilePath = [NSString stringWithUTF8String:filePath.c_str()];
                [filePaths addObject:nsFilePath];
            }
        }
        
        [NotchDropBridge handleDroppedFiles:filePaths];
        return env.Undefined();
    }

    Napi::Value GetCurrentItems(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        NSArray* items = [NotchDropBridge getCurrentItems];
        
        Napi::Array jsArray = Napi::Array::New(env, items.count);
        for (NSUInteger i = 0; i < items.count; i++) {
            NSString* item = items[i];
            jsArray.Set(i, Napi::String::New(env, [item UTF8String]));
        }
        
        return jsArray;
    }

    Napi::Value ClearAllItems(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        [NotchDropBridge clearAllItems];
        return env.Undefined();
    }

    Napi::Value SetHapticFeedback(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsBoolean()) {
            Napi::TypeError::New(env, "Expected boolean argument").ThrowAsJavaScriptException();
            return env.Null();
        }
        BOOL enabled = info[0].As<Napi::Boolean>();
        [NotchDropBridge setHapticFeedback:enabled];
        return env.Undefined();
    }

    Napi::Value GetHapticFeedback(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        BOOL enabled = [NotchDropBridge getHapticFeedback];
        return Napi::Boolean::New(env, enabled);
    }

    Napi::Value SetNotchVisible(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsBoolean()) {
            Napi::TypeError::New(env, "Expected boolean argument").ThrowAsJavaScriptException();
            return env.Null();
        }
        BOOL visible = info[0].As<Napi::Boolean>();
        [NotchDropBridge setNotchVisible:visible];
        return env.Undefined();
    }

    Napi::Value GetNotchVisible(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        BOOL visible = [NotchDropBridge getNotchVisible];
        return Napi::Boolean::New(env, visible);
    }

    Napi::Value GetWindowPosition(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        NSDictionary* position = [NotchDropBridge getWindowPosition];
        
        Napi::Object result = Napi::Object::New(env);
        result.Set("x", Napi::Number::New(env, [position[@"x"] doubleValue]));
        result.Set("y", Napi::Number::New(env, [position[@"y"] doubleValue]));
        result.Set("width", Napi::Number::New(env, [position[@"width"] doubleValue]));
        result.Set("height", Napi::Number::New(env, [position[@"height"] doubleValue]));
        
        return result;
    }

    Napi::Value TriggerSwiftAction(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 2 || !info[0].IsString() || !info[1].IsString()) {
            Napi::TypeError::New(env, "Expected (string, string) arguments").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        std::string action = info[0].As<Napi::String>();
        std::string data = info[1].As<Napi::String>();
        
        NSString* nsAction = [NSString stringWithUTF8String:action.c_str()];
        NSString* nsData = [NSString stringWithUTF8String:data.c_str()];
        
        [NotchDropBridge triggerSwiftAction:nsAction data:nsData];
        return env.Undefined();
    }

    Napi::Value On(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 2 || !info[0].IsString() || !info[1].IsFunction()) {
            Napi::TypeError::New(env, "Expected (string, function) arguments").ThrowAsJavaScriptException();
            return env.Undefined();
        }

        callbacks.Value().Set(info[0].As<Napi::String>(), info[1].As<Napi::Function>());
        return env.Undefined();
    }

    // MARK: - Voice Assistant Methods
    
    Napi::Value ConfigureVoice(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 2 || !info[0].IsString() || !info[1].IsString()) {
            Napi::TypeError::New(env, "Expected (string, string) arguments for URL and token").ThrowAsJavaScriptException();
            return env.Undefined();
        }
        
        std::string url = info[0].As<Napi::String>();
        std::string token = info[1].As<Napi::String>();
        
        NSString* nsURL = [NSString stringWithUTF8String:url.c_str()];
        NSString* nsToken = [NSString stringWithUTF8String:token.c_str()];
        
        [NotchDropBridge configureVoice:nsURL token:nsToken];
        return env.Undefined();
    }
    
    Napi::Value ConnectVoiceAssistant(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        [NotchDropBridge connectVoiceAssistant];
        return env.Undefined();
    }
    
    Napi::Value DisconnectVoiceAssistant(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        [NotchDropBridge disconnectVoiceAssistant];
        return env.Undefined();
    }
    
    Napi::Value GetVoiceConnectionStatus(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        NSString* status = [NotchDropBridge getVoiceConnectionStatus];
        return Napi::String::New(env, [status UTF8String]);
    }
    
    Napi::Value UpdateVoiceConnectionState(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsString()) {
            Napi::TypeError::New(env, "Expected string argument").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        std::string status = info[0].As<Napi::String>();
        NSString* nsStatus = [NSString stringWithUTF8String:status.c_str()];
        [NotchDropBridge updateVoiceConnectionState:nsStatus];
        return env.Undefined();
    }

    Napi::Value UpdateVoiceMuteState(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsBoolean()) {
            Napi::TypeError::New(env, "Expected boolean argument").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        bool isMuted = info[0].As<Napi::Boolean>();
        [NotchDropBridge updateVoiceMuteState:isMuted];
        return env.Undefined();
    }
    
    Napi::Value AddVoiceMessage(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsString()) {
            Napi::TypeError::New(env, "Expected string argument").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        std::string messageJson = info[0].As<Napi::String>();
        NSString* nsMessageJson = [NSString stringWithUTF8String:messageJson.c_str()];
        [NotchDropBridge addVoiceMessage:nsMessageJson];
        return env.Undefined();
    }
    
    Napi::Value AddTranscriptionData(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsString()) {
            Napi::TypeError::New(env, "Expected string argument").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        std::string messageJson = info[0].As<Napi::String>();
        NSString* nsMessageJson = [NSString stringWithUTF8String:messageJson.c_str()];
        
        // Console log in C++ bridge
        NSLog(@"📝 C++ Bridge: Received transcription data JSON: %@", nsMessageJson);
        
        [NotchDropBridge addTranscriptionData:nsMessageJson];
        NSLog(@"📝 C++ Bridge: Forwarded to Objective-C bridge");
        
        return env.Undefined();
    }

    Napi::Value SendLiveIntelligenceData(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsString()) {
            Napi::TypeError::New(env, "Expected string argument").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        std::string messageJson = info[0].As<Napi::String>();
        NSString* nsMessageJson = [NSString stringWithUTF8String:messageJson.c_str()];
        
        // Console log in C++ bridge
        NSLog(@"🧠 C++ Bridge: Received live intelligence data JSON: %@", nsMessageJson);
        
        [NotchDropBridge sendLiveIntelligenceData:nsMessageJson];
        NSLog(@"🧠 C++ Bridge: Forwarded to Objective-C bridge");
        
        return env.Undefined();
    }
    
    Napi::Value ReplaceTranscriptions(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsString()) {
            Napi::TypeError::New(env, "Expected JSON string array").ThrowAsJavaScriptException();
            return env.Null();
        }
        std::string arrayJson = info[0].As<Napi::String>();
        NSString* nsArrayJson = [NSString stringWithUTF8String:arrayJson.c_str()];
        NSLog(@"📝 C++ Bridge: Replace transcriptions JSON count=%lu", (unsigned long)[nsArrayJson length]);
        [NotchDropBridge replaceTranscriptions:nsArrayJson];
        return env.Undefined();
    }

    Napi::Value SetRecordingPanelMode(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsString()) {
            Napi::TypeError::New(env, "Expected mode string").ThrowAsJavaScriptException();
            return env.Null();
        }
        std::string mode = info[0].As<Napi::String>();
        NSString* nsMode = [NSString stringWithUTF8String:mode.c_str()];
        [NotchDropBridge setRecordingPanelMode:nsMode];
        return env.Undefined();
    }

    Napi::Value ClearLiveIntelligenceData(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        
        // Console log in C++ bridge
        NSLog(@"🧠 C++ Bridge: Clearing live intelligence data");
        
        [NotchDropBridge clearLiveIntelligenceData];
        NSLog(@"🧠 C++ Bridge: Forwarded clear request to Objective-C bridge");
        
        return env.Undefined();
    }
        Napi::Value UpdateStealthModeState(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsBoolean()) {
            Napi::TypeError::New(env, "Expected boolean argument").ThrowAsJavaScriptException();
            return env.Null();
        }

        bool isEnabled = info[0].As<Napi::Boolean>();
        [NotchDropBridge updateStealthModeState:isEnabled];
        return env.Undefined();
    }
    
    // MARK: - Wake Word Detection Methods
    
    Napi::Value HandleWakeWordDetected(const Napi::CallbackInfo& info) {
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsNumber()) {
            Napi::TypeError::New(env, "Expected number argument").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        float score = info[0].As<Napi::Number>().FloatValue();
        [NotchDropBridge handleWakeWordDetected:score];
        return env.Undefined();
    }
};

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    return NotchDropAddon::Init(env, exports);
}

NODE_API_MODULE(notchdrop_addon, Init)
