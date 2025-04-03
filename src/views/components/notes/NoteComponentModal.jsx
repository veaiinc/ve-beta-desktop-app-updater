import { Tooltip } from 'antd';
import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
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
import ReactModal from '../../components/modalsV2/index';

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
	const [isClosing, setIsClosing] = useState(false);
	const {
		templates: { globalChatMessages },
		documentPreview: { noteContent },
	} = useContext(Context);
	const [info, setInfo] = useState({
		noteComponentFullScreen: false,
		chatToNoteLoopOn: false,
		noteIconsInfo: {
			copy: false,
		},
	});

	const customModalStyles = {
		content: {
			width: '100vw',
			height: '100vh',
			padding: '0px',
			border: 'none',
			borderRadius: '0px',
			backgroundColor: 'var(--background-color)',
			zIndex: 1000,
			clipPath: 'inset(0% 0% 0% 0%)',
			transition:
				'clip-path 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
			opacity: 1,
		},
		overlay: {
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			zIndex: 99999999999,
			transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
		},
	};

	useEffect(() => {
		if (modalIsOpen) {
			smoothScrollToBottom();
		}
	}, [chatList, modalIsOpen]); // Scroll when chat updates

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

	const handleCopyNoteContent = (content) => {
		navigator?.clipboard?.writeText(content);
		setTimeout(() => {
			setInfo((prev) => ({
				...prev,
				noteIconsInfo: {
					...prev?.noteIconsInfo,
					copy: !prev?.noteIconsInfo?.copy,
				},
			}));
		}, 1000);
	};

	const handleCopyClick = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			noteIconsInfo: {
				...prev?.noteIconsInfo,
				copy: !prev?.noteIconsInfo?.copy,
			},
		}));
	}, []);

	const noteIcons = useMemo(
		() => [
			{ icon: <PreviousSvg />, tooltipContent: 'undo' },
			{ icon: <NextSvg />, tooltipContent: 'redo' },
			{
				icon: <CopySvg />,
				onIconClick: handleCopyClick,
				tooltipContent: info?.noteIconsInfo?.copy ? 'copied' : 'copy',
			},
			{ icon: <ShareSvg />, tooltipContent: 'share' },
		],
		[info?.noteIconsInfo],
	);

	const handleClose = () => {
		const modalContent = document.querySelector('.notes-modal-container .ReactModal__Content');
		const modalOverlay = document.querySelector('.notes-modal-container .ReactModal__Overlay');

		if (modalContent && modalOverlay) {
			modalContent.style.clipPath = 'inset(50% 50% 50% 50%)';
			modalContent.style.opacity = '0';
			modalOverlay.style.opacity = '0';
		}

		setTimeout(() => {
			closeModal();
		}, 400);
	};

	return (
		<ReactModal
			isOpen={modalIsOpen}
			closeModal={handleClose}
			customStyles={customModalStyles}
			rootClassName={`notes-modal-container ${isClosing ? 'closing' : ''}`}
		>
			<div className="notes-modal-container">
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
															smoothScrollToBottom={
																smoothScrollToBottom
															}
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
								<div className="full-screen-icon" onClick={handleClose}>
									<RightDoubleArrowSvg />
								</div>
								<div className="title"></div>
							</div>
							<div className="right">
								{noteIcons.map(({ icon, onIconClick, tooltipContent }, index) => {
									return (
										<Tooltip title={tooltipContent} key={index}>
											<div className="icon-container" onClick={onIconClick}>
												{icon}
											</div>
										</Tooltip>
									);
								})}
							</div>
						</div>
						<div className="note-component-container">
							<NoteComponent
								outerContainerStyle={{
									width: '100%',
									height: '100%',
									overflow: 'scroll',
								}}
								initialContent={
									info?.chatToNoteLoopOn ? globalChatMessages : noteContent
								}
								loopOn={info?.chatToNoteLoopOn}
								noteIconsInfo={info?.noteIconsInfo}
								onCopyNoteContent={handleCopyNoteContent}
							/>
						</div>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default NoteComponentModal;
