import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/ai_agents/bottomToolbar.scss';
import { ReactComponent as Plus } from '../../../assets/svg/ai_agents/Plus.svg';
import { ReactComponent as Home } from '../../../assets/svg/ai_agents/home.svg';
import { ReactComponent as Settings } from '../../../assets/svg/ai_agents/settings.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as Expand } from '../../../assets/svg/bottomToolbar/expand.svg';
import ToolBarChatContainerModal from '../modalsV2/ToolBarChatContainerModal';
const BottomToolbar = ({ outerContainerStyle = {}, chatList = [], onSend }) => {
	const [info, setInfo] = useState({
		expanded: false,
		inputExpanded: false,
		chatModalIsOpen: false,
	});

	//function definitions
	const handleInputFocus = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			expanded: true,
			inputExpanded: true,
		}));
	}, [info]);

	const handleClose = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			expanded: false,
		}));
	}, [info]);

	const handleChatExpand = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			chatModalIsOpen: true,
			expanded: false,
			inputExpanded: false,
		}));
	}, []);

	const handleCloseChatModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, chatModalIsOpen: false }));
	}, [info]);

	return (
		<div className="bottomToolbarParentWrapper" style={{ ...outerContainerStyle }}>
			<div
				className={`${
					info?.expanded ? 'expandedChatContainer' : ''
				} bottomToolbarChatContainer`}
			>
				<div className="bottomToolBarChatHeader">
					<span>AI Assistant</span>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<button className="closeButton" onClick={handleChatExpand}>
							<Expand />
						</button>
						<button className="closeButton" onClick={handleClose}>
							<Close />
						</button>
					</div>
				</div>
				<div className="chatContent">
					{chatList.map((chat, index) => (
						<div
							key={index}
							className={`chat-message ${chat.type.toLowerCase()}-message`}
						>
							<div className="message-content">{chat.message}</div>
						</div>
					))}
				</div>
			</div>

			{/* bottom toolBarContent */}
			{!info?.chatModalIsOpen ? (
				<div className="bottomToolbar">
					<input
						className={`bottomToolbarInputs ${info.inputExpanded ? 'expanded' : ''}`}
						placeholder="Ask AI"
						onFocus={handleInputFocus}
					/>
					<div className="quickActionsButtons">
						<Home />
					</div>
					<div className="quickActionsButtons">
						<Plus />
					</div>
					<div className="quickActionsButtons">
						<Settings />
					</div>
				</div>
			) : (
				''
			)}
			<ToolBarChatContainerModal
				onClose={handleCloseChatModal}
				modalIsOpen={info?.chatModalIsOpen}
				chatList={chatList}
				onSend={onSend}
			/>
		</div>
	);
};

export default memo(BottomToolbar);
