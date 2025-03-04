import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'antd';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as TickSvg } from '../../../assets/svg/home_page/Tick.svg';
import Context from '../../../context/context';

const LLMTooltip = ({ children, isOpen, setIsLLMModelOpen, handleOptionClick, selectedModel }) => {
	const {
		templates: { getLLMModels, llmModels, updateStateValues, chatInfo },
	} = useContext(Context);
	const [searchQuery, setSearchQuery] = useState('');
	const [models, setModels] = useState([]);

	useEffect(() => {
		if (!llmModels) {
			getLLMModels();
		} else {
			setModels(llmModels?.models);
			updateStateValues({
				chatInfo: {
					...chatInfo,
					selectedLLMModel: llmModels?.default_model_code,
				},
			});
		}
	}, [llmModels]);

	const filteredModels = useMemo(() => {
		return models?.filter((model) =>
			model?.display_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
		);
	}, [models, searchQuery]);

	return (
		<Tooltip
			placement="top"
			open={isOpen}
			onOpenChange={setIsLLMModelOpen}
			color="transparent"
			trigger="click"
			title={
				<div className="llm-model-container">
					<div className="input-container">
						<SearchSvg />
						<input
							type="text"
							placeholder="Search model"
							onChange={(e) => setSearchQuery(e?.target?.value)}
							value={searchQuery}
						/>
					</div>
					<div className="options-container">
						{filteredModels?.map((model, index) => (
							<div
								className={`option ${
									selectedModel === model?.model_code ? 'selected' : ''
								}`}
								key={index}
								onClick={() => handleOptionClick(model)}
							>
								<div className="option-title">{model?.display_name}</div>
								{selectedModel === model?.model_code && <TickSvg />}
							</div>
						))}
					</div>
				</div>
			}
		>
			{children}
		</Tooltip>
	);
};

export default memo(LLMTooltip);
