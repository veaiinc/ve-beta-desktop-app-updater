import React from 'react';
import '../../../assets/scss/sales/workFlowStatsCard.scss';
import SampleWorkflowImage from '../../../assets/images/workflow-sample-image.png';
import { ReactComponent as RightArrow } from '../../../assets/svg/right-arrow.svg';
const _ = require('lodash');

function MyWorkFlowStatsCard({ workflow, index, inSights }) {
	return (
		<a href={`/sales/${workflow._id}`}>
			<div className="workflowContainer" index={index}>
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
				<div className="workflowStats">
					<div className="statsheader">
						<div className="modules">
							<p>Proposals</p>
							<RightArrow />
							<p>Summary</p>
						</div>
						<div className="actionButton">
							<p>+ Send</p>
						</div>
					</div>

					<div className="statsContainer">
						<div className="statBox">
							<p className="statsTitle">DRAFT</p>
							<p className="statsValue">10</p>
						</div>
						<div className="statBox">
							<p className="statsTitle">SENT</p>
							<p className="statsValue">12</p>
						</div>
						<div className="statBox">
							<p className="statsTitle">ACCEPTED</p>
							<p className="statsValue">12</p>
						</div>
						<div className="statBox">
							<p className="statsTitle">REJECTED</p>
							<p className="statsValue">12</p>
						</div>
						<div className="statBox">
							<p className="statsTitle">EXPIRED</p>
							<p className="statsValue">12</p>
						</div>
					</div>
				</div>
			</div>
		</a>
	);
}

export default MyWorkFlowStatsCard;
