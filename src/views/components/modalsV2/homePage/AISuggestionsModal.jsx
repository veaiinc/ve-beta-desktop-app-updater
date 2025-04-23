import { memo, useCallback, useState } from 'react';
import '../../../../assets/scss/home_page/modals/aiSuggestionsModal.scss';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as ArrowRightSvg } from '../../../../assets/svg/home_page/arrow-right.svg';
import { ReactComponent as ChainOfThoughtSvg } from '../../../../assets/svg/chainOfThought.svg';
import { ReactComponent as ReportIconSvg } from '../../../../assets/svg/reportIcon.svg';
import { ReactComponent as RecommendedSvg } from '../../../../assets/svg/recommended.svg';
import { ReactComponent as SuggestedActionsSvg } from '../../../../assets/svg/suggestedActions.svg';
import { ReactComponent as SuggestedPromptsSvg } from '../../../../assets/svg/suggestedPrompts.svg';
import { ReactComponent as ReportIcon2Svg } from '../../../../assets/svg/reportIcon2.svg';
import { ReactComponent as ThumbsUpSvg } from '../../../../assets/svg/thumbsUp.svg';
import { ReactComponent as ThumbsDownSvg } from '../../../../assets/svg/thumbsDown.svg';
import { Markdown } from '../../../../helpers/markdownHelper';
import { useNavigate } from 'react-router-dom';
import ObjectID from 'bson-objectid';
import { Drawer } from 'antd';
import Context from '../../../../context/context';
import { useContext } from 'react';

const AISuggestionsModal = ({
	open,
	onClose,
	data,
	onNextCardClick,
	onPrevCardClick,
	totalDocs,
	selectedCardNumber,
}) => {
	const navigate = useNavigate();
	const {
		templates: { updateStateValues, pendingActionsUpdate },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isExpanded: false,
		isSolutionsExpanded: false,
		isActionsExpanded: false,
		isPromptsExpanded: false,
		isReportExpanded: true,
	});

	const handleClickRun = useCallback((prompt) => {
		if (typeof updateStateValues === 'function') {
			updateStateValues({ activePromptForChat: prompt });
		}
		onClose();
		navigate(`/chat/${ObjectID()?.toString()}`);
	}, []);

	const handleViewReportClick = useCallback((data) => {
		const cot = (data?.chain_of_thought || [])?.map((item) => {
			return {
				sub_query: item,
			};
		});
		const messages = [
			{
				type: 'user',
				moduleType: 'ai_suggestion_report',
				data,
				message: data?.title,
			},
			{
				type: 'AI',
				moduleType: 'ai_suggestion_report',
				data: {
					research_report: data?.research_report,
				},
				processing: 'Report',
				deepSearch: {
					cot,
				},
				follow_up_query: data?.suggested_prompts,
				stream_end: true,
			},
		];
		updateStateValues({ globalChatMessages: messages });
		navigate(`/chat/${ObjectID()?.toString()}`);
	}, []);

	if (!data) return null;
	const {
		title,
		description,
		confidence_score,
		priority,
		chain_of_thought,
		research_report,
		suggested_actions,
		solutions,
		suggested_prompts,
	} = data;

	const handleIgnoreClick = async () => {
		await pendingActionsUpdate(data?._id, { isIgnored: true });
		onClose();
	};
	const handleThumbClick = async (type) => {
		if (data?.feedback === type) return;
		await pendingActionsUpdate(data?._id, { feedback: type });
	};

	console.log(data, 'data');
	return (
		<Drawer
			open={open}
			onClose={onClose}
			placement="right"
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			style={{ padding: '0px' }}
			rootClassName="ai-suggestions-drawer"
		>
			<div className="ai-suggestions-container">
				<div className="drawer-header">
					<div className="header-content">
						<div className="left-container">
							<div className="prev-btn" onClick={onPrevCardClick}>
								<ChevronRightThinSvg />
							</div>
							<div className="total-docs">
								{`${selectedCardNumber} / ${totalDocs}`}
							</div>
							<div className="next-btn" onClick={onNextCardClick}>
								<ChevronRightThinSvg />
							</div>
						</div>

						<div className="info">
							<div className="priority">
								<div
									className="indicator"
									style={{
										background:
											priority === 'High'
												? 'red'
												: priority === 'Medium'
												? 'orange'
												: 'green',
									}}
								></div>
								<div className="priority-text">{`${priority} Priority`}</div>
							</div>
							{confidence_score && (
								<div className="confidence">
									<div className="value">{`${confidence_score * 100}%`}</div>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="body">
					<div className="body-header">
						<div className="body-header">
							<div className="title-text">{title || ''}</div>
							<div className="description">{description || ''}</div>
						</div>
					</div>
					<hr className="horizontal-line" />
					<div
						className="chain-of-thought-container"
						onClick={() =>
							setInfo((prev) => ({ ...prev, isExpanded: !prev?.isExpanded }))
						}
					>
						<div className="cot-header">
							<div className="cot-text">
								<ChainOfThoughtSvg />
								Chain of thought
							</div>
							<div
								className="cot-expand-btn"
								style={{
									transform: info?.isExpanded
										? 'rotate(-90deg)'
										: 'rotate(90deg)',
								}}
							>
								<ChevronRightThinSvg />
							</div>
						</div>
						{info?.isExpanded && (
							<div
								className="chain-of-thought-content"
								onClick={(e) => e?.stopPropagation()}
							>
								{Array?.isArray(chain_of_thought)
									? chain_of_thought?.map((cot, index) => {
											return (
												<div className="content-container" key={index}>
													<div className="logo-container"></div>
													<div className="text-container">{cot}</div>
												</div>
											);
									  })
									: ''}
							</div>
						)}
					</div>
					<hr className="horizontal-line" />
					<div
						className="report-container"
						onClick={() =>
							setInfo((prev) => ({
								...prev,
								isReportExpanded: !prev?.isReportExpanded,
							}))
						}
					>
						<div className="cot-header">
							<div className="cot-text">
								<ReportIconSvg />
								Report
							</div>
							<div className="report-icon-container">
								<ReportIcon2Svg />
								<div
									className="cot-expand-btn"
									style={{
										transform: info?.isReportExpanded
											? 'rotate(-90deg)'
											: 'rotate(90deg)',
									}}
								>
									<ChevronRightThinSvg />
								</div>
							</div>
						</div>

						{info?.isReportExpanded && (
							<div
								className="report-description"
								onClick={(e) => e.stopPropagation()}
							>
								<Markdown>{research_report || ''}</Markdown>
							</div>
						)}
					</div>

					<hr className="horizontal-line" />
					<div
						className="solutions-container"
						onClick={() =>
							setInfo((prev) => ({
								...prev,
								isSolutionsExpanded: !prev?.isSolutionsExpanded,
							}))
						}
						style={{ width: '100%' }}
					>
						<div className="cot-header">
							<div className="cot-text">
								<RecommendedSvg />
								Suggested Solutions
							</div>
							<div
								className="cot-expand-btn"
								style={{
									transform: info?.isExpanded
										? 'rotate(-90deg)'
										: 'rotate(90deg)',
								}}
							>
								<ChevronRightThinSvg />
							</div>
						</div>

						{info?.isSolutionsExpanded && (
							<div className="solutions" onClick={(e) => e.stopPropagation()}>
								{Array?.isArray(solutions)
									? solutions?.map((item, index) => (
											<div
												className="solution-item"
												key={index}
												onClick={() => handleClickRun(item)}
											>
												<div className="logo">
													<ArrowRightSvg />
												</div>
												<div className="item-text">{item}</div>
											</div>
									  ))
									: solutions || ''}
							</div>
						)}
					</div>
					<hr className="horizontal-line" />
					<div
						className="suggested-actions-container"
						onClick={() =>
							setInfo((prev) => ({
								...prev,
								isActionsExpanded: !prev?.isActionsExpanded,
							}))
						}
						style={{ width: '100%' }}
					>
						<div className="cot-header">
							<div className="cot-text">
								<SuggestedActionsSvg />
								Suggested Actions
							</div>
							<div
								className="cot-expand-btn"
								style={{
									transform: info?.isActionsExpanded
										? 'rotate(-90deg)'
										: 'rotate(90deg)',
								}}
							>
								<ChevronRightThinSvg />
							</div>
						</div>

						{info?.isActionsExpanded && (
							<div className="suggested-actions" onClick={(e) => e.stopPropagation()}>
								{Array?.isArray(suggested_actions)
									? suggested_actions.map((item, index) => (
											<div
												className="action-item"
												key={index}
												onClick={() => handleClickRun(item)}
											>
												<div className="logo">
													<ArrowRightSvg />
												</div>
												<div className="item-text">{item}</div>
											</div>
									  ))
									: suggested_actions || ''}
							</div>
						)}
					</div>
					<hr className="horizontal-line" />
					<div className="suggested-prompts">
						<div
							className="suggested-prompts-container"
							onClick={() =>
								setInfo((prev) => ({
									...prev,
									isPromptsExpanded: !prev?.isPromptsExpanded,
								}))
							}
							style={{ width: '100%' }}
						>
							<div className="cot-header">
								<div className="cot-text">
									<SuggestedPromptsSvg />
									Suggested Prompts
								</div>
								<div
									className="cot-expand-btn"
									style={{
										transform: info?.isPromptsExpanded
											? 'rotate(-90deg)'
											: 'rotate(90deg)',
									}}
								>
									<ChevronRightThinSvg />
								</div>
							</div>

							{info?.isPromptsExpanded && (
								<div
									className="suggested-prompts"
									onClick={(e) => e.stopPropagation()}
								>
									{Array?.isArray(suggested_prompts)
										? suggested_prompts.map((item, index) => (
												<div
													className="prompt-item"
													key={index}
													onClick={() => handleClickRun(item)}
												>
													<div className="logo">
														<ArrowRightSvg />
													</div>
													<div className="item-text">{item}</div>
												</div>
										  ))
										: suggested_prompts || ''}
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="footer">
					<div className="horizontal-line"></div>
					<div className="footer-content">
						<div className="footer-left">
							<div
								className={`thumbs-up-container ${
									data?.feedback === 'thumbsup' ? 'selected-thumb' : ''
								}`}
								onClick={() => handleThumbClick('thumbsup')}
							>
								<ThumbsUpSvg />
							</div>
							<div
								className={`thumbs-up-container ${
									data?.feedback === 'thumbsdown' ? 'selected-thumb' : ''
								}`}
								onClick={() => handleThumbClick('thumbsdown')}
							>
								<ThumbsDownSvg />
							</div>
						</div>
						<div className="btns-container">
							<button className="ignore-btn" onClick={handleIgnoreClick}>
								Ignore
							</button>
							<button
								className="report-btn"
								onClick={() => handleViewReportClick(data)}
							>
								View report
							</button>
						</div>
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(AISuggestionsModal);
