import React, { useState, useEffect } from 'react';
import Right from '../../layouts/actions/down';
import { useChatStream } from '../../../builder_client_common';
import ObjectID from 'bson-objectid';

const Ai_InputComponent = ({
	sessionId,
	agentType,
	handleReplaceText,
	handleInsertText,
	handleGenerateText,
	editor,
	aiSelectedText,
}) => {
	const { socketRef, createWebSocketConnection, sendMessage } = useChatStream();

	const [info, setinfo] = useState({
		generatedText: null,
		selectedText: '',
		aiTextInput: '',
		aiPromptLoading: false,
		textGenerated: false,
		sessionId: sessionId,
		agentType: agentType,
		isPublicChat: false,
	});

	useEffect(() => {
		if (!info?.sessionId) {
			// If no session ID exists, generate a new one
			const newSessionId = new ObjectID().toString();
			setinfo((prev) => ({
				...prev,
				sessionId: newSessionId,
				agentType: agentType,
			}));
			initializeWebSocket(newSessionId, agentType);
		} else if (info?.sessionId && info?.agentType) {
			initializeWebSocket(info?.sessionId, info?.agentType);
			setinfo((prev) => ({ ...prev, sessionId, agentType }));
		}
	}, [sessionId, agentType]);

	useEffect(() => {
		if (editor) {
			// Get selected text from Jodit editor
			const selectedText = editor.selection?.text || '';
			// console.log('Selected text:', selectedText);

			if (selectedText) {
				setinfo((prev) => ({
					...prev,
					selectedText: selectedText,
				}));
			}
		}
	}, [editor]);

	const handleOnChangeFunction = (e) => {
		const value = e.target.value;
		setinfo((prev) => ({
			...prev,
			aiTextInput: value,
		}));
	};

	const handleGenerateTextSubmitHandler = () => {
		// Get the current selected text from Jodit editor
		let currentSelectedText = '';

		if (editor) {
			currentSelectedText = editor.selection?.text || '';
		}

		// If no text is selected, try getting it from the state
		if (!currentSelectedText) {
			currentSelectedText = info.selectedText;
		}

		// console.log('Current selected text:', currentSelectedText); // Debug log

		let query = {
			date: [],
			deep_research: false,
			knowledge_base_search: true,
			modules: [],
			query: `${aiSelectedText}\n${info?.aiTextInput}`, // Combine selected text and prompt
			timezone: 'Asia/Calcutta',
			web_search: false,
		};

		setinfo((prev) => ({
			...prev,
			aiTextInput: '',
			aiPromptLoading: true,
			selectedText: currentSelectedText,
		}));

		sendMessage(query);
	};

	const handleSuggestedText = (type) => {
		let promptText = '';
		switch (type) {
			case 'improve_writing':
				promptText = `Improve this text while maintaining its meaning: "${info.selectedText}"`;
				break;
			case 'make_shorter':
				promptText = `Make this text shorter while maintaining its key points: "${info.selectedText}"`;
				break;
			case 'make_longer':
				promptText = `Expand this text with more details: "${info.selectedText}"`;
				break;
			default:
				promptText = '';
		}

		setinfo((prev) => ({
			...prev,
			aiTextInput: promptText,
		}));

		// Automatically trigger generation after setting the prompt
		setTimeout(() => handleGenerateTextSubmitHandler(), 100);
	};

	const streamMessageFunction = (event) => {
		let chunkMessageData = JSON.parse(event.data);

		if (chunkMessageData?.stream_end) {
			setinfo((prev) => ({
				...prev,
				textGenerated: true,
				aiPromptLoading: false,
			}));
		} else {
			setinfo((prev) => ({
				...prev,
				generatedText: prev.generatedText
					? prev.generatedText + chunkMessageData?.answer
					: chunkMessageData?.answer,
			}));
		}
	};

	const initializeWebSocket = (sessionId, agentType) => {
		try {
			// Create WebSocket connection
			// console.log('Creating WebSocket connection...');
			const socket = createWebSocketConnection(
				sessionId,
				streamMessageFunction,
				agentType,
				false, // isPublicChat
			);
		} catch (error) {
			console.error('Error initializing WebSocket: shahid', error);
		}
	};

	return (
		<div className="text-popup-container">
			<div className="text-popup-wrapper">
				{info.generatedText !== null ? (
					<div
						className="tpc-generatedText"
						style={{
							color: info.textGenerated == false ? 'red' : '',
						}}
					>
						{info.generatedText}
					</div>
				) : (
					''
				)}

				<div className="text-popup-container-input">
					<input
						type="text"
						placeholder={
							info.selectedText !== ''
								? 'Describe how to edit the text'
								: 'Describe how to generate the text'
						}
						value={info.aiTextInput}
						onChange={handleOnChangeFunction}
						autoFocus
					/>
					<a onClick={handleGenerateTextSubmitHandler}>
						{info.aiPromptLoading ? (
							<a>
								<span class="p-loader"></span>
							</a>
						) : (
							<Right />
						)}
					</a>
				</div>
			</div>
			{info.textGenerated == false ? (
				<div className="text-popup-container-suggestions">
					<label>Suggested</label>
					<a onClick={() => handleSuggestedText('improve_writing')}>Improve Writing</a>
					<a onClick={() => handleSuggestedText('make_shorter')}>Shorten</a>
					<a onClick={() => handleSuggestedText('make_longer')}>Lengthen</a>
				</div>
			) : (
				<div className="text-popup-container-suggestions">
					<a onClick={() => handleReplaceText(info?.generatedText)}>Replace</a>
					<a onClick={() => handleInsertText(info?.generatedText)}>Insert After</a>
					<a onClick={handleGenerateText}>Retry</a>
				</div>
			)}
		</div>
	);
};

export default Ai_InputComponent;
