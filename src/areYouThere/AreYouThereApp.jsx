import React, { useEffect, useState, useCallback } from 'react';
import './areYouThere.scss';

const AreYouThereApp = () => {
	const [info, setInfo] = useState({
		countdown: 0,
		isVisible: true,
		currentInterval: 0,
		windowType: 'time-based', // 'time-based' or 'transcription-based'
		reason: '',
		transcriptionState: null,
	});

	// Handle user clicking I'm here
	const handleImHereClick = useCallback(() => {
		console.log("✅ User clicked I'm here - continuing meeting");
		setInfo((prev) => ({
			...prev,
			isVisible: false,
			countdown: 0, // Reset countdown
		}));

		// Send IPC message based on window type
		if (info.windowType === 'transcription-based') {
			if (window.electronApi?.areYouThere?.continueTranscription) {
				window.electronApi.areYouThere.continueTranscription();
			}
		} else {
			if (window.electronApi?.areYouThere?.continueMeeting) {
				window.electronApi.areYouThere.continueMeeting();
			}
		}
	}, [info.windowType]);

	// Handle user clicking End Session
	const handleEndSessionClick = useCallback(() => {
		console.log('🔚 User clicked End Session');
		setInfo((prev) => ({
			...prev,
			isVisible: false,
			countdown: 0, // Reset countdown
		}));

		// Send IPC message based on window type
		if (info.windowType === 'transcription-based') {
			if (window.electronApi?.areYouThere?.endTranscriptionSession) {
				window.electronApi.areYouThere.endTranscriptionSession();
			}
		} else {
			if (window.electronApi?.areYouThere?.endSession) {
				window.electronApi.areYouThere.endSession();
			}
		}
	}, [info.windowType]);

	// Countdown timer effect - counts up from 0 to 25 seconds
	useEffect(() => {
		// Only start countdown if window is visible
		if (!info.isVisible) {
			return;
		}

		if (info.countdown >= 25) {
			console.log('⏰ Countdown reached 25 seconds - stopping meeting due to no response');
			setInfo((prev) => ({
				...prev,
				isVisible: false,
				countdown: 0, // Reset countdown
			}));

			// Send IPC message based on window type
			if (info.windowType === 'transcription-based') {
				if (window.electronApi?.areYouThere?.stopTranscriptionMonitoring) {
					window.electronApi.areYouThere.stopTranscriptionMonitoring();
				}
			} else {
				if (window.electronApi?.areYouThere?.stopMeeting) {
					window.electronApi.areYouThere.stopMeeting();
				}
			}
			return;
		}

		const timer = setTimeout(() => {
			setInfo((prev) => ({
				...prev,
				countdown: prev.countdown + 1,
			}));
		}, 1000);

		return () => clearTimeout(timer);
	}, [info.countdown, info.isVisible, info.windowType]);

	// Get current recording time from main process
	const getCurrentRecordingTime = async () => {
		if (window.electronApi?.areYouThere?.getCurrentRecordingTime) {
			try {
				const result = await window.electronApi.areYouThere.getCurrentRecordingTime();
				if (result.success) {
					setInfo((prev) => ({
						...prev,
						currentInterval: result.recordingTime,
					}));
				}
			} catch (error) {
				console.error('Error getting recording time:', error);
			}
		}
	};

	// Get transcription detection state
	const getTranscriptionDetectionState = async () => {
		if (window.electronApi?.areYouThere?.getTranscriptionDetectionState) {
			try {
				const result =
					await window.electronApi.areYouThere.getTranscriptionDetectionState();
				if (result.success) {
					setInfo((prev) => ({
						...prev,
						transcriptionState: result,
					}));
					console.log('🎤 Transcription detection state:', result);
				}
			} catch (error) {
				console.error('Error getting transcription detection state:', error);
			}
		}
	};

	// Get initial recording time
	useEffect(() => {
		getCurrentRecordingTime();
	}, []);

	// Listen for show and close commands from main process
	useEffect(() => {
		const handleShowCommand = async (data) => {
			console.log(
				'🔄 Received show command from main process - checking recording state',
				data,
			);

			// Determine window type based on command data
			if (data && data.type === 'transcription-based') {
				setInfo((prev) => ({
					...prev,
					windowType: 'transcription-based',
					reason: data.reason || 'no-transcriptions',
				}));
				console.log('🎤 Setting window type to transcription-based');

				// Get transcription detection state for more detailed info
				await getTranscriptionDetectionState();
			} else {
				setInfo((prev) => ({
					...prev,
					windowType: 'time-based',
					reason: '',
				}));
				console.log('⏰ Setting window type to time-based');
			}

			// Check if recording is still active before showing
			if (window.electronApi?.areYouThere?.checkRecordingState) {
				try {
					const result = await window.electronApi.areYouThere.checkRecordingState();
					if (result.success && result.isRecordingActive) {
						console.log('✅ Recording is active - showing Are You There window');
						setInfo((prev) => ({
							...prev,
							isVisible: true,
							countdown: 0, // Reset countdown to 0
						}));
						// Get fresh recording time when showing again
						getCurrentRecordingTime();
					} else {
						console.log(
							'❌ Recording is not active - not showing Are You There window',
						);
						setInfo((prev) => ({
							...prev,
							isVisible: false,
						}));
					}
				} catch (error) {
					console.error('Error checking recording state:', error);
					// If we can't check, don't show the window to be safe
					setInfo((prev) => ({
						...prev,
						isVisible: false,
					}));
				}
			} else {
				// Fallback - show the window if we can't check state
				console.log('⚠️ Cannot check recording state - showing window as fallback');
				setInfo((prev) => ({
					...prev,
					isVisible: true,
					countdown: 0,
				}));
				getCurrentRecordingTime();
			}
		};

		const handleCloseCommand = () => {
			console.log('🔒 Received close command from main process');
			setInfo((prev) => ({
				...prev,
				isVisible: false,
			}));
		};

		if (window.electronApi?.areYouThere?.onShowCommand) {
			window.electronApi.areYouThere.onShowCommand(handleShowCommand);
		}

		if (window.electronApi?.areYouThere?.onCloseCommand) {
			window.electronApi.areYouThere.onCloseCommand(handleCloseCommand);
		}

		return () => {
			if (window.electronApi?.areYouThere?.removeShowCommandListener) {
				window.electronApi.areYouThere.removeShowCommandListener();
			}
			if (window.electronApi?.areYouThere?.removeCloseCommandListener) {
				window.electronApi.areYouThere.removeCloseCommandListener();
			}
		};
	}, []);

	if (!info.isVisible) {
		return null;
	}

	// Get appropriate text based on window type
	const getWindowText = () => {
		if (info.windowType === 'transcription-based') {
			const timeSinceLastTranscription =
				info.transcriptionState?.timeSinceLastTranscription || 0;
			const minutes = Math.floor(timeSinceLastTranscription / 60);
			const seconds = timeSinceLastTranscription % 60;
			const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

			return {
				title: 'No Speech Detected',
				description: `We haven't detected any speech for ${timeString}. Are you still participating?`,
				primaryButton: "I'm still here",
				secondaryButton: 'End Session',
				timeoutMessage: "Session will end if you don't confirm.",
			};
		} else {
			return {
				title: 'Are You Still There?',
				description: "The meeting will end if you don't confirm.",
				primaryButton: "I'm still here",
				secondaryButton: 'End Session',
				timeoutMessage: "The meeting will end if you don't confirm.",
			};
		}
	};

	const windowText = getWindowText();

	return (
		<div className="are-you-there-container">
			<div className="are-you-there-content">
				<div className="are-you-there-header">
					<h2 className="are-you-there-title">{windowText.title}</h2>
					<p className="are-you-there-description">{windowText.description}</p>
					{info.windowType === 'transcription-based' && (
						<div className="transcription-warning">
							<p className="warning-text">
								⚠️ No speech detected for{' '}
								{info.transcriptionState?.timeSinceLastTranscription
									? Math.floor(
											info.transcriptionState.timeSinceLastTranscription / 60,
									  ) + ' minute(s)'
									: '5 minutes'}
							</p>
						</div>
					)}
				</div>
				<div className="countdown-timer">
					<span className="countdown-number">{25 - info.countdown} seconds</span>
					<p className="timeout-message">{windowText.timeoutMessage}</p>
				</div>
				<div className="button-group">
					<button
						className="action-button primary-button"
						onClick={handleImHereClick}
						autoFocus
					>
						{windowText.primaryButton}
					</button>
					<button className="action-button danger-button" onClick={handleEndSessionClick}>
						{windowText.secondaryButton}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AreYouThereApp;
