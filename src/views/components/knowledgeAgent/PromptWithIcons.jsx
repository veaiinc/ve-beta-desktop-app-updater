import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './PromptWithIcons.scss';
import Editor from '../notes/Editor';
const actionPattern = /<([^>]+)>/g;
const PromptWithIcons = ({
	prompt = '',
	actionDetails = [],
	onChange,
	placeholder = 'Enter your prompt here',
	className = '',
	style = {},
	readOnly = false,
	disabled = false,
	autoResize = true,
	agentId,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const textAreaRef = useRef(null);
	const containerRef = useRef(null);
	const initialBlocksRef = useRef(null);

	// Initialize initialBlocks only once
	useEffect(() => {
		if (!initialBlocksRef.current) {
			initialBlocksRef.current = { data: prompt };
		}
	}, [agentId]);

	// Function to parse prompt and render with icons
	const renderPromptWithIcons = () => {
		if (!prompt || !actionDetails?.length) {
			return [{ type: 'text', content: prompt || '' }];
		}

		// Create a map of action names to their details for quick lookup
		const actionMap = actionDetails.reduce((acc, action) => {
			acc[action.actionName] = action;
			return acc;
		}, {});

		// Split the prompt by action patterns and render with icons
		let parts = [];
		let lastIndex = 0;

		let match;

		while ((match = actionPattern.exec(prompt)) !== null) {
			const actionName = match[1];
			const actionDetail = actionMap[actionName];

			// Add text before the action
			// if (lastIndex < match.index) {
			// 	parts.push({
			// 		type: 'text',
			// 		content: prompt.slice(lastIndex, match.index),
			// 	});
			// }

			// Add action with icon
			parts.push({
				type: 'action',
				content: actionName,
				actionDetail,
			});

			lastIndex = match.index + match[0].length;
		}

		// // Add remaining text
		// if (lastIndex < prompt.length) {
		// 	parts.push({
		// 		type: 'text',
		// 		content: prompt.slice(lastIndex),
		// 	});
		// }

		return parts;
	};

	// Auto-resize functionality
	const adjustHeight = () => {
		if (autoResize && textAreaRef.current) {
			const textarea = textAreaRef.current;
			textarea.style.height = '0px';
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	// Adjust height on mount and when value changes
	useEffect(() => {
		if (isEditing) {
			adjustHeight();
		}
	}, [prompt, autoResize, isEditing]);

	// Handle click outside to exit edit mode
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (isEditing && containerRef.current && !containerRef.current.contains(event.target)) {
				setIsEditing(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isEditing]);

	const parts = renderPromptWithIcons();

	return (
		<div ref={containerRef} className={`promptWithIconsContainer ${className}`} style={style}>
			{/* {isEditing ? (
				<textarea
					ref={textAreaRef}
					value={prompt}
					onChange={(e) => {
						onChange?.(e.target.value);
						adjustHeight();
					}}
					placeholder={placeholder}
					className="custom-textarea"
					style={{
						resize: 'none',
						overflow: 'hidden',
						boxSizing: 'border-box',
						...style,
					}}
					readOnly={readOnly}
					disabled={disabled}
					rows={1}
				/>
			) : (
				<div
					className="custom-textarea"
					onClick={() => !readOnly && !disabled && setIsEditing(true)}
					style={{ cursor: readOnly || disabled ? 'default' : 'text' }}
				>
					{parts.map((part, index) => {
						if (part.type === 'text') {
							return <span key={index}>{part.content}</span>;
						} else if (part.type === 'action' && part.actionDetail) {
							return (
								<span key={index} className="actionWithIcon">
									<img
										src={part.actionDetail?.actionData?.image_src}
										alt={part.actionDetail?.actionData?.app}
										className="actionIcon"
										title={`${part.actionDetail?.actionData?.app} - ${part.actionDetail?.actionData?.name}`}
									/>
									<span className="actionName">{part.content}</span>
								</span>
							);
						} else {
							// Fallback for actions without details
							return (
								<span
									key={index}
									className="actionFallback"
								>{`<${part.content}>`}</span>
							);
						}
					})}
				</div>
			)} */}
			<Editor
				markdown={true}
				initialBlocks={initialBlocksRef.current}
				customBlockData={{ actionDetails }}
				onMarkdownChange={(markdown) => {
					onChange?.(markdown);
				}}
				myAccess={readOnly || disabled ? 'view' : 'edit'}
			/>
		</div>
	);
};

PromptWithIcons.propTypes = {
	prompt: PropTypes.string,
	actionDetails: PropTypes.arrayOf(PropTypes.object),
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
	className: PropTypes.string,
	style: PropTypes.object,
	readOnly: PropTypes.bool,
	disabled: PropTypes.bool,
	autoResize: PropTypes.bool,
};

export default PromptWithIcons;
