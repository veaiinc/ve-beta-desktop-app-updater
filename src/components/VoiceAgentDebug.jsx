import React, { useState, useEffect } from 'react';
import useVoiceIntegration from '../hooks/useVoiceIntegration';

const VoiceAgentDebug = () => {
    const [debugLogs, setDebugLogs] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const voiceIntegration = useVoiceIntegration();

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setDebugLogs(prev => [...prev.slice(-20), { timestamp, message, type }]);
        console.log(`🎤 [${timestamp}] ${message}`);
    };

    const handleStartVoiceAgent = async () => {
        try {
            addLog('🚀 Starting voice agent manually...', 'info');
            
            // Method 1: Try useVoiceIntegration
            if (voiceIntegration && voiceIntegration.connectToRoom) {
                addLog('📞 Found voiceIntegration.connectToRoom(), calling...', 'info');
                try {
                    const result = await voiceIntegration.connectToRoom();
                    addLog(`✅ voiceIntegration.connectToRoom() result: ${JSON.stringify(result)}`, 'success');
                    return;
                } catch (error) {
                    addLog(`❌ voiceIntegration.connectToRoom() failed: ${error.message}`, 'error');
                    // Fall through to direct API method
                }
            }

            // Method 2: Try direct API calls
            addLog('📞 Attempting direct API calls...', 'info');
            
            // Get auth data from localStorage
            const usertoken = localStorage.getItem('usertoken');
            const workspaceId = localStorage.getItem('workspaceId');
            
            // Get location from localStorage first, fallback to India location
            let location = JSON.parse(localStorage.getItem('location') || '{}');
            
            // If no location in localStorage, use the India location as fallback
            if (!location || Object.keys(location).length === 0) {
                addLog('⚠️ No location in localStorage, using India fallback', 'info');
                location = {
                    "countryCode": "IN",
                    "countryRegionCode": "TS", 
                    "countryRegion": "Telangana",
                    "country": "India",
                    "city": "Hyderabad",
                    "timezone": "Asia/Kolkata",
                    "postalCode": "500009",
                    "currency": "INR",
                    "region": "ap-south-1"
                };
            } else {
                addLog('✅ Using location from localStorage', 'success');
            }

            if (!usertoken || !workspaceId) {
                addLog('❌ Missing usertoken or workspaceId in localStorage', 'error');
                return;
            }

            addLog(`🔑 Using workspaceId: ${workspaceId}`, 'info');
            addLog(`🌍 Using location: ${JSON.stringify(location)}`, 'info');

            // Generate token
            const tokenUrl = `https://voice.us-east-1.ve.ai/${workspaceId}/generate-voice-agent-token`;
            addLog(`📡 Calling token API: ${tokenUrl}`, 'info');

            const tokenResponse = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': usertoken,
                    'Authorization': `Bearer ${usertoken}`
                },
                body: JSON.stringify({ location })
            });

            addLog(`📊 Token API response status: ${tokenResponse.status} ${tokenResponse.statusText}`, 'info');

            if (!tokenResponse.ok) {
                const errorText = await tokenResponse.text();
                addLog(`❌ Token API failed: ${tokenResponse.status} ${tokenResponse.statusText}`, 'error');
                addLog(`❌ Error response: ${errorText}`, 'error');
                return;
            }

            const tokenData = await tokenResponse.json();
            addLog(`✅ Raw token response: ${JSON.stringify(tokenData)}`, 'success');
            
            // Extract token from response
            const token = tokenData?.token || tokenData?.access_token;
            const roomName = tokenData?.room_name || tokenData?.roomName || tokenData?.room;
            
            addLog(`🔑 Extracted token length: ${token?.length || 'undefined'}`, 'info');
            addLog(`🏠 Extracted room name: ${roomName || 'undefined'}`, 'info');

            // Connect to LiveKit
            const liveKitUrl = `wss://ve-ai-voice-agent-ginreaey.livekit.cloud/rtc?access_token=${tokenData.token}&auto_subscribe=1&sdk=js&version=2.13.3&protocol=16`;
            addLog(`🔌 Connecting to LiveKit: ${liveKitUrl}`, 'info');

            // Create WebSocket connection
            const ws = new WebSocket(liveKitUrl);
            
            ws.onopen = () => {
                addLog('✅ LiveKit WebSocket connected!', 'success');
            };

            ws.onmessage = (event) => {
                addLog(`📨 LiveKit message: ${event.data}`, 'info');
            };

            ws.onerror = (error) => {
                addLog(`❌ LiveKit error: ${error}`, 'error');
            };

            ws.onclose = (event) => {
                addLog(`🔌 LiveKit closed: ${event.code} ${event.reason}`, 'info');
            };

        } catch (error) {
            addLog(`❌ Error starting voice agent: ${error.message}`, 'error');
        }
    };

    const clearLogs = () => {
        setDebugLogs([]);
    };

    const setLocationData = () => {
        const location = {
            "countryCode": "IN",
            "countryRegionCode": "TS", 
            "countryRegion": "Telangana",
            "country": "India",
            "city": "Hyderabad",
            "timezone": "Asia/Kolkata",
            "postalCode": "500009",
            "currency": "INR",
            "region": "ap-south-1"
        };
        localStorage.setItem('location', JSON.stringify(location));
        addLog('✅ Location data set in localStorage', 'success');
        addLog(`📍 Location: ${JSON.stringify(location)}`, 'info');
    };

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    // Listen for NotchDrop voice activation
    useEffect(() => {
        const handleVoiceActivation = (event) => {
            addLog(`🎤 Received voice activation event: ${event.type}`, 'info');
            if (event.detail) {
                addLog(`📋 Event details: ${JSON.stringify(event.detail)}`, 'info');
            }
            handleStartVoiceAgent();
        };

        window.addEventListener('start-voice-agent', handleVoiceActivation);
        window.addEventListener('notchdrop-voice-activate', handleVoiceActivation);

        return () => {
            window.removeEventListener('start-voice-agent', handleVoiceActivation);
            window.removeEventListener('notchdrop-voice-activate', handleVoiceActivation);
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 10000,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            maxWidth: '400px',
            border: '1px solid #333'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, marginRight: '10px' }}>🎤 Voice Agent Debug</h3>
                <button 
                    onClick={toggleVisibility}
                    style={{
                        backgroundColor: '#007acc',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '5px'
                    }}
                >
                    {isVisible ? 'Hide' : 'Show'}
                </button>
                <button 
                    onClick={handleStartVoiceAgent}
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '5px'
                    }}
                >
                    🚀 Start Voice Agent
                </button>
                <button 
                    onClick={clearLogs}
                    style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '5px'
                    }}
                >
                    Clear
                </button>
                <button 
                    onClick={setLocationData}
                    style={{
                        backgroundColor: '#6f42c1',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    📍 Set Location
                </button>
            </div>

            {isVisible && (
                <div style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '8px',
                    borderRadius: '4px'
                }}>
                    {debugLogs.length === 0 ? (
                        <div style={{ color: '#888' }}>No logs yet...</div>
                    ) : (
                        debugLogs.map((log, index) => (
                            <div 
                                key={index} 
                                style={{ 
                                    marginBottom: '2px',
                                    color: log.type === 'error' ? '#ff6b6b' : 
                                           log.type === 'success' ? '#51cf66' : '#74c0fc'
                                }}
                            >
                                <span style={{ color: '#888' }}>{log.timestamp}</span> {log.message}
                            </div>
                        ))
                    )}
                </div>
            )}

            <div style={{ marginTop: '8px', fontSize: '10px', color: '#888' }}>
                voiceIntegration available: {voiceIntegration ? '✅' : '❌'}<br/>
                localStorage usertoken: {localStorage.getItem('usertoken') ? '✅' : '❌'}<br/>
                localStorage workspaceId: {localStorage.getItem('workspaceId') ? '✅' : '❌'}
            </div>
        </div>
    );
};

export default VoiceAgentDebug;
