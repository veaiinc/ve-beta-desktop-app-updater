import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/index.scss';
import { ReactComponent as AgentIcon } from '../../../assets/svg/ai_assistant/agent.svg';
import { ReactComponent as Sync } from '../../../assets/svg/docs/sync.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';

const staticCreateActions = [
	{
		type: 'Minimal',
		prompt: 'Wedding Day Timeline Generator',
	},
	{
		type: 'Professional',
		prompt: 'Wedding Day Timeline Generator',
	},
	{
		type: 'Traditional',
		prompt: 'Wedding Day Timeline Generator',
	},
	{
		type: 'Sales',
		prompt: 'Track invoice status, Payment schedule, amounts, and more.',
	},
	{
		type: 'Consise',
		prompt: 'Wedding Day Timeline Generator',
	},
];

const AiAssistants = () => {
	const navigate = useNavigate();

	const {
		aiSetup: { getAiAssistants, aiAssistants, moreAiAssistants },
	} = useContext(Context);

	const [info, setInfo] = useState({
		aiAssistantsList: [],
		hasNextPage: false,
		currentPage: 1,
	});

	useEffect(() => {
		if (!aiAssistants) {
			getAiAssistants();
		}
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
			getAiAssistants(info?.currentPage + 1, 10, true);
		}
	}, [info?.currentPage, info?.hasNextPage]);

	const agents = info?.aiAssistantsList?.length
		? info.aiAssistantsList.map((ele) => ({
				agentId: ele?._id,
				agentName: ele?.name,
				createdBy: ele?.createdBy || 'AI',
				...ele,
		  }))
		: [];

	return (
		<>
			<div className="aiAssistantsParentContainer">
				<div className="pageHeadContainer">
					<div className="headTitleContainer">
						<span className="lineOne">Explore</span>
						<span className="lineTwo">AI Assistants</span>
					</div>

					<div
						className="headActionContainer"
						onClick={() => navigate('/ai-assistant/create-assistant')}
					>
						<span>Create a AI Assistant</span>
					</div>
				</div>

				<div className="displayAgenstsContainer">
					<div className="titleContainer">
						<span>Created by you</span>
					</div>

					<div className="agentsCardContainer">
						{agents ? (
							agents?.map((agent) => (
								<div
									className="agentCard"
									onClick={() =>
										navigate(`/ai-assistant/${agent?.agentId}`, {
											state: { agent },
										})
									}
								>
									<div>
										<AgentIcon />
									</div>
									<div className="agentName">{agent?.agentName}</div>
									<div className="createdBy">Created by {agent?.createdBy}</div>
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
					</div>
				</div>

				<div className="promtsContainer">
					<div className="promptHeader">
						<span>Suggested Prompt</span>
						<Sync />
					</div>

					<div className="promptCardsContainer">
						{staticCreateActions?.map((ele, index) => (
							<div key={index} className="createStaticActionsCards">
								<span className="createStaticActionsCardsTitle">{ele?.type}</span>
								<span className="createStaticActionsCardsSubTitle">
									{ele?.prompt}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default memo(AiAssistants);
