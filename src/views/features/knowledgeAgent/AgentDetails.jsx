import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/knowledgeAgent/agentDetails.scss';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CreateAgentHeader from '../../components/ai_assistant/CreateAgentHeader';
import { ReactComponent as AgentIcon } from '../../../assets/svg/ai_assistant/agent.svg';
import { ReactComponent as EditIcon } from '../../../assets/svg/ai_assistant/edit.svg';
import TabHeader from '../../components/ai_assistant/TabHeader';
import Context from '../../../context/context';
import AiPlayGround from '../../components/ai_assistant/AiPlayGround';
import AiChatLogs from '../../components/ai_assistant/AiChatLogs';
import EditSvg from '../../../assets/svg/ai_assistant/EditSvg';
import ChatBox from '../../components/homePage/ChatBox';
import { message } from 'antd';
import jwtDecode from 'jwt-decode';

const KnowledgeAgentDetails = () => {
	const {
		knowledgeAgent: { activeKnowledgeAssistant, getActiveKnowledgeAgentDetails },
		templates: { updateStateValues, currentSessionId, chatInfo },
	} = useContext(Context);

	const { agentId } = useParams();
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		activeAiAssistant: null,
		loading: true,
		access: 'view',
	});

	useEffect(() => {
		if (agentId) {
			if (activeKnowledgeAssistant?.data && activeKnowledgeAssistant?.data?._id === agentId) {
				setInfo((prev) => ({
					...prev,
					activeAiAssistant: activeKnowledgeAssistant?.data,
					loading: false,
				}));
			} else if (activeKnowledgeAssistant?.error) {
				message.error(activeKnowledgeAssistant?.error);
				setInfo((prev) => ({
					...prev,
					loading: false,
				}));
			} else {
				getActiveKnowledgeAgentDetails(agentId);
			}
		}
	}, [agentId, activeKnowledgeAssistant]);

	useEffect(() => {
		if (agentId) {
			updateStateValues({
				chatInfo: { ...chatInfo, agentType: 'knowledge_agent', assistantId: agentId },
			});
		}
	}, [agentId]);

	useEffect(() => {
		checkAccess();
	}, [info?.activeAiAssistant]);

	const handleCustomOnSendFunction = useCallback(
		(data) => {
			updateStateValues({ activePayloadForChat: data });

			navigate(`/chat/${currentSessionId}`);
		},
		[currentSessionId],
	);

	const checkAccess = useCallback(() => {
		const token = localStorage.getItem('usertoken');
		const { user_id } = jwtDecode(token);
		const access = info?.activeAiAssistant?.sharedWith?.find(
			(user) => user?.userId === user_id,
		);
		setInfo((prev) => ({
			...prev,
			access: access?.access || '',
		}));
	}, [info?.activeAiAssistant?.sharedWith]);

	return (
		<div style={{ width: '100%', paddingRight: 10 }} className="agent-details-container">
			<CreateAgentHeader
				backText="Back to Knowledge Agents"
				agentIcon={<AgentIcon width={16} height={16} />}
				name={info?.loading ? 'Loading...' : info?.activeAiAssistant?.name}
				onBack={() => navigate(-1)}
				actionBtnClassName="editAgentBtn"
				actionText="Edit"
				actionIcon={<EditSvg />}
				onActionClick={() =>
					navigate(`/knowledge-agent/${agentId}/edit`, {
						state: { assistant: info?.activeAiAssistant },
					})
				}
				assistant={info?.activeAiAssistant}
				showActionButton={info?.access === 'edit' || info?.access === 'owner'}
			/>
			<div className="agent-details-wrapper">
				<div className="agent-details-content">
					{/* <div className="member-access">
						<span className="member-access-text">+3 Members access</span>
					</div> */}
					<h2>
						Ask <span className="agent-name">{info?.activeAiAssistant?.name}</span>
						<br /> anything
					</h2>

					{info?.activeAiAssistant?.handle && (
						<div className="handle-wrapper">@{info?.activeAiAssistant?.handle}</div>
					)}

					{info?.activeAiAssistant?.description && (
						<div className="description-wrapper">
							{info?.activeAiAssistant?.description}
						</div>
					)}
					{/* <div className="add-to-start-button">Add to Start</div> */}
				</div>
				<div className="chat-box-wrapper">
					<ChatBox onSend={handleCustomOnSendFunction} customChatActions={true} />
				</div>
			</div>
		</div>
	);
};

export default memo(KnowledgeAgentDetails);
