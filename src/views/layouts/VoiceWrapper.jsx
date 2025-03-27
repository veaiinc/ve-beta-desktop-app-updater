import React, { memo, useContext, useCallback, useState, useRef, useEffect } from 'react';
import { LiveKitRoom, RoomAudioRenderer, StartAudio } from '@livekit/components-react';
import Voice from '../components/chat/Voice';
import Context from '../../context/context';
import { message } from 'antd';
import { useLocation } from 'react-router-dom';
import '../../assets/scss/voice/voiceWrapper.scss';
import { checkDevices } from '../../helpers';

const VoiceWrapper = () => {
	let {
		aiSetup: { updateAiSetupState, voiceIntegrationData },
	} = useContext(Context);

	const location = useLocation();
	const isHomePage = location.pathname === '/' || location.pathname === '/home';
	const [info, setInfo] = useState({
		deviceInfo: {},
	});
	const [position, setPosition] = useState({ x: window.innerWidth / 2 - 125, y: 0 });
	const containerRef = useRef(null);
	const isDraggingRef = useRef(false);
	const startPosRef = useRef({ x: 0, y: 0 });

	// Add and remove event listeners
	useEffect(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);

	useEffect(() => {
		getDeviceInfo();
	}, []);

	const handleMouseDown = useCallback(
		(e) => {
			if (e.target.closest('.controls')) return; // Prevent dragging when clicking controls

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

	const customDisconnetFunc = useCallback(() => {
		if (voiceIntegrationData?.shouldConnect) {
			updateAiSetupState({
				triggerVoiceDisconnect: true,
				voiceIntegrationData: null,
			});
		}
	}, [voiceIntegrationData]);

	const getDeviceInfo = useCallback(async () => {
		const deviceInfo = await checkDevices();
		setInfo((prev) => ({ ...prev, deviceInfo }));
	}, []);

	return (
		<div
			ref={containerRef}
			className={`voiceContainer ${
				voiceIntegrationData?.shouldConnect ? 'active' : 'inactive'
			} ${isHomePage ? 'home-page' : 'other-page'}`}
			onMouseDown={handleMouseDown}
			style={{
				position: 'fixed',
				transform: `translate(${position.x}px, ${position.y}px)`,
				cursor: isDraggingRef.current ? 'grabbing' : 'grab',
			}}
		>
			<LiveKitRoom
				className="flex flex-col h-full w-full"
				serverUrl={voiceIntegrationData?.serverUrl || ''}
				token={voiceIntegrationData?.token || ''}
				connect={voiceIntegrationData?.shouldConnect || false}
				onError={(e) => {
					message.error(e.message);
					console.error(e);
				}}
			>
				<Voice handleDisconnect={customDisconnetFunc} deviceInfo={info?.deviceInfo} />
				<RoomAudioRenderer />
				<StartAudio label="Click to enable audio playback" />
			</LiveKitRoom>
		</div>
	);
};

export default memo(VoiceWrapper);
