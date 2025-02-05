import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/agentDetails.scss';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CreateAgentHeader from '../../components/ai_assistant/CreateAgentHeader';
import { ReactComponent as AgentIcon } from '../../../assets/svg/ai_assistant/agent.svg';
import { ReactComponent as EditIcon } from '../../../assets/svg/ai_assistant/edit.svg';
import TabHeader from '../../components/ai_assistant/TabHeader';
import Context from '../../../context/context';
import AiPlayGround from '../../components/ai_assistant/AiPlayGround';
import AiChatLogs from '../../components/ai_assistant/AiChatLogs';

const AgentDetails = () => {
	const {
		aiSetup: { activeAiAssistantDetails, getActiveAiAssistantDetails },
	} = useContext(Context);

	const { aiAssistantId } = useParams();
	const { assistant } = useLocation()?.state;
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		activeTab: 'chatlogs', // playground, chatlogs, connections
		activeAiAssistant: null,
	});

	useEffect(() => {
		if (aiAssistantId) {
			getActiveAiAssistantDetails(aiAssistantId);
		}
	}, [aiAssistantId]);

	useEffect(() => {
		if (activeAiAssistantDetails) {
			setInfo((prev) => ({ ...prev, activeAiAssistant: activeAiAssistantDetails }));
		}
	}, [activeAiAssistantDetails]);

	const tabs = {
		playground: {
			value: 'playground',
			label: 'Playground',
			component: <AiPlayGround assistant={info?.activeAiAssistant} />,
		},
		chatlogs: {
			value: 'chatlogs',
			label: 'Chat Logs',
			component: <AiChatLogs assistant={info?.activeAiAssistant} />,
		},
		// connections: {
		// 	value: 'connections',
		// 	label: 'Connections',
		// 	// component: <Connections />,
		// },
	};

	const onTabChange = useCallback(
		(tab) => {
			if (tab !== info?.activeTab) {
				setInfo((prev) => ({ ...prev, activeTab: tab }));
			}
		},
		[info?.activeTab],
	);

	return (
		<div style={{ width: '100%', paddingRight: 10 }}>
			<CreateAgentHeader
				backText="Back to AI Assistants"
				agentIcon={<AgentIcon width={16} height={16} />}
				name={assistant?.name}
				onBack={() => navigate('/ai-assistant')}
				actionBtnClassName="editAgentBtn"
				actionText="Edit"
				actionIcon={<EditIcon width={18} height={18} />}
				onActionClick={() =>
					navigate(`/ai-assistant/${aiAssistantId}/edit`, {
						state: { assistant },
					})
				}
				assistant={info?.activeAiAssistant}
			/>
			<TabHeader
				activeTab={info?.activeTab}
				onTabChange={onTabChange}
				tabs={Object.values(tabs)?.map(({ value, label }) => ({ value, label }))}
			/>
			{tabs?.[info?.activeTab]?.component}
		</div>
	);
};

export default memo(AgentDetails);
