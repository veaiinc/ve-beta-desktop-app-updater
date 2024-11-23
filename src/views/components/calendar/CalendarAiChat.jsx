import React, { memo, useState, useEffect, useCallback, useContext } from 'react';
import '../../../assets/scss/calendar/calendarAiChat.scss';
import Context from '../../../context/context';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as SendSvg } from '../../../assets/svg/calendar/send.svg';
import { ReactComponent as AiSparkel } from '../../../assets/svg/calendar/aiSparkel.svg';

const initialState = {
	sessionId: null,
	chatHistory: [],
	userInput: '',
	isProcessing: false,
	errorMessage: null,
};

const CalendarAiChat = ({ toggleAskAi }) => {
	const {
		calendarInfo: { calendarChat, getCalendarChat },
	} = useContext(Context);

	const [info, setInfo] = useState({
		...initialState,
	});

	useEffect(() => {
		const sessionId = uuidv4();
		setInfo((prevInfo) => ({ ...prevInfo, sessionId: sessionId }));
		return setInfo(initialState);
	});

	// Function to handle API call
	const calendarAiChatRes = useCallback(async (sessionId, inputData) => {
		try {
			setInfo((prev) => ({ ...prev, isProcessing: true, errorMessage: null }));
			const response = await getCalendarChat(sessionId, inputData); // Replace with actual API call
			setInfo((prev) => ({
				...prev,
				isProcessing: false,
				chatHistory: [
					...prev.chatHistory,
					{ type: 'ai', message: response.data }, // Update based on API response structure
				],
			}));
		} catch (error) {
			setInfo((prev) => ({
				...prev,
				isProcessing: false,
				errorMessage: 'Something went wrong. Please try again.',
			}));
		}
	}, []);

	// Handle user input submission
	const handleSendMessage = () => {
		const { userInput, sessionId } = info;
		if (!userInput.trim()) return; // Prevent empty submissions

		setInfo((prev) => ({
			...prev,
			chatHistory: [...prev.chatHistory, { type: 'user', message: userInput }],
			userInput: '',
		}));

		calendarAiChatRes(sessionId, userInput);
	};

	// Disable input while processing
	const isInputDisabled = info.isProcessing;

	// Handle user typing
	const handleInputChange = (e) => {
		setInfo((prev) => ({ ...prev, userInput: e.target.value }));
	};
	return (
		// <div className="calendarAiChatContainer">
		// 	<div className="headerWrapper">
		// 		<span className="headLabel">Ask Ai</span>
		// 		<CloseSvg onClick={toggleAskAi} style={{ cursor: 'pointer' }} />
		// 	</div>
		// 	<div className="chatContainer">
		// 		<div className="forScroll"></div>
		// 		<div className="chatDate">Today</div>

		// 		<div className="userMessage">
		// 			<p>Schedule a meeting</p>
		// 		</div>
		// 		<div className="aiMessageWrapper">
		// 			<AiSparkel />
		// 			<div className="aiMessage">
		// 				<span>Google Meet?</span>
		// 			</div>
		// 		</div>

		// 		<div className="userMessage">
		// 			<p>That sounds good.</p>
		// 		</div>

		// 		<div className="aiMessageWrapper">
		// 			<AiSparkel />
		// 			<div className="aiMessage">
		// 				<span>ok sure , give me time and date to schedule.</span>
		// 			</div>
		// 		</div>
		// 	</div>

		// 	<div className="aiInputContainer">
		// 		<input
		// 			type="text"
		// 			placeholder="Ex : Schedule a meeting"
		// 			value={info.userInput}
		// 			onChange={handleInputChange}
		// 			onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
		// 			disabled={isInputDisabled}
		// 		/>
		// 		<SendSvg style={{ cursor: 'pointer' }} onClick={handleSendMessage} />
		// 	</div>
		// </div>

		<div className="calendarAiChatContainer">
			<div className="headerWrapper">
				<span className="headLabel">Ask Ai</span>
				<CloseSvg onClick={toggleAskAi} style={{ cursor: 'pointer' }} />
			</div>
			<div className="chatContainer">
				<div className="forScroll"></div>
				<div className="chatDate">Today</div>

				{info.chatHistory.map((chat, index) => (
					<div
						key={index}
						className={chat.type === 'user' ? 'userMessage' : 'aiMessageWrapper'}
					>
						{chat.type === 'ai' && <AiSparkel />}
						<div className={chat.type === 'user' ? 'userMessage' : 'aiMessage'}>
							<span>{chat.message}</span>
						</div>
					</div>
				))}

				{info.isProcessing && (
					<div className="aiMessageWrapper">
						<AiSparkel />
						<div className="aiMessage">
							<span>Thinking...</span>
						</div>
					</div>
				)}
			</div>

			<div className="aiInputContainer">
				<input
					type="text"
					placeholder="Ex: Schedule a meeting"
					value={info.userInput}
					onChange={handleInputChange}
					onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
					disabled={isInputDisabled}
				/>
				<SendSvg
					onClick={handleSendMessage}
					style={{ cursor: isInputDisabled ? 'not-allowed' : 'pointer' }}
				/>
			</div>

			{info.errorMessage && <div className="errorMessage">{info.errorMessage}</div>}
		</div>
	);
};

export default memo(CalendarAiChat);
