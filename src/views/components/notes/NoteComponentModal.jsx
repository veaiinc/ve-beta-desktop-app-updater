import { Drawer, Spin } from 'antd';
import React, { useMemo, useState } from 'react';
import '../../../assets/scss/notes/noteComponentModal.scss';
import { ReactComponent as AiStarInChat } from '../../../assets/svg/ai_agents/ai-star-in-chat.svg';
import NoteComponent from './NoteComponent';
import { TypingEffect } from '../../../helpers/markdownHelper';
import Markdown from 'react-markdown';
import { ReactComponent as Filter } from '../../../assets/svg/ai_agents/filter.svg';
import { ReactComponent as Arroba } from '../../../assets/svg/ai_agents/arroba.svg';
import { ReactComponent as PaperClip } from '../../../assets/svg/ai_agents/paper-clip.svg';
import { ReactComponent as Mic } from '../../../assets/svg/ai_agents/mic.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import Upload from 'antd/es/upload/Upload';

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
}) => {
	const [info, setInfo] = useState({
		noteContent: '',
	});
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

	const handleEditNoteClick = () => {
		setInfo({
			noteContent: 'hiiii',
		});
	};
	return (
		<Drawer
			open={modalIsOpen}
			onClose={closeModal}
			placement="right"
			rootClassName="notes-modal-container"
			width={'100vw'}
			height={'100vh'}
		>
			<div className="modal-container">
				<div className="chatBarContainer">
					{/* chat body */}
					<div className={`chatBodyParentContainer`}>
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
												<TypingEffect
													text={chat?.message}
													toolInvocations={chat?.toolInvocations}
													onEditClick={handleEditNoteClick}
												/>
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
					<div className="chatInputContainer">
						<div className={`chatInputParentContainer`}>
							<textarea
								type="text"
								placeholder="Hey! Need help? Ask me anything."
								value={chatQuery}
								onChange={onChange}
								onKeyDown={onKeyDown}
								className="textArea"
								// rows={1}
							/>
							{/* <SendSvg
						style={{
							cursor: aiChatLoading ? 'not-allowed' : 'pointer',
							opacity: aiChatLoading ? 0.5 : 1,
						}}
						onClick={() => !aiChatLoading && onKeyDown(null, 'key')}
					/> */}
							<div className="chat-icons-container">
								{chatIcons?.map((icon, idx) => (
									<span key={idx} className="chat-icon">
										{icon}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="note-component">
					<div className="header">wedding</div>

					<NoteComponent
						outerContainerStyle={{
							width: '100%',
							maxWidth: '692px',
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
						initialContent={info?.noteContent}
					/>
				</div>
			</div>
		</Drawer>
	);
};

export default NoteComponentModal;
