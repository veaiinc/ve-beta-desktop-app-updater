import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useVoiceAgent } from './useVoiceAgent';
import { useVoiceIntegration } from '../../../hooks/useVoiceIntegration';
import './VoiceAgent.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as UserSoundSvg } from '../../../assets/svg/chat/UserSound.svg';
import { ReactComponent as MicSvg } from '../../../assets/svg/ai_agents/mic.svg';

const VoiceAgentParent = () => {
	const location = useLocation();
	const isHomePage = location.pathname === '/demo' || location.pathname === '/';
	const [isActive, setIsActive] = useState(true);
	const [position, setPosition] = useState({ x: window.innerWidth / 2 - 125, y: 0 });
	const containerRef = useRef(null);
	const isDraggingRef = useRef(false);
	const startPosRef = useRef({ x: 0, y: 0 });

	const userToken = localStorage.getItem('usertoken');
	const [token, setToken] = useState(userToken);
	const [autoStartTriggered, setAutoStartTriggered] = useState(false);

	// Use the working voice integration that generates tokens
	const voiceIntegration = useVoiceIntegration();

	const {
		isConnected: wsConnected,
		isRecording: wsRecording,
		isConnecting: wsConnecting,
		messages,
		micStatus,
		addMessage,
		connectAndStart: wsConnectAndStart,
		disconnect: wsDisconnect,
	} = useVoiceAgent(token);

	// Use the working voice integration for actual connection
	const isConnected = voiceIntegration.isConnected || wsConnected;
	const isRecording = voiceIntegration.isMuted ? false : wsRecording;
	const isConnecting = wsConnecting;

	// Auto-start voice agent when component mounts (triggered by NotchDrop)
	useEffect(() => {
		if (!autoStartTriggered && !isConnected && !isConnecting) {
			console.log(
				'🎤 DIRECT: VoiceAgentParent mounted - auto-starting with token generation...',
			);
			setAutoStartTriggered(true);

			setTimeout(async () => {
				console.log('🎤 DIRECT: Calling connectToRoom() with token generation...');
				try {
					// Use the working voice integration that generates tokens and connects to LiveKit
					await voiceIntegration.connectToRoom();
					console.log('✅ DIRECT: Voice integration connected successfully');
				} catch (error) {
					console.error('❌ DIRECT: Voice integration failed:', error);
					// Fallback to WebSocket approach
					console.log('🔄 DIRECT: Falling back to WebSocket approach...');
					wsConnectAndStart();
				}
			}, 500);
		}
	}, [voiceIntegration, isConnected, isConnecting, autoStartTriggered, wsConnectAndStart]);

	const connectAndStart = useCallback(async () => {
		console.log('🎤 DIRECT: Manual connect triggered');
		try {
			await voiceIntegration.connectToRoom();
		} catch (error) {
			console.error('❌ Voice integration failed, using fallback:', error);
			wsConnectAndStart();
		}
	}, [voiceIntegration, wsConnectAndStart]);

	const disconnect = useCallback(async () => {
		console.log('🎤 DIRECT: Disconnect triggered');
		try {
			await voiceIntegration.disconnect();
		} catch (error) {
			console.error('❌ Voice integration disconnect failed:', error);
		}
		wsDisconnect();
	}, [voiceIntegration, wsDisconnect]);

	const chatContainerRef = useRef(null);
	const actionBtnRef = useRef(null);

	useEffect(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
		}
	}, [messages]);

	const handleMouseDown = useCallback(
		(e) => {
			if (
				e.target.closest('.controls') ||
				e.target.closest('.action-button') ||
				e.target.closest('.cancel-button')
			) {
				return;
			}

			isDraggingRef.current = true;
			startPosRef.current = {
				x: e.clientX - position.x,
				y: e.clientY - position.y,
			};
		},
		[position],
	);

	const handleMouseMove = useCallback((e) => {
		if (!isDraggingRef.current) return;

		const newX = e.clientX - startPosRef.current.x;
		const newY = e.clientY - startPosRef.current.y;

		setPosition({ x: newX, y: newY });
	}, []);

	const handleMouseUp = useCallback(() => {
		isDraggingRef.current = false;
	}, []);

	const handleDisconnect = useCallback(() => {
		setIsActive(false);
		disconnect();
	}, [disconnect]);

	const handleMicClick = useCallback(() => {
		if (!isConnected && !isConnecting) {
			connectAndStart();
		} else {
			disconnect();
		}
	}, [isConnected, isConnecting, connectAndStart, disconnect]);

	const getStatusText = () => {
		if (isConnecting) {
			return 'Connecting...';
		}
		if (isRecording) {
			return 'Listening to you...';
		}
		if (isConnected) {
			return 'Click to stop';
		}
		return 'Click to start';
	};

	const shouldShowAnimation = () => {
		return isConnected && isRecording;
	};

	const getStateClass = () => {
		if (isRecording) return 'user-speaking';
		if (isConnecting) return 'connecting';
		if (isConnected) return 'connected';
		return 'disconnected';
	};

	const getLatestMessage = () => {
		if (messages.length === 0) {
			return null;
		}
		return messages[messages.length - 1];
	};

	const getDisplayText = () => {
		const latestMessage = getLatestMessage();
		if (latestMessage) {
			return `${latestMessage.isUser ? 'You' : 'Agent'}: ${latestMessage.content}`;
		}
		return getStatusText();
	};

	if (!isActive) {
		return null;
	}

	return (
		<div
			ref={containerRef}
			className={`voiceContainer ${isActive ? 'active' : 'inactive'} ${
				isHomePage ? 'home-page' : 'other-page'
			}`}
			onMouseDown={handleMouseDown}
			style={{
				position: 'fixed',
				transform: `translate(${position.x}px, ${position.y}px)`,
				cursor: isDraggingRef.current ? 'grabbing' : 'grab',
			}}
		>
			<div className={`voice-input-container ${getStateClass()}`}>
				<div className="input-area">
					<UserSoundSvg className="voice-icon" />
					<span className="placeholder">{getDisplayText()}</span>
				</div>

				{shouldShowAnimation() && (
					<div className="animation-container">
						<div className="state-label">{getStatusText()}</div>
						<div className="voice-animation">
							<img
								src={'https://ap.assets.ve.ai/logo/speaking%20final.gif'}
								width={'40px'}
								height={'40px'}
								alt="Speaking animation"
							/>
						</div>
					</div>
				)}

				<div className="controls">
					<button
						className={`action-button ${isRecording ? 'recording' : ''}`}
						onClick={handleMicClick}
						disabled={isConnecting}
						ref={actionBtnRef}
						data-enabled={isRecording ? 'true' : 'false'}
					>
						{isConnecting ? '⏳ Connecting...' : <MicSvg />}
					</button>

					<button className="cancel-button" onClick={handleDisconnect}>
						<CloseSvg className="cancel-icon" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default memo(VoiceAgentParent);
