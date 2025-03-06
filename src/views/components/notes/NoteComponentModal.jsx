import { Drawer } from 'antd';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import '../../../assets/scss/notes/noteComponentModal.scss';
import NoteComponent from './NoteComponent';
import { TypingEffect } from '../../../helpers/markdownHelper';
import Markdown from 'react-markdown';
import { ReactComponent as BackSvg } from '../../../assets/svg/sidebar/leftarrowwhite.svg';
import { ReactComponent as PreviousSvg } from '../../../assets/svg/notes/previous.svg';
import { ReactComponent as NextSvg } from '../../../assets/svg/notes/next.svg';
import { ReactComponent as CopySvg } from '../../../assets/svg/notes/copy.svg';
import { ReactComponent as ShareSvg } from '../../../assets/svg/notes/share.svg';
import { ReactComponent as RightDoubleArrowSvg } from '../../../assets/svg/notes/right-double-arrow.svg';
import ChatBox from '../homePage/ChatBox';
import { useContext } from 'react';
import Context from '../../../context/context';
import { ReactComponent as FullScreenSvg } from '../../../assets/svg/notes/fullScreen.svg';
import { ReactComponent as LinkLightSvg } from '../../../assets/svg/notes/loop-light.svg';
import { ReactComponent as LinkDarkSvg } from '../../../assets/svg/notes/loop-dark.svg';
const noteIcons = [<PreviousSvg />, <NextSvg />, <CopySvg />, <ShareSvg />];
const NoteComponentModal = ({
	modalIsOpen,
	closeModal,
	handleRatingClick,
	chatList,
	handleSendWebsocketMessage,
	latestStreamMesage,
	lastQuery,
	toggleLatestStreamMessage,
}) => {
	const chatContentRef = useRef(null);
	const {
		templates: { globalChatMessages },
		documentPreview: { noteContent },
	} = useContext(Context);

	const [info, setInfo] = useState({
		noteComponentFullScreen: false,
		chatToNoteLoopOn: true,
	});

	useEffect(() => {
		smoothScrollToBottom();
	}, [chatList]); // Scroll when chat updates

	const smoothScrollToBottom = useCallback(
		(type) => {
			const scrollElement = chatContentRef?.current;
			if (!scrollElement) return;
			const scrollToPosition = (position) => {
				scrollElement.scrollTo({
					top: position,
					behavior: type === 'instant' ? 'auto' : 'smooth',
				});
			};
			if (type === 'custom') {
				const scrollHeight = scrollElement.scrollHeight;
				const scrollOffset = 100;
				scrollToPosition(scrollHeight - scrollOffset);
			} else {
				scrollToPosition(scrollElement.scrollHeight);
			}
		},
		[chatContentRef],
	);

	const handleFullScreenClick = () => {
		setInfo({
			...info,
			noteComponentFullScreen: !info?.noteComponentFullScreen,
		});
	};

	const handleChatToNoteLoopClick = () => {
		setInfo({
			...info,
			chatToNoteLoopOn: !info?.chatToNoteLoopOn,
		});
	};

	return (
		<Drawer
			open={modalIsOpen}
			onClose={closeModal}
			placement="right"
			rootClassName="notes-modal-container"
			width={'100vw'}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="modal-container">
				<div className="chatBarContainer">
					<div className="chat-to-note-link-container">
						<div className="title">Link all chat to note</div>
						<div
							className={`link-icon-container ${
								info?.chatToNoteLoopOn ? 'active' : ''
							}`}
							onClick={handleChatToNoteLoopClick}
						>
							{info?.chatToNoteLoopOn ? <LinkDarkSvg /> : <LinkLightSvg />}
						</div>
					</div>
					{/* chat body */}
					<div className={`chatBodyParentContainer`} ref={chatContentRef}>
						<div className="chatContent">
							{chatList?.map((chat, index) =>
								chat?.content ? (
									chat?.content
								) : (
									<div
										key={index}
										className={`chat-message ${chat?.type?.toLowerCase()}-message`}
									>
										<div className="message-content">
											{chat?.type?.toLowerCase() === 'ai' ? (
												<div className="content">
													<TypingEffect
														text={chat?.message}
														smoothScrollToBottom={smoothScrollToBottom}
														handleRatingClick={handleRatingClick}
														messageId={chat?.messageId}
														showTypingEffect={chat?.typingEffect}
														rating={chat?.rating}
														messageData={chat}
														citations={chat?.citations}
													/>
												</div>
											) : (
												<Markdown>{chat?.message}</Markdown>
											)}
										</div>
									</div>
								),
							)}
						</div>
					</div>
					<div className="chat-box-wrapper">
						<ChatBox
							showChatLabels={false}
							handleSendWebsocketMessage={handleSendWebsocketMessage}
							latestStreamMesage={latestStreamMesage}
							lastQuery={lastQuery}
							toggleLatestStreamMessage={toggleLatestStreamMessage}
						/>
					</div>
				</div>
				<div
					className="note-component"
					style={{
						width: info?.noteComponentFullScreen ? '100%' : 'calc(100% - 400px)',
					}}
				>
					<div className="header">
						<div className="left">
							<div
								className="back-icon"
								onClick={handleFullScreenClick}
								style={{
									transform: info?.noteComponentFullScreen
										? 'rotate(180deg)'
										: 'none',
								}}
							>
								<BackSvg />
							</div>
							<div className="full-screen-icon" onClick={closeModal}>
								<RightDoubleArrowSvg />
							</div>
							<div className="title">wedding timeline</div>
						</div>
						<div className="right">
							{noteIcons.map((icon, index) => {
								return (
									<div className="icon-container" key={index}>
										{icon}
									</div>
								);
							})}
						</div>
					</div>

					<NoteComponent
						outerContainerStyle={{
							width: '100%',
							height: '100%',
							padding: 0,
							margin: 'auto',
							backgroundColor: '#171819',
						}}
						innerContainerStyle={{
							width: '100%',
							height: '100%',
							backgroundColor: '#171819',
						}}
						initialContent={info?.chatToNoteLoopOn ? globalChatMessages : noteContent}
						loopOn={info?.chatToNoteLoopOn}
					/>
				</div>
			</div>
		</Drawer>
	);
};

export default NoteComponentModal;
