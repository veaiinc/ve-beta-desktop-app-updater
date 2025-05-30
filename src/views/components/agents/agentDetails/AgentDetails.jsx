import { memo, useState } from 'react';
import s from './agentDetails.module.scss';

// images
import CatIcon from './assets/cat.png';

// svgs
import PencilIcon from './assets/PencilIcon';
import ConfigureAgent from './configureAgent/ConfigureAgent';

const AgentDetails = ({ agentName, agentDescription, setAgentDetails }) => {
	const [info, setInfo] = useState({
		editAgentDetails: {
			agentName: false,
			agentDescription: false,
		},
	});

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
								onChange={(e) => setAgentDetails({ agentName: e.target.value })}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										toggleEditAgentDetails('agentName');
									}
								}}
								onBlur={() => toggleEditAgentDetails('agentName')}
								value={agentName}
								aria-label="Edit agent name"
								className={s.input}
							/>
						) : (
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
								{agentName}
								<PencilIcon />
							</span>
						)}
					</div>
					<div className={s.agentDescription}>
						{info.editAgentDetails.agentDescription ? (
							<textarea
								autoFocus
								onChange={(e) =>
									setAgentDetails({ agentDescription: e.target.value })
								}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										if (e.shiftKey) return;
										e.preventDefault();
										toggleEditAgentDetails('agentDescription');
									}
								}}
								onBlur={() => toggleEditAgentDetails('agentDescription')}
								value={agentDescription}
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
									{agentDescription}
								</p>
								<PencilIcon />
							</>
						)}
					</div>
				</div>
				<ConfigureAgent />
			</div>
		</div>
	);
};

export default memo(AgentDetails);
