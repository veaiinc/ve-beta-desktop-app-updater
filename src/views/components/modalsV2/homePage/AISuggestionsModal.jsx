import React, { memo } from 'react';
import '../../../../assets/scss/home_page/modals/aiSuggestionsModal.scss';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';

import { Drawer } from 'antd';

const AISuggestionsModal = ({ open, onClose, data, onNextCardClick, onPrevCardClick }) => {
	if (!data) return;
	const { title, description, confidence_score, must_notify } = data?.researchTopics?.[0];
	const { cot } = data;
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
												must_notify === 'No'
													? 'var(--primary-button)'
													: 'red',
										}}
									></div>
									{`${must_notify === 'No' ? 'Medium' : 'High'} Priority`}
								</div>
							</div>
							<div className="title-text">{title || ''}</div>
							<div className="description">{description || ''}</div>
						</div>
					</div>
					<div className="chain-of-thought-container">
						<div className="cot-text">Chain of thought</div>
						<div className="desc">{cot || ''}</div>
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
