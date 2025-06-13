import { memo, useContext, useState } from 'react';
import s from './agentsList.module.scss';
import { ReactComponent as AddIcon } from '../../../../assets/svg/agents/add.svg';

// icons
import { ReactComponent as CarretRight } from './assets/carret-right.svg';

// images
import CatIcon from './assets/cat.png';
import Context from '../../../../context/context';

// utils
import { generateRandomAIAgentDetails } from './utils';
import { message } from '../../globalComponents/CustomToast';
import { Link, useNavigate } from 'react-router-dom';
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

const AgentsList = ({ agents = [] }) => {
	const navigate = useNavigate();

	const {
		knowledgeAgent: {
			createNewKnowledgeAgent,
			knowledgeAssistantsList,
			getKnowledgeAssistantsList,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		createAgentLoader: false,
	});

	const dataLength = agents?.length ?? 0;
	const currentPage = knowledgeAssistantsList?.currentPage ?? 1;
	const hasNextPage = knowledgeAssistantsList?.hasNextPage ?? false;

	const handleCreateAgent = async () => {
		if (info.createAgentLoader) return;
		setInfo((prev) => ({ ...prev, createAgentLoader: true }));
		const { agentName, agentDescription } = generateRandomAIAgentDetails();
		const [success, data] = await createNewKnowledgeAgent(agentName, agentDescription);
		if (success) {
			const assistantId = data?.insertedId;
			navigate(`/agent/${assistantId}`);
		} else {
			message.error(data?.message);
		}
		setInfo((prev) => ({ ...prev, createAgentLoader: true }));
	};

	const fetchNextAgents = () => {
		const page = currentPage + 1;
		getKnowledgeAssistantsList(page, limit, append);
	};

	return (
		<div className={s.agentsListContainer}>
			<InfiniteScroll
				style={infiniteScrollStyle}
				height={infiniteScrollHeight}
				dataLength={dataLength}
				loader={<FetchMoreLoaderComp />}
				next={fetchNextAgents}
				hasMore={hasNextPage}
			>
				<button className={s.createNewAgent} onClick={handleCreateAgent}>
					<div className={s.plusIcon}>
						<AddIcon />
					</div>
					<h1 className={s.name}>Create New Agent</h1>
				</button>
				{agents.map((agent) => (
					<Link
						to={`/agent/${agent._id}?config=prompt`}
						key={agent._id}
						className={s.agentInfoContainer}
					>
						<div className={s.addIcon}>
							<img
								src={agent.knowledgeAgent_profile_picture_s3Key || CatIcon}
								className={s.profileIcon}
								alt={agent.name}
							/>
						</div>
						<div className={s.agentInfo}>
							<div className={s.agentName}>{agent.name}</div>
							<div className={s.agentDescription}>{agent.description}</div>
						</div>
					</Link>
				))}
			</InfiniteScroll>
		</div>
	);
};

export default memo(AgentsList);
