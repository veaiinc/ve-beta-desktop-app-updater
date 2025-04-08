import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/aiPrompt.scss';
import { ReactComponent as Question } from '../../../assets/svg/ai_assistant/question.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';
import CustomTextArea from '../globalComponents/CustomTextArea';
import { Tooltip } from 'antd';
import Context from '../../../context/context';
import Skeleton from 'react-loading-skeleton';

const KnowledgeAgentPrompt = ({ assistant }) => {
	const {
		knowledgeAgent: { allAiPrompts, getAiPrompts, selectAiPrompt, resetAiPrompt, editAiPrompt },
	} = useContext(Context);

	const [info, setInfo] = useState({
		aiModelOptions: ['GPT-4o', 'GPT-4o-mini', 'GPT-4o-turbo'],
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
	});

	useEffect(() => {
		if (allAiPrompts) {
			let selectedSystemPrompt;
			let systemPrompt;
			if (assistant?.prompt?.customEditedPrompt) {
				selectedSystemPrompt = 'Custom';
				systemPrompt = assistant?.prompt?.customEditedPrompt;
			} else if (assistant?.prompt?.promptId) {
				const selectedPrompt = allAiPrompts?.find(
					(prompt) => prompt?._id === assistant?.prompt?.promptId,
				);
				selectedSystemPrompt = selectedPrompt?.label;
				systemPrompt = selectedPrompt?.prompt;
			} else {
				const defaultPrompt = allAiPrompts?.find((prompt) => prompt?.isDefault);
				selectedSystemPrompt = defaultPrompt?.label;
				systemPrompt = defaultPrompt?.prompt;
			}
			setInfo((prev) => ({
				...prev,
				systemPromptOptions: allAiPrompts || [],
				selectedSystemPrompt,
				systemPrompt,
				promptLoading: false,
			}));
		} else if (assistant?._id) {
			getAiPrompts(assistant?._id);
		}
	}, [allAiPrompts, assistant?._id]);

	// useEffect(() => {
	// 	getAiPrompt(assistant?._id);
	// 	getDefaultAiPrompt(assistant?._id);
	// }, [assistant]);

	// useEffect(() => {
	// 	if (aiPrompt) {
	// 		const promptToShow = aiPrompt?.customEditedPrompt || aiPrompt?.prompt || '';
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			systemPrompt: promptToShow,
	// 			selectedSystemPrompt: aiPrompt?.label || '',
	// 		}));
	// 	}
	// }, [aiPrompt]);

	// useEffect(() => {
	// 	if (aiDefaultPrompt && Array?.isArray(aiDefaultPrompt)) {
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			systemPromptOptions: [
	// 				...prev.systemPromptOptions,
	// 				...aiDefaultPrompt?.map((prompt) => ({
	// 					label: prompt?.label,
	// 					id: prompt?._id,
	// 				})),
	// 			],
	// 		}));
	// 	}
	// }, [aiDefaultPrompt]);

	useEffect(() => {
		if (info?.systemPrompt !== undefined) {
			handleDebounceUpdate();
		}
	}, [info?.editedPrompt]);

	const handleDebounceUpdate = useCallback(() => {
		clearTimeout(info?.timeout);
		const timeout = setTimeout(() => {
			if (info?.editedPrompt && assistant?._id && assistant?.prompt?.promptId) {
				editAiPrompt(assistant?._id, assistant?.prompt?.promptId, {
					prompt: info?.editedPrompt,
				});
			}
			setInfo((prev) => ({
				...prev,
				timeout: null,
			}));
		}, 800);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [
		info?.timeout,
		info?.editedPrompt,
		assistant?._id,
		assistant?.prompt?.promptId,
		editAiPrompt,
	]);

	const handleModelDropdownVisibility = useCallback((visible) => {
		setInfo((prev) => ({ ...prev, isSelectModelOpen: visible }));
	}, []);

	const handleSystemPromptDropdownVisibility = useCallback((visible) => {
		setInfo((prev) => ({ ...prev, isSelectSystemPromptOpen: visible }));
	}, []);

	const handleChooseModalChange = useCallback((value) => {
		setInfo((prev) => ({ ...prev, selectedModel: value, isSelectModelOpen: false }));
	}, []);

	const handleSystemPromptChange = useCallback(
		(option) => {
			setInfo((prev) => ({
				...prev,
				selectedSystemPrompt: option.label,
				systemPrompt: option.prompt || '',
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
		}));
	}, []);

	const handleResetPrompt = useCallback(() => {
		resetAiPrompt(assistant?._id);
	}, [assistant]);

	return (
		<div className="aiPromptParentContainer">
			<div className="aiModalContainer">
				<div className="aiModalHeader">
					<span className="lineone">Model </span>
					<Question />
				</div>

				<div className="chooseModelContainer">
					<Tooltip
						open={info.isSelectModelOpen}
						onOpenChange={handleModelDropdownVisibility}
						placement="bottom"
						title={
							<div className="modelDropdown">
								{info?.aiModelOptions?.map((option, index) => (
									<div
										key={index}
										className="modelListItem"
										onClick={() => handleChooseModalChange(option)}
									>
										{option}
									</div>
								))}
							</div>
						}
						arrow={false}
						trigger={'click'}
						color={'transparent'}
						overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
					>
						<div className="voiceList">
							{info?.selectedModel}{' '}
							<DownSvg className={`${info?.isSelectModelOpen ? 'open' : ''}`} />
						</div>
					</Tooltip>
				</div>
			</div>

			<div className="systemProptParentContainer">
				<div className="systemProptHeader">
					<span className="lineone">System Prompt</span>
					<Question />
				</div>

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
						<div className="chooseModelContainer">
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
								overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
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
						</div>

						<CustomTextArea
							className="systemPromptTextArea"
							placeholder="Enter your system prompt here"
							value={info?.systemPrompt}
							onChange={(e) => handlePromptChange(e.target.value)}
							autoResize={true}
						/>

						<div className="resetPromptContainer">
							<span onClick={handleResetPrompt}>Reset</span>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default memo(KnowledgeAgentPrompt);
