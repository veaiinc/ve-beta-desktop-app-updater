import { memo, useContext, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import s from './agentDetails.module.scss';
import Context from '../../../../context/context';

// components
import RunAndBuildToggle from '../runBuildToggle/RunAndBuildToggle';
import ConfigureAgent from './configureAgent/ConfigureAgent';
import AgentCredentials from './agentCredentials/AgentCredentials';
import KnowledgeAgentDetails from '../../../../views/features/knowledgeAgent/AgentDetails';

const AgentDetails = () => {
	const { agentId } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();

	const agentActionParam = searchParams.get('agentAction') || 'buildAgent';
	const configParam = searchParams.get('config') || 'prompt';

	const [info, setInfo] = useState({
		agentAction: agentActionParam,
	});

	const {
		knowledgeAgent: { activeKnowledgeAssistant, getActiveKnowledgeAgentDetails },
	} = useContext(Context);

	useEffect(() => {
		if (activeKnowledgeAssistant === null && agentId) {
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
	}, [
		agentId,
		activeKnowledgeAssistant,
		getActiveKnowledgeAgentDetails,
		searchParams,
		setSearchParams,
	]);

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

	return (
		<div className={s.agentDetailsContainer}>
			<RunAndBuildToggle agentAction={info.agentAction} setAgentAction={setAgentAction} />
			<div className={s.agentActionContainer}>
				{info.agentAction === 'runAgent' ? (
					<KnowledgeAgentDetails />
				) : info.agentAction === 'buildAgent' ? (
					<>
						<AgentCredentials agentId={agentId} />
						<ConfigureAgent agentId={agentId} />
					</>
				) : null}
			</div>
		</div>
	);
};

export default memo(AgentDetails);
