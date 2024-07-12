import React, { memo } from 'react';
import '../../../assets/scss/sales/workFlowStatsCard.scss';
import { ReactComponent as MoreOptions } from '../../../assets/svg/more-options-dots.svg';
import { ReactComponent as RightArrow } from '../../../assets/svg/right-arrow.svg';
import { useNavigate } from 'react-router-dom';

const _ = require('lodash');

const MyWorkFlowStatsCard = ({
	hideImage,
	workflow,
	index,
	inSights,
	singleCard = false,
	activeTab = 'draft',
	openModal,
	source = null,
}) => {
	const navigate = useNavigate();

	const statsBox = (label, value, active = false) => {
		return (
			<div className={`statBox ${active ? 'statBox-active' : ''}`}>
				<p className="statsValue">{value}</p>
				<p className="statsTitle">{label}</p>
			</div>
		);
	};

	const StatsCard = () => {
		return (
			<div
				className="workflowContainer"
				index={index}
				onClick={() => navigate(`/sales/${workflow?._id}`, { state: { data: workflow } })}
			>
				{hideImage ? (
					''
				) : (
					<div className="imageContainer">
						<div className="coverImage">
							<div
								dangerouslySetInnerHTML={{
									__html: workflow?.templates?.[0]?.parsedHtmlContent,
								}}
								style={{ width: '100%' }}
							/>
						</div>
					</div>
				)}
				<div className="workflowStats">
					<div className="statsheader">
						<div className="modules">
							{workflow?.moduleTemplates?.map((ele) => (
								<>
									<p style={{ textTransform: 'capitalize' }}>{ele?.module}</p>
									<RightArrow />
								</>
							))}
							<p>Summary</p>
						</div>
						<div
							className="actionButton"
							onClick={!source ? openModal : (e) => openModal(e, workflow)}
						>
							<p>+ Add Lead</p>
						</div>
						<div className="moreOptionsContainer">
							<MoreOptions />
						</div>
					</div>

					<div className="statsContainer">
						{singleCard ? (
							<div
							// href={`/sales/${workflow?._id}?status=draft`}
							>
								{statsBox(
									'DRAFT',
									inSights && inSights?.status?.draft
										? inSights?.status?.draft
										: 0,
									activeTab === 'draft' ? true : false,
								)}
							</div>
						) : (
							statsBox(
								'DRAFT',
								inSights && inSights?.status?.draft ? inSights?.status?.draft : 0,
							)
						)}
						{singleCard ? (
							<a
							// href={`/sales/${workflow?._id}?status=sent`}
							>
								{statsBox(
									'SENT',
									inSights && inSights?.status?.sent ? inSights?.status?.sent : 0,
									activeTab === 'sent' ? true : false,
								)}
							</a>
						) : (
							statsBox(
								'SENT',
								inSights && inSights?.status?.sent ? inSights?.status?.sent : 0,
							)
						)}
						{singleCard ? (
							<a
							// href={`/sales/${workflow?._id}?status=accepted`}
							>
								{statsBox(
									'ACCEPTED',
									inSights && inSights?.status?.accepted
										? inSights?.status?.accepted
										: 0,
									activeTab === 'accepted' ? true : false,
								)}
							</a>
						) : (
							statsBox(
								'ACCEPTED',
								inSights && inSights?.status?.accepted
									? inSights?.status?.accepted
									: 0,
							)
						)}
						{singleCard ? (
							<a
							// href={`/sales/${workflow?._id}?status=rejected`}
							>
								{statsBox(
									'REJECTED',
									inSights && inSights?.status?.rejected
										? inSights?.status?.rejected
										: 0,
									activeTab === 'rejected' ? true : false,
								)}
							</a>
						) : (
							statsBox(
								'REJECTED',
								inSights && inSights?.status?.rejected
									? inSights?.status?.rejected
									: 0,
							)
						)}

						{singleCard ? (
							<a
							// href={`/sales/${workflow?._id}?status=expired`}
							>
								{statsBox(
									'EXPIRED',
									inSights && inSights?.status?.expired
										? inSights?.status?.expired
										: 0,
									activeTab === 'expired' ? true : false,
								)}
							</a>
						) : (
							statsBox(
								'EXPIRED',
								inSights && inSights?.status?.expired
									? inSights?.status?.expired
									: 0,
							)
						)}
					</div>
					{singleCard ? (
						''
					) : (
						<>
							<div className="statsheader">
								{/* <div className="modules">
									<p>Workflow Stats</p>
								</div> */}
							</div>
							<div className="workflowStatsValues">
								<div style={{ padding: '0rem 10rem' }}></div>
							</div>
						</>
					)}
				</div>
			</div>
		);
	};

	return (
		<>
			{singleCard ? (
				<StatsCard />
			) : (
				<a href={`/sales/${workflow?._id}`}>
					<p></p>
					<StatsCard />
				</a>
			)}
		</>
	);
};

export default memo(MyWorkFlowStatsCard);
