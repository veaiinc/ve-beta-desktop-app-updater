import React, { useEffect, useState, useCallback } from 'react';
import './areYouThere.scss';

const AreYouThereApp = () => {
	const [countdown, setCountdown] = useState(0);
	const [isVisible, setIsVisible] = useState(true);
	const [currentInterval, setCurrentInterval] = useState(0);
	const [windowType, setWindowType] = useState('time-based'); // 'time-based' or 'transcription-based'
	const [reason, setReason] = useState('');
	const [transcriptionState, setTranscriptionState] = useState(null);

	// Handle user clicking I'm here
	const handleImHereClick = useCallback(() => {
		console.log("✅ User clicked I'm here - continuing meeting");
		setIsVisible(false);
		setCountdown(0); // Reset countdown

		// Send IPC message based on window type
		if (windowType === 'transcription-based') {
			if (window.electronApi?.areYouThere?.continueTranscription) {
				window.electronApi.areYouThere.continueTranscription();
			}
		} else {
			if (window.electronApi?.areYouThere?.continueMeeting) {
				window.electronApi.areYouThere.continueMeeting();
			}
		}
	}, [windowType]);

	// Handle user clicking End Session
	const handleEndSessionClick = useCallback(() => {
		console.log('🔚 User clicked End Session');
		setIsVisible(false);
		setCountdown(0); // Reset countdown

		// Send IPC message based on window type
		if (windowType === 'transcription-based') {
			if (window.electronApi?.areYouThere?.endTranscriptionSession) {
				window.electronApi.areYouThere.endTranscriptionSession();
			}
		} else {
			if (window.electronApi?.areYouThere?.endSession) {
				window.electronApi.areYouThere.endSession();
			}
		}
	}, [windowType]);

	// Countdown timer effect - counts up from 0 to 25 seconds
	useEffect(() => {
		// Only start countdown if window is visible
		if (!isVisible) {
			return;
		}

		if (countdown >= 25) {
			console.log('⏰ Countdown reached 25 seconds - stopping meeting due to no response');
			setIsVisible(false);
			setCountdown(0); // Reset countdown

			// Send IPC message based on window type
			if (windowType === 'transcription-based') {
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
			setCountdown((prev) => prev + 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [countdown, isVisible, windowType]);

	// Get current recording time from main process
	const getCurrentRecordingTime = async () => {
		if (window.electronApi?.areYouThere?.getCurrentRecordingTime) {
			try {
				const result = await window.electronApi.areYouThere.getCurrentRecordingTime();
				if (result.success) {
					setCurrentInterval(result.recordingTime);
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
					setTranscriptionState(result);
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
				setWindowType('transcription-based');
				setReason(data.reason || 'no-transcriptions');
				console.log('🎤 Setting window type to transcription-based');

				// Get transcription detection state for more detailed info
				await getTranscriptionDetectionState();
			} else {
				setWindowType('time-based');
				setReason('');
				console.log('⏰ Setting window type to time-based');
			}

			// Check if recording is still active before showing
			if (window.electronApi?.areYouThere?.checkRecordingState) {
				try {
					const result = await window.electronApi.areYouThere.checkRecordingState();
					if (result.success && result.isRecordingActive) {
						console.log('✅ Recording is active - showing Are You There window');
						setIsVisible(true);
						setCountdown(0); // Reset countdown to 0
						// Get fresh recording time when showing again
						getCurrentRecordingTime();
					} else {
						console.log(
							'❌ Recording is not active - not showing Are You There window',
						);
						setIsVisible(false);
					}
				} catch (error) {
					console.error('Error checking recording state:', error);
					// If we can't check, don't show the window to be safe
					setIsVisible(false);
				}
			} else {
				// Fallback - show the window if we can't check state
				console.log('⚠️ Cannot check recording state - showing window as fallback');
				setIsVisible(true);
				setCountdown(0);
				getCurrentRecordingTime();
			}
		};

		const handleCloseCommand = () => {
			console.log('🔒 Received close command from main process');
			setIsVisible(false);
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

	if (!isVisible) {
		return null;
	}

	// Get appropriate text based on window type
	const getWindowText = () => {
		if (windowType === 'transcription-based') {
			const timeSinceLastTranscription = transcriptionState?.timeSinceLastTranscription || 0;
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
					{windowType === 'transcription-based' && (
						<div className="transcription-warning">
							<p className="warning-text">
								⚠️ No speech detected for{' '}
								{transcriptionState?.timeSinceLastTranscription
									? Math.floor(
											transcriptionState.timeSinceLastTranscription / 60,
									  ) + ' minute(s)'
									: '5 minutes'}
							</p>
						</div>
					)}
				</div>
				<div className="countdown-timer">
					<span className="countdown-number">{25 - countdown} seconds</span>
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
