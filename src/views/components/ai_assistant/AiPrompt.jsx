import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/aiPrompt.scss';
import { ReactComponent as Question } from '../../../assets/svg/ai_assistant/question.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';
import CustomTextArea from '../../components/globalComponents/CustomTextArea';
import { Tooltip } from 'antd';
import Context from '../../../context/context';

const AiPrompt = ({ assistant }) => {
	const {
		aiSetup: {
			selectAiPrompt,
			getDefaultAiPrompt,
			resetAiPrompt,
			editAiPrompt,
			getAiPrompt,
			aiPrompt,
			aiDefaultPrompt,
		},
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
	});

	useEffect(() => {
		getAiPrompt(assistant?._id);
		getDefaultAiPrompt(assistant?._id);
	}, [assistant]);

	useEffect(() => {
		if (aiPrompt) {
			const promptToShow = aiPrompt?.customEditedPrompt || aiPrompt?.prompt || '';
			setInfo((prev) => ({
				...prev,
				systemPrompt: promptToShow,
				selectedSystemPrompt: aiPrompt?.label || '',
			}));
		}
	}, [aiPrompt]);

	useEffect(() => {
		if (aiDefaultPrompt && Array?.isArray(aiDefaultPrompt)) {
			setInfo((prev) => ({
				...prev,
				systemPromptOptions: [
					...prev.systemPromptOptions,
					...aiDefaultPrompt?.map((prompt) => ({
						label: prompt?.label,
						id: prompt?._id,
					})),
				],
			}));
		}
	}, [aiDefaultPrompt]);

	useEffect(() => {
		if (info?.systemPrompt !== undefined) {
			handleDebounceUpdate();
		}
	}, [info?.editedPrompt]);

	const handleDebounceUpdate = useCallback(() => {
		clearTimeout(info?.timeout);
		const timeout = setTimeout(() => {
			if (info?.editedPrompt && assistant?._id && aiPrompt?.promptId) {
				editAiPrompt(assistant?._id, aiPrompt?.promptId, {
					prompt: info?.editedPrompt,
				});
			}
			setInfo((prev) => ({
				...prev,
				timeout: null,
			}));
		}, 800);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [info?.editedPrompt, assistant?._id, aiPrompt?.promptId, editAiPrompt]);

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
			if (assistant?._id && option.id) {
				selectAiPrompt(assistant?._id, option.id);
			}
		},
		[assistant, selectAiPrompt],
	);

	const handlePromptChange = useCallback((value) => {
		setInfo((prev) => ({
			...prev,
			systemPrompt: value,
			editedPrompt: value,
			selectedSystemPrompt: 'custom',
		}));
	}, []);

	const handleResetPrompt = useCallback(() => {
		resetAiPrompt(assistant?._id);
	}, [assistant]);

	return (
		<div className="aiPromptParentContainer">
			{/* <div className="aiModalContainer">
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
								{info?.aiModelOptions?.map((option) => (
									<div
										key={option}
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
			</div> */}

			<div className="systemProptParentContainer">
				<div className="systemProptHeader">
					<span className="lineone">System Prompt</span>
					<Question />
				</div>

				<div className="chooseModelContainer">
					<Tooltip
						open={info.isSelectSystemPromptOpen}
						onOpenChange={handleSystemPromptDropdownVisibility}
						placement="bottom"
						title={
							<div className="modelDropdown">
								{info?.systemPromptOptions?.map((option) => (
									<div
										key={option?.id}
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
								className={`${info?.isSelectSystemPromptOpen ? 'open' : ''}`}
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
			</div>
		</div>
	);
};

export default memo(AiPrompt);
