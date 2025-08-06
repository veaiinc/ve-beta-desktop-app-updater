import { useEffect, useRef } from 'react';

const useAudioVisualizer = (isTranscribing, localAudioTrack, waveColor = '#94989e') => {
	const canvasRef = useRef(null);
	const animationFrameRef = useRef(null);
	const audioContextRef = useRef(null);
	const analyserRef = useRef(null);
	const dataArrayRef = useRef(null);

	useEffect(() => {
		if (!isTranscribing || !localAudioTrack?.mediaStreamTrack) {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (audioContextRef.current) {
				audioContextRef.current.close();
			}
			return;
		}

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		const audioContext = new AudioContext();
		const source = audioContext.createMediaStreamSource(
			new MediaStream([localAudioTrack.mediaStreamTrack]),
		);
		const analyser = audioContext.createAnalyser();

		// Configure analyzer for smooth visualization
		analyser.fftSize = 2048;
		analyser.smoothingTimeConstant = 0.6; // More responsive
		analyser.minDecibels = -90;
		analyser.maxDecibels = -10;

		source.connect(analyser);
		const dataArray = new Uint8Array(analyser.frequencyBinCount);

		// Set canvas size
		canvas.width = 200;
		canvas.height = 32;

		audioContextRef.current = audioContext;
		analyserRef.current = analyser;
		dataArrayRef.current = dataArray;

		const drawWaveform = () => {
			if (!isTranscribing) {
				audioContext.close();
				return;
			}

			analyser.getByteFrequencyData(dataArray);

			// Clear canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const centerY = canvas.height / 2;
			const barCount = 60; // Even more bars for better visualization
			const barWidth = canvas.width / barCount;

			ctx.fillStyle = waveColor; // Use the custom color
			ctx.strokeStyle = waveColor; // Use the custom color
			ctx.lineWidth = 1;

			for (let i = 0; i < barCount; i++) {
				const dataIndex = Math.floor((i / barCount) * dataArray.length);
				const value = dataArray[dataIndex] || 0;
				// Much higher sensitivity and minimum height
				const barHeight = Math.max(4, (value / 255) * canvas.height * 1.8);

				const x = i * barWidth + barWidth / 2;
				const y = centerY - barHeight / 2;

				// Draw thicker bars
				ctx.fillRect(x - 1, y, 2, barHeight);
			}

			animationFrameRef.current = requestAnimationFrame(drawWaveform);
		};

		drawWaveform();

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (audioContextRef.current) {
				audioContextRef.current.close();
			}
		};
	}, [isTranscribing, localAudioTrack, waveColor]);

	return { canvasRef };
};

export default useAudioVisualizer;
