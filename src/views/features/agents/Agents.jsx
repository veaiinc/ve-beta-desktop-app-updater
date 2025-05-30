import { memo, useState } from 'react';
import s from './agents.module.scss';

// components
import QuickActions from '../../components/globalComponents/QuickActions';
import CreateNewAgentCard from '../../components/agents/createNewAgentCard/CreateNewAgentCard';
import AgentDetails from '../../components/agents/agentDetails/AgentDetails';
import RunAndBuildToggle from '../../components/agents/runBuildToggle/RunAndBuildToggle';

// svgs
import { ReactComponent as LeftCaret } from './assets/left-caret.svg';

const Agents = () => {
	const [info, setInfo] = useState({
		createAgentStep: 1,
		activeToggle: 'runAgent', // runAgent, buildAgent
		agentDetails: {
			agentName: 'Agent47',
			agentDescription:
				'Agent47  continuously monitors streams of meeting transcripts, updates, or notes from multiple platforms and automatically surfaces',
		},
	});

	const showLeftCaret = info.createAgentStep > 1;
	const showRunAndBuildToggle = showLeftCaret;
	const stepLabelStyle = {
		cursor: showLeftCaret ? 'pointer' : 'default',
		fontSize: showLeftCaret ? 14 : 20,
		color: showLeftCaret ? 'var(--secondary-font)' : 'var(--primary-font)',
	};

	const handleCreateAgent = () => {
		setInfo((prevInfo) => ({
			...prevInfo,
			createAgentStep: prevInfo.createAgentStep + 1,
			agentName: '', // step 1
		}));
	};

	const handlePrevStep = () => {
		if (info.createAgentStep === 1) return;
		setInfo((prevInfo) => ({
			...prevInfo,
			createAgentStep: prevInfo.createAgentStep - 1,
		}));
	};

	const setActiveToggle = (toggle) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			activeToggle: toggle,
		}));
	};

	const setAgentDetails = (details) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			agentDetails: { ...prevInfo.agentDetails, ...details }, // details -> { agentName: 'name' } or { agentDescription: 'description' }
		}));
	};

	const createAgentStepsMapper = {
		1: {
			stepLabel: 'Workflow Agent',
			stepComponent: <CreateNewAgentCard handleCreateAgent={handleCreateAgent} />,
		},
		2: {
			stepLabel: 'Back to workflow agents',
			stepComponent: (
				<AgentDetails
					agentName={info.agentDetails.agentName}
					agentDescription={info.agentDetails.agentDescription}
					setAgentDetails={setAgentDetails}
				/>
			),
		},
	};

	return (
		<div className={s.agentsContainer}>
			<button style={stepLabelStyle} className={s.stepLabel} onClick={handlePrevStep}>
				{showLeftCaret && <LeftCaret />}
				<span>{createAgentStepsMapper[info.createAgentStep].stepLabel}</span>
			</button>
			{showRunAndBuildToggle && (
				<RunAndBuildToggle
					activeToggle={info.activeToggle}
					setActiveToggle={setActiveToggle}
				/>
			)}
			<div className={s.body}>
				{createAgentStepsMapper[info.createAgentStep].stepComponent}
			</div>
			<QuickActions />
		</div>
	);
};

export default memo(Agents);
