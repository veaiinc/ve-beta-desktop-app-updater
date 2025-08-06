import { memo, useContext, useEffect, useCallback } from 'react';
import '../../../assets/scss/chat/askTooltip.scss';
import { Tooltip } from 'antd';
import Context from '../../../context/context';
import { ReactComponent as TickSvg } from '../../../assets/svg/tick.svg';
import { ReactComponent as VeLogoSvg } from '../../../assets/svg/veLogo.svg';
import { ReactComponent as OpenAISvg } from '../../../assets/svg/openai.svg';

const AskTooltip = ({ children, open, onOpenChange }) => {
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
		if (!llmModels && open) {
			getLLMModels();
		}
	}, [open]);

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
			rootClassName="ask-tooltip-wrapper"
			arrow={false}
			color="transparent"
			trigger="click"
			open={open}
			onOpenChange={onOpenChange}
			title={
				<div className="ask-tooltip-container">
					<div className="ve-container">
						<div className="ve-header">Include workspace context</div>
						<div className="ve-body">
							<div className="ve-title-container">
								<VeLogoSvg style={{ width: 16, height: 11 }} />
								<div className="text-container">Ask Ve AI</div>
							</div>
							{!chatBoxInfo?.selectedLLMModel && <TickSvg />}
						</div>
					</div>
					<div className="model-options-container">
						<div className="title-text">Models</div>
						<div className="options">
							{llmModels?.models?.map((model, index) => (
								<div
									className="option"
									key={index}
									onClick={() => handleModelClick(model)}
								>
									<div className="option-title-container">
										<OpenAISvg />
										<div className="text-container">
											{model?.display_name || ''}
										</div>
									</div>
									{chatBoxInfo?.selectedLLMModel === model?.model_code && (
										<TickSvg />
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			}
		>
			{children}
		</Tooltip>
	);
};

export default memo(AskTooltip);
