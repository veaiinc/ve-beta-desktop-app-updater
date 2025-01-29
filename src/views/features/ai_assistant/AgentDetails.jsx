import React, { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/agentDetails.scss';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CreateAgentHeader from '../../components/ai_assistant/CreateAgentHeader';
import { ReactComponent as AgentIcon } from '../../../assets/svg/ai_assistant/agent.svg';
import { ReactComponent as EditIcon } from '../../../assets/svg/ai_assistant/edit.svg';
import TabHeader from '../../components/ai_assistant/TabHeader';
import Context from '../../../context/context';

const AgentDetails = () => {
	const {
		aiSetup: { activeAiAssistantDetails },
	} = useContext(Context);

	const { aiAssistantId } = useParams();
	const location = useLocation();
	const { assistant, activeAiAssistant } = location?.state;
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		activeTab: 'playground', // playground, chatlogs, connections
		activeAiAssistant: null,
	});

	useEffect(() => {
		if (activeAiAssistantDetails) {
			setInfo((prev) => ({ ...prev, activeAiAssistant: activeAiAssistantDetails }));
		}
	}, [activeAiAssistantDetails]);

	const tabs = {
		playground: { value: 'playground', label: 'Playground' },
		chatlogs: { value: 'chatlogs', label: 'Chat Logs' },
		connections: { value: 'connections', label: 'Connections' },
	};

	const onTabChange = (tab) => {
		setInfo({ ...info, activeTab: tab });
	};

	return (
		<>
			<CreateAgentHeader
				backText="Back to AI Assistants"
				agentIcon={<AgentIcon width={16} height={16} />}
				// name={info?.activeAiAssistant?.name || assistant?.name}
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
			/>
			<TabHeader
				activeTab={info?.activeTab}
				onTabChange={onTabChange}
				tabs={Object.values(tabs)?.map(({ value, label }) => ({ value, label }))}
			/>
		</>
	);
};

export default memo(AgentDetails);
