import React, { useState } from 'react';
import '../../../assets/scss/sales/workFlowStatsCard.scss';
import SampleWorkflowImage from '../../../assets/images/workflow-sample-image.png';
import { ReactComponent as RightArrow } from '../../../assets/svg/right-arrow.svg';
import Modal from '../modals';

const _ = require('lodash');

function MyWorkFlowStatsCard({ hideImage, workflow, index, inSights }) {
	const [isModalOpen, setModalOpen] = useState(false);

	const handleSendClick = (event) => {
		event.preventDefault();
		setModalOpen(true);
	};

	return (
		<>
			<a href={`/sales/${workflow._id}`}>
				<div className="workflowContainer" index={index}>
					{hideImage ? (
						''
					) : (
						<div className="imageContainer">
							<div
								className="coverImage"
								style={{ backgroundImage: `url(${workflow.displayImageURL})` }}
							></div>
							<div className="description">
								<p>{workflow.title}</p>
								<span>Edit</span>
							</div>
						</div>
					)}
					<div className="workflowStats">
						<div className="statsheader">
							<div className="modules">
								<p>Proposals</p>
								<RightArrow />
								<p>Summary</p>
							</div>
							<div className="actionButton" onClick={handleSendClick}>
								<p>+ Send</p>
							</div>
						</div>

						<div className="statsContainer">
							<div className="statBox">
								<p className="statsTitle">DRAFT</p>
								<p className="statsValue">
									{inSights && inSights.status.draft ? inSights.status.draft : 0}
								</p>
							</div>
							<div className="statBox">
								<p className="statsTitle">SENT</p>
								<p className="statsValue">
									{inSights && inSights.status.sent ? inSights.status.sent : 0}
								</p>
							</div>
							<div className="statBox">
								<p className="statsTitle">ACCEPTED</p>
								<p className="statsValue">
									{inSights && inSights.status.accepted
										? inSights.status.accepted
										: 0}
								</p>
							</div>
							<div className="statBox">
								<p className="statsTitle">REJECTED</p>
								<p className="statsValue">
									{inSights && inSights.status.rejected
										? inSights.status.rejected
										: 0}
								</p>
							</div>
							<div className="statBox">
								<p className="statsTitle">EXPIRED</p>
								<p className="statsValue">
									{inSights && inSights.status.expired
										? inSights.status.expired
										: 0}
								</p>
							</div>
						</div>
					</div>
				</div>
			</a>
			<Modal handleClose={() => setModalOpen(false)} show={isModalOpen} modalType={'center'}>
				<p>Hello 1212</p>
			</Modal>
		</>
	);
}

export default MyWorkFlowStatsCard;
