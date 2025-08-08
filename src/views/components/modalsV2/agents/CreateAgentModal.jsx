import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ReactModal from '../index';
import s from './createAgentModal.module.scss';
import ChatBox from '../../chat/ChatBox';
import ObjectID from 'bson-objectid';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
const CreateAgentModal = ({ isOpen, closeModal }) => {
	const {
		knowledgeAgent: { activeKnowledgeAssistant, getActiveKnowledgeAgentDetails },
		templates: { updateStateValues, handleGlobalChatMessages },
	} = useContext(Context);
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		sessionId: ObjectID()?.toString(),
	});
	const handleCustomOnSendFunction = useCallback(
		(data) => {
			updateStateValues({ activePayloadForChat: data });
			navigate(`/chat/${info?.sessionId}`);
		},
		[info?.sessionId],
	);

	return (
		<ReactModal isOpen={isOpen} closeModal={closeModal} modalType={'center'}>
			<div className={s.createAgentContainer}>
				<div className={s.headerWrapper}>
					<h2 className={s.title}>Design Your Agent’s Role</h2>
					<div className={s.subHeading}>
						Describe a task, workflow, or problem your agent should handle. The more
						specific you are, the smarter the agent becomes.
					</div>
				</div>
				<div className={s.chatBoxWrapper}>
					<ChatBox
						onSend={handleCustomOnSendFunction}
						customChatActions={true}
						showUpgradeSubscriptionBtn={false}
						sessionId={info?.sessionId}
						animateChatBox={false}
						placeholder="What should your agent help you with?"
						isPublicChat={true}
					/>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CreateAgentModal);
