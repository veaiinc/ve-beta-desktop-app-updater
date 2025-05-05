import { memo, useContext, useState, useCallback } from 'react';
import Context from '../../../context/context';
import FormModel from './FormModel';
import { Markdown } from '../../../helpers/markdownHelper';
import { Tooltip } from 'antd';
import { ReactComponent as PencilSparkleIcon } from '../../../assets/svg/notes/pencilSparkle.svg';
import { ReactComponent as ThumpsUpSvg } from '../../../assets/svg/ai_agents/thumps-up.svg';
import { ReactComponent as ThumpsDownSvg } from '../../../assets/svg/ai_agents/thumps-down.svg';
import { ReactComponent as TickSvg } from '../../../assets/svg/tick.svg';
import { ReactComponent as CopyIcon } from '../../../assets/svg/ai_agents/copy.svg';
import { ReactComponent as ViewDocumentIcon } from '../../../assets/svg/chat/viewDocument.svg';
import { ReactComponent as ArrowRightSvg } from '../../../assets/svg/home_page/arrow-right.svg';
import AISuggestionsReportAiComponent from './chatComponents/AiSuggestionsReportAiComponent';
import '../../../assets/scss/chat/aiMessage.scss';

const AIMessage = memo(
	({
		text,
		customePencilClickFunc = null,
		messageId = null,
		handleRatingClick = null,
		rating = null,
		citations = [],
		messageData,
		isLastMessage = false,
		isNewMessage = false,
		showCanvas = true,
		handleSendWebsocketMessage = null,
		latestStreamMesage = null,
		lastQuery = null,
		toggleLatestStreamMessage = null,
		handleViewDocument = null,
		showViewDocument = false,
		isNoteCanvas = false,
	}) => {
		const {
			documentPreview: { setNoteContent },
			templates: { updateStateValues },
		} = useContext(Context);

		const [info, setInfo] = useState({
			isCopiedToClipboard: false,
			feedbackPopupOpen: false,
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

		const handleThumbsClick = useCallback(() => {
			const newRating = rating === 'thumbsUp' ? 'thumbsDown' : 'thumbsUp';
			handleRatingClick && handleRatingClick(newRating, messageId);
		}, [handleRatingClick, messageId, rating]);

		const handlePromptClick = (prompt) => {
			updateStateValues({ activePromptForChat: prompt });
		};

		return (
			<div className="ai-message-container">
				{messageData?.workflow_template_id &&
					(showCanvas && !isNoteCanvas ? (
						<FormModel
							workflowTemplateId={messageData?.workflow_template_id}
							moduleTemplateId={messageData?.module_template_id}
							ByDefaultExpanded={true}
							handleSendWebsocketMessage={handleSendWebsocketMessage}
							latestStreamMesage={latestStreamMesage}
							lastQuery={lastQuery}
							toggleLatestStreamMessage={toggleLatestStreamMessage}
							messageId={messageData?.messageId}
							handleViewDocument={handleViewDocument}
							showViewDocument={showViewDocument}
							isLastMessage={isLastMessage}
							messageData={messageData}
						/>
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
				) : (
					<Markdown citations={citations}>{text}</Markdown>
				)}

				{messageData?.messageId && (
					<div
						className="hover-actions-container"
						style={{
							visibility: isNewMessage ? 'visible' : '',
						}}
					>
						<div className="left-container">
							<div className="icon-container">
								<Tooltip
									placement="bottom"
									arrow={false}
									trigger="hover"
									title="Like / Dislike"
								>
									{rating === 'thumbsUp' ? (
										<ThumpsUpSvg fill="#f2f2f3" onClick={handleThumbsClick} />
									) : (
										<ThumpsDownSvg
											fill={rating === 'thumbsDown' ? '#f2f2f3' : 'none'}
											onClick={handleThumbsClick}
										/>
									)}
								</Tooltip>
							</div>
						</div>

						<div className="right-container">
							<div className="icon-container">
								<Tooltip
									placement="bottom"
									arrow={false}
									trigger="hover"
									title="Edit"
								>
									<PencilSparkleIcon onClick={handlePencilClick} />
								</Tooltip>
							</div>

							<div className="icon-container">
								<Tooltip
									placement="bottom"
									arrow={false}
									trigger="hover"
									title={info.isCopiedToClipboard ? 'Copied' : 'Copy'}
								>
									{info.isCopiedToClipboard ? (
										<TickSvg />
									) : (
										<CopyIcon onClick={() => handleCopyTextClick(text)} />
									)}
								</Tooltip>
							</div>
						</div>
					</div>
				)}

				{typeof messageData?.['follow_up_query'] !== 'string' &&
					messageData?.stream_end &&
					(messageData?.['follow_up_query'] || [])?.length > 0 && (
						<div className="suggested-prompts">
							<div className="title-text">Suggested Prompts</div>
							<div className="prompts-container">
								{(messageData?.['follow_up_query'] || []).map((query, index) => (
									<div
										className="prompt-container"
										key={index}
										onClick={() => handlePromptClick(query)}
									>
										<div className="logo-container">
											<ArrowRightSvg />
										</div>
										<div className="prompt">{query}</div>
									</div>
								))}
							</div>
						</div>
					)}
			</div>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.text === nextProps.text &&
			prevProps.messageId === nextProps.messageId &&
			prevProps.rating === nextProps.rating &&
			JSON.stringify(prevProps.citations) === JSON.stringify(nextProps.citations) &&
			prevProps.messageData?.messageId === nextProps.messageData?.messageId &&
			prevProps.isNewMessage === nextProps.isNewMessage &&
			prevProps.lastQuery === nextProps.lastQuery &&
			prevProps.latestStreamMesage === nextProps.latestStreamMesage
		);
	},
);

export default AIMessage;
