import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for recording meeting audio directly from system microphone
 * Uses native MediaRecorder API and Web Audio API - no third-party dependencies
 */
export const useMeetingAudioRecorder = (meetingId) => {
	const [isRecording, setIsRecording] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [recordingDuration, setRecordingDuration] = useState(0);
	const [audioBlob, setAudioBlob] = useState(null);
	const [error, setError] = useState(null);
	const [audioUrl, setAudioUrl] = useState(null);

	// Refs for managing recording state
	const mediaRecorderRef = useRef(null);
	const audioStreamRef = useRef(null);
	const audioChunksRef = useRef([]);
	const timerRef = useRef(null);
	const startTimeRef = useRef(null);
	const currentMeetingIdRef = useRef(meetingId);

	// Update the meeting ID ref when it changes
	useEffect(() => {
		currentMeetingIdRef.current = meetingId;
		console.log('useMeetingAudioRecorder: Meeting ID updated to:', meetingId);
		console.log(
			'useMeetingAudioRecorder: currentMeetingIdRef.current is now:',
			currentMeetingIdRef.current,
		);
	}, [meetingId]);

	// Cleanup function
	const cleanup = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}

		if (audioStreamRef.current) {
			audioStreamRef.current.getTracks().forEach((track) => track.stop());
			audioStreamRef.current = null;
		}

		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current = null;
		}

		audioChunksRef.current = [];
		setIsRecording(false);
		setIsPaused(false);
		setRecordingDuration(0);
	}, []);

	// Start recording function
	const startRecording = useCallback(async () => {
		try {
			const currentMeetingId = currentMeetingIdRef.current;
			console.log(
				'useMeetingAudioRecorder: Starting recording for meeting:',
				currentMeetingId,
			);
			console.log(
				'useMeetingAudioRecorder: currentMeetingIdRef.current at start:',
				currentMeetingIdRef.current,
			);
			setError(null);

			// Request microphone access
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					sampleRate: 44100,
					channelCount: 1,
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true,
				},
			});
			console.log('useMeetingAudioRecorder: Microphone access granted');

			audioStreamRef.current = stream;
			audioChunksRef.current = [];

			// Use the simplest, most compatible format
			let mimeType = 'audio/webm';
			if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
				mimeType = 'audio/webm;codecs=opus';
			}
			console.log('useMeetingAudioRecorder: Using MIME type:', mimeType);

			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: mimeType,
			});

			mediaRecorderRef.current = mediaRecorder;

			// Validate MediaRecorder state
			console.log('useMeetingAudioRecorder: MediaRecorder state:', mediaRecorder.state);
			console.log('useMeetingAudioRecorder: MediaRecorder mimeType:', mediaRecorder.mimeType);

			// Handle data available event
			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
					console.log(
						'useMeetingAudioRecorder: Chunk added, size:',
						event.data.size,
						'total chunks:',
						audioChunksRef.current.length,
					);
				}
			};

			// Handle recording stop event
			mediaRecorder.onstop = () => {
				console.log('useMeetingAudioRecorder: Recording stopped, creating blob');
				console.log(
					'useMeetingAudioRecorder: Total chunks:',
					audioChunksRef.current.length,
				);

				if (audioChunksRef.current.length === 0) {
					console.error('useMeetingAudioRecorder: No audio chunks available!');
					setError('No audio data recorded');
					return;
				}

				const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
				console.log('useMeetingAudioRecorder: Audio blob created, size:', audioBlob.size);

				setAudioBlob(audioBlob);

				// Create object URL for playback
				const url = URL.createObjectURL(audioBlob);
				setAudioUrl(url);
				console.log('useMeetingAudioRecorder: Audio URL created:', url);
			};

			// Handle errors
			mediaRecorder.onerror = (event) => {
				console.error('MediaRecorder error:', event.error);
				setError(`Recording error: ${event.error.message}`);
			};

			// Start recording with default settings
			mediaRecorder.start();
			setIsRecording(true);
			setIsPaused(false);
			startTimeRef.current = Date.now();

			console.log('useMeetingAudioRecorder: MediaRecorder started');

			// Start timer
			timerRef.current = setInterval(() => {
				if (startTimeRef.current) {
					const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
					setRecordingDuration(elapsed);
				}
			}, 1000);

			console.log('Audio recording started for meeting:', meetingId);
		} catch (err) {
			console.error('Error starting audio recording:', err);
			setError(`Failed to start recording: ${err.message}`);
			cleanup();
		}
	}, [meetingId, cleanup]);

	// Pause recording function
	const pauseRecording = useCallback(() => {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
			mediaRecorderRef.current.pause();
			setIsPaused(true);

			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		}
	}, []);

	// Resume recording function
	const resumeRecording = useCallback(() => {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
			mediaRecorderRef.current.resume();
			setIsPaused(false);

			// Restart timer
			timerRef.current = setInterval(() => {
				if (startTimeRef.current) {
					const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
					setRecordingDuration(elapsed);
				}
			}, 1000);
		}
	}, []);

	// Stop recording function
	const stopRecording = useCallback(() => {
		const currentMeetingId = currentMeetingIdRef.current;
		console.log(
			'useMeetingAudioRecorder: Stop recording called for meeting:',
			currentMeetingId,
		);

		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
			console.log('useMeetingAudioRecorder: Stopping MediaRecorder');
			mediaRecorderRef.current.stop();
		}

		cleanup();
		console.log('Audio recording stopped for meeting:', currentMeetingId);
	}, [cleanup]);

	// Get audio file info
	const getAudioInfo = useCallback(() => {
		if (!audioBlob) return null;

		return {
			blob: audioBlob,
			url: audioUrl,
			size: audioBlob.size,
			duration: recordingDuration,
			format: 'webm',
			meetingId: meetingId,
		};
	}, [audioBlob, audioUrl, recordingDuration, meetingId]);

	// Format duration for display
	const formatDuration = useCallback((seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}, []);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			cleanup();
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
		};
	}, [cleanup, audioUrl]);

	return {
		// State
		isRecording,
		isPaused,
		recordingDuration,
		audioBlob,
		audioUrl,
		error,

		// Actions
		startRecording,
		stopRecording,
		pauseRecording,
		resumeRecording,

		// Utilities
		getAudioInfo,
		formatDuration,
		cleanup,
	};
};

export default useMeetingAudioRecorder;
