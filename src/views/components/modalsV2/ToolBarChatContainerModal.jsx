import { Drawer } from 'antd';
import React, { memo, useState } from 'react';
import '../../../assets/scss/ai_agents/bottomToolbarChatContainer.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as SendSvg } from '../../../assets/svg/calendar/send.svg';
const ToolBarChatContainerModal = ({ onClose, modalIsOpen }) => {
	const [info, setInfo] = useState({});
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

				{/* //chat body */}
				<div className="toolBarchatBodyParentContainer"></div>

				{/* //message Container */}
				<div className="toolBarExpandedChatInputParentContainer">
					<textarea
						type="text"
						// ref={userTypingRef}
						placeholder="Ex: Schedule a meeting"
						value={info?.userInput}
						// onChange={handleInputChange}
						// onKeyDown={handleSendMessage}
						disabled={info?.isProcessing}
						className="toolBarExpandedTextArea"
					/>
					<SendSvg style={{ cursor: 'pointer' }} />
				</div>
			</div>
		</Drawer>
	);
};

export default memo(ToolBarChatContainerModal);
