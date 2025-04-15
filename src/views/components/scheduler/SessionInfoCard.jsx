import React, { memo, useState } from 'react';
import { ReactComponent as Dot } from '../../../assets/svg/gallery/threeDots.svg';
import { ReactComponent as QuestionMark } from '../../../assets/svg/ai_assistant/question.svg';
import { ReactComponent as Down } from '../../../assets/svg/calendar/down.svg';
import ToggleSwitch from '../input/slider';
import { Tooltip } from 'antd';

const SessionInfoCard = ({ sessionData }) => {
	const [info, setInfo] = useState({
		isDetailsOpen: false,
		detailsOptions: ['Details', 'Conference', 'Shoot', 'Interview'],
		isDataEnrichment: false,
		sessionCategory: 'Details',
	});

	const handleDetailsChange = (option) => {
		setInfo((prev) => ({
			...prev,
			isDetailsOpen: !prev.isDetailsOpen,
			sessionCategory: option,
		}));
	};

	return (
		<div className="sessionInfoContainer">
			<div className="SchedulerImgContainer">
				<img
					src={
						'https://images.pexels.com/photos/8471810/pexels-photo-8471810.jpeg?auto=compress&cs=tinysrgb&w=1200'
					}
					alt="Scheduler"
				/>
			</div>
			<div className="sessionInfoDetails">
				<div className="sessionTitle">
					<span>{sessionData?.sessionName || 'session Name'}</span>
					<Dot />
				</div>

				<div className="sessionInfoSetting">
					<div className="settingRow">
						<div className="labelWithIcon">
							<Tooltip
								title="Ai-powered company insights from multiple sources"
								placement="top"
							>
								<div className="question-icon">
									<QuestionMark />
								</div>
							</Tooltip>
							<span>Data Enrichment</span>
						</div>
						<ToggleSwitch
							onChange={() =>
								setInfo((prev) => ({
									...prev,
									isDataEnrichment: !prev.isDataEnrichment,
								}))
							}
							checked={info?.isDataEnrichment}
						/>
					</div>
					<div className="settingRow">
						<span className="label">Session Category</span>
						<div className="detailsSection">
							<Tooltip
								open={info.isDetailsOpen}
								onOpenChange={() =>
									setInfo((prev) => ({
										...prev,
										isDetailsOpen: !prev.isDetailsOpen,
									}))
								}
								placement="bottom"
								title={
									<div className="details-dropdown">
										{info?.detailsOptions?.map((option) => (
											<div
												key={option}
												className="details-dropdown-item"
												onClick={() => handleDetailsChange(option)}
											>
												{option}
											</div>
										))}
									</div>
								}
								arrow={false}
								trigger={'click'}
								color={'transparent'}
								overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
							>
								<div className="details-label">
									{info?.sessionCategory}
									<Down className={`${info.isDetailsOpen ? 'open' : ''}`} />
								</div>
							</Tooltip>
						</div>
					</div>
				</div>
			</div>

			<div className="shareBtnContainer">
				<button
					className="shareBtn"
					onClick={() => {
						console.log('clicked share');
					}}
				>
					Share
				</button>
			</div>
		</div>
	);
};

export default memo(SessionInfoCard);
