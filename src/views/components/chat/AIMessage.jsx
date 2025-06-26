import { memo, useContext, useState, useCallback } from 'react';
import Context from '../../../context/context';
import { Markdown } from '../../../helpers/markdownHelper';
import { Tooltip } from 'antd';
import { ReactComponent as PencilSparkleIcon } from '../../../assets/svg/notes/pencilSparkle.svg';
import { ReactComponent as GraduationCapSvg } from '../../../assets/svg/graduationCap.svg';
import { ReactComponent as TickSvg } from '../../../assets/svg/tick.svg';
import { ReactComponent as CopyIcon } from '../../../assets/svg/ai_agents/copy.svg';
import { ReactComponent as ViewDocumentIcon } from '../../../assets/svg/chat/viewDocument.svg';
import { ReactComponent as BulbSvg } from '../../../assets/svg/home_page/bulb.svg';
import AISuggestionsReportAiComponent from './chatComponents/AiSuggestionsReportAiComponent';
import '../../../assets/scss/chat/aiMessage.scss';
import PromptPopup from '../homePage/PromptPopup';
import ClarifyWidget from './chatWidgets/ClarifyWidget';
import FormWidget from './FormWidget';

const AIMessage = ({
	text,
	customePencilClickFunc = null,
	messageId = null,
	rating = null,
	citations = null,
	messageData,
	isLastMessage = false,
	showCanvas = true,
	handleViewDocument = null,
	showViewDocument = false,
	isNoteCanvas = false,
}) => {
	const {
		documentPreview: { setNoteContent },
		templates: { updateStateValues, aiMessagesInfo },
	} = useContext(Context);
	const [info, setInfo] = useState({
		isCopiedToClipboard: false,
		feedbackPopupOpen: false,
		liked: null,
	});

	const handleUpdateId = (workflowTemplateId, moduleTemplateId) => {
		updateStateValues({
			documentPreviewIds: {
				workflowTemplateId,
				moduleTemplateId,
			},
		});
	};

	const handleCopyTextClick = useCallback((text) => {
		const textToBeCopied = text?.replace(/\\\[(.*?)\\\]/g, '$$$1$$')?.replace(/\\n/g, '\n');
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
		updateStateValues({ activePromptForChat: prompt });
	};

	return (
		<div className="ai-message-container">
			{info?.feedbackPopupOpen && (
				<PromptPopup
					messageId={messageData?.messageId}
					liked={info?.liked}
					open={info?.feedbackPopupOpen}
					feedbackPopupOpen={info?.feedbackPopupOpen}
					closeModal={() => setInfo((prev) => ({ ...prev, feedbackPopupOpen: false }))}
				/>
			)}
			{messageData?.used_agents?.length > 0 &&
				messageData?.workflow_template_id &&
				messageData?.module_template_id &&
				(showCanvas && !isNoteCanvas ? (
					messageData?.used_agents?.map((agent, index) => (
						<FormWidget
							workflowTemplateId={messageData?.workflow_template_id}
							moduleTemplateId={messageData?.module_template_id}
							handleViewDocument={handleViewDocument}
							showViewDocument={showViewDocument}
							isLastMessage={isLastMessage}
							messageData={messageData}
							agent={agent}
							key={index}
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

			{messageData?.moduleType === 'ai_suggestion_report' ? (
				<AISuggestionsReportAiComponent data={messageData?.data} />
			) : messageData?.widget_type === 'clarifyWidget' ? (
				<ClarifyWidget data={messageData?.data} />
			) : (
				<Markdown citations={citations}>{text}</Markdown>
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
								overlayInnerStyle={{ color: 'var(--primary-font)' }}
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
								overlayInnerStyle={{ color: 'var(--primary-font)' }}
							>
								<PencilSparkleIcon
									style={{ width: '20px', height: '20px' }}
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
							overlayInnerStyle={{ color: 'var(--primary-font)' }}
						>
							<div className="teach-me-container" onClick={handleTeachMeClick}>
								<GraduationCapSvg
									className="teach-me-icon"
									style={{ width: '20px', height: '20px' }}
								/>
								<div className="teach-me-text">Teach me</div>
							</div>
						</Tooltip>
					</div>
				</div>
			)}

			{typeof messageData?.['follow_up_query'] !== 'string' &&
				messageData?.stream_end &&
				(messageData?.['follow_up_query'] || [])?.length > 0 && (
					<div className="suggested-prompts">
						<div className="title-text">
							<BulbSvg />
							Suggested Prompts
						</div>
						<div className="prompts-container">
							{(messageData?.['follow_up_query'] || [])?.map((query, index) => (
								<div
									className="prompt-container"
									key={index}
									onClick={() => handlePromptClick(query)}
								>
									<div className="prompt">{query}</div>
								</div>
							))}
						</div>
					</div>
				)}

			{aiMessagesInfo?.[messageData?.messageId]?.followUpQuery?.length > 0 && (
				<div className="suggested-prompts">
					<div className="title-text">
						<BulbSvg />
						Suggested Prompts
					</div>
					<div className="prompts-container">
						{(aiMessagesInfo?.[messageData?.messageId]?.followUpQuery || [])?.map(
							(query, index) => (
								<div
									className="prompt-container"
									key={index}
									onClick={() => handlePromptClick(query)}
								>
									<div className="prompt">{query}</div>
								</div>
							),
						)}
					</div>
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
		prevProps.isLastMessage === nextProps.isLastMessage
	);
});
