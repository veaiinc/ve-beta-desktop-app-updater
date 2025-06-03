import { memo, useState, useEffect, useCallback, useRef, useContext } from 'react';
import s from './agentCredentials.module.scss';
import Context from '../../../../../context/context';
import { message } from '../../../../components/globalComponents/CustomToast';
import PencilIcon from '../assets/PencilIcon';
import CatIcon from '../assets/cat.png';

const AgentCredentials = ({ agentId }) => {
	const timeoutId = useRef(null);
	const {
		knowledgeAgent: { activeKnowledgeAssistant, updateKnowledgeAgent },
	} = useContext(Context);

	const [info, setInfo] = useState({
		agentName: 'Agent name',
		agentDescription: 'Agent description',
		editAgentDetails: {
			agentName: false,
			agentDescription: false,
		},
	});

	useEffect(() => {
		if (activeKnowledgeAssistant?.data?.name?.length > 0) {
			setInfo((prev) => ({
				...prev,
				agentName: activeKnowledgeAssistant?.data?.name,
			}));
		}
		if (activeKnowledgeAssistant?.data?.description?.length > 0) {
			setInfo((prev) => ({
				...prev,
				agentDescription: activeKnowledgeAssistant?.data?.description,
			}));
		}
	}, [activeKnowledgeAssistant?.data?.name, activeKnowledgeAssistant?.data?.description]);

	const updateAgentDetails = useCallback(() => {
		const { agentName, agentDescription } = info;
		if (agentName.length === 0) {
			message.error('Agent name cannot be empty');
			return;
		}
		if (agentDescription.length === 0) {
			message.error('Agent description cannot be empty');
			return;
		}
		const agentDetails = {
			name: agentName,
			description: agentDescription,
		};
		updateKnowledgeAgent(agentId, agentDetails);
	}, [info.agentName, info.agentDescription]);

	useEffect(() => {
		clearTimeout(timeoutId.current);
		timeoutId.current = setTimeout(() => {
			updateAgentDetails();
		}, 1000);
		return () => clearTimeout(timeoutId.current);
	}, [info.agentName, info.agentDescription]);

	const handleNameChange = (e) => {
		setInfo((prev) => ({ ...prev, agentName: e.target.value }));
	};

	const handleDescriptionChange = (e) => {
		setInfo((prev) => ({ ...prev, agentDescription: e.target.value }));
	};

	const toggleEditAgentDetails = (type) => {
		setInfo((prev) => ({
			...prev,
			editAgentDetails: { ...prev.editAgentDetails, [type]: !prev.editAgentDetails[type] },
		}));
	};

	return (
		<div className={s.agentCredentialsContainer}>
			<img src={CatIcon} alt="agent icon" className={s.agentIcon} />
			<div className={s.agentDetails}>
				<div className={s.agentName}>
					{info.editAgentDetails.agentName ? (
						<input
							type="text"
							autoFocus
							onChange={handleNameChange}
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
							onChange={handleDescriptionChange}
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
		</div>
	);
};

export default memo(AgentCredentials);
