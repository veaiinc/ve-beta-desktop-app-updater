import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Copy, ChevronDown, ChevronUp, GripHorizontal } from 'lucide-react';
import './askAI.scss';
import { useAskAISocket } from './socketState';
import { Square } from 'lucide-react';
import ObjectID from 'bson-objectid';
import { getLocationsDetails } from '../helpers';
import { AskAIMarkdown } from '../helpers/markdownHelper';
import { copyToClipboard } from '../helpers/clipboardHelper';
import Spinner from '../views/components/loaders/Spinner';

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
	const [displayedResponse, setDisplayedResponse] = useState('');
	const [receivedTabContent, setReceivedTabContent] = useState(null);
	const [copied, setCopied] = useState(false);
	const [isNeedHelpRequest, setIsNeedHelpRequest] = useState(false);
	const [receivedDynamicIslandMessage, setReceivedDynamicIslandMessage] = useState(null);
	const isStoppedRef = useRef(false);
	// Add this simple conversation history state
	const [fullConversation, setFullConversation] = useState('');
	// Initialize socket
	const { createWebSocketConnection, sendMessage, closeWebSocketConnection } = useAskAISocket();
	// Update dimensions only when necessary
	const updateDimensions = useCallback(
		(forceUpdate = false) => {
			if (containerRef.current && forceUpdate) {
				setTimeout(() => {
					const width = 600; // Fixed width for Ask AI window to match design
					const height = hasResponse || isLoading || displayedResponse ? 500 : 120; // Taller height to accommodate response + input

					if (window.electronApi?.askAI?.updateDimensions) {
						window.electronApi.askAI.updateDimensions({ width, height });
					}
				}, 50);
			}
		},
		[hasResponse, isLoading, displayedResponse],
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

	// Track input focus state for overlay
	useEffect(() => {
		const handleFocus = () => {
			if (window.electronApi?.askAI?.setInputFocus) {
				window.electronApi.askAI.setInputFocus(true);
			}
		};

		const handleBlur = () => {
			if (window.electronApi?.askAI?.setInputFocus) {
				window.electronApi.askAI.setInputFocus(false);
			}
		};

		const inputElement = inputRef.current;
		if (inputElement) {
			inputElement.addEventListener('focus', handleFocus);
			inputElement.addEventListener('blur', handleBlur);
		}

		return () => {
			if (inputElement) {
				inputElement.removeEventListener('focus', handleFocus);
				inputElement.removeEventListener('blur', handleBlur);
			}
		};
	}, []);

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

	// Listen for tab content from overlay
	useEffect(() => {
		const handleTabContent = (tabContent) => {
			console.log('Received tab content from overlay:', tabContent);
			setReceivedTabContent(tabContent);

			// Auto-generate a prompt based on the tab content
			const prompt = generatePromptFromTabContent(tabContent);

			// Check if this is from "All Threads" or "Need Help" tabs
			const shouldUseDirectSearch =
				tabContent.tabKey === 'all-threads' && tabContent.tabKey === 'need-help';
			setIsNeedHelpRequest(shouldUseDirectSearch);

			// Don't show the prompt in the input field - keep it clean
			// setInputValue(prompt); // Removed - don't populate input for automatic requests

			// Auto-focus the input
			if (inputRef.current) {
				inputRef.current.focus();
			}

			// Automatically send the request to Ask AI with the generated prompt
			setTimeout(() => {
				handleSubmit(prompt, shouldUseDirectSearch);
			}, 100); // Small delay to ensure everything is ready
		};

		// Listen for chat messages from Dynamic Island
		const handleChatMessage = (chatMessage) => {
			console.log('💬 Received chat message from Dynamic Island:', chatMessage);

			if (chatMessage.type === 'dynamic-island-chat' && chatMessage.message) {
				// Set the received message for display purposes
				setReceivedDynamicIslandMessage(chatMessage.message);

				// Don't set the message in the input field - process it directly
				// Auto-focus the input for user interaction
				if (inputRef.current) {
					inputRef.current.focus();
				}

				// Process the message directly without showing it in input
				setTimeout(() => {
					handleSubmit(chatMessage.message, false);
				}, 100); // Small delay to ensure everything is ready
			}
		};

		// Set up listeners
		if (window.electronApi?.askAI?.onReceiveTabContent) {
			window.electronApi.askAI.onReceiveTabContent(handleTabContent);
		}

		if (window.electronApi?.askAI?.onReceiveChatMessage) {
			window.electronApi.askAI.onReceiveChatMessage(handleChatMessage);
		}

		// Cleanup
		return () => {
			if (window.electronApi?.askAI?.removeTabContentListener) {
				window.electronApi.askAI.removeTabContentListener();
			}
			if (window.electronApi?.askAI?.removeChatMessageListener) {
				window.electronApi.askAI.removeChatMessageListener();
			}
		};
	}, []);

	// Generate prompt based on tab content
	const generatePromptFromTabContent = (tabContent) => {
		const { tabKey, tabLabel, content, type, itemContent, itemData } = tabContent;

		// Handle individual item clicks
		if (type === 'individual-item' && itemContent) {
			return `Please help me with this: "${itemContent}". Provide insights, suggestions, or guidance on how to approach this.`;
		}

		// Handle empty content
		if (!content || content.length === 0) {
			return `I'm looking at the "${tabLabel}" tab but there's no content yet. Can you help me understand what this tab is for and how I might use it?`;
		}

		const itemCount = content.length;
		const firstItem = content[0];

		switch (tabKey) {
			case 'all-threads':
				return `I have ${itemCount} threads in my conversation history. The latest one is: "${
					firstItem.prompt || firstItem.name || 'No prompt available'
				}". Please analyze these threads and provide insights or suggestions.`;

			case 'ask-user':
				return `I have ${itemCount} questions that need user input. The latest one is: "${firstItem.prompt}". Please help me formulate better questions or suggest how to approach these user interactions.`;

			case 'need-help':
				return `I have ${itemCount} help suggestions. The latest one is: "${firstItem.prompt}". Please help me understand these suggestions better or provide additional guidance.`;

			case 'actions':
				return `I have ${itemCount} action items. The latest one is: "${firstItem.prompt}". Please help me prioritize these actions or suggest the best approach to handle them.`;

			case 'files':
				return `I have ${itemCount} files to work with. The latest one is: "${
					firstItem.prompt || firstItem.name
				}". Please help me understand how to work with these files or suggest next steps.`;

			default:
				return `I'm looking at the "${tabLabel}" tab with ${itemCount} items. Please help me understand and work with this content.`;
		}
	};

	// Modify handleStop to save the current conversation
	const handleStop = () => {
		console.log('🛑 Stopping generation immediately...');

		// Set flag to indicate user stopped the generation FIRST
		isStoppedRef.current = true;

		// IMMEDIATELY freeze the display at current state
		setDisplayedResponse((currentDisplayed) => {
			console.log('🛑 Freezing display at:', currentDisplayed);
			// Set streamingResponse to match current displayed content
			setStreamingResponse(currentDisplayed);

			// Save the partial conversation to full conversation history
			if (currentDisplayed.trim()) {
				setFullConversation((prev) => {
					const newConversation =
						prev +
						(prev ? '\n\n' : '') +
						`Human: ${inputValue || 'Previous question'}\n\n` +
						`Assistant: ${currentDisplayed} [STOPPED BY USER]`;
					console.log('💾 Saved conversation:', newConversation);
					return newConversation;
				});
			}

			return currentDisplayed;
		});

		// Stop the loading state immediately
		setIsLoading(false);

		// FORCE CLOSE the WebSocket connection immediately
		try {
			if (closeWebSocketConnection) {
				closeWebSocketConnection();
				console.log('🛑 WebSocket connection closed');
			}
		} catch (error) {
			console.warn('Error closing WebSocket:', error);
		}

		console.log('🛑 Generation stopped successfully - display frozen');
	};

	// Modify handleSubmit to include conversation context
	const handleSubmit = async (customInput = null, isNeedHelp = null) => {
		const queryValue = customInput || inputValue.trim();
		if (!queryValue) return;

		// Reset the stopped flag for new requests
		isStoppedRef.current = false;

		// Store the current question for conversation history
		const currentQuestion = queryValue;

		// Use the passed isNeedHelp parameter if provided, otherwise use state
		const shouldUseDirectSearch = isNeedHelp !== null ? isNeedHelp : isNeedHelpRequest;

		// Clear input only if it's a manual submission (not automatic)
		if (!customInput) {
			setInputValue('');
		}

		const hasPermission = await requestScreenPermissionIfNeeded();
		setIsLoading(true);

		// Clear display states for new message (but keep conversation history)
		setResponse('');
		setStreamingResponse('');
		setDisplayedResponse('');

		// Clear Dynamic Island message indicator when starting new submission
		setReceivedDynamicIslandMessage(null);

		// Reset need help flag for manual submissions
		if (!customInput) {
			setIsNeedHelpRequest(false);
		}

		try {
			// 📸 Capture screenshot using Electron API
			let base64Image = null;
			if (window.electronApi?.desktop?.captureScreen) {
				try {
					base64Image = await window.electronApi.desktop.captureScreen();
				} catch (err) {
					console.warn('Failed to capture screenshot:', err);
				}
			}

			const imageArray = base64Image ? [base64Image] : [];

			// Create context-aware query
			let contextualQuery = queryValue;
			if (fullConversation.trim()) {
				contextualQuery = `Previous conversation context:\n${fullConversation}\n\nCurrent question: ${queryValue}`;
				console.log('📚 Including conversation context in query');
			}

			// Prepare message data with conversation context
			const messageData = {
				query: contextualQuery, // Include context directly in the query
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

			// Only set direct_search_agent to true for "Need Help" tab requests
			if (shouldUseDirectSearch) {
				messageData.direct_search_agent = true;
			}

			// Add location details
			let location_details = JSON?.parse(localStorage?.getItem('locationDetails'));
			if (!location_details) {
				location_details = await getLocationsDetails();
			}
			messageData.location = location_details;

			console.log('📤 Sending contextual query:', {
				originalQuery: queryValue,
				hasContext: !!fullConversation.trim(),
				sessionId,
			});

			await sendMessage({
				data: messageData,
				sessionId, // Use the same session ID to maintain context
				onMessageFunc: (event, sessionId) =>
					onMessageFunc(event, sessionId, currentQuestion),
				agentType: 'multi_agent_chat_streaming',
			});

			// Reset the need help flag after sending the message
			setIsNeedHelpRequest(false);
		} catch (error) {
			console.error('Failed to send message:', error);
			setIsLoading(false);
			setResponse('Error: Failed to send message. Please try again.');
			setIsExpanded(true);
			setIsNeedHelpRequest(false);
		}
	};

	// Modify onMessageFunc to save completed conversations
	const onMessageFunc = useCallback((event, currentSessionId, currentQuestion) => {
		// FIRST CHECK: If user stopped generation, ignore ALL incoming messages
		if (isStoppedRef.current) {
			console.log('🛑 Ignoring message - generation was stopped by user');
			return;
		}

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
			// DOUBLE CHECK: Don't add chunks if stopped
			if (isStoppedRef.current) {
				console.log('🛑 Ignoring chunk - generation was stopped');
				return;
			}

			const newChunk = data?.answer || '';
			console.log('📝 Adding chunk:', newChunk);

			setStreamingResponse((prev) => {
				// TRIPLE CHECK: Don't update if stopped during state update
				if (isStoppedRef.current) {
					console.log('🛑 Stopping chunk addition mid-update');
					return prev;
				}
				const updated = prev + newChunk;
				console.log('📝 Updated streaming response:', updated);
				return updated;
			});
		}

		// Handle stream end
		if (data?.stream_end) {
			// FINAL CHECK: Don't finalize if stopped
			if (isStoppedRef.current) {
				console.log('🛑 Ignoring stream end - generation was stopped');
				return;
			}

			console.log('🏁 Stream ended, finalizing response...');
			setStreamingResponse((currentStreaming) => {
				if (isStoppedRef.current) {
					return currentStreaming;
				}

				const finalResponse = currentStreaming + (data?.answer || '');
				console.log('🏁 Final response calculated:', finalResponse);

				// Save the complete conversation to history
				setFullConversation((prev) => {
					const newConversation =
						prev +
						(prev ? '\n\n' : '') +
						`Human: ${currentQuestion}\n\n` +
						`Assistant: ${finalResponse}`;
					console.log('💾 Saved complete conversation:', newConversation);
					return newConversation;
				});

				// Set the final response
				setResponse(finalResponse);
				setDisplayedResponse(finalResponse);
				setIsLoading(false);
				setIsExpanded(true);
				setHasResponse(true);

				// Clear the Dynamic Island message indicator since we got a response
				setReceivedDynamicIslandMessage(null);

				console.log('✅ Final response set:', finalResponse);
				return ''; // Clear streaming response
			});
		}
	}, []);

	// Character-by-character streaming display
	useEffect(() => {
		let timeoutId;

		// FIRST CHECK: Don't animate if user stopped generation
		if (isStoppedRef.current) {
			return;
		}

		if (streamingResponse && !response) {
			const currentDisplayed = displayedResponse;
			const targetText = streamingResponse;

			// Only animate if there's new content to show AND not stopped
			if (targetText.length > currentDisplayed.length && !isStoppedRef.current) {
				const nextChar = targetText[currentDisplayed.length];

				timeoutId = setTimeout(() => {
					// DOUBLE CHECK: Don't update if stopped during timeout
					if (!isStoppedRef.current) {
						setDisplayedResponse((prev) => prev + nextChar);
					}
				}, 20); // Adjust speed: lower = faster, higher = slower
			}
		}

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [streamingResponse, displayedResponse, response]); // Keep dependencies the same

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

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();

			// Only submit if NOT loading and has input text
			if (!isLoading && inputValue.trim()) {
				handleSubmit();
			}
		}
	};

	const handleCopyResponse = async () => {
		try {
			let textToCopy = '';

			// Try to get the actual displayed text from the rendered markdown
			if (responseRef.current) {
				const markdownElement = responseRef.current.querySelector(
					'.markdown-custom-content',
				);
				if (markdownElement) {
					// Extract text content from the rendered markdown, preserving structure
					textToCopy = markdownElement.innerText || markdownElement.textContent;
				}
			}

			// Fallback to raw markdown if DOM extraction fails
			if (!textToCopy) {
				textToCopy = response || displayedResponse;
			}

			if (!textToCopy) {
				console.warn('No content to copy');
				return;
			}

			const success = await copyToClipboard(textToCopy, {
				onSuccess: () => {
					console.log('✅ Response copied to clipboard successfully');
					// You could add a toast notification here if you have a notification system
					setCopied(true);
					setTimeout(() => {
						setCopied(false);
					}, 1000);
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

	// Add a debug function to see conversation history
	const debugConversation = () => {
		console.log('🔍 Current conversation history:');
		console.log(fullConversation);
	};

	return (
		<div ref={containerRef} className="ask-ai-app">
			{/* Response Window - Top */}
			{(response || isLoading || displayedResponse || isExpanded || hasResponse) && (
				<div className={`ai-response-window ${isExpanded ? 'expanded' : 'collapsed'}`}>
					<div className="ai-response-header">
						<div className="ai-response-drag-handle">
							<GripHorizontal size={16} color="rgba(255, 255, 255, 0.7)" />
						</div>
						<div className="ai-response-title">
							<span>AI Response</span>
							{response && (
								<button
									className="expand-button"
									onClick={toggleExpanded}
									title={isExpanded ? 'Collapse' : 'Expand'}
								>
									{/* {isExpanded ? (
										<ChevronUp size={16} />
									) : (
										<ChevronDown size={16} />
									)} */}
								</button>
							)}
						</div>
						<div className="ai-response-controls">
							{(response || displayedResponse) && (
								<button
									className="copy-button"
									onClick={handleCopyResponse}
									title="Copy response"
								>
									{copied ? 'copied' : <Copy size={14} />}
								</button>
							)}
							<button className="close-button" onClick={handleClose} title="Close">
								<X size={16} />
							</button>
						</div>
					</div>

					<div className="divider"></div>
					<div className="ai-response-content" ref={responseRef}>
						{isLoading && !response && !displayedResponse ? (
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
								{response || displayedResponse ? (
									<>
										<AskAIMarkdown>
											{response || displayedResponse}
										</AskAIMarkdown>
										{isLoading && displayedResponse && !response && (
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

			{/* Input Bar - Botdtom */}
			<div className="ask-ai-input">
				<div className="ask-ai-input-drag-handle">
					<GripHorizontal size={16} color="rgba(255, 255, 255, 0.7)" />
				</div>
				{/* Dynamic Island Message Indicator */}
				{receivedDynamicIslandMessage && (
					<div className="ask-ai-input__dynamic-island-indicator">
						<span className="dynamic-island-indicator__label">
							🏝️ Message from Dynamic Island: "{receivedDynamicIslandMessage}"
							{isLoading && (
								<span className="dynamic-island-indicator__status">
									{' '}
									• Processing...
								</span>
							)}
						</span>
						<button
							className="dynamic-island-indicator__clear"
							onClick={() => setReceivedDynamicIslandMessage(null)}
							title="Clear indicator"
						>
							<X size={12} />
						</button>
					</div>
				)}
				{/* Tab Content Indicator - Removed for cleaner interface */}
				{/* {receivedTabContent && (
					<div className="ask-ai-input__tab-indicator">
						<span className="tab-indicator__label">
							📋{' '}
							{receivedTabContent.type === 'individual-item'
								? `Item from: ${receivedTabContent.tabLabel}`
								: `Content from: ${receivedTabContent.tabLabel}`}
							{isLoading && (
								<span className="tab-indicator__status">
									{' '}
									• Asking AI automatically...
								</span>
							)}
						</span>
						<button
							className="tab-indicator__clear"
							onClick={() => setReceivedTabContent(null)}
							title="Clear tab content"
						>
							<X size={12} />
						</button>
					</div>
				)} */}

				<div className="ask-ai-input__container ask-ai-input__container_responding">
					<textarea
						ref={inputRef}
						className="ask-ai-input__field"
						placeholder="Ask about this"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						rows={1}
					/>

					{
						<button
							className={`ask-ai-input__submit ${inputValue.trim() ? 'active' : ''} ${
								isLoading ? 'loading' : ''
							}`}
							onClick={() => {
								isLoading ? handleStop() : handleSubmit();
							}}
							// disabled={!inputValue.trim() || isLoading}
							title="Ask"
						>
							{isLoading ? <Square size={10} /> : 'Ask'}
						</button>
					}
				</div>
			</div>

			{/* Add this to your JSX for debugging (remove in production) */}
			{/* {process.env.NODE_ENV === 'development' && (
				<button
					onClick={debugConversation}
					style={{ position: 'absolute', top: 0, right: 0 }}
				>
					Debug Conversation
				</button>
			)} */}
		</div>
	);
};

export default AskAIApp;
