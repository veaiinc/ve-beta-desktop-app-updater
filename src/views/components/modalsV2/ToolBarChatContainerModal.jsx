/* eslint-disable react/jsx-no-duplicate-props */
import { Drawer } from 'antd';
import React, { memo, useState, useRef, useEffect } from 'react';
import '../../../assets/scss/ai_agents/bottomToolbarChatContainer.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as SendSvg } from '../../../assets/svg/calendar/send.svg';
import { ReactComponent as ExpandChatIcon } from '../../../assets/svg/ai_agents/expand-chat-icon.svg';
import { ReactComponent as AiStarInChat } from '../../../assets/svg/ai_agents/ai-star-in-chat.svg';
import { ReactComponent as Filter } from '../../../assets/svg/ai_agents/filter.svg';
import { ReactComponent as Arroba } from '../../../assets/svg/ai_agents/arroba.svg';
import { ReactComponent as PaperClip } from '../../../assets/svg/ai_agents/paper-clip.svg';
import { ReactComponent as Mic } from '../../../assets/svg/ai_agents/mic.svg';
import { Markdown, TypingEffect } from '../../../helpers/markdownHelper';

const chatIcons = [<Filter />, <Arroba />, <PaperClip />, <Mic />];

const ToolBarChatContainerModal = ({
	onClose,
	modalIsOpen,
	chatList = [],
	onChange,
	onKeyDown,
	chatQuery,
	aiChatLoading,
	isChatExpanded,
}) => {
	const [isExpanded, setIsExpanded] = useState(isChatExpanded || false);

	const chatContentRef = useRef(null);

	const width = isExpanded ? 'calc(100% - 245px)' : '400px';

	// Add this useEffect for auto-scrolling
	useEffect(() => {
		if (chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
		}
	}, [chatList]); // Scroll whenever chatList changes

	useEffect(() => {
		if (isExpanded && chatQuery?.trim()?.length) {
			// write logic to send the message
			console.log('chatQuery', chatQuery);
		}
	}, [isExpanded]);

	return (
		<Drawer
			onClose={() => {
				setIsExpanded(false);
				onClose();
			}}
			width={width}
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
						<ExpandChatIcon onClick={() => setIsExpanded(!isExpanded)} />
						<CloseSvg
							onClick={() => {
								setIsExpanded(false);
								onClose();
							}}
							style={{ cursor: 'pointer' }}
						/>
					</div>
				</div>

				{/* chat body */}
				<div className={`toolBarchatBodyParentContainer ${isExpanded ? 'expanded' : ''}`}>
					<div className="chatContent" ref={chatContentRef}>
						{chatList?.map((chat, index) =>
							chat?.content ? (
								chat?.content
							) : (
								<div
									key={index}
									className={`chat-message ${chat?.type?.toLowerCase()}-message`}
								>
									{chat?.type?.toLowerCase() === 'ai' && <AiStarInChat />}
									<div className="message-content">
										{chat?.type?.toLowerCase() === 'ai' ? (
											<TypingEffect text={chat?.message} />
										) : (
											<Markdown>{chat?.message}</Markdown>
										)}
									</div>
								</div>
							),
						)}
					</div>
				</div>

				{/* //message Container */}
				<div
					className={`toolBarExpandedChatInputParentContainer   ${
						isExpanded ? 'expanded' : ''
					}`}
				>
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
					<div className="chat-icons-container">
						{chatIcons?.map((icon, idx) => (
							<span key={idx} className="chat-icon">
								{icon}
							</span>
						))}
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(ToolBarChatContainerModal);
