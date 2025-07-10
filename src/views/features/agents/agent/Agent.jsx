import { memo, useContext, useRef, useState } from 'react';
import s from './agent.module.scss';
import AgentDetails from '../../../components/agents/agentDetails/AgentDetails';
import RecentChat from '../../chat/RecentChat';
import ObjectID from 'bson-objectid';
import Context from '../../../../context/context';

const sid = ObjectID().toString();
const Agent = () => {
	const {} = useContext(Context);
	const [info, setInfo] = useState({
		rerender: false,
	});
	const chatBoxClickedRef = useRef(false);

	const handleAgentChatActive = () => {
		if (!chatBoxClickedRef.current) {
			chatBoxClickedRef.current = true;
			setInfo((prev) => ({
				...prev,
				rerender: true,
			}));
		}
	};
	return (
		<div className={s.agentContainer}>
			{/* <div className={s.chatBlock}>
				<RecentChat
					isPreview={true}
					{...(chatBoxClickedRef?.current && { sId: sid })}
					customChatBoxClick={handleAgentChatActive}
				/>
			</div> */}
			<div className={s.agentBlock}>
				<AgentDetails />
			</div>
		</div>
	);
};

export default memo(Agent);
