import { memo, useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import s from './agentDetails.module.scss';
import Context from '../../../../context/context';

// images
import CatIcon from './assets/cat.png';

// svgs
import PencilIcon from './assets/PencilIcon';
import ConfigureAgent from './configureAgent/ConfigureAgent';

const AgentDetails = () => {
	const { agentId } = useParams();

	const {
		knowledgeAgent: { getActiveKnowledgeAgentDetails, activeKnowledgeAssistant },
	} = useContext(Context);

	const [info, setInfo] = useState({
		agentName: 'Agent name',
		agentDescription: 'Agent description',
		editAgentDetails: {
			agentName: false,
			agentDescription: false,
		},
	});

	const agentName = activeKnowledgeAssistant?.data?.name ?? info.agentName;
	const agentDescription = activeKnowledgeAssistant?.data?.description ?? info.agentDescription;

	useEffect(() => {
		if (activeKnowledgeAssistant === null && agentId) getActiveKnowledgeAgentDetails(agentId);
	}, []);

	const toggleEditAgentDetails = (type) => {
		setInfo((prev) => ({
			...prev,
			editAgentDetails: { ...prev.editAgentDetails, [type]: !prev.editAgentDetails[type] },
		}));
	};

	return (
		<div className={s.container}>
			<div className={s.agentDetailsContainer}>
				<img src={CatIcon} alt="agent icon" className={s.agentIcon} />
				<div className={s.agentDetails}>
					<div className={s.agentName}>
						{info.editAgentDetails.agentName ? (
							<input
								type="text"
								autoFocus
								onChange={(e) =>
									setInfo((prev) => ({ ...prev, agentName: e.target.value }))
								}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										toggleEditAgentDetails('agentName');
									}
								}}
								onBlur={() => toggleEditAgentDetails('agentName')}
								value={info.agentName}
								aria-label="Edit agent name"
								className={s.input}
							/>
						) : (
							<>
								<span
									onClick={() => toggleEditAgentDetails('agentName')}
									role="button"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											toggleEditAgentDetails('agentName');
										}
									}}
								>
									{info.agentName}
								</span>
								<PencilIcon />
							</>
						)}
					</div>
					<div className={s.agentDescription}>
						{info.editAgentDetails.agentDescription ? (
							<textarea
								autoFocus
								onChange={(e) =>
									setInfo((prev) => ({
										...prev,
										agentDescription: e.target.value,
									}))
								}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										if (e.shiftKey) return;
										e.preventDefault();
										toggleEditAgentDetails('agentDescription');
									}
								}}
								onBlur={() => toggleEditAgentDetails('agentDescription')}
								value={info.agentDescription}
								aria-label="Edit agent description"
								className={s.textarea}
								rows={3}
							/>
						) : (
							<>
								<p
									onClick={() => toggleEditAgentDetails('agentDescription')}
									role="button"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											toggleEditAgentDetails('agentDescription');
										}
									}}
								>
									{info.agentDescription}
								</p>
								<PencilIcon />
							</>
						)}
					</div>
				</div>
				<ConfigureAgent agentId={agentId} />
			</div>
		</div>
	);
};

export default memo(AgentDetails);
