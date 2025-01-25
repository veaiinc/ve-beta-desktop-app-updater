import React, { memo, useState } from 'react';
import '../../../assets/scss/ai_assistant/CreateAgent.scss';
import CreateAgentHeader from '../../components/ai_assistant/CreateAgentHeader';
import TabHeader from '../../components/ai_assistant/TabHeader';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as AgentIcon } from '../../../assets/svg/ai_assistant/agent.svg';

const tabs = {
	personality: { value: 'personality', label: 'Personality' },
	instructions: { value: 'instructions', label: 'Instructions' },
	actions: { value: 'actions', label: 'Actions' },
	knowledgeBase: { value: 'knowledgeBase', label: 'Knowledge Base' },
	prompt: { value: 'prompt', label: 'Prompt' },
	share: { value: 'share', label: 'Share' },
};

const CreateAgent = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('personality');
	const onTabChange = (tab) => {
		setActiveTab(tab);
	};

	const onBack = () => {
		navigate(-1);
	};

	const onActionClick = () => {
		console.log('Action Clicked');
	};

	return (
		<div className="create-agent">
			<div style={{ flexShrink: 0 }}>
				<CreateAgentHeader
					name="Assistant#2"
					onBack={onBack}
					onActionClick={onActionClick}
					status="Saved"
					backText="Back to AI Assistants"
					actionText="Publish"
					agentIcon={<AgentIcon width={18} height={18} />}
				/>
				<TabHeader
					activeTab={activeTab}
					onTabChange={onTabChange}
					tabs={Object?.values(tabs)}
				/>
			</div>
			<div className="tabSection">
				<div className="create-agent-body-title">Create Agent</div>
			</div>
		</div>
	);
};

export default memo(CreateAgent);
