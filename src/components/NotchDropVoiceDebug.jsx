import React, { useEffect, useState } from 'react';

const NotchDropVoiceDebug = () => {
    const [messages, setMessages] = useState([]);
    const [voiceAgentVisible, setVoiceAgentVisible] = useState(false);

    useEffect(() => {
        console.log('🔍 DEBUG: NotchDropVoiceDebug component mounted');
        
        const addDebugMessage = (message) => {
            console.log('🔍 DEBUG:', message);
            setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
        };

        // Listen for all possible voice activation events
        const handleSendChatMessage = (event, data) => {
            addDebugMessage(`Received send-chat-message-to-askai: ${JSON.stringify(data)}`);
            
            if (data && (data.type === 'ACTIVATE_VOICE_AGENT' || data.source === 'notchdrop_voice_button')) {
                addDebugMessage('✅ VOICE ACTIVATION DETECTED! Showing voice agent...');
                setVoiceAgentVisible(true);
                
                // Try to start voice agent
                setTimeout(() => {
                    addDebugMessage('🎤 Attempting to start voice agent...');
                    
                    // Import and use voice integration
                    import('../hooks/useVoiceIntegration').then(({ useVoiceIntegration }) => {
                        addDebugMessage('📞 Voice integration hook imported');
                    }).catch(error => {
                        addDebugMessage(`❌ Error importing voice integration: ${error.message}`);
                    });
                    
                }, 1000);
            }
        };

        const handleDirectVoiceAgent = (event, data) => {
            addDebugMessage(`Received notchdrop:showVoiceAgent: ${JSON.stringify(data)}`);
            setVoiceAgentVisible(true);
        };

        const handleCustomEvent = (event) => {
            addDebugMessage(`Received custom event: ${event.type}`);
            setVoiceAgentVisible(true);
        };

        // Set up all listeners
        if (window.electronApi && window.electronApi.ipcRenderer) {
            addDebugMessage('✅ electronApi available, setting up IPC listeners');
            
            window.electronApi.ipcRenderer.on('send-chat-message-to-askai', handleSendChatMessage);
            window.electronApi.ipcRenderer.on('notchdrop:showVoiceAgent', handleDirectVoiceAgent);
            window.electronApi.ipcRenderer.on('notchdrop:activate-voice-agent', handleDirectVoiceAgent);
        } else {
            addDebugMessage('❌ electronApi not available');
        }

        // Custom events
        window.addEventListener('notchdrop-voice-activate', handleCustomEvent);
        window.addEventListener('show-voice-agent', handleCustomEvent);

        // Check for global flags set by main process
        const checkGlobalFlags = () => {
            if (window.notchDropVoiceActivate) {
                addDebugMessage('✅ FOUND GLOBAL FLAG: notchDropVoiceActivate = true');
                setVoiceAgentVisible(true);
                window.notchDropVoiceActivate = false; // Reset flag
            }
        };

        // Check flags periodically
        const flagChecker = setInterval(checkGlobalFlags, 100);

        addDebugMessage('🔍 All voice activation listeners set up');

        return () => {
            clearInterval(flagChecker);
        };

        return () => {
            if (window.electronApi && window.electronApi.ipcRenderer) {
                window.electronApi.ipcRenderer.removeListener('send-chat-message-to-askai', handleSendChatMessage);
                window.electronApi.ipcRenderer.removeListener('notchdrop:showVoiceAgent', handleDirectVoiceAgent);
                window.electronApi.ipcRenderer.removeListener('notchdrop:activate-voice-agent', handleDirectVoiceAgent);
            }
            window.removeEventListener('notchdrop-voice-activate', handleCustomEvent);
            window.removeEventListener('show-voice-agent', handleCustomEvent);
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: '50px',
            right: '10px',
            width: '400px',
            maxHeight: '300px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '12px',
            zIndex: 10000,
            overflow: 'auto'
        }}>
            <h3>🔍 NotchDrop Voice Debug</h3>
            <p>Voice Agent Visible: {voiceAgentVisible ? '✅ YES' : '❌ NO'}</p>
            <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: '4px', fontSize: '11px' }}>
                        {msg}
                    </div>
                ))}
            </div>
            
            <button 
                onClick={() => {
                    setMessages([]);
                    setVoiceAgentVisible(false);
                }}
                style={{
                    marginTop: '10px',
                    padding: '4px 8px',
                    backgroundColor: '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Clear
            </button>
        </div>
    );
};

export default NotchDropVoiceDebug;
