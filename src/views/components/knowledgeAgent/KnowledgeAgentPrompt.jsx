import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/aiPrompt.scss';
import { ReactComponent as Question } from '../../../assets/svg/ai_assistant/question.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';
import { message, Tooltip } from 'antd';
import Context from '../../../context/context';
import Skeleton from 'react-loading-skeleton';
import PromptWithIcons from './PromptWithIcons';
import AgentCredentials from '../agents/agentDetails/agentCredentials/AgentCredentials';
import { useParams } from 'react-router-dom';

const tooltipStyles = {
	body: { minWidth: 'fit-content', padding: '0' },
};

const customPromptItem = {
	_id: 'custom',
	label: 'Custom',
	prompt: '',
	tag: 'custom',
	isDefault: false,
};

const KnowledgeAgentPrompt = ({ assistant, actionDetails = [] }) => {
	const {
		knowledgeAgent: {
			allAiPrompts,
			getAiPrompts,
			selectAiPrompt,
			resetAiPrompt,
			editAiPrompt,
			updateKnowledgeAgent,
		},
	} = useContext(Context);
	const { agentId } = useParams();
	const [info, setInfo] = useState({
		aiModelOptions: [
			{ label: 'GPT-4o', value: 'gpt-4o' },
			{ label: 'GPT-4o-mini', value: 'gpt-4o-mini' },
			{ label: 'GPT-4o-turbo', value: 'gpt-4o-turbo' },
		],
		selectedModel: 'GPT-4o',
		modelListLoading: false,
		isSelectModelOpen: false,
		systemPromptOptions: [],
		selectedSystemPrompt: '',
		isSelectSystemPromptOpen: false,
		systemPrompt: '',
		editedPrompt: '',
		timeout: null,
		promptLoading: true,
		currentPromptId: null,
	});

	useEffect(() => {
		if (allAiPrompts) {
			let selectedSystemPrompt;
			let systemPrompt;
			let currentPromptId;

			if (assistant?.prompt?.customEditedPrompt) {
				selectedSystemPrompt = 'Custom';
				systemPrompt = assistant?.prompt?.customEditedPrompt;
				currentPromptId = assistant?.prompt?.promptId;
			} else if (assistant?.prompt?.promptId) {
				const selectedPrompt = allAiPrompts?.find(
					(prompt) => prompt?._id === assistant?.prompt?.promptId,
				);
				selectedSystemPrompt = selectedPrompt?.label;
				systemPrompt = selectedPrompt?.prompt;
				currentPromptId = selectedPrompt?._id;
			} else {
				const defaultPrompt = allAiPrompts?.find((prompt) => prompt?.isDefault);
				selectedSystemPrompt = defaultPrompt?.label;
				systemPrompt = defaultPrompt?.prompt;
				currentPromptId = defaultPrompt?._id;
			}
			setInfo((prev) => ({
				...prev,
				systemPromptOptions: allAiPrompts || [],
				selectedSystemPrompt,
				systemPrompt,
				currentPromptId,
				promptLoading: false,
			}));
		} else if (assistant?._id) {
			getAiPrompts(assistant?._id);
		}
	}, [allAiPrompts, assistant?._id]);

	useEffect(() => {
		const selectedModel = info?.aiModelOptions?.find(
			(option) => option.value === assistant?.model,
		)?.label;
		setInfo((prev) => ({
			...prev,
			selectedModel,
		}));
	}, [assistant]);

	useEffect(() => {
		if (info?.systemPrompt !== undefined) {
			handleDebounceUpdate();
		}
	}, [info?.editedPrompt]);

	const handleDebounceUpdate = useCallback(() => {
		clearTimeout(info?.timeout);
		const timeout = setTimeout(() => {
			if (info?.editedPrompt && assistant?._id && info?.currentPromptId) {
				editAiPrompt(assistant?._id, info?.currentPromptId, {
					prompt: info?.editedPrompt,
				});
			}
			setInfo((prev) => ({
				...prev,
				timeout: null,
			}));
		}, 800);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [info?.timeout, info?.editedPrompt, info?.currentPromptId, assistant?._id, editAiPrompt]);

	const handleModelDropdownVisibility = useCallback((visible) => {
		setInfo((prev) => ({ ...prev, isSelectModelOpen: visible }));
	}, []);

	const handleSystemPromptDropdownVisibility = useCallback((visible) => {
		setInfo((prev) => ({ ...prev, isSelectSystemPromptOpen: visible }));
	}, []);

	const handleChooseModalChange = async (option) => {
		setInfo((prev) => ({ ...prev, selectedModel: option.label, isSelectModelOpen: false }));
		const response = await updateKnowledgeAgent(assistant?._id, { model: option.value });
		if (!response[0]) message.error('Failed to update model for the agent!');
	};

	const handleSystemPromptChange = useCallback(
		(option) => {
			setInfo((prev) => ({
				...prev,
				selectedSystemPrompt: option.label,
				systemPrompt: option.prompt || '',
				currentPromptId: option._id,
				isSelectSystemPromptOpen: false,
			}));
			if (assistant?._id && option._id) {
				selectAiPrompt(assistant?._id, option._id);
			}
		},
		[assistant, selectAiPrompt],
	);

	const handlePromptChange = useCallback((value) => {
		setInfo((prev) => ({
			...prev,
			systemPrompt: value,
			editedPrompt: value,
			selectedSystemPrompt: 'Custom',
			currentPromptId: prev.currentPromptId,
		}));
	}, []);

	const handleResetPrompt = useCallback(async () => {
		const response = await resetAiPrompt(assistant?._id);
		if (response?.[0] === true) {
			const { label, prompt } = response[1];
			setInfo((prev) => ({
				...prev,
				selectedSystemPrompt: label,
				systemPrompt: prompt,
				editedPrompt: '',
			}));
		}
	}, [assistant]);

	return (
		<div className="aiPromptParentContainer">
			<div className="agentPromptDetailsContainer">
				<AgentCredentials agentId={agentId} />
				{/* <div className="aiModalContainer">
					<div className="aiModalHeader">
						<span className="lineone">Model </span>
						<Question />
					</div>
				</div> */}
				<div className="chooseModelContainer">
					<Tooltip
						open={info.isSelectModelOpen}
						onOpenChange={handleModelDropdownVisibility}
						placement="bottomRight"
						title={
							<div className="modelDropdown">
								{info?.aiModelOptions?.map((option, index) => (
									<div
										key={index}
										className="modelListItem"
										onClick={() => handleChooseModalChange(option)}
									>
										{option.label}
									</div>
								))}
							</div>
						}
						arrow={false}
						trigger={'click'}
						color={'transparent'}
						styles={tooltipStyles}
					>
						<div className="voiceList">
							{info?.selectedModel}{' '}
							<DownSvg className={`${info?.isSelectModelOpen ? 'open' : ''}`} />
						</div>
					</Tooltip>
				</div>
			</div>

			<div className="systemProptParentContainer">
				{/* <div className="systemProptHeader">
                    <span className="lineone">System Prompt</span>
                    <Question />
                </div> */}

				{info?.promptLoading ? (
					<div className="promptLoadingContainer">
						<div
							className="promptDropdownLoader"
							style={{ width: '100%', height: '100%' }}
						>
							<Skeleton height={43} className="promptDropdownLoader" />
						</div>
						<div
							className="promptTextAreaLoader"
							style={{ width: '100%', height: '100%' }}
						>
							<Skeleton className="promptTextAreaLoader" height={130} />
						</div>
					</div>
				) : (
					<>
						{/* <div className="chooseModelContainer">
                            <Tooltip
                                open={info.isSelectSystemPromptOpen}
                                onOpenChange={handleSystemPromptDropdownVisibility}
                                placement="bottom"
                                title={
                                    <div className="modelDropdown">
                                        {info?.systemPromptOptions?.map((option) => (
                                            <div
                                                key={option?._id}
                                                className="modelListItem"
                                                onClick={() => handleSystemPromptChange(option)}
                                            >
                                                {option?.label}
                                            </div>
                                        ))}
                                    </div>
                                }
                                arrow={false}
                                trigger={'click'}
                                color={'transparent'}
                                styles={tooltipStyles}
                            >
                                <div className="voiceList">
                                    {info?.selectedSystemPrompt}{' '}
                                    <DownSvg
                                        className={`${
                                            info?.isSelectSystemPromptOpen ? 'open' : ''
                                        }`}
                                    />
                                </div>
                            </Tooltip>
                        </div> */}

						<div className="systemPromptHint">{`Type '<' to add tools`}</div>

						<div className="systemPromptTextArea promptWithIconsWrapper">
							<PromptWithIcons
								prompt={info?.systemPrompt}
								onChange={handlePromptChange}
								placeholder="Enter your system prompt here"
								autoResize={true}
								agentId={agentId}
							/>
						</div>

						<div className="resetPromptContainer">
							<button onClick={handleResetPrompt}>Reset</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default memo(KnowledgeAgentPrompt);
