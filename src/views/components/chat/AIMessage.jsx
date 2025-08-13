import { memo, useContext, useState, useCallback, useEffect } from 'react';
import Context from '../../../context/context';
import { Markdown } from '../../../helpers/markdownHelper';
import { Tooltip } from 'antd';
import { ReactComponent as PencilSparkleIcon } from '../../../assets/svg/notes/pencilSparkle.svg';
import { ReactComponent as GraduationCapSvg } from '../../../assets/svg/graduationCap.svg';
import { ReactComponent as TickSvg } from '../../../assets/svg/tick.svg';
import { ReactComponent as CopyIcon } from '../../../assets/svg/ai_agents/copy.svg';
import { ReactComponent as ViewDocumentIcon } from '../../../assets/svg/chat/viewDocument.svg';
import AISuggestionsReportAiComponent from './chatComponents/AiSuggestionsReportAiComponent';
import { ReactComponent as PlusSvg } from '../../../assets/svg/ai_assistant/plus.svg';
import { ReactComponent as VeLogoSvg } from '../../../assets/svg/veLogo.svg';
import '../../../assets/scss/chat/aiMessage.scss';
import PromptPopup from '../homePage/PromptPopup';
import ClarifyWidget from './chatWidgets/ClarifyWidget';
import FormWidget from './FormWidget';
import UnintegratedAgentApps from './chatComponents/UnintegratedAgentApps';
import IntermediateSteps from './chatComponents/IntermediateSteps';
import { fileTypeIcons, getFaviconUrl, getWebsiteName } from '../../../helpers';
import BrowserTools from './chatComponents/BrowserTools';

const tooltipStyles = {
	body: { color: 'var(--primary-font)' },
};

const builderAgentMapper = {
	formBuilderAgent: true,
	invoiceBuilderAgent: true,
	contractBuilderAgent: true,
};
const pencilIconStyles = {
	width: '20px',
	height: '20px',
	position: 'relative',
	top: '-2px',
};
const AIMessage = ({
	text,
	customePencilClickFunc = null,
	citations = null,
	messageData,
	isLastMessage = false,
	showCanvas = true,
	handleViewDocument = null,
	showViewDocument = false,
	isNoteCanvas = false,
	handleSourcesClick = null,
	messageIndex = null,
	showCitationsButton = true,
	sessionId = null,
}) => {
	const {
		documentPreview: { setNoteContent },
		templates: { updateStateValues, aiMessagesInfo, globalChatMessages },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isCopiedToClipboard: false,
		feedbackPopupOpen: false,
		liked: null,
		usedAgents: [],
	});

	useEffect(() => {
		const usedAgents = messageData?.used_agents?.filter((agent) => builderAgentMapper[agent]);
		setInfo((prev) => ({ ...prev, usedAgents: usedAgents }));
	}, [messageData?.used_agents]);

	const handleUpdateId = (workflowTemplateId, moduleTemplateId) => {
		updateStateValues({
			documentPreviewIds: {
				workflowTemplateId,
				moduleTemplateId,
			},
		});
	};

	const handleCopyTextClick = useCallback((text) => {
		const textToBeCopied = text?.replace(/\[C\d+\]/g, '');
		navigator?.clipboard?.writeText(textToBeCopied).then(() => {
			setInfo((prev) => ({ ...prev, isCopiedToClipboard: true }));
			setTimeout(() => {
				setInfo((prev) => ({ ...prev, isCopiedToClipboard: false }));
			}, 1000);
		});
	}, []);

	const handlePencilClick = useCallback(() => {
		if (customePencilClickFunc) {
			customePencilClickFunc();
		}
		setNoteContent(messageData);
	}, [customePencilClickFunc, setNoteContent, messageData]);

	const handleTeachMeClick = useCallback(() => {
		setInfo((prev) => ({ ...prev, feedbackPopupOpen: true }));
	}, []);

	const handlePromptClick = (prompt) => {
		if (prompt && sessionId) {
			updateStateValues({
				activePromptForChat: {
					prompt,
					sessionId,
				},
			});
		}
	};

	const handleFeedbackUpdateSuccess = (feedbackReq = {}) => {
		// Clone the existing globalChatMessages safely
		const newGlobalChatMessages = { ...(globalChatMessages || {}) };

		// Ensure the session exists before modifying
		if (newGlobalChatMessages[sessionId]?.messages) {
			newGlobalChatMessages[sessionId].messages = newGlobalChatMessages[
				sessionId
			].messages.map((message) => {
				if (message?.messageId === messageData?.messageId) {
					return {
						...message,
						...feedbackReq,
					};
				}
				return message;
			});

			// Apply updated state
			updateStateValues({
				globalChatMessages: newGlobalChatMessages,
			});
		}
	};

	return (
		<div className="ai-message-container">
			<PromptPopup
				messageId={messageData?.messageId}
				liked={messageData?.rating}
				open={info?.feedbackPopupOpen}
				feedbackMessage={messageData?.userRemarks}
				feedbackPopupOpen={info?.feedbackPopupOpen}
				selectedFeedback={messageData?.userFeedbackReasons}
				handleFeedbackUpdateSuccess={handleFeedbackUpdateSuccess}
				isTrained={
					messageData?.rating ||
					messageData?.userRemarks ||
					messageData?.userFeedbackReasons?.length
				}
				closeModal={() => setInfo((prev) => ({ ...prev, feedbackPopupOpen: false }))}
			/>
			{info?.usedAgents?.length > 0 &&
				messageData?.workflow_template_id &&
				messageData?.module_template_id &&
				(showCanvas && !isNoteCanvas ? (
					info?.usedAgents?.map((agent, index) => (
						<FormWidget
							workflowTemplateId={messageData?.workflow_template_id}
							moduleTemplateId={messageData?.module_template_id}
							handleViewDocument={handleViewDocument}
							showViewDocument={showViewDocument}
							isLastMessage={isLastMessage}
							messageData={messageData}
							agent={agent}
							key={index}
							sessionId={sessionId}
						/>
					))
				) : (
					<div
						className="view-document-container"
						onClick={() =>
							handleUpdateId(
								messageData?.workflow_template_id,
								messageData?.module_template_id,
							)
						}
					>
						<ViewDocumentIcon />
						<p>View Document</p>
					</div>
				))}

			{messageData?.browserTools?.length > 0 && (
				<BrowserTools data={messageData?.browserTools} />
			)}

			{messageData?.tool_invocations && (
				<IntermediateSteps
					steps={messageData?.tool_invocations}
					isStreaming={messageData?.stream_end === false}
				/>
			)}

			{messageData?.moduleType === 'ai_suggestion_report' ? (
				<AISuggestionsReportAiComponent data={messageData?.data} />
			) : messageData?.widget_type === 'clarifyWidget' ? (
				<ClarifyWidget data={messageData?.data} sessionId={sessionId} />
			) : (
				<Markdown citations={citations}>{text}</Markdown>
			)}

			{messageData?.unintegrated_apps?.length > 0 && (
				<UnintegratedAgentApps apps={messageData?.unintegrated_apps} />
			)}

			{messageData?.messageId && (
				<div
					className="hover-actions-container"
					style={{
						visibility: isLastMessage ? 'visible' : '',
					}}
				>
					<div className="left-container">
						<div className="icon-container">
							<Tooltip
								placement="bottom"
								arrow={false}
								trigger={'hover'}
								title={
									<div className="hover-icons-tooltip">
										{info?.isCopiedToClipboard ? 'Copied' : 'Copy'}
									</div>
								}
								color="transparent"
								styles={tooltipStyles}
							>
								{info?.isCopiedToClipboard ? (
									<TickSvg />
								) : (
									<CopyIcon onClick={() => handleCopyTextClick(text)} />
								)}
							</Tooltip>
						</div>
						<div className="icon-container">
							<Tooltip
								placement="bottom"
								arrow={false}
								trigger={'hover'}
								color="transparent"
								title={<div className="hover-icons-tooltip">Edit</div>}
								styles={tooltipStyles}
							>
								<PencilSparkleIcon
									style={pencilIconStyles}
									onClick={handlePencilClick}
								/>
							</Tooltip>
						</div>
						<Tooltip
							placement="bottom"
							arrow={false}
							trigger={'hover'}
							color="transparent"
							title={<div className="hover-icons-tooltip">Feedback</div>}
							styles={tooltipStyles}
						>
							<div className="teach-me-container" onClick={handleTeachMeClick}>
								<GraduationCapSvg
									className="teach-me-icon"
									style={{ width: '19px', height: '19px' }}
								/>
								{/* <div className="teach-me-text">Teach me</div> */}
							</div>
						</Tooltip>
						{messageData?.citations?.length > 0 && showCitationsButton && (
							<div
								className="ai-message-sources-container"
								onClick={() => handleSourcesClick?.(messageIndex)}
							>
								<div className="imgs-container">
									{messageData?.citations?.slice(0, 3)?.map((citation, index) => (
										<div className="ai-message-icon" key={index}>
											{citation?.type === 'url' ? (
												getFaviconUrl(citation?.name) ? (
													<img
														src={getFaviconUrl(citation?.name)}
														alt="favicon"
														className="ai-message-favicon-image"
													/>
												) : (
													<div className="ai-message-source-icon">
														{getWebsiteName(citation?.name)?.charAt(0)}
													</div>
												)
											) : (
												<div className="ai-message-source-icon">
													{citation?.type === 's3_key'
														? fileTypeIcons[
																citation?.name?.match(
																	/\.(\w+)$/,
																)?.[1]
														  ] || <VeLogoSvg />
														: fileTypeIcons[citation?.type] || (
																<VeLogoSvg />
														  )}
												</div>
											)}
										</div>
									))}
								</div>
								<div className="source-text-container">Sources</div>
							</div>
						)}
					</div>
				</div>
			)}

			{(aiMessagesInfo?.[messageData?.messageId]?.followUpQuery?.length > 0 ||
				((messageData?.['follow_up_query'] || [])?.length > 0 &&
					typeof messageData?.['follow_up_query'] === 'object')) && (
				<div className="chat-suggestions-container">
					{(aiMessagesInfo?.[messageData?.messageId]?.followUpQuery?.length > 0 ||
						(messageData?.['follow_up_query'] || [])?.length > 0) && (
						<div className="suggested-prompts">
							<div className="title-text">Suggested Prompts</div>
							<div className="prompts-container">
								{(
									aiMessagesInfo?.[messageData?.messageId]?.followUpQuery ||
									messageData?.['follow_up_query'] ||
									[]
								)?.map((query, index) => (
									<div
										className="prompt-container"
										key={index}
										onClick={() => handlePromptClick(query?.action_query)}
									>
										<PlusSvg
											style={{ width: '18px', height: '18px', flexShrink: 0 }}
										/>
										<div className="prompt">{query?.display_query || ''}</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default memo(AIMessage, (prevProps, nextProps) => {
	return (
		prevProps.text === nextProps.text &&
		prevProps.messageId === nextProps.messageId &&
		prevProps.rating === nextProps.rating &&
		JSON.stringify(prevProps.citations) === JSON.stringify(nextProps.citations) &&
		prevProps.messageData?.messageId === nextProps.messageData?.messageId &&
		JSON.stringify(prevProps.messageData?.tool_invocations) ===
			JSON.stringify(nextProps.messageData?.tool_invocations) &&
		prevProps.messageData?.stream_end === nextProps.messageData?.stream_end &&
		prevProps.isLastMessage === nextProps.isLastMessage &&
		prevProps.handleSourcesClick === nextProps.handleSourcesClick &&
		prevProps.messageIndex === nextProps.messageIndex &&
		prevProps.showCitationsButton === nextProps.showCitationsButton &&
		prevProps.sessionId === nextProps.sessionId
	);
});
