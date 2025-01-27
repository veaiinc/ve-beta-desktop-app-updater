import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/ai_assistant/aiPrompt.scss';
import { ReactComponent as Question } from '../../../assets/svg/ai_assistant/question.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';
import CustomTextArea from '../../components/globalComponents/CustomTextArea';
import { Tooltip } from 'antd';

const AiPrompt = () => {
	const [info, setInfo] = useState({
		modelOptions: ['GPT-4o', 'GPT-4o-mini', 'GPT-4o-turbo'],
		selectedModel: 'GPT-4o',
		modelListLoading: false,
		isSelectModelOpen: false,
		systemPromptOptions: [
			'Custom prompt',
			'Customer Support',
			'Sales',
			'Language tutor',
			'Coding Expert',
			'Life Coach',
		],
		selectedSystemPrompt: 'System Prompt 1',
		isSelectSystemPromptOpen: false,
		systemPrompt: '',
	});

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
		setInfo((prev) => ({ ...prev, systemPrompt: value }));
	}, []);

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
								{info?.modelOptions?.map((option) => (
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

				<div className="resetPromptContainer">
					<span>Reset Prompt</span>
				</div>
			</div>
		</div>
	);
};

export default memo(AiPrompt);
