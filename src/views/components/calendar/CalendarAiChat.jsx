import React, { memo, useState, useEffect, useCallback, useContext, useRef } from 'react';
import '../../../assets/scss/calendar/calendarAiChat.scss';
import ObjectId from 'bson-objectid';
import Context from '../../../context/context';
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

	const userTypingRef = useRef(null);

	const [info, setInfo] = useState({
		...initialState,
	});

	console.log('errorMessage: ' + info?.errorMessage);

	// Generate a unique session ID when the component mounts
	useEffect(() => {
		const sessionId = ObjectId().toString();
		setInfo((prevInfo) => ({ ...prevInfo, sessionId }));
		return () => {
			setInfo({
				sessionId: null,
				chatHistory: [],
				userInput: '',
				isProcessing: false,
				errorMessage: null,
			});
		};
	}, []);

	console.log('CalendarAiChat: ' + JSON.stringify(info?.chatHistory, null, 2));

	// Function to handle API call
	const calendarAiChatRes = useCallback(
		async (sessionId, inputData) => {
			// let response;

			setInfo((prevInfo) => ({ ...prevInfo, errorMessage: null, isProcessing: true }));
			const response = await getCalendarChat(sessionId, { query: inputData });
			console.log('response===>?' + JSON.stringify(response, null, 2));

			if (response?.[0] === true) {
				setInfo((prevInfo) => ({
					...prevInfo,
					isProcessing: false,
					chatHistory: [
						...prevInfo.chatHistory,
						{ type: 'ai', message: response[1]?.answer },
					],
				}));
			} else {
				setInfo((prevInfo) => ({
					...prevInfo,
					isProcessing: false,
					errorMessage: 'Something went wrong. Please try again.',
				}));
			}
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
		// Update the chat history and clear User input && clear previous error message
		if ((isEnterKeyPress || isButtonClick) && !info?.isProcessing) {
			setInfo((prevInfo) => ({
				...prevInfo,
				errorMessage: null,
				chatHistory: [...prevInfo.chatHistory, { type: 'user', message: userInput }],
				userInput: '',
			}));

			calendarAiChatRes(sessionId, userInput);
		}
	};

	// Handle user typing
	const handleInputChange = (e) => {
		setInfo((prevInfo) => ({ ...prevInfo, userInput: e.target.value }));
	};
	return (
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
			</div>

			<div className="aiInputContainer">
				<input
					type="text"
					ref={userTypingRef}
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
		</div>
	);
};

export default memo(CalendarAiChat);
