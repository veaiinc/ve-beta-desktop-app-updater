import React, { useEffect } from 'react';
import { message } from 'antd';

const QuickDebugAccess = () => {
    useEffect(() => {
        const handleKeyPress = (event) => {
            // Listen for Ctrl + Alt + D to open dev tools
            if (event.ctrlKey && event.altKey && event.key === 'd') {
                event.preventDefault();
                openDevTools();
            }
            
            // Listen for Ctrl + Alt + N to open Network tab specifically
            if (event.ctrlKey && event.altKey && event.key === 'n') {
                event.preventDefault();
                openDevToolsNetwork();
            }
        };

        const openDevTools = async () => {
            try {
                const result = await window.electronApi?.openDevTools({ targetWindow: 'current', mode: 'detach' });
                if (result?.success) {
                    message.success('Developer Tools opened! Go to Console/Network tab');
                } else {
                    message.error('Failed to open Developer Tools');
                }
            } catch (error) {
                console.error('Error opening dev tools:', error);
                message.error('Error opening Developer Tools');
            }
        };

        const openDevToolsNetwork = async () => {
            try {
                const result = await window.electronApi?.openDevTools({ targetWindow: 'current', mode: 'detach' });
                if (result?.success) {
                    message.success('Developer Tools opened! Switch to Network tab and filter by "WS" for WebSocket traffic');
                } else {
                    message.error('Failed to open Developer Tools');
                }
            } catch (error) {
                console.error('Error opening dev tools:', error);
                message.error('Error opening Developer Tools');
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleKeyPress);

        // Show initial instructions
        setTimeout(() => {
            if (process.env.NODE_ENV === 'development') {
                console.log('🚀 Quick Debug Access:');
                console.log('  Ctrl+Alt+D - Open Developer Tools');
                console.log('  Ctrl+Alt+N - Open Developer Tools (Network focus)');
                console.log('  Ctrl+Alt+A - Toggle Ask AI window');
            }
        }, 3000);

        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return null; // This component doesn't render anything
};

export default QuickDebugAccess;
