import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import './askAI.scss';

const AskAIApp = () => {
	const containerRef = useRef(null);
	const [inputValue, setInputValue] = useState('');
	const [response, setResponse] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const inputRef = useRef(null);
	const responseRef = useRef(null);

	// Sample response for demo - will be replaced with actual AI response
	const sampleResponse = "Based on the conversation, the key takeaways are: The team has aligned on a Q4 2024 launch for Project Nova, targeting November 15th to leverage holiday sales. The marketing strategy will prioritize social media and influencer collaborations to reach a younger demographic. Sarah highlighted potential budget constraints for influencer marketing, and the team agreed to explore a tiered compensation model. For next steps, Alex is tasked with finalizing the influencer list by next week, and the marketing department will deliver a full content calendar within two weeks.";

	// Update dimensions when content changes
	const updateDimensions = useCallback(() => {
		if (containerRef.current) {
			setTimeout(() => {
				const rect = containerRef.current.getBoundingClientRect();
				const height = Math.max(containerRef.current.scrollHeight, rect.height, 400);
				const width = 500; // Fixed width for Ask AI window

				if (window.electronApi?.askAI?.updateDimensions) {
					window.electronApi.askAI.updateDimensions({ width, height });
				}
			}, 50);
		}
	}, []);

	useEffect(() => {
		// Focus on the input when the component mounts
		if (inputRef.current) {
			setTimeout(() => {
				inputRef.current.focus();
			}, 100);
		}

		// Initial dimension update
		updateDimensions();

		// Set up observers for dimension updates
		const resizeObserver = new ResizeObserver(() => {
			updateDimensions();
		});

		const mutationObserver = new MutationObserver(() => {
			updateDimensions();
		});

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
			mutationObserver.observe(containerRef.current, {
				childList: true,
				subtree: true,
				attributes: true,
			});
		}

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, [updateDimensions]);

	// Update dimensions when response state changes
	useEffect(() => {
		updateDimensions();
	}, [response, isExpanded, updateDimensions]);

	const handleSubmit = async () => {
		if (!inputValue.trim()) return;
		
		setIsLoading(true);
		// Simulate AI response - replace with actual AI call
		setTimeout(() => {
			setResponse(sampleResponse);
			setIsLoading(false);
			setIsExpanded(true);
		}, 1500);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	const handleCopyResponse = () => {
		navigator.clipboard.writeText(response);
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
			{(response || isLoading) && (
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
									{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
							<button 
								className="close-button"
								onClick={handleClose}
								title="Close"
							>
								<X size={16} />
							</button>
						</div>
					</div>
					
					<div className="ai-response-content" ref={responseRef}>
						{isLoading ? (
							<div className="loading-indicator">
								<div className="loading-dots">
									<span></span>
									<span></span>
									<span></span>
								</div>
								<span>Analyzing...</span>
							</div>
						) : (
							<div className="response-text">{response}</div>
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