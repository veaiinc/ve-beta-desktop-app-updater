import { memo, useContext, useEffect, useCallback } from 'react';
import '../../../assets/scss/chat/askTooltip.scss';
import { Tooltip } from 'antd';
import Context from '../../../context/context';
import { fileTypeIcons } from '../../../helpers';
import { ReactComponent as TickSvg } from '../../../assets/svg/tick.svg';

const AskTooltip = ({ children }) => {
	const {
		templates: {
			globalChatMessages,
			currentSessionId,
			handleGlobalChatMessages,
			getLLMModels,
			llmModels,
		},
	} = useContext(Context);

	const chatBoxInfo = globalChatMessages?.[currentSessionId]?.chatBoxInfo;

	useEffect(() => {
		if (!llmModels) {
			getLLMModels();
		}
	}, []);

	const handleModelClick = useCallback(
		(model) => {
			let chatBoxInfo = globalChatMessages?.[currentSessionId]?.chatBoxInfo;
			if (chatBoxInfo?.selectedLLMModel !== model?.model_code) {
				chatBoxInfo = {
					...chatBoxInfo,
					selectedLLMModel: model?.model_code,
				};
			} else {
				chatBoxInfo = {
					...chatBoxInfo,
					selectedLLMModel: null,
				};
			}
			handleGlobalChatMessages({
				chatBoxInfo,
				updateExtraInfo: true,
				sessionId: currentSessionId,
			});
		},
		[currentSessionId, globalChatMessages, handleGlobalChatMessages],
	);

	return (
		<Tooltip
			placement="bottom"
			trigger="click"
			rootClassName="ask-tooltip-wrapper"
			arrow={false}
			color="transparent"
			title={
				<div className="ask-tooltip-container">
					<div className="title-text">Model</div>
					<div className="options">
						{llmModels?.models?.map((model, index) => (
							<div
								className="option"
								key={index}
								onClick={() => handleModelClick(model)}
							>
								<div className="title-container">
									<div className="icon">
										{fileTypeIcons[model?.model_type] || ''}
									</div>
									<div className="text-container">
										{model?.display_name || ''}
									</div>
								</div>
								{chatBoxInfo?.selectedLLMModel === model?.model_code && (
									<div className="icon">
										<TickSvg />
									</div>
								)}
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

export default memo(AskTooltip);
