import { memo, useCallback, useState } from 'react';
import '../../../../assets/scss/home_page/modals/aiSuggestionsModal.scss';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as ArrowRightSvg } from '../../../../assets/svg/home_page/arrow-right.svg';
import { Markdown } from '../../../../helpers/markdownHelper';
import { useNavigate } from 'react-router-dom';
import ObjectID from 'bson-objectid';
import { Drawer } from 'antd';
import Context from '../../../../context/context';
import { useContext } from 'react';

const AISuggestionsModal = ({ open, onClose, data, onNextCardClick, onPrevCardClick }) => {
	const navigate = useNavigate();
	const {
		templates: { updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isExpanded: false,
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
							<div className="next-btn" onClick={onNextCardClick}>
								<ChevronRightThinSvg />
							</div>
						</div>
					</div>
					<div className="horizontal-line"></div>
				</div>

				<div className="body">
					<div className="body-header">
						<div className="body-header">
							<div className="info">
								{confidence_score && (
									<div className="confidence">
										<div className="value">{`${confidence_score * 100}%`}</div>
										Confidence
									</div>
								)}
								{confidence_score && <span>|</span>}

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
									{`${priority} Priority`}
								</div>
							</div>
							<div className="title-text">{title || ''}</div>
							<div className="description">{description || ''}</div>
						</div>
					</div>

					<div
						className="chain-of-thought-container"
						onClick={() =>
							setInfo((prev) => ({ ...prev, isExpanded: !prev?.isExpanded }))
						}
					>
						<div className="cot-header">
							<div className="cot-text">Chain of thought</div>
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
					<div className="report-container">
						<div className="report-header">
							<div className="report-title">Report</div>
							<div className="report-description">
								<Markdown>{research_report || ''}</Markdown>
							</div>
						</div>
					</div>
					<div className="solutions">
						<div className="title-text">Suggested Solutions</div>
						<div className="solutions">
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
					</div>
					<div className="suggested-actions">
						<div className="title-text">Suggested Actions</div>
						<div className="suggested-actions">
							{Array?.isArray(suggested_actions)
								? suggested_actions?.map((item, index) => (
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
					</div>
					<div className="suggested-prompts">
						<div className="title-text">Suggested Prompts</div>
						<div className="suggested-prompts">
							{Array?.isArray(suggested_prompts)
								? suggested_prompts?.map((item, index) => (
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
					</div>
				</div>

				<div className="footer">
					<div className="horizontal-line"></div>
					<div className="btns-container">
						<button className="ignore-btn" onClick={onClose}>
							Ignore
						</button>
						<button className="report-btn" onClick={() => handleViewReportClick(data)}>
							View report
						</button>
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(AISuggestionsModal);
