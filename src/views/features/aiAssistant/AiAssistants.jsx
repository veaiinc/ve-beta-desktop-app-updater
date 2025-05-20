import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/index.scss';
import AgentIcon from '../../../assets/svg/ai_assistant/agent.svg?react';
import Sync from '../../../assets/svg/docs/sync.svg?react';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import Spinner from '../../components/loaders/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import AgentsHeader from '../knowledgeAgent/AgentsHeader';

const AiAssistants = () => {
	const navigate = useNavigate();

	const {
		aiSetup: {
			getAiAssistants,
			aiAssistants,
			moreAiAssistants,
			createNewAiAssistant,
			aiAssistant,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		aiAssistantsList: [],
		hasNextPage: false,
		currentPage: 1,
		aiAssistantName: 'Untitled Assistant',
		aiAssistantId: null,
		creatingNewAiAssistantLoading: false,
		activeAiAssistant: null,
	});

	useEffect(() => {
		return () => {
			setInfo((prev) => ({ ...prev, creatingNewAiAssistantLoading: false }));
		};
	}, []);

	useEffect(() => {
		getAiAssistants();
	}, []);

	useEffect(() => {
		if (aiAssistants?.data?.length !== 0) {
			setInfo((prev) => ({
				...prev,
				aiAssistantsList: aiAssistants?.data,
				hasNextPage: aiAssistants?.hasNextPage,
				currentPage: aiAssistants?.currentPage,
			}));
		}
	}, [aiAssistants]);

	useEffect(() => {
		if (moreAiAssistants !== null) {
			setInfo((prev) => ({
				...prev,
				aiAssistantsList: [...prev?.aiAssistantsList, ...moreAiAssistants?.data],
				hasNextPage: moreAiAssistants?.hasNextPage,
				currentPage: moreAiAssistants?.currentPage,
			}));
		}
	}, [moreAiAssistants]);

	const getMoreAiAssistants = useCallback(() => {
		if (info?.hasNextPage) {
			getAiAssistants(info?.currentPage + 1, 20, true);
		}
	}, [info?.currentPage, info?.hasNextPage]);

	const assistants = info?.aiAssistantsList?.length
		? info.aiAssistantsList?.map((ele) => ({
				aiAssistantId: ele?._id,
				assistantName: ele?.name,
				createdBy: ele?.createdBy || 'AI',
				...ele,
		  }))
		: [];

	return (
		<div className="aiAssistantsParentContainer" style={{ paddingRight: 10 }}>
			<AgentsHeader />

			<div className="displayAgenstsContainer">
				<div className="titleContainer">
					<span>Created by you</span>
				</div>

				<div className="agentsCardContainer">
					<InfiniteScroll
						dataLength={assistants?.length || 0}
						next={getMoreAiAssistants}
						hasMore={info?.hasNextPage}
						loader={
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									width: '100%',
									flexShrink: 0,
								}}
							>
								<Spinner width="20px" height="20px" />
							</div>
						}
						className="agentsCardContainer"
						height={`calc( 100vh - 240px)`}
					>
						{assistants ? (
							assistants?.map((assistant) => (
								<div
									className="agentCard"
									onClick={() =>
										navigate(`/ai-assistant/${assistant?.aiAssistantId}`, {
											state: { assistant },
										})
									}
								>
									<div>
										{assistant?.assitant_profile_picture_s3Key ? (
											<img
												src={assistant?.assitant_profile_picture_s3Key}
												alt="agent"
												style={{
													borderRadius: '50%',
													width: '32px',
													height: '32px',
												}}
											/>
										) : (
											<AgentIcon />
										)}
									</div>
									<div className="agentName">{assistant?.name}</div>
									<div className="createdBy">
										Created by {assistant?.createdBy}
									</div>
								</div>
							))
						) : (
							<div
								className="agentCard"
								onClick={() => navigate(`/ai-assistant/create-assistant`)}
							>
								<div>
									<AgentIcon />
								</div>
								<div className="agentName">Create your first AI Assistant</div>
								<div className="createdBy">Powered by Ve.ai</div>
							</div>
						)}
					</InfiniteScroll>
				</div>
			</div>
		</div>
	);
};

export default memo(AiAssistants);
