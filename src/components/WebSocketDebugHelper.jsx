import React, { useState } from 'react';
import { Button, Card, Typography, Space, message } from 'antd';
import { BugOutlined, ToolOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const WebSocketDebugHelper = () => {
    const [isVisible, setIsVisible] = useState(false);

    const openDevTools = async (targetWindow = 'current') => {
        try {
            // Use the IPC handler we created in main.js
            const result = await window.electronApi?.openDevTools({ targetWindow, mode: 'detach' });
            
            if (result?.success) {
                message.success(`Developer tools ${result.action} for ${targetWindow} window`);
            } else {
                message.error(result?.error || 'Failed to open developer tools');
            }
        } catch (error) {
            console.error('Error opening dev tools:', error);
            message.error('Error opening developer tools');
        }
    };

    const copyDebugScript = () => {
        const debugScript = `
// WebSocket Debug Helper - Paste this in Console
const debugWebSocket = () => {
    // Monitor all WebSocket connections
    const originalWebSocket = window.WebSocket;
    
    window.WebSocket = function(url, protocols) {
        console.group('🔌 New WebSocket Connection');
        console.log('URL:', url);
        console.log('Protocols:', protocols);
        console.groupEnd();
        
        const ws = new originalWebSocket(url, protocols);
        
        // Log connection events
        ws.addEventListener('open', (event) => {
            console.log('✅ WebSocket Connected:', url);
        });
        
        ws.addEventListener('close', (event) => {
            console.log('❌ WebSocket Disconnected:', url, 'Code:', event.code, 'Reason:', event.reason);
        });
        
        ws.addEventListener('error', (event) => {
            console.error('🚨 WebSocket Error:', url, event);
        });
        
        // Log all messages
        ws.addEventListener('message', (event) => {
            console.group('📨 WebSocket Message Received');
            console.log('URL:', url);
            console.log('Raw Data:', event.data);
            
            try {
                const parsed = JSON.parse(event.data);
                console.log('Parsed JSON:', parsed);
            } catch (e) {
                console.log('Not JSON data');
            }
            
            console.groupEnd();
        });
        
        // Override send to log outgoing messages
        const originalSend = ws.send;
        ws.send = function(data) {
            console.group('📤 WebSocket Message Sent');
            console.log('URL:', url);
            console.log('Data:', data);
            
            try {
                const parsed = JSON.parse(data);
                console.log('Parsed JSON:', parsed);
            } catch (e) {
                console.log('Not JSON data');
            }
            
            console.groupEnd();
            return originalSend.call(this, data);
        };
        
        return ws;
    };
    
    console.log('🔍 WebSocket debugging enabled! All WebSocket traffic will be logged.');
};

// Run the debug function
debugWebSocket();
        `.trim();

        navigator.clipboard.writeText(debugScript).then(() => {
            message.success('Debug script copied to clipboard! Paste it in the Console tab of Developer Tools.');
        }).catch(() => {
            message.error('Failed to copy to clipboard');
        });
    };

    if (!isVisible) {
        return (
            <Button 
                icon={<BugOutlined />} 
                onClick={() => setIsVisible(true)}
                style={{ 
                    position: 'fixed', 
                    bottom: 20, 
                    right: 20, 
                    zIndex: 1000,
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    color: 'white'
                }}
                size="large"
            >
                WebSocket Debug
            </Button>
        );
    }

    return (
        <Card
            title={
                <Space>
                    <BugOutlined />
                    WebSocket Debug Helper
                </Space>
            }
            extra={<Button type="text" onClick={() => setIsVisible(false)}>×</Button>}
            style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: 400,
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={5}>
                    <InfoCircleOutlined /> Debug WebSocket Payloads
                </Title>
                
                <Paragraph>
                    <Text strong>Step 1:</Text> Open Developer Tools
                </Paragraph>
                
                <Space wrap>
                    <Button 
                        icon={<ToolOutlined />} 
                        onClick={() => openDevTools('current')}
                        type="primary"
                    >
                        Current Window
                    </Button>
                    <Button 
                        icon={<ToolOutlined />} 
                        onClick={() => openDevTools('main')}
                    >
                        Main Window
                    </Button>
                    <Button 
                        icon={<ToolOutlined />} 
                        onClick={() => openDevTools('overlay')}
                    >
                        Overlay Window
                    </Button>
                </Space>

                <Paragraph>
                    <Text strong>Step 2:</Text> Enable WebSocket Logging
                </Paragraph>

                <Button 
                    onClick={copyDebugScript}
                    block
                    type="dashed"
                >
                    Copy Debug Script to Clipboard
                </Button>

                <Paragraph style={{ fontSize: '12px', color: '#666' }}>
                    <Text strong>Windows Shortcuts:</Text><br/>
                    • <Text code>F12</Text> - Toggle Developer Tools (if available)<br/>
                    • <Text code>Ctrl+F12</Text> - Alternative if F12 is taken<br/>
                    • <Text code>Ctrl+Shift+I</Text> - Alternative shortcut<br/>
                    • <Text code>Ctrl+Alt+A</Text> - Toggle Ask AI window<br/><br/>
                    
                    <Text strong>Instructions:</Text><br/>
                    1. Click "Copy Debug Script" above<br/>
                    2. Click a "Dev Tools" button above<br/>
                    3. Go to Console tab<br/>
                    4. Paste and press Enter<br/>
                    5. Go to Network tab to see WebSocket traffic<br/>
                    6. All WebSocket messages will be logged!
                </Paragraph>
            </Space>
        </Card>
    );
};

export default WebSocketDebugHelper;
