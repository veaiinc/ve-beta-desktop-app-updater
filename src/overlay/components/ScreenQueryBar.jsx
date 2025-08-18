import React, { useState, useRef, useEffect } from 'react';
import './screen-query-bar.scss';

const ScreenQueryBar = ({ onClose }) => {
	const [inputValue, setInputValue] = useState('');
	const inputRef = useRef(null);

	useEffect(() => {
		// Focus on the input when the component mounts
		if (inputRef.current) {
			// Use a slight delay to ensure it's rendered
			setTimeout(() => {
				inputRef.current.focus();
				inputRef.current.select(); // Select all text if any
			}, 100);
		}

		// Keep focus on the input and prevent other elements from stealing focus
		const handleFocusOut = (e) => {
			// If focus is moving outside the component, bring it back
			if (inputRef.current && !e.currentTarget.contains(e.relatedTarget)) {
				setTimeout(() => {
					if (inputRef.current) {
						inputRef.current.focus();
					}
				}, 10);
			}
		};

		// Add event listeners to maintain focus
		if (inputRef.current) {
			const inputElement = inputRef.current;
			inputElement.addEventListener('blur', handleFocusOut);
			
			return () => {
				inputElement.removeEventListener('blur', handleFocusOut);
			};
		}
	}, []);

	const handleSubmit = () => {
		// Here you can handle the actual AI query submission
		console.log('Asking AI:', inputValue || 'Ask about the screen');
		onClose();
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			handleSubmit();
		}
	};

	const handleContainerClick = (e) => {
		// Prevent clicks from propagating to background elements
		e.stopPropagation();
		e.preventDefault();
		
		// Ensure input gets focus when clicking anywhere in the container
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	const handleInputClick = (e) => {
		// Prevent input clicks from propagating
		e.stopPropagation();
	};

	return (
		<div className="screen-query-bar" onClick={handleContainerClick}>
			<div className="screen-query-bar__divider" />
			
			<input
				ref={inputRef}
				type="text"
				className="screen-query-bar__input"
				placeholder="Ask about the screen"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				onClick={handleInputClick}
				onFocus={(e) => e.stopPropagation()}
			/>
			
			<div className="screen-query-bar__action" onClick={handleSubmit}>
				<span className="screen-query-bar__action-label">Ask</span>
				<div className="screen-query-bar__key-container">
					<kbd className="screen-query-bar__key">⏎</kbd>
				</div>
			</div>
		</div>
	);
};

export default ScreenQueryBar;