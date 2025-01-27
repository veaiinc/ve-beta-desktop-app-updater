import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/ai_assistant/CreateAgent.scss';
import CreateAgentHeader from '../../components/ai_assistant/CreateAgentHeader';
import TabHeader from '../../components/ai_assistant/TabHeader';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as AgentIcon } from '../../../assets/svg/ai_assistant/agent.svg';
import AiPersonality from '../../components/ai_assistant/AiPersonality';
import AiInstructions from '../../components/ai_assistant/AiInstructions';
import AiActions from '../../components/ai_assistant/AiActions';
import AiKnowledgeBase from '../../components/ai_assistant/AiKnowledgeBase';
import AiPrompt from '../../components/ai_assistant/AiPrompt';
import AiShare from '../../components/ai_assistant/AiShare';
import AiLinkFile from '../../components/ai_assistant/AiLinkFile';

const CreateAgent = () => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		activeTab: 'personality', // personality, instructions, actions, knowledgeBase, prompt, share, linkeafile
	});

	const tabs = {
		personality: { value: 'personality', label: 'Personality', component: <AiPersonality /> },
		instructions: {
			value: 'instructions',
			label: 'Instructions',
			component: <AiInstructions />,
		},
		actions: { value: 'actions', label: 'Actions', component: <AiActions /> },
		knowledgeBase: {
			value: 'knowledgeBase',
			label: 'Knowledge Base',
			component: <AiKnowledgeBase />,
		},
		prompt: { value: 'prompt', label: 'Prompt', component: <AiPrompt /> },
		share: { value: 'share', label: 'Share', component: <AiShare /> },
		linkFile: { value: 'linkFile', label: 'Link File', component: <AiLinkFile /> },
	};

	const onTabChange = useCallback((tab) => {
		setInfo((prev) => ({ ...prev, activeTab: tab }));
	}, []);
	const onBack = useCallback(() => {
		navigate(-1);
	}, []);
	const onActionClick = useCallback(() => {
		console.log('Action Clicked');
	}, []);

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
					activeTab={info?.activeTab}
					onTabChange={onTabChange}
					tabs={Object?.values(tabs)}
				/>
			</div>
			<div className="tabSection">{tabs[info?.activeTab]?.component}</div>
		</div>
	);
};

export default memo(CreateAgent);
