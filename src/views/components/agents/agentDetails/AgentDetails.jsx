import { memo, useContext, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import s from './agentDetails.module.scss';
import Context from '../../../../context/context';

// components
import ConfigureAgent from './configureAgent/ConfigureAgent';
import AgentCredentials from './agentCredentials/AgentCredentials';
import KnowledgeAgentDetails from '../../../../views/features/knowledgeAgent/AgentDetails';
import AgentHeader from '../runBuildToggle/AgentHeader';

const AgentDetails = () => {
	const { agentId } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const agentActionParam = searchParams.get('agentAction');
	const configParam = searchParams.get('config') || 'prompt';
	const agentCredentialsRef = useRef(null);

	const [info, setInfo] = useState({
		agentAction: agentActionParam,
	});

	const {
		knowledgeAgent: { activeKnowledgeAssistant, getActiveKnowledgeAgentDetails },
	} = useContext(Context);
	useEffect(() => {
		if (activeKnowledgeAssistant === null) {
			getActiveKnowledgeAgentDetails(agentId);
		}

		// Ensure default params are set if not present
		const newParams = {};
		if (!searchParams.get('agentAction')) newParams.agentAction = 'buildAgent';
		if (!searchParams.get('config')) newParams.config = 'prompt';

		if (Object.keys(newParams).length > 0) {
			setSearchParams((prev) => {
				const updated = new URLSearchParams(prev);
				Object.entries(newParams).forEach(([key, value]) => updated.set(key, value));
				return updated;
			});
		}
	}, [activeKnowledgeAssistant]);

	useEffect(() => {
		if (agentActionParam) {
			setInfo((prev) => ({
				...prev,
				agentAction: agentActionParam,
			}));
		}
	}, [agentActionParam]);

	const setAgentAction = (agentAction) => {
		setInfo((prev) => ({ ...prev, agentAction }));
		setSearchParams((prev) => {
			const updated = new URLSearchParams(prev);
			updated.set('agentAction', agentAction);
			updated.set('config', configParam);
			return updated;
		});
	};
	const handleEditClick = () => {
		if (agentCredentialsRef.current) {
			agentCredentialsRef.current.triggerEditAgentName();
		}
	};

	return (
		<div className={s.agentDetailsContainer}>
			<AgentHeader
				onEditClick={handleEditClick}
				agentAction={info.agentAction}
				setAgentAction={setAgentAction}
				activeKnowledgeAssistant={activeKnowledgeAssistant}
				isTemplate={activeKnowledgeAssistant?.data?.tenant_id === null}
			/>
			<div className={s.agentActionContainer}>
				{info.agentAction === 'runAgent' ? (
					<KnowledgeAgentDetails
						isTemplate={activeKnowledgeAssistant?.data?.tenant_id === null}
					/>
				) : info.agentAction === 'buildAgent' ? (
					<>
						<ConfigureAgent
							agentId={agentId}
							isTemplate={activeKnowledgeAssistant?.data?.tenant_id === null}
						/>
					</>
				) : null}
			</div>
		</div>
	);
};

export default memo(AgentDetails);
