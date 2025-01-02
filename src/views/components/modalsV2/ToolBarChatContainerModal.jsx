/* eslint-disable react/jsx-no-duplicate-props */
import { Drawer } from 'antd';
import React, { memo, useState, useRef, useEffect } from 'react';
import '../../../assets/scss/ai_agents/bottomToolbarChatContainer.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as SendSvg } from '../../../assets/svg/calendar/send.svg';
import ReactMarkdown from 'react-markdown';
const ToolBarChatContainerModal = ({
	onClose,
	modalIsOpen,
	chatList = [],
	onChange,
	onKeyDown,
	chatQuery,
	aiChatLoading,
}) => {
	const [info, setInfo] = useState({});
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
			width={320}
			open={modalIsOpen}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '12px' }}
		>
			<div className="toolExpandedChatBarContainer">
				{/* header */}
				<div className="toolExpandedChatBarContainerHeader">
					<span className="toolExpandedChatBarContainerHeaderTitle">Ask Ai</span>
					<CloseSvg onClick={onClose} style={{ cursor: 'pointer' }} />
				</div>

				{/* chat body */}
				<div className="toolBarchatBodyParentContainer" ref={chatContentRef}>
					<div className="chatContent">
						{chatList.map((chat, index) =>
							chat?.content ? (
								chat?.content
							) : (
								<div
									key={index}
									className={`chat-message ${chat.type.toLowerCase()}-message`}
								>
									<div className="message-content">
										<ReactMarkdown>{chat.message}</ReactMarkdown>
									</div>
								</div>
							),
						)}
					</div>
				</div>

				{/* //message Container */}
				<div className="toolBarExpandedChatInputParentContainer">
					<textarea
						type="text"
						placeholder="Ex: Schedule a meeting"
						value={chatQuery}
						onChange={onChange}
						onKeyDown={onKeyDown}
						className="toolBarExpandedTextArea"
						// rows={1}
					/>
					<SendSvg
						style={{
							cursor: aiChatLoading ? 'not-allowed' : 'pointer',
							opacity: aiChatLoading ? 0.5 : 1,
						}}
						onClick={() => !aiChatLoading && onKeyDown(null, 'key')}
					/>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(ToolBarChatContainerModal);
