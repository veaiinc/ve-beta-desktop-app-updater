import React, { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/agentDetails.scss';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CreateAgentHeader from '../../components/ai_assistant/CreateAgentHeader';
import { ReactComponent as AgentIcon } from '../../../assets/svg/ai_assistant/agent.svg';
import { ReactComponent as EditIcon } from '../../../assets/svg/ai_assistant/edit.svg';
import TabHeader from '../../components/ai_assistant/TabHeader';
import Context from '../../../context/context';

const AgentDetails = () => {
	let {
		aiSetup: { getKnowledgeBaseFiles, getActiveAiAssistantDetails },
	} = useContext(Context);
	const { agentId } = useParams();
	const location = useLocation();
	const { agent } = location?.state;
	const navigate = useNavigate();

	console.log('agentData Data', agent);

	const [info, setInfo] = useState({
		activeTab: 'playground',
	});

	useEffect(() => {
		getKnowledgeBaseFiles(agentId);
		getActiveAiAssistantDetails(agentId);
	}, []);

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
				name={agent?.agentName}
				onBack={() => navigate('/ai-assistant')}
				actionBtnClassName="editAgentBtn"
				actionText="Edit"
				actionIcon={<EditIcon width={18} height={18} />}
				onActionClick={() =>
					navigate('/ai-assistant/create-assistant', { state: { agent } })
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
