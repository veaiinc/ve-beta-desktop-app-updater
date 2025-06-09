import { memo, useContext } from 'react';
import s from './createNewAgentCard.module.scss';
import { ReactComponent as AddIcon } from '../../../../assets/svg/agents/add.svg';

// icons
import { ReactComponent as CarretRight } from './assets/carret-right.svg';

// images
import CatIcon from './assets/cat.png';
import Context from '../../../../context/context';

// utils
import { generateRandomAIAgentDetails } from './utils';
import { message } from '../../globalComponents/CustomToast';
import { useNavigate } from 'react-router-dom';

const CreateNewAgentCard = ({ agents = [] }) => {
	const navigate = useNavigate();

	const {
		knowledgeAgent: { createNewKnowledgeAgent },
	} = useContext(Context);

	const handleCreateAgent = async () => {
		const { agentName, agentDescription } = generateRandomAIAgentDetails();
		const [success, data] = await createNewKnowledgeAgent(agentName, agentDescription);
		if (success) {
			const assistantId = data?.insertedId;
			navigate(`/agent/${assistantId}`);
		} else {
			message.error(data?.message);
		}
	};

	return (
		<div className={s.agentIntroCardContainer}>
			<div className={s.agentIntroCard} onClick={handleCreateAgent}>
				<div className={s.addIcon} style={{ background: '#79ecc9' }}>
					<AddIcon />
				</div>
				<div className={s.name}>Create New Agent</div>
			</div>

			{agents.map((agent) => (
				<div
					onClick={() => navigate(`/agent/${agent._id}?config=prompt`)}
					key={agent._id}
					className={s.agentIntroCard}
				>
					<div className={s.addIcon}>
						<img
							src={agent.knowledgeAgent_profile_picture_s3Key || CatIcon}
							className={s.profileIcon}
						/>
					</div>
					<div className={s.agentInfo}>
						<div className={s.agentName}>{agent.name}</div>
						<div className={s.agentDescription}>{agent.description}</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(CreateNewAgentCard);
