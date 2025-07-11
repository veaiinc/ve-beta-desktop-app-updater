import { memo, useEffect, useState } from 'react';
import s from './agent.module.scss';
import AgentDetails from '../../../components/agents/agentDetails/AgentDetails';
import RecentChat from '../../chat/RecentChat';
import { useSearchParams } from 'react-router-dom';

const Agent = () => {
	const [searchParams] = useSearchParams();
	const [info, setInfo] = useState({
		rerender: false,
		sId: null,
	});

	useEffect(() => {
		if (searchParams) {
			const sessionId = searchParams?.get('sId');
			setInfo((prev) => ({
				...prev,
				sId: sessionId,
			}));
		}
	}, [searchParams]);

	return (
		<div className={s.agentContainer}>
			{info?.sId && (
				<div className={s.chatBlock}>
					<RecentChat isPreview={true} sId={info?.sId} />
				</div>
			)}

			<div className={s.agentBlock}>
				<AgentDetails />
			</div>
		</div>
	);
};

export default memo(Agent);
