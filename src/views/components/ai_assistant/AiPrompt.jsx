import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/aiPrompt.scss';
import { ReactComponent as Question } from '../../../assets/svg/ai_assistant/question.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';
import CustomTextArea from '../../components/globalComponents/CustomTextArea';
import { Tooltip } from 'antd';
import Context from '../../../context/context';

const AiPrompt = ({ assistant }) => {
	const {
		aiSetup: { resetAiPrompt, editAiPrompt, getAiPrompt, aiPrompt },
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
	}, [assistant]);

	useEffect(() => {
		if (aiPrompt) {
			const promptToShow = aiPrompt?.customEditedPrompt || aiPrompt?.prompt || '';
			setInfo((prev) => ({
				...prev,
				systemPrompt: promptToShow,
				systemPromptOptions: aiPrompt?.label ? [aiPrompt?.label] : [],
				selectedSystemPrompt: aiPrompt?.label || '',
			}));
		}
	}, [aiPrompt]);

	// console.log('assistant data in prompt page==>', aiPrompt)

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

	// console.log('aiPrompt data in prompt page==>', aiPrompt);

	const handleModelDropdownVisibility = useCallback((visible) => {
		setInfo((prev) => ({ ...prev, isSelectModelOpen: visible }));
	}, []);

	const handleSystemPromptDropdownVisibility = useCallback((visible) => {
		setInfo((prev) => ({ ...prev, isSelectSystemPromptOpen: visible }));
	}, []);

	const handleChooseModalChange = useCallback((value) => {
		setInfo((prev) => ({ ...prev, selectedModel: value, isSelectModelOpen: false }));
	}, []);

	const handleSystemPromptChange = useCallback((value) => {
		setInfo((prev) => ({
			...prev,
			selectedSystemPrompt: value,
			isSelectSystemPromptOpen: false,
		}));
	}, []);

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
			</div>

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
										key={option}
										className="modelListItem"
										onClick={() => handleSystemPromptChange(option)}
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

				<div className="resetPromptContainer" onClick={handleResetPrompt}>
					<span>Reset</span>
				</div>
			</div>
		</div>
	);
};

export default memo(AiPrompt);
