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
import InfiniteScroll from '../../globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../../helpers';

// constants
const infiniteScrollHeight = 'calc(100vh - 550px)';
const infiniteScrollStyle = {
	display: 'flex',
	justifyContent: 'flex-start',
	alignItems: 'flex-start',
	maxHeight: 'fit-content',
	width: '100%',
	flexWrap: 'wrap',
	gap: '24px',
	overflow: 'auto',
};
const limit = 10,
	append = true;

const CreateNewAgentCard = ({ agents = [] }) => {
	const navigate = useNavigate();

	const {
		knowledgeAgent: {
			createNewKnowledgeAgent,
			knowledgeAssistantsList,
			getKnowledgeAssistantsList,
		},
	} = useContext(Context);

	const dataLength = agents?.length ?? 0;
	const currentPage = knowledgeAssistantsList?.currentPage ?? 1;
	const hasNextPage = knowledgeAssistantsList?.hasNextPage ?? false;

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

	const fetchNextAgents = () => {
		const page = currentPage + 1;
		getKnowledgeAssistantsList(page, limit, append);
	};

	return (
		<div className={s.agentIntroCardContainer}>
			<InfiniteScroll
				style={infiniteScrollStyle}
				height={infiniteScrollHeight}
				dataLength={dataLength}
				loader={<FetchMoreLoaderComp />}
				next={fetchNextAgents}
				hasMore={hasNextPage}
			>
				<div className={s.agentIntroCard} onClick={handleCreateAgent}>
					<div className={s.addIcon} style={{ background: '#79ecc9' }}>
						<AddIcon />
					</div>
					<h1 className={s.name}>Create New Agent</h1>
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
			</InfiniteScroll>
		</div>
	);
};

export default memo(CreateNewAgentCard);
