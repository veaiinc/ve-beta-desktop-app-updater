import { Tooltip } from 'antd';
import { useEffect, useRef, useCallback, useState, memo } from 'react';
import '../../../assets/scss/notes/noteComponentModal.scss';
import NoteComponent from './NoteComponent';
import Markdown from 'react-markdown';
import { ReactComponent as BackSvg } from '../../../assets/svg/sidebar/leftarrowwhite.svg';
import { ReactComponent as CloseSvg } from '../../../assets/svg/close.svg';
import { StarSvg } from '../../../assets/svg/notes/Star';
import ChatBox from '../chat/ChatBox';
import { useContext } from 'react';
import Context from '../../../context/context';
import { ReactComponent as LinkLightSvg } from '../../../assets/svg/notes/loop-light.svg';
import { ReactComponent as LinkDarkSvg } from '../../../assets/svg/notes/loop-dark.svg';
import ReactModal from '../../components/modalsV2/index';
import ShareComponent from './ShareComponent';
import MoreOptions from './MoreOptions';
import AIMessage from '../chat/AIMessage';

const outerContainerStyleFullWidth = {
	width: '100%',
	height: '100%',
	maxWidth: '100%',
};

const outerContainerStyle = {
	width: '100%',
	height: '100%',
	maxWidth: '775px',
};

const NoteComponentModal = ({ modalIsOpen, closeModal }) => {
	const chatContentRef = useRef(null);
	const {
		templates: { globalChatMessages, currentSessionId, handleGlobalChatMessages },
		documentPreview: { noteContent },
		chatStream: { sendMessage },
		notes: { addToFavorite, removeFromFavorite, deletePage, duplicatePage },
	} = useContext(Context);

	const [info, setInfo] = useState({
		noteComponentFullScreen: false,
		chatToNoteLoopOn: false,
		noteId: null,
		isFavorite: false,
		notesConfigs: {
			smallText: false,
			fullWidth: false,
		},
	});

	useEffect(() => {
		if (modalIsOpen) {
			smoothScrollToBottom();
		}
	}, [globalChatMessages, modalIsOpen]); // Scroll when chat updates

	const smoothScrollToBottom = useCallback((type) => {
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
	}, []);

	const handleFullScreenClick = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			noteComponentFullScreen: !prev?.noteComponentFullScreen,
		}));
	}, []);

	const handleChatToNoteLoopClick = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			chatToNoteLoopOn: !prev?.chatToNoteLoopOn,
		}));
	}, []);

	const handleClose = useCallback(() => {
		closeModal?.();
	}, [closeModal]);

	const handleFavorite = useCallback(
		(value) => {
			setInfo((prev) => ({ ...prev, isFavorite: value }));
			const payload = { pageId: info?.noteId };
			if (value) {
				addToFavorite(payload);
			} else {
				removeFromFavorite(payload);
			}
		},
		[info?.noteId],
	);

	const handleMoreOptionsChange = useCallback((key, value) => {
		setInfo((prev) => ({
			...prev,
			notesConfigs: { ...prev?.notesConfigs, [key]: value },
		}));
	}, []);

	const handleDeletePage = useCallback(async () => {
		const [success] = await deletePage({ pageId: info?.noteId });
		if (success) {
			handleClose();
		}
	}, [info?.noteId]);

	const handleDuplicatePage = useCallback(async () => {
		const [success] = await duplicatePage({ pageId: info?.noteId });
		if (success) {
			// Handle success case if needed
		}
	}, [info?.noteId]);

	const handleSendWebsocketMessage = useCallback(
		async (data, lastQuery) => {
			try {
				await sendMessage(data);
				handleGlobalChatMessages({
					sessionId: currentSessionId,
					lastQuery,
					updateExtraInfo: true,
				});
			} catch (error) {
				console.error('Failed to send message:', error);
				// Handle error appropriately (show notification, etc.)
			}
		},
		[sendMessage, currentSessionId],
	);

	if (!modalIsOpen) {
		return null;
	}

	return (
		<ReactModal isOpen={modalIsOpen} closeModal={handleClose} modalType="center">
			<div className="notes-modal-container">
				<div className="notes-modal-wrapper">
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
								{globalChatMessages?.[currentSessionId]?.messages?.map(
									(chat, index) =>
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
															<AIMessage
																text={chat?.message}
																smoothScrollToBottom={
																	smoothScrollToBottom
																}
																messageId={chat?.messageId}
																showTypingEffect={
																	chat?.typingEffect
																}
																rating={chat?.rating}
																messageData={chat}
																citations={chat?.citations}
																isNoteCanvas={true}
																showCitationsButton={false}
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
								showIconText={false}
								handleSendWebsocketMessage={handleSendWebsocketMessage}
								showUpgradeSubscriptionBtn={false}
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
									className="full-screen-icon"
									onClick={handleFullScreenClick}
									style={{
										transform: info?.noteComponentFullScreen
											? 'rotate(180deg)'
											: 'none',
									}}
								>
									<Tooltip
										title={`${
											info?.noteComponentFullScreen ? 'Minimize' : 'Expand'
										} Notes`}
										placement="bottom"
									>
										<BackSvg />
									</Tooltip>
								</div>
								<div className="close-icon" onClick={handleClose}>
									<Tooltip title="Close Notes" placement="bottom">
										<CloseSvg />
									</Tooltip>
								</div>
								<div className="title"></div>
							</div>
							<div className="right">
								<div className="notes-nav-menu">
									<ShareComponent pageId={info?.noteId} />
									<StarSvg
										fill={info?.isFavorite}
										width={18}
										height={18}
										onClick={() => handleFavorite(!info?.isFavorite)}
										className="cursor-pointer"
									/>
									<MoreOptions
										notesConfigs={info?.notesConfigs}
										onChange={handleMoreOptionsChange}
										onDelete={handleDeletePage}
										onDuplicate={handleDuplicatePage}
									/>
								</div>
							</div>
						</div>
						<div className="note-component-container">
							<NoteComponent
								outerContainerStyle={
									info?.notesConfigs?.fullWidth
										? outerContainerStyleFullWidth
										: outerContainerStyle
								}
								initialContent={
									info?.chatToNoteLoopOn
										? globalChatMessages?.[currentSessionId]?.messages
										: noteContent
								}
								loopOn={info?.chatToNoteLoopOn}
								noteId={info?.noteId}
								setNoteId={(newNoteId) =>
									setInfo((prev) => ({ ...prev, noteId: newNoteId }))
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(NoteComponentModal);
