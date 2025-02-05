import React, { memo, useState } from 'react';
import '../../../assets/scss/ai_assistant/aichatlogs.scss';
import { ReactComponent as DownArrow } from '../../../assets/svg/activity/down.svg';
import { ReactComponent as Export } from '../../../assets/svg/gallery/download2.svg';
import { ReactComponent as Refresh } from '../../../assets/svg/sidebar/Refresh.svg';
import { Tooltip } from 'antd';

const AiChatLogs = ({ assistant }) => {
	const [info, setInfo] = useState({
		isSourceDropdownOpen: false,
		sourceOptions: ['All', 'Playground', 'Slack', 'Workflows'],
		isFeedbackDropdownOpen: false,
		feedbackOptions: ['All', 'Contains Thumbs up', 'Contains Thumbs down'],
		isConfidenceScoreDropdownOpen: false,
	});
	return (
		<div className="aiChatLogsParentContainer">
			<div className="aiChatLogsContainer">
				<div className="aiChatLogsHeaderContainer">
					<div className="leftActionBtnContainer">
						{/* Date */}
						<div className="chatLogsActionBtn">
							Date <DownArrow />
						</div>

						{/* Source */}
						<Tooltip
							open={info?.isSourceDropdownOpen}
							onOpenChange={() =>
								setInfo({
									...info,
									isSourceDropdownOpen: !info?.isSourceDropdownOpen,
								})
							}
							placement="bottom"
							title={
								<div className="actions-dropdown">
									{info?.sourceOptions?.map((option) => (
										<div
											key={option}
											className="actions-dropdown-item"
											onClick={() => {
												setInfo({
													...info,
													isSourceDropdownOpen: false,
												});
											}}
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
							<div className="chatLogsActionBtn">
								Source <DownArrow />
							</div>
						</Tooltip>

						{/* Feedback */}
						<Tooltip
							open={info?.isFeedbackDropdownOpen}
							onOpenChange={() =>
								setInfo({
									...info,
									isFeedbackDropdownOpen: !info?.isFeedbackDropdownOpen,
								})
							}
							placement="bottom"
							title={
								<div className="actions-dropdown">
									{info?.feedbackOptions?.map((option) => (
										<div
											key={option}
											className="actions-dropdown-item"
											onClick={() => {
												setInfo({
													...info,
													isFeedbackDropdownOpen: false,
												});
											}}
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
							<div className="chatLogsActionBtn">
								Feedback <DownArrow />
							</div>
						</Tooltip>

						{/* Confidence Score */}
						<div className="chatLogsActionBtn">
							Confidence Score <DownArrow />
						</div>
					</div>
					<div className="rightActionBtnContainer">
						<div className="chatLogsActionBtn">
							Refresh <Refresh />
						</div>
						<div className="chatLogsActionBtn">
							Export <Export />
						</div>
					</div>
				</div>

				<div className="aiChatLogsBodyContainer">
					<div className="chatListContainer">
						<div className="chat">chat details goes here</div>
						<div className="chat">chat details goes here</div>
						<div className="chat">chat details goes here</div>
						<div className="chat">chat details goes here</div>
					</div>
					<div className="chatContentContainer">chat body goes here</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AiChatLogs);
