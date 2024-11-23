import React, { memo, useState, useEffect, useCallback, useContext } from 'react';
import '../../../assets/scss/calendar/calendarAiChat.scss';
import Context from '../../../context/context';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as SendSvg } from '../../../assets/svg/calendar/send.svg';
import { ReactComponent as AiSparkel } from '../../../assets/svg/calendar/aiSparkel.svg';
import { useRef } from 'react';

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

	const scrollRef = useRef(null);

	// Generate a unique session ID when the component mounts
	useEffect(() => {
		const sessionId = uuidv4();
		setInfo((prevInfo) => ({ ...prevInfo, sessionId }));
		return () => {
			// Reset state on unmount
			setInfo({
				sessionId: null,
				chatHistory: [],
				userInput: '',
				isProcessing: false,
				errorMessage: null,
			});
		};
	}, []);

	useEffect(() => {
		if (scrollRef?.current) {
			scrollRef?.current?.scrollIntoView();
		}
	}, [info.chatHistory]);

	// Function to handle API call
	const calendarAiChatRes = useCallback(
		async (sessionId, inputData) => {
			try {
				setInfo((prevInfo) => ({ ...prevInfo, errorMessage: null, isProcessing: true }));
				const response = await getCalendarChat(sessionId, inputData); // Replace with actual API call
				console.log('Response==>' + JSON.stringify(response, null, 2));
				setInfo((prevInfo) => ({
					...prevInfo,
					isProcessing: false,
					chatHistory: [
						...prevInfo.chatHistory,
						{ type: 'ai', message: response?.data }, // Update res datat with context data
					],
				}));
			} catch (error) {
				setInfo((prevInfo) => ({
					...prevInfo,
					isProcessing: false,
					errorMessage: 'Something went wrong. Please try again.',
				}));
			}
			console.log('errorMessage' + info?.errorMessage);
		},
		[getCalendarChat],
	);

	// Handle user input submission
	const handleSendMessage = (keyPressOrbuttonClick) => {
		const { userInput, sessionId } = info;

		const isEnterKeyPress = keyPressOrbuttonClick?.key === 'Enter' && !info?.isProcessing;
		const isButtonClick = keyPressOrbuttonClick === 'click';

		if (!userInput.trim() || info?.isProcessing || !(isEnterKeyPress || isButtonClick)) {
			return;
		}
		// Update the chat history and clear input
		setInfo((prevInfo) => ({
			...prevInfo,
			chatHistory: [...prevInfo.chatHistory, { type: 'user', message: userInput }],
			userInput: '',
		}));
		console.log('Prompt Executed===>' + userInput);
		calendarAiChatRes(sessionId, userInput);
	};

	// Handle user typing
	const handleInputChange = (e) => {
		setInfo((prevInfo) => ({ ...prevInfo, userInput: e.target.value }));
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
				{/* <div className="chatDate">Today</div> */}

				{info?.chatHistory?.map((chat, index) => (
					<div
						key={index}
						className={chat?.type === 'user' ? 'userMessage' : 'aiMessageWrapper'}
					>
						{chat?.type === 'ai' && <AiSparkel />}
						<div className={chat?.type === 'user' ? '' : 'aiMessage'}>
							<span>{chat?.message}</span>
						</div>
					</div>
				))}

				{info?.isProcessing && (
					<div className="aiMessageWrapper">
						<AiSparkel />
						<div className="aiMessage">
							<span>Thinking...</span>
						</div>
					</div>
				)}
				{info?.errorMessage && (
					<div className="aiMessageWrapper">
						<AiSparkel />
						<div className="aiMessage">
							<span>{info?.errorMessage}</span>
						</div>
					</div>
				)}
				<div className="forScrollToView" ref={scrollRef}></div>
			</div>

			<div className="aiInputContainer">
				<input
					type="text"
					placeholder="Ex: Schedule a meeting"
					value={info?.userInput}
					onChange={handleInputChange}
					onKeyDown={handleSendMessage}
					disabled={info?.isProcessing}
				/>
				<SendSvg
					onClick={() => handleSendMessage('click')}
					style={{ cursor: info?.isProcessing ? 'not-allowed' : 'pointer' }}
				/>
			</div>

			{/* {info?.errorMessage && <div className="errorMessage">{info?.errorMessage}</div>} */}
		</div>
	);
};

export default memo(CalendarAiChat);
