import React, { memo, useMemo } from 'react';
import '../../../assets/scss/ai_agents/agentsCards.scss';

const MeetingCards = ({ data }) => {
	return (
		<div className="agentsMeetingsbCards">
			<div className="agentsWorkflowJobCardsContent">
				<span className="agentsWorkflowJobCardsTitle">{data?.title}</span>
			</div>
			<span className="agentsTabType">{data?.type}</span>
		</div>
	);
};
const TaskCards = ({ data }) => {
	return (
		<div className="agentsTaskCards">
			<div className="agentsWorkflowJobCardsContent">
				<span className="agentsWorkflowJobCardsTitle">{data?.title}</span>
			</div>
			<span className="agentsTabType">{data?.type}</span>
		</div>
	);
};
const WorkflowCards = ({ data }) => {
	return (
		<div className="agentsWorkflowJobCards">
			<div className="agentsWorkflowJobCardsContent">
				<span className="agentsWorkflowJobCardsTitle">{data?.title}</span>
			</div>
			<span className="agentsTabType">{data?.type}</span>
		</div>
	);
};
const AiAgentsCards = ({ data }) => {
	const mapper = useMemo(() => {
		return {
			workflow: <WorkflowCards data={data} />,
			meeting: <MeetingCards data={data} />,
			tasks: <TaskCards data={data} />,
		};
	}, [data]);
	return (
		<div className="AiAgentsCards">
			{mapper?.[data?.cardType] ? mapper?.[data?.cardType] : <WorkflowCards data={data} />}
		</div>
	);
};

export default memo(AiAgentsCards);
