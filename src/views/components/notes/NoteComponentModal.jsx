import { Drawer, Image, Spin } from 'antd';
import React, { useMemo, useEffect, useRef, useCallback, useState } from 'react';
import '../../../assets/scss/notes/noteComponentModal.scss';
import NoteComponent from './NoteComponent';
import { TypingEffect } from '../../../helpers/markdownHelper';
import Markdown from 'react-markdown';
import { ReactComponent as Filter } from '../../../assets/svg/ai_agents/filter.svg';
import { ReactComponent as Arroba } from '../../../assets/svg/ai_agents/arroba.svg';
import { ReactComponent as PaperClip } from '../../../assets/svg/ai_agents/paper-clip.svg';
import { ReactComponent as Mic } from '../../../assets/svg/ai_agents/mic.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as PreviousSvg } from '../../../assets/svg/notes/previous.svg';
import { ReactComponent as NextSvg } from '../../../assets/svg/notes/next.svg';
import { ReactComponent as CopySvg } from '../../../assets/svg/notes/copy.svg';
import { ReactComponent as ShareSvg } from '../../../assets/svg/notes/share.svg';
import { ReactComponent as ArrowUp } from '../../../assets/svg/ai_agents/arrow-up-dark.svg';

import Upload from 'antd/es/upload/Upload';
import ChatBox from '../homePage/ChatBox';
const noteIcons = [<PreviousSvg />, <NextSvg />, <CopySvg />, <ShareSvg />];
const NoteComponentModal = ({
	modalIsOpen,
	closeModal,
	chatList = [],
	chatQuery,
	onKeyDown,
	onChange,
	onImageUpload,
	uploadedImages,
	handlePreview,
	handleRemoveImage,
	onClick,
}) => {
	const chatContentRef = useRef(null);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	useEffect(() => {
		smoothScrollToBottom();
	}, [chatList]); // Scroll when chat updates

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

	const smoothScrollToBottom = useCallback(() => {
		if (chatContentRef?.current) {
			chatContentRef.current.scrollTo({
				top: chatContentRef.current.scrollHeight,
				behavior: 'smooth', // Enables smooth scrolling
			});
		}
	}, [chatContentRef]);
	return (
		<>
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

						<ChatBox showChatLabels={false} />
					</div>
					<div className="note-component">
						<div className="header">
							<div className="left">
								<div className="chevron-icon" onClick={closeModal}>
									<ChevronRightThinSvg />
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
			{previewImage && (
				<Image
					wrapperStyle={{
						display: 'none',
					}}
					preview={{
						visible: previewOpen,
						onVisibleChange: (visible) => setPreviewOpen(visible),
						afterOpenChange: (visible) => !visible && setPreviewImage(''),
					}}
					src={previewImage}
				/>
			)}

			{previewImage && (
				<Image
					wrapperStyle={{
						display: 'none',
						zIndex: '1020',
					}}
					preview={{
						visible: previewOpen,
						onVisibleChange: (visible) => setPreviewOpen(visible),
						afterOpenChange: (visible) => !visible && setPreviewImage(''),
					}}
					src={previewImage}
				/>
			)}
		</>
	);
};

export default NoteComponentModal;
