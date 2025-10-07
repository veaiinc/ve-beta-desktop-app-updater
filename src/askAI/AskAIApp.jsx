import { useState, useEffect, useCallback, useContext } from 'react';
import './askAI.scss';
import ObjectID from 'bson-objectid';
import Context from '../context/context';
import ChatBox from '../views/components/chat/ChatBox';
import CustomToast from '../views/components/globalComponents/CustomToast';
import { flushSync } from 'react-dom';

const AskAIApp = () => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState({
		sessionId: ObjectID()?.toString(),
	});

    // Fixed-size overlay (compact chatbox sizing, units are CSS vw/vh interpreted by main)
    const FIXED_WIDTH = 46;
    const FIXED_HEIGHT = 6;

	const setFixedDimensions = useCallback(() => {
		try {
			window?.electronApi?.askAI?.updateDimensions({
				width: FIXED_WIDTH,
				height: FIXED_HEIGHT,
				position: { isExpanding: false },
			});
		} catch (err) {
			// noop
		}
	}, []);

	// Enforce fixed dimensions on mount
	useEffect(() => {
		setFixedDimensions();
	}, [setFixedDimensions]);

	// Listen for chat messages from Dynamic Island or NotchDrop
	useEffect(() => {
		const handleChatMessage = (chatMessage) => {
			if (chatMessage?.sessionId) {
				flushSync(() => {
					setInfo((prev) => ({ ...prev, sessionId: chatMessage?.sessionId }));
				});
			}
		};

		window?.electronApi.askAI.onReceiveChatMessage(handleChatMessage);

		// Cleanup
		return () => {
			window?.electronApi.askAI.removeChatMessageListener();
		};
	}, []);

	const handleDesktopAppPayload = async () => {
		let payload = {};
		try {
			if (window.electronApi?.desktop?.captureScreen) {
				const base64Image = await window.electronApi.desktop.captureScreen();
				if (base64Image) {
					payload.imagesArray = [base64Image];
				}
			}
		} catch (err) {
			console.log('error while getting desktop payload', err);
		}
		return payload;
	};

	const handleClose = () => {
		window?.electronApi.askAI.toggleWindow();
	};

	const handleSendWebsocketMessage = useCallback(
		async (_data, lastQuery) => {
			try {
				// Build navigation payload similar to NotchDrop Swift submitChat
				const navData = {
					type: 'chat',
					message: lastQuery,
					timestamp: new Date().toISOString(),
					source: 'askai-overlay',
					path: `/chat/${ObjectID().toString()}`,
					updateObject: {
						type: 'chat',
						payload: {
							query: lastQuery,
						},
					},
				};

				// Ask main process to open/focus main window and navigate
				await window?.electronApi?.navigateMainWindow(navData);

				// Reset to a fresh session so input isn't blocked by prior stream state
				setInfo((prev) => ({ ...prev, sessionId: ObjectID()?.toString() }));

			} catch (error) {
				console.error('Failed to navigate main window for chat:', error);
			}
		},
		[],
	);

	return (
		<div className="ask-ai-app">
			<div className="ask-ai-chat-input-wrapper">
				<ChatBox
					key={info?.sessionId}
					isPublicChat={false}
					handleSendWebsocketMessage={handleSendWebsocketMessage}
					hideDeepResearch={false}
					autoFocus={true}
					customChatBoxClick={null}
					showScrollButton={false}
					smoothScrollToBottom={null}
					onChatQueryChange={null}
					animateChatBox={true}
					sessionId={info?.sessionId}
					handleBrowserButtonClick={null}
					showBrowserButton={false}
					browserImage={null}
					showBottomTools={false}
					showMicBtn={true}
					showRecentFiles={false}
					isDesktopApp={true}
					handleDesktopAppPayload={handleDesktopAppPayload}
					showMoveHandle={true}
					handleChatBoxHeight={null}
					getChatBoxHeight={false}
				/>
			</div>

			<CustomToast />
		</div>
	);
};

export default AskAIApp;
