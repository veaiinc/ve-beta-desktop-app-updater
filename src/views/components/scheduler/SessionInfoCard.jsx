import React, { memo, useState } from 'react';
import { ReactComponent as Dot } from '../../../assets/svg/gallery/threeDots.svg';
import { ReactComponent as QuestionMark } from '../../../assets/svg/ai_assistant/question.svg';
import { ReactComponent as Down } from '../../../assets/svg/calendar/down.svg';
import ToggleSwitch from '../input/slider';
import { Tooltip } from 'antd';
import '../../../assets/scss/scheduler/editScheduler.scss';
import Spinner from '../loaders/Spinner';

const SessionInfoCard = ({ sessionData, onUpdate, isUpdating }) => {
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
			{/* <div className="SchedulerImgContainer">
				<img
					src={
						'https://images.pexels.com/photos/8471810/pexels-photo-8471810.jpeg?auto=compress&cs=tinysrgb&w=1200'
					}
					alt="Scheduler"
				/>
			</div> */}
			<div className="sessionInfoDetails">
				<div className="sessionTitle">
					<div className="sessionTitleLeft">
						<span className="editSession">Edit Session</span>
						<span className="scheduler">Scheduler</span>
					</div>
					<div className="sessionTitleRight">
						{/* <span>{sessionData?.sessionName || 'session Name'}</span> */}
						{/* <Dot /> */}
						<div
							className={`updateButton ${isUpdating ? 'updating' : ''}`}
							onClick={onUpdate}
						>
							{isUpdating ? (
								<>
									<Spinner width="16px" height="16px" />
									Updating...
								</>
							) : (
								'Update and publish'
							)}
						</div>
					</div>
				</div>

				<div className="sessionInfoSetting">
					{/* <div className="settingRow">
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
					</div> */}
					<div className="settingRow">
						<span className="sessionTitleLabel">Session Title</span>
						<span className="sessionTitle">{sessionData?.sessionName}</span>
						<div className="divider-line"></div>
						{/* <div className="detailsSection">
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
						</div> */}
					</div>
				</div>
			</div>

			<div className="shareBtnContainer">
				{/* <button
					className="shareBtn"
					onClick={() => {
						console.log('clicked share');
					}}
				>
					Share
				</button> */}
			</div>
		</div>
	);
};

export default memo(SessionInfoCard);
