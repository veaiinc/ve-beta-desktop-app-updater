import React, { memo, useCallback } from 'react';
import '../../../../assets/scss/home_page/modals/aiSuggestionsModal.scss';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import ReactMarkdown from 'react-markdown';
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

	const handleClickRun = useCallback(
		(prompt) => {
			if (typeof updateStateValues === 'function') {
				updateStateValues({ activePromptForChat: prompt });
			}
			onClose();
			navigate(`/chat/${ObjectID().toString()}`);
		},
		[onClose, navigate, updateStateValues],
	);

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
				<div className="header">
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
					<div className="chain-of-thought-container">
						<div className="cot-text">Chain of thought</div>
						<div className="desc">
							{Array.isArray(chain_of_thought)
								? chain_of_thought.map((item, index) => <p key={index}>{item}</p>)
								: chain_of_thought || ''}
						</div>
					</div>
					<div className="report-container">
						<div className="report-header">
							<div className="report-title">Report</div>
							<div className="report-description">
								<ReactMarkdown>{research_report || ''}</ReactMarkdown>
							</div>
						</div>
					</div>
					<div className="suggested-actions">
						<div className="title-text">Suggested Actions</div>
						<div className="suggested-actions">
							{Array.isArray(suggested_actions)
								? suggested_actions.map((item, index) => (
										<div
											className="action-item"
											key={index}
											onClick={() => handleClickRun(item)}
										>
											{item}
										</div>
								  ))
								: suggested_actions || ''}
						</div>
					</div>
					<div className="solutions">
						<div className="title-text">Suggested Solutions</div>
						<div className="solutions">
							{Array.isArray(solutions)
								? solutions.map((item, index) => (
										<div
											className="solution-item"
											key={index}
											onClick={() => handleClickRun(item)}
										>
											{item}
										</div>
								  ))
								: solutions || ''}
						</div>
					</div>
					<div className="suggested-prompts">
						<div className="title-text">Suggested Prompts</div>
						<div className="suggested-prompts">
							{Array.isArray(suggested_prompts)
								? suggested_prompts.map((item, index) => (
										<div
											className="prompt-item"
											key={index}
											onClick={() => handleClickRun(item)}
										>
											{item}
										</div>
								  ))
								: suggested_prompts || ''}
						</div>
					</div>
				</div>

				{/* <div className="footer">
					<button className="ignore-btn">Ignore</button>
					<button className="report-btn">View report</button>
				</div> */}
			</div>
		</Drawer>
	);
};

export default memo(AISuggestionsModal);
