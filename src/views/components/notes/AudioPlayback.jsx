import React, { useState, useRef, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { ReactComponent as PlayIcon } from '../../../assets/svg/play.svg';
import { ReactComponent as PauseIcon } from '../../../assets/svg/pause.svg';
import { ReactComponent as DownloadIcon } from '../../../assets/svg/download.svg';
import { ReactComponent as VolumeIcon } from '../../../assets/svg/volume.svg';
import audioStorageService from '../../../services/audioStorageService';
import './AudioPlayback.scss';

const AudioPlayback = ({ meetingId }) => {
	const [audioData, setAudioData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [error, setError] = useState(null);

	const audioRef = useRef(null);
	const progressRef = useRef(null);

	// Load audio data when component mounts
	useEffect(() => {
		loadAudioData();
	}, [meetingId]);

	// Cleanup blob URL on unmount
	useEffect(() => {
		return () => {
			if (audioData?.audioUrl && audioData.audioUrl.startsWith('blob:')) {
				URL.revokeObjectURL(audioData.audioUrl);
			}
		};
	}, [audioData?.audioUrl]);

	// Load audio data from storage
	const loadAudioData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			if (!meetingId) {
				setError('No meeting ID provided');
				return;
			}

			const result = await audioStorageService.getAudio(meetingId);
			console.log('AudioPlayback: getAudio result:', result);

			if (result.success) {
				console.log('AudioPlayback: Audio blob size:', result.audioBlob?.size);
				console.log('AudioPlayback: Audio URL:', result.audioUrl);
				console.log('AudioPlayback: Metadata:', result.metadata);
				
				setAudioData(result);
				// Calculate duration from audio blob
				if (result.audioBlob && result.audioBlob.size > 0) {
					// Create a new blob URL
					const audioUrl = URL.createObjectURL(result.audioBlob);
					console.log('AudioPlayback: Created blob URL:', audioUrl);
					
					const audio = new Audio();
					audio.preload = 'metadata';
					audio.onloadedmetadata = () => {
						console.log('AudioPlayback: Audio duration:', audio.duration);
						setDuration(audio.duration);
						setAudioData(prev => ({ ...prev, audioUrl }));
					};
					audio.onerror = (e) => {
						console.error('AudioPlayback: Audio error:', e);
						setError('Audio file cannot be played');
					};
					audio.src = audioUrl;
				} else {
					setDuration(0);
				}
			} else {
				setError(result.error || 'Audio file not found');
			}
		} catch (err) {
			console.error('Error loading audio data:', err);
			setError('Failed to load audio file');
		} finally {
			setIsLoading(false);
		}
	}, [meetingId]);

	// Handle play/pause
	const togglePlayPause = useCallback(() => {
		if (!audioRef.current || !audioData) return;

		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
		} else {
			audioRef.current.play();
			setIsPlaying(true);
		}
	}, [isPlaying, audioData]);

	// Handle time update
	const handleTimeUpdate = useCallback(() => {
		if (audioRef.current) {
			setCurrentTime(audioRef.current.currentTime);
		}
	}, []);

	// Handle audio ended
	const handleAudioEnded = useCallback(() => {
		setIsPlaying(false);
		setCurrentTime(0);
		if (audioRef.current) {
			audioRef.current.currentTime = 0;
		}
	}, []);

	// Handle progress bar click
	const handleProgressClick = useCallback(
		(e) => {
			if (!audioRef.current || !progressRef.current) return;

			const rect = progressRef.current.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const width = rect.width;
			const clickTime = (clickX / width) * duration;

			audioRef.current.currentTime = clickTime;
			setCurrentTime(clickTime);
		},
		[duration],
	);

	// Handle volume change
	const handleVolumeChange = useCallback((e) => {
		const newVolume = parseFloat(e.target.value);
		setVolume(newVolume);
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
		}
		setIsMuted(newVolume === 0);
	}, []);

	// Handle mute toggle
	const toggleMute = useCallback(() => {
		if (!audioRef.current) return;

		if (isMuted) {
			audioRef.current.volume = volume;
			setIsMuted(false);
		} else {
			audioRef.current.volume = 0;
			setIsMuted(true);
		}
	}, [isMuted, volume]);

	// Handle download
	const handleDownload = useCallback(async () => {
		try {
			const result = await audioStorageService.getDownloadUrl(meetingId);

			if (result.success) {
				// Create download link
				const link = document.createElement('a');
				link.href = result.downloadUrl;
				link.download = result.fileName;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				message.success('Audio download started');
			} else {
				message.error(result.error || 'Failed to download audio');
			}
		} catch (err) {
			console.error('Error downloading audio:', err);
			message.error('Failed to download audio');
		}
	}, [meetingId]);

	// Format time for display
	const formatTime = useCallback((time) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}, []);

	// Format file size for display
	const formatFileSize = useCallback((bytes) => {
		if (!bytes) return '0 MB';
		const mb = bytes / 1024 / 1024;
		return `${mb.toFixed(2)} MB`;
	}, []);

	// Calculate progress percentage
	const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

	if (isLoading) {
		return (
			<div className="audio-playback-container">
				<div className="audio-loading">
					<div className="loading-spinner"></div>
					<p>Loading audio...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="audio-playback-container">
				<div className="audio-error">
					<p>❌ {error}</p>
					<button onClick={loadAudioData} className="retry-button">
						Retry
					</button>
				</div>
			</div>
		);
	}

	if (!audioData) {
		return (
			<div className="audio-playback-container">
				<div className="audio-empty">
					<p>No audio recording available for this meeting.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="audio-playback-container">
			<div className="audio-player">
				{/* Audio element */}
				<audio
					ref={audioRef}
					src={audioData.audioUrl}
					onTimeUpdate={handleTimeUpdate}
					onEnded={handleAudioEnded}
					onLoadedMetadata={() => {
						if (audioRef.current) {
							setDuration(audioRef.current.duration);
						}
					}}
					preload="metadata"
				/>

				{/* Audio info */}
				<div className="audio-info">
					<div className="audio-title">
						<h3>Meeting Recording</h3>
						<p className="audio-details">
							{formatTime(duration)} • {formatFileSize(audioData.metadata?.fileSize)}
						</p>
					</div>
					<button
						onClick={handleDownload}
						className="download-button"
						title="Download audio file"
					>
						<DownloadIcon />
					</button>
				</div>

				{/* Progress bar */}
				<div className="progress-container">
					<div ref={progressRef} className="progress-bar" onClick={handleProgressClick}>
						<div
							className="progress-fill"
							style={{ width: `${progressPercentage}%` }}
						/>
						<div
							className="progress-handle"
							style={{ left: `${progressPercentage}%` }}
						/>
					</div>
					<div className="time-display">
						<span>{formatTime(currentTime)}</span>
						<span>{formatTime(duration)}</span>
					</div>
				</div>

				{/* Controls */}
				<div className="audio-controls">
					<button
						onClick={togglePlayPause}
						className="play-pause-button"
						title={isPlaying ? 'Pause' : 'Play'}
					>
						{isPlaying ? <PauseIcon /> : <PlayIcon />}
					</button>

					<div className="volume-controls">
						<button
							onClick={toggleMute}
							className="mute-button"
							title={isMuted ? 'Unmute' : 'Mute'}
						>
							<VolumeIcon />
						</button>
						<input
							type="range"
							min="0"
							max="1"
							step="0.1"
							value={isMuted ? 0 : volume}
							onChange={handleVolumeChange}
							className="volume-slider"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AudioPlayback;
