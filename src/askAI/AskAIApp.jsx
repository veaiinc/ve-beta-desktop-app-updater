import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import './askAI.scss';
import { useAskAISocket } from './socketState';
import ObjectID from 'bson-objectid';
import { getLocationsDetails } from '../helpers';
import { Markdown } from '../helpers/markdownHelper';
import { copyToClipboard } from '../helpers/clipboardHelper';

const sessionId = ObjectID().toString();

const AskAIApp = () => {
	const containerRef = useRef(null);
	const [inputValue, setInputValue] = useState('');
	const [response, setResponse] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [hasResponse, setHasResponse] = useState(false);
	const inputRef = useRef(null);
	const responseRef = useRef(null);
	const [streamingResponse, setStreamingResponse] = useState('');

	// Initialize socket
	const { createWebSocketConnection, sendMessage, closeWebSocketConnection } = useAskAISocket();
	// Update dimensions only when necessary
	const updateDimensions = useCallback(
		(forceUpdate = false) => {
			if (containerRef.current && forceUpdate) {
				setTimeout(() => {
					const width = 1000; // Fixed width for Ask AI window
					const height = hasResponse ? 600 : 120; // Better heights for proper display

					if (window.electronApi?.askAI?.updateDimensions) {
						window.electronApi.askAI.updateDimensions({ width, height });
					}
				}, 50);
			}
		},
		[hasResponse],
	);

	useEffect(() => {
		// Focus on the input when the component mounts
		if (inputRef.current) {
			setTimeout(() => {
				inputRef.current.focus();
			}, 100);
		}

		// Initial dimension update
		updateDimensions(true);
	}, [updateDimensions]);

	// Update dimensions only when response state significantly changes
	useEffect(() => {
		updateDimensions(true);
	}, [hasResponse, updateDimensions]);

	// Clean up socket connection on unmount
	useEffect(() => {
		return () => {
			closeWebSocketConnection();
		};
	}, [closeWebSocketConnection]);

	// Handle incoming WebSocket messages
	const onMessageFunc = useCallback((event, currentSessionId) => {
		let { data = '' } = event || {};
		try {
			data = JSON.parse(data);
		} catch (error) {
			console.error('Failed to parse WebSocket message:', error);
			return;
		}

		console.log('📨 Received message:', data);

		// Handle streaming messages
		if (data?.message_chunk_id) {
			const newChunk = data?.answer || '';
			console.log('📝 Adding chunk:', newChunk);
			setStreamingResponse((prev) => {
				const updated = prev + newChunk;
				console.log('📝 Updated streaming response:', updated);
				return updated;
			});
		}

		// Handle stream end
		if (data?.stream_end) {
			console.log('🏁 Stream ended, finalizing response...');
			setStreamingResponse((currentStreaming) => {
				const finalResponse = currentStreaming + (data?.answer || '');
				console.log('🏁 Final response calculated:', finalResponse);

				// Set the final response
				setResponse(finalResponse);
				setIsLoading(false);
				setIsExpanded(true);
				setHasResponse(true);

				console.log('✅ Final response set:', finalResponse);
				console.log('✅ Response window should stay visible now');

				return ''; // Clear streaming response
			});
		}
	}, []);

	// Update response display with streaming content
	useEffect(() => {
		if (streamingResponse && !response) {
			// Show streaming content in real-time
			setResponse(streamingResponse);
		}
	}, [streamingResponse, response]);

	const requestScreenPermissionIfNeeded = async () => {
		try {
			// ✅ Use the exposed API method, not .invoke()
			const checkResult = await window.electronApi.checkScreenPermission();
			if (checkResult.hasPermission) {
				return true;
			}

			// ✅ Use the exposed request method
			const requestResult = await window.electronApi.requestScreenPermission();
			if (requestResult.granted) {
				return true;
			} else {
				alert(
					'Please enable screen recording in System Settings > Privacy & Security > Screen Recording.',
				);
				return false;
			}
		} catch (err) {
			console.error('Permission check failed:', err);
			return false;
		}
	};

	const handleSubmit = async () => {
		if (!inputValue.trim()) return;

		const hasPermission = await requestScreenPermissionIfNeeded();

		const queryValue = inputValue.trim();
		setInputValue(''); // Clear input immediately after submission
		setIsLoading(true);
		setResponse('');
		setStreamingResponse('');

		try {
			// 📸 Capture screenshot using Electron API
			let base64Image = null;
			if (window.electronApi?.desktop?.captureScreen) {
				try {
					base64Image = await window.electronApi.desktop.captureScreen();
				} catch (err) {
					console.warn('Failed to capture screenshot:', err);
					// Optionally continue without image
				}
			}

			const imageArray = base64Image ? [base64Image] : [];
			// Prepare message data
			const messageData = {
				query: queryValue,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				web_search: true,
				knowledge_base_search: true,
				deep_research: false,
				deep_search: false,
				modules: [],
				date: [],
				selected_model: null,
				location: null,
				image_data_base64: imageArray,
			};

			// Add location details
			let location_details = JSON?.parse(localStorage?.getItem('locationDetails'));
			if (!location_details) {
				location_details = await getLocationsDetails();
			}
			messageData.location = location_details;

			await sendMessage({
				data: messageData,
				sessionId,
				onMessageFunc,
				agentType: 'multi_agent_chat_streaming',
			});
		} catch (error) {
			console.error('Failed to send message:', error);
			setIsLoading(false);
			setResponse('Error: Failed to send message. Please try again.');
			setIsExpanded(true);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			handleSubmit();
		}
	};

	const handleCopyResponse = async () => {
		try {
			const success = await copyToClipboard(response, {
				onSuccess: () => {
					console.log('✅ Response copied to clipboard successfully');
					// You could add a toast notification here if you have a notification system
				},
				onError: (error) => {
					console.error('❌ Failed to copy response:', error);
					// You could add an error toast notification here
				},
			});

			if (!success) {
				console.error('Copy operation failed');
			}
		} catch (error) {
			console.error('Error in handleCopyResponse:', error);
		}
	};

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	const handleClose = () => {
		if (window.electronApi?.askAI?.toggleWindow) {
			window.electronApi.askAI.toggleWindow();
		}
	};

	return (
		<div ref={containerRef} className="ask-ai-app">
			{/* Response Window - Top */}
			{(response || isLoading || streamingResponse || isExpanded || hasResponse) && (
				<div className={`ai-response-window ${isExpanded ? 'expanded' : 'collapsed'}`}>
					<div className="ai-response-header">
						<div className="ai-response-title">
							<span>AI Response</span>
							{response && (
								<button
									className="expand-button"
									onClick={toggleExpanded}
									title={isExpanded ? 'Collapse' : 'Expand'}
								>
									{isExpanded ? (
										<ChevronUp size={16} />
									) : (
										<ChevronDown size={16} />
									)}
								</button>
							)}
						</div>
						<div className="ai-response-controls">
							{response && (
								<button
									className="copy-button"
									onClick={handleCopyResponse}
									title="Copy response"
								>
									<Copy size={14} />
								</button>
							)}
							<button className="close-button" onClick={handleClose} title="Close">
								<X size={16} />
							</button>
						</div>
					</div>

					<div className="ai-response-content" ref={responseRef}>
						{isLoading && !response && !streamingResponse ? (
							<div className="loading-indicator">
								<div className="loading-dots">
									<span></span>
									<span></span>
									<span></span>
								</div>
								<span>Thinking...</span>
							</div>
						) : (
							<div className="response-text">
								{response || streamingResponse ? (
									<>
										<Markdown>{response || streamingResponse}</Markdown>
										{isLoading && streamingResponse && (
											<span className="thinking-indicator">Thinking...</span>
										)}
									</>
								) : (
									'No response content'
								)}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Input Bar - Bottom */}
			<div className="ask-ai-input">
				<div className="ask-ai-input__container">
					<textarea
						ref={inputRef}
						className="ask-ai-input__field"
						placeholder="Ask about this"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						rows={1}
					/>

					<button
						className={`ask-ai-input__submit ${inputValue.trim() ? 'active' : ''}`}
						onClick={handleSubmit}
						disabled={!inputValue.trim() || isLoading}
						title="Ask"
					>
						Ask
					</button>
				</div>
			</div>
		</div>
	);
};

export default AskAIApp;
