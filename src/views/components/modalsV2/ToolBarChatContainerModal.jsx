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
import ReactMarkdown from 'react-markdown';

const chatIcons = [<Filter />, <Arroba />, <PaperClip />, <Mic />];

const ToolBarChatContainerModal = ({
	onClose,
	modalIsOpen,
	chatList = [],
	onChange,
	onKeyDown,
	chatQuery,
	aiChatLoading,
}) => {
	const chatContentRef = useRef(null);

	// Add this useEffect for auto-scrolling
	useEffect(() => {
		if (chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
		}
	}, [chatList]); // Scroll whenever chatList changes

	return (
		<Drawer
			onClose={onClose}
			width={400}
			open={modalIsOpen}
			style={{ backgroundColor: '#171819' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="toolExpandedChatBarContainer">
				{/* header */}
				<div className="toolExpandedChatBarContainerHeader">
					<h1 className="toolExpandedChatBarContainerHeaderTitle">AI Assistant</h1>
					<div className="toolExpandedChatBarContainerHeaderIconContainer">
						<ExpandChatIcon />
						<CloseSvg onClick={onClose} style={{ cursor: 'pointer' }} />
					</div>
				</div>

				{/* chat body */}
				<div className="toolBarchatBodyParentContainer">
					<div className="chatContent" ref={chatContentRef}>
						{chatList?.map((chat, index) => (
							<div
								key={index}
								className={`chat-message ${chat?.type?.toLowerCase()}-message`}
							>
								<div className="message-content">
									{chat?.type?.toLowerCase() === 'ai' && <AiStarInChat />}
									<ReactMarkdown>{chat?.message}</ReactMarkdown>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* //message Container */}
				<div className="toolBarExpandedChatInputParentContainer">
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
