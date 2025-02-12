/* eslint-disable react/jsx-no-duplicate-props */
import { Drawer, Spin } from 'antd';
import React, { memo, useState, useRef, useEffect, useContext } from 'react';
import '../../../assets/scss/ai_agents/bottomToolbarChatContainer.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as SendSvg } from '../../../assets/svg/calendar/send.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as ExpandChatIcon } from '../../../assets/svg/ai_agents/expand-chat-icon.svg';
import { ReactComponent as AiStarInChat } from '../../../assets/svg/ai_agents/ai-star-in-chat.svg';
import { ReactComponent as Filter } from '../../../assets/svg/ai_agents/filter.svg';
import { ReactComponent as Arroba } from '../../../assets/svg/ai_agents/arroba.svg';
import { ReactComponent as PaperClip } from '../../../assets/svg/ai_agents/paper-clip.svg';
import { ReactComponent as ArrowUp } from '../../../assets/svg/ai_agents/arrow-up-dark.svg';
import { ReactComponent as Mic } from '../../../assets/svg/ai_agents/mic.svg';
import { Markdown, TypingEffect } from '../../../helpers/markdownHelper';

import Upload from 'antd/es/upload/Upload';
import { useMemo } from 'react';
import NoteComponentModal from '../notes/NoteComponentModal';
import CitationsModal from './chat/CitationsModal';

const ToolBarChatContainerModal = ({
	onClose,
	modalIsOpen,
	chatList = [],
	onChange,
	onKeyDown,
	chatQuery,
	onImageUpload,
	uploadedImages,
	handlePreview,
	handleRemoveImage,
	onClick,
}) => {
	const [info, setInfo] = useState({
		noteModalIsOpen: false,
		citationsModalIsOpen: false,
	});

	const chatContentRef = useRef(null);

	useEffect(() => {
		if (chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
		}
	}, [chatList]); // Scroll whenever chatList changes
	const handleNoteComponentModalClose = () => {
		setInfo((prev) => ({
			...prev,
			noteModalIsOpen: false,
		}));
	};
	const handleCloseCitationsModal = () => {
		setInfo((prev) => ({
			...prev,
			citationsModalIsOpen: false,
		}));
	};

	const chatIcons = useMemo(
		() => [
			<Filter />,
			<Arroba />,
			<Upload
				onChange={onImageUpload}
				showUploadList={false}
				beforeUpload={() => false} // Prevent default upload behavior
				maxCount={1} // Allow only one file at a time
				// accept="image/*" // Accept only images
				accept=".pdf,.docx,.txt,.md,.json,.png,.jpg,.jpeg"
			>
				<PaperClip />
			</Upload>,
			<Mic />,
		],
		[onImageUpload],
	);

	const handleNoteComponentModalOpen = () => {
		setInfo((prev) => ({
			...prev,
			noteModalIsOpen: true,
		}));
	};

	return (
		<>
			<Drawer
				onClose={onClose}
				width={'100vw'}
				open={modalIsOpen}
				style={{ backgroundColor: '#171819' }}
				headerStyle={{ display: 'none' }}
				bodyStyle={{ padding: '0px' }}
			>
				<div className="toolExpandedChatBarContainer" style={{ width: '100%' }}>
					{/* header */}
					<div className="toolExpandedChatBarContainerHeader" style={{ width: '100%' }}>
						<h1 className="toolExpandedChatBarContainerHeaderTitle">AI Assistant</h1>
						<div className="toolExpandedChatBarContainerHeaderIconContainer">
							{!info?.citationsModalIsOpen && (
								<ExpandChatIcon
									onClick={() => {
										setInfo((prev) => ({
											...prev,
											citationsModalIsOpen: true,
										}));
									}}
								/>
							)}

							<CloseSvg onClick={onClose} style={{ cursor: 'pointer' }} />
						</div>
					</div>

					{/* chat body */}

					<div className="parentContainer">
						<div className="chatContainer">
							<div className={`toolBarchatBodyParentContainer`}>
								<div className="chatContent" ref={chatContentRef}>
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
																customePencilClickFunc={
																	handleNoteComponentModalOpen
																}
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

							{uploadedImages?.length ? (
								<div className="imagePreviewBar">
									{uploadedImages?.map((ele, index) => (
										<div className="previewOfUploadedImage" key={index}>
											<img
												src={ele?.preview}
												alt="uploaded"
												width={'100%'}
												height={'100%'}
												style={{ objectFit: 'cover', borderRadius: '12px' }}
												onClick={() => handlePreview(ele)}
											/>

											{ele?.loading ? (
												<div className="spinContainerLoaderForPreview">
													<Spin />
												</div>
											) : (
												<span
													className="removeImageIcon"
													onClick={() => handleRemoveImage(ele)}
												>
													<Close />
												</span>
											)}
										</div>
									))}
								</div>
							) : (
								''
							)}

							{/* //message Container */}
							<div className={`toolBarExpandedChatInputParentContainer`}>
								<textarea
									type="text"
									placeholder="Hey! Need help? Ask me anything."
									value={chatQuery}
									onChange={onChange}
									onKeyDown={onKeyDown}
									className="toolBarExpandedTextArea"
									// rows={1}
								/>
								{/* <SendSvg
						style={{
							cursor: aiChatLoading ? 'not-allowed' : 'pointer',
							opacity: aiChatLoading ? 0.5 : 1,
						}}
						onClick={() => !aiChatLoading && onKeyDown(null, 'key')}
					/> */}
								<div className="buttons-container">
									<div className="chat-icons-container">
										{chatIcons?.map((icon, idx) => (
											<span key={idx} className="chat-icon">
												{icon}
											</span>
										))}
									</div>
									<div
										className="click-btn"
										onClick={(e) => onClick(e)}
										style={{
											backgroundColor: `${
												chatQuery?.trim()?.length > 0
													? '#b2a1e8'
													: '#2e2f33'
											}`,
										}}
									>
										<ArrowUp />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<CitationsModal
					modalIsOpen={info?.citationsModalIsOpen}
					closeModal={handleCloseCitationsModal}
				/>
				<NoteComponentModal
					modalIsOpen={info?.noteModalIsOpen}
					closeModal={handleNoteComponentModalClose}
					chatQuery={chatQuery}
					onKeyDown={onKeyDown}
					onChange={onChange}
					chatList={chatList}
					onClick={onClick}
					onImageUpload={onImageUpload}
					uploadedImages={uploadedImages}
					handlePreview={handlePreview}
					handleRemoveImage={handleRemoveImage}
				/>
			</Drawer>
			{/* <CitationsModal
				modalIsOpen={info?.citationsModalIsOpen}
				closeModal={handleCloseCitationsModal}
			/> */}
		</>
	);
};

export default memo(ToolBarChatContainerModal);
