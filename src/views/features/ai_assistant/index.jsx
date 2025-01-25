import React, { memo } from 'react';
import '../../../assets/scss/ai_assistants/index.scss';
import { ReactComponent as AgentIcon } from '../../../assets/svg/ai_assistant/agent.svg';
import { ReactComponent as Sync } from '../../../assets/svg/docs/sync.svg';
import { useNavigate } from 'react-router-dom';

const staticCreateActions = [
	{
		type: 'Minimal',
		prompt: 'Wedding Day Timeline Generator',
	},
	{
		type: 'Professional',
		prompt: 'Wedding Day Timeline Generator',
	},
	{
		type: 'Traditional',
		prompt: 'Wedding Day Timeline Generator',
	},
	{
		type: 'Sales',
		prompt: 'Track invoice status, Payment schedule, amounts, and more.',
	},
	{
		type: 'Consise',
		prompt: 'Wedding Day Timeline Generator',
	},
];

const AiAssistants = () => {
	const navigate = useNavigate();

	const agents = [
		{
			icon: <AgentIcon />,
			agentName: 'Agent 1',
			createdBy: 'John Doe',
		},
		{
			icon: <AgentIcon />,
			agentName: 'Agent 2',
			createdBy: 'John Doe',
		},
		{
			icon: <AgentIcon />,
			agentName: 'Agent 3',
			createdBy: 'John Doe',
		},
		{
			icon: <AgentIcon />,
			agentName: 'Agent 4',
			createdBy: 'John Doe',
		},
	];

	return (
		<div className="aiAssistantsParentContainer">
			<div className="pageHeadContainer">
				<div className="headTitleContainer">
					<span className="lineOne">Explore</span>
					<span className="lineTwo">AI Assistants</span>
				</div>

				<div
					className="headActionContainer"
					onClick={() => navigate('/ai-assistant/create-assistant')}
				>
					<span>Create a AI Assistant</span>
				</div>
			</div>

			<div className="displayAgenstsContainer">
				<div className="titleContainer">
					<span>Created by you</span>
				</div>

				<div className="agentsCardContainer">
					{agents?.map((agent) => (
						<div className="agentCard">
							<div>{agent?.icon}</div>
							<div className="agentName">{agent?.agentName}</div>
							<div className="createdBy">Created by {agent?.createdBy}</div>
						</div>
					))}
				</div>
			</div>

			<div className="promtsContainer">
				<div className="promptHeader">
					<span>Suggested Prompt</span>
					<Sync />
				</div>

				<div className="docsTemplateContainer">
					{staticCreateActions?.map((ele, index) => (
						<div key={index} className="createStaticActionsCards">
							<span className="createStaticActionsCardsTitle">{ele?.type}</span>
							<span className="createStaticActionsCardsSubTitle">{ele?.prompt}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default memo(AiAssistants);
