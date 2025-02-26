import { Drawer } from 'antd';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import '../../../assets/scss/notes/noteComponentModal.scss';
import NoteComponent from './NoteComponent';
import { TypingEffect } from '../../../helpers/markdownHelper';
import Markdown from 'react-markdown';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as PreviousSvg } from '../../../assets/svg/notes/previous.svg';
import { ReactComponent as NextSvg } from '../../../assets/svg/notes/next.svg';
import { ReactComponent as CopySvg } from '../../../assets/svg/notes/copy.svg';
import { ReactComponent as ShareSvg } from '../../../assets/svg/notes/share.svg';
import ChatBox from '../homePage/ChatBox';
import { useContext } from 'react';
import Context from '../../../context/context';
import { ReactComponent as FullScreenSvg } from '../../../assets/svg/notes/fullScreen.svg';
import { ReactComponent as LinkSvg } from '../../../assets/svg/notes/link.svg';
const noteIcons = [<PreviousSvg />, <NextSvg />, <CopySvg />, <ShareSvg />];
const NoteComponentModal = ({ modalIsOpen, closeModal, handleRatingClick, chatList }) => {
	const chatContentRef = useRef(null);

	const [info, setInfo] = useState({
		noteComponentFullScreen: false,
		chatToNoteLoopOn: true,
	});

	useEffect(() => {
		smoothScrollToBottom();
	}, [chatList]); // Scroll when chat updates

	const smoothScrollToBottom = useCallback(() => {
		if (chatContentRef?.current) {
			chatContentRef.current.scrollTo({
				top: chatContentRef.current.scrollHeight,
				behavior: 'smooth', // Enables smooth scrolling
			});
		}
	}, [chatContentRef]);

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
				<div
					className="chatBarContainer"
					// style={{
					// 	width: info?.noteComponentFullScreen ? '0px' : '400px',
					// }}
				>
					<div className="chat-to-note-link-container">
						<div className="title">Link all chat to note</div>
						<div className="link-icon-container" onClick={handleChatToNoteLoopClick}>
							<LinkSvg />
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
						<ChatBox showChatLabels={false} chatToNoteLoopOn={info?.chatToNoteLoopOn} />
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
								className="chevron-icon"
								onClick={handleFullScreenClick}
								style={{
									transform: info?.noteComponentFullScreen
										? 'none'
										: 'rotate(180deg)',
								}}
							>
								<ChevronRightThinSvg />
							</div>
							<div className="full-screen-icon" onClick={closeModal}>
								<FullScreenSvg />
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
					/>
				</div>
			</div>
		</Drawer>
	);
};

export default NoteComponentModal;
