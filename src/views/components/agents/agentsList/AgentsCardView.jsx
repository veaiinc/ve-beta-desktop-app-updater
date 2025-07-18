import { memo, useContext, useState } from 'react';
import s from './agentsList.module.scss';
import { ReactComponent as AddIcon } from '../../../../assets/svg/agents/add.svg';
import { ReactComponent as RightArrowIcon } from '../agentsList/assets/rightarrow.svg';
import { ReactComponent as DotIcon } from '../agentsList/assets/current-progress.svg';
// icons
import { ReactComponent as Delete } from '../agentDetails/configureAgent/tabs/assets/delete.svg';

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
const infiniteScrollHeight = '100%';
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
const limit = 10;
const append = true;

const statusColors = {
	active: 'var(--success, #1C993E)',
	error: 'var(--error, #C03744)',
	idle: 'var(--pending, #EDA145)',
};

const AgentsCardView = ({ agents = [] }) => {
	const navigate = useNavigate();

	const {
		knowledgeAgent: {
			createNewKnowledgeAgent,
			knowledgeAssistantsList,
			getKnowledgeAssistantsList,
			deleteKnowledgeAgent,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		createAgentLoader: false,
		loading: false,
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
			navigate(`/agent/${assistantId}?agentAction=runAgent`);
		} else {
			message.error(data?.message);
		}
		setInfo((prev) => ({ ...prev, createAgentLoader: true }));
	};

	const fetchNextAgents = () => {
		const page = currentPage + 1;
		getKnowledgeAssistantsList(page, limit, append);
	};

	const handleDeleteAgent = async (agentId) => {
		if (info?.loading) return;
		setInfo((prev) => ({ ...prev, loading: true }));

		try {
			const [success, data] = await deleteKnowledgeAgent(agentId);
			if (success) {
				message.success('Agent deleted successfully');
			} else {
				message.error(data?.message || 'Failed to delete agent');
			}
		} catch (error) {
			message.error('Failed to delete agent');
		} finally {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	};

	return (
		<div className={s.agentsCardContainer}>
			<InfiniteScroll
				style={infiniteScrollStyle}
				height={infiniteScrollHeight}
				dataLength={dataLength}
				loader={<FetchMoreLoaderComp />}
				next={fetchNextAgents}
				hasMore={hasNextPage}
			>
				<button className={s.createNewAgent} onClick={handleCreateAgent}>
					<div className={s.createNewAgentContainer}>
						<div className={s.plusIcon}>
							<AddIcon />
						</div>
						<h1 className={s.name}>Create New Agent</h1>
					</div>
				</button>
				{agents.map((agent) => (
					<Link
						to={`/agent/${agent._id}?config=prompt`}
						key={agent._id}
						className={s.agentInfoContainer}
					>
						<div className={s.agentInfoHeader}>
							<div className={s.agentInfoHeaderLeft}>
								<img
									src={agent.knowledgeAgent_profile_picture_s3Key || CatIcon}
									className={s.profileIcon}
									alt={agent.name}
								/>
								<div className={s.agentNameContainer}>
									<div className={s.agentName}>{agent.name}</div>
									<div className={s.agentUsername}>@{agent.name}</div>
								</div>
							</div>
							<div className={s.deleteIconContainer}>
								<Delete
									className={s.deleteIcon}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										handleDeleteAgent(agent._id);
									}}
								/>
							</div>
						</div>
						<div className={s.agentInfo}>
							<DotIcon />
							<div className={s.agentDescription}>{agent.description}</div>
						</div>
						<div className={s.agentInfoFooter}>
							<div className={s.statusBadge}>
								<div
									className={s.statusDot}
									style={{
										backgroundColor:
											statusColors[agent.status] || statusColors?.active,
									}}
								></div>
								<div className={s.statusText}>{agent.status || 'Active'}</div>
							</div>
							<div className={s.statusActivity}>
								<RightArrowIcon />
								<div className={s.statusActivityText}>Activities</div>
							</div>
						</div>
					</Link>
				))}
			</InfiniteScroll>
		</div>
	);
};

export default memo(AgentsCardView);
