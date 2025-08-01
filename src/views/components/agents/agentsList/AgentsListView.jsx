import { memo, useContext, useState } from 'react';
import s from './agentsList.module.scss';
import { ReactComponent as AddIcon } from '../../../../assets/svg/agents/add.svg';
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
	flexDirection: 'column',
	width: '100%',
	overflow: 'auto',
};
const limit = 10;
const append = true;

const statusColors = {
	active: 'var(--success, #1C993E)',
	error: 'var(--error, #C03744)',
	idle: 'var(--pending, #EDA145)',
};

const AgentsListView = ({ agents = [] }) => {
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
		<div className={s.agentsListContainer}>
			<InfiniteScroll
				style={infiniteScrollStyle}
				height={infiniteScrollHeight}
				dataLength={dataLength}
				loader={<FetchMoreLoaderComp />}
				next={fetchNextAgents}
				hasMore={hasNextPage}
			>
				{/* Create New Agent Row */}
				<div className={s.createNewAgentRowContainer}>
					<button className={s.createNewAgentRow} onClick={handleCreateAgent}>
						<div className={s.createNewAgentContent}>
							<div className={s.createNewAgentListContainer}>
								<div className={s.createNewAgentLeft}></div>
								<div className={s.createNewAgentText}>
									<h3 className={s.createNewAgentTitle}>Create New Agent</h3>
									<p className={s.createNewAgentDescription}>
										Define what you want automated — your agent will do the
										rest.
									</p>
								</div>
							</div>
							<div className={s.plusIcon}>
								<AddIcon />
							</div>
						</div>
					</button>

					{/* Agents List */}
					<div className={s.agentsListContainer}>
						{agents.map((agent) => (
							<Link
								to={`/agent/${agent._id}?config=prompt`}
								key={agent._id}
								className={s.agentRow}
							>
								<div className={s.agentRowContent}>
									<div className={s.agentRowLeft}>
										<img
											src={
												agent.knowledgeAgent_profile_picture_s3Key ||
												CatIcon
											}
											className={s.agentAvatar}
											alt={agent.name}
										/>
										<div className={s.agentInfo}>
											<div className={s.agentName}>{agent.name}</div>
											<div className={s.agentUsername}>@{agent.name}</div>
										</div>
									</div>
									<div className={s.agentRowRight}>
										<div className={s.agentStatus}>
											<div
												className={s.statusDot}
												style={{
													backgroundColor:
														statusColors[agent.status] ||
														statusColors?.active,
												}}
											></div>
											<div className={s.statusText}>
												{agent.status || 'Active'}
											</div>
										</div>
										{/* <div className={s.agentTimestamp}>
											{agent.updatedAt
												? new Date(agent.updatedAt).toLocaleDateString()
												: 'Recently'}
										</div> */}
										<div className={s.deleteIconContainerList}>
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
								</div>
								<div className={s.divider}></div>
							</Link>
						))}
					</div>
				</div>
			</InfiniteScroll>
		</div>
	);
};

export default memo(AgentsListView);
