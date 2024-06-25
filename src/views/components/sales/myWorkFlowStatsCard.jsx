import React from 'react';
import '../../../assets/scss/sales/workFlowStatsCard.scss';
import SampleWorkflowImage from '../../../assets/images/workflow-sample-image.png';
import { ReactComponent as RightArrow } from '../../../assets/svg/right-arrow.svg';

function MyWorkFlowStatsCard(props) {
	return (
		<div className="workflowContainer">
			<div className="imageContainer">
				<div
					className="coverImage"
					style={{ backgroundImage: `url(${SampleWorkflowImage})` }}
				></div>
				<div className="description">
					<p>Workflow Title</p>
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
						<p className="statsTitle">SENT</p>
						<p className="statsValue">12</p>
					</div>
					<div className="statBox">
						<p className="statsTitle">SENT</p>
						<p className="statsValue">12</p>
					</div>
					<div className="statBox">
						<p className="statsTitle">SENT</p>
						<p className="statsValue">12</p>
					</div>
					<div className="statBox">
						<p className="statsTitle">SENT</p>
						<p className="statsValue">12</p>
					</div>
					<div className="statBox">
						<p className="statsTitle">SENT</p>
						<p className="statsValue">12</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MyWorkFlowStatsCard;
