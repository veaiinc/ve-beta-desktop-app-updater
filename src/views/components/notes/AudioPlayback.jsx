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
	const containerRef = useRef(null);

	// Load audio data when component mounts
	useEffect(() => {
		loadAudioData();
	}, [meetingId]);

	// Try to get duration when component becomes visible
	useEffect(() => {
		const tryGetDuration = () => {
			if (audioRef.current && duration === 0) {
				console.log('AudioPlayback: Component visible, trying to get duration');
				
				// Try multiple methods to get duration
				const attemptDuration = () => {
					if (audioRef.current && audioRef.current.duration > 0) {
						console.log('AudioPlayback: Got duration on visibility:', audioRef.current.duration);
						setDuration(audioRef.current.duration);
						return true;
					}
					return false;
				};

				// Method 1: Force reload metadata
				audioRef.current.load();
				
				// Method 2: Try after short delay
				setTimeout(() => {
					if (!attemptDuration()) {
						// Method 3: Force duration detection by playing briefly
						console.log('AudioPlayback: Forcing duration detection on visibility');
						audioRef.current.currentTime = 0.01;
						audioRef.current.volume = 0; // Mute to avoid sound
						
						audioRef.current.play().then(() => {
							setTimeout(() => {
								audioRef.current.pause();
								audioRef.current.currentTime = 0;
								attemptDuration();
							}, 50);
						}).catch(() => {
							// If play fails, try seeking method
							audioRef.current.currentTime = 999999;
							setTimeout(() => {
								audioRef.current.currentTime = 0;
								attemptDuration();
							}, 100);
						});
					}
				}, 200);
			}
		};

		// Try immediately
		tryGetDuration();

		// Also try when window gains focus
		const handleFocus = () => {
			setTimeout(tryGetDuration, 100);
		};

		window.addEventListener('focus', handleFocus);
		return () => window.removeEventListener('focus', handleFocus);
	}, [duration]);

	// Intersection Observer to detect when component becomes visible
	useEffect(() => {
		if (!containerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && duration === 0) {
						console.log('AudioPlayback: Component is now visible, trying to get duration');
						setTimeout(() => {
							if (audioRef.current && audioRef.current.duration > 0) {
								console.log('AudioPlayback: Got duration from intersection observer:', audioRef.current.duration);
								setDuration(audioRef.current.duration);
							}
						}, 200);
					}
				});
			},
			{ threshold: 0.1 }
		);

		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, [duration]);

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
					
					// Set audio data immediately
					setAudioData(prev => ({ ...prev, audioUrl }));
					
					// Create audio element to get duration immediately
					const audio = new Audio();
					audio.preload = 'metadata';
					audio.crossOrigin = 'anonymous';
					
					// Force duration detection by playing briefly
					const forceDurationDetection = () => {
						console.log('AudioPlayback: Forcing duration detection by playing briefly');
						
						// Set a very small current time and play briefly
						audio.currentTime = 0.01;
						audio.volume = 0; // Mute to avoid any sound
						
						audio.play().then(() => {
							// After 50ms, pause and check duration
							setTimeout(() => {
								audio.pause();
								audio.currentTime = 0;
								
								if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
									console.log('AudioPlayback: Successfully got duration:', audio.duration);
									setDuration(audio.duration);
								} else {
									console.log('AudioPlayback: Duration still not available, trying alternative method');
									// Try alternative: seek to end and back
									audio.currentTime = 999999;
									setTimeout(() => {
										audio.currentTime = 0;
										if (audio.duration > 0) {
											console.log('AudioPlayback: Got duration from seeking:', audio.duration);
											setDuration(audio.duration);
										}
									}, 100);
								}
							}, 50);
						}).catch(err => {
							console.error('AudioPlayback: Force play failed:', err);
							// Fallback: try to get duration anyway
							if (audio.duration > 0) {
								setDuration(audio.duration);
							}
						});
					};
					
					audio.onloadedmetadata = () => {
						console.log('AudioPlayback: onLoadedMetadata - duration:', audio.duration);
						if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
							console.log('AudioPlayback: Duration from metadata:', audio.duration);
							setDuration(audio.duration);
						} else {
							// If metadata doesn't have duration, force detection
							setTimeout(forceDurationDetection, 100);
						}
					};
					
					audio.oncanplay = () => {
						console.log('AudioPlayback: onCanPlay - duration:', audio.duration);
						if (audio.duration > 0) {
							setDuration(audio.duration);
						}
					};
					
					audio.onerror = (e) => {
						console.error('AudioPlayback: Audio error:', e);
						setError('Audio file cannot be played');
					};
					
					// Set source and start duration detection
					audio.src = audioUrl;
					
					// If metadata doesn't load within 500ms, force detection
					setTimeout(() => {
						if (duration === 0) {
							console.log('AudioPlayback: Metadata timeout, forcing duration detection');
							forceDurationDetection();
						}
					}, 500);
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
			// If duration is still 0, try to get it by playing briefly
			if (duration === 0) {
				console.log('AudioPlayback: Duration is 0, attempting to get duration by playing');
				audioRef.current.play().then(() => {
					// Check duration after a short delay
					setTimeout(() => {
						if (audioRef.current && audioRef.current.duration > 0) {
							console.log('AudioPlayback: Got duration from play:', audioRef.current.duration);
							setDuration(audioRef.current.duration);
						}
					}, 100);
				}).catch(err => {
					console.error('AudioPlayback: Play failed:', err);
				});
			} else {
				audioRef.current.play();
			}
			setIsPlaying(true);
		}
	}, [isPlaying, audioData, duration]);

	// Handle time update
	const handleTimeUpdate = useCallback(() => {
		if (audioRef.current) {
			setCurrentTime(audioRef.current.currentTime);
			
			// Try to get duration if it's still 0
			if (duration === 0 && audioRef.current.duration > 0) {
				console.log('AudioPlayback: Got duration from timeUpdate:', audioRef.current.duration);
				setDuration(audioRef.current.duration);
			}
		}
	}, [duration]);

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
		// Handle invalid time values
		if (!time || isNaN(time) || !isFinite(time)) {
			return '00:00';
		}
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
			<div className="audio-loading">
				<div className="loading-spinner"></div>
				<p>Loading audio...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="audio-error">
				<p>❌ {error}</p>
				<button onClick={loadAudioData} className="retry-button">
					Retry
				</button>
			</div>
		);
	}

	if (!audioData) {
		return (
			<div className="audio-empty">
				<p>No audio recording available for this meeting.</p>
			</div>
		);
	}

	return (
		<div className="audio-player" ref={containerRef}>
				{/* Audio element */}
				<audio
					ref={audioRef}
					src={audioData.audioUrl}
					onTimeUpdate={handleTimeUpdate}
					onEnded={handleAudioEnded}
					onLoadedMetadata={() => {
						if (audioRef.current) {
							console.log('AudioPlayback: onLoadedMetadata - duration:', audioRef.current.duration);
							const validDuration = audioRef.current.duration && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration) ? audioRef.current.duration : 0;
							setDuration(validDuration);
							console.log('AudioPlayback: Set duration to:', validDuration);
						}
					}}
					onCanPlay={() => {
						if (audioRef.current) {
							console.log('AudioPlayback: onCanPlay - duration:', audioRef.current.duration);
							const validDuration = audioRef.current.duration && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration) ? audioRef.current.duration : 0;
							if (validDuration > 0) {
								setDuration(validDuration);
								console.log('AudioPlayback: Set duration from onCanPlay:', validDuration);
							}
						}
					}}
					onDurationChange={() => {
						if (audioRef.current) {
							console.log('AudioPlayback: onDurationChange - duration:', audioRef.current.duration);
							const validDuration = audioRef.current.duration && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration) ? audioRef.current.duration : 0;
							if (validDuration > 0) {
								setDuration(validDuration);
								console.log('AudioPlayback: Set duration from onDurationChange:', validDuration);
							}
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
							{duration === 0 && (
								<button 
									onClick={() => {
										console.log('AudioPlayback: Manual duration retry');
										if (audioRef.current) {
											audioRef.current.load();
											setTimeout(() => {
												if (audioRef.current && audioRef.current.duration > 0) {
													setDuration(audioRef.current.duration);
												}
											}, 500);
										}
									}}
									style={{
										marginLeft: '8px',
										background: 'rgba(29, 185, 84, 0.2)',
										border: '1px solid #1db954',
										borderRadius: '4px',
										padding: '2px 6px',
										fontSize: '10px',
										color: '#1db954',
										cursor: 'pointer'
									}}
								>
									Retry Duration
								</button>
							)}
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
