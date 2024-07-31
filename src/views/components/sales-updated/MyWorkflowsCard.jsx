import React from 'react';
import '../../../assets/scss/sales/MyWorkflowsCard.scss';
import ActionCards from './ActionCards';
import StatsCard from './StatsCard';
const MyWorkflowsCard = () => {
	const actionCardds = [
		{ headerText: 'All Enquires', subText: '290' },
		{ headerText: 'Smart File sent', subText: '290' },
		{ headerText: 'Expired', subText: '290' },
		{ headerText: 'All Enquires', subText: '290' },
		{ headerText: 'All Enquires', subText: '290' },
	];
	const statstCatsd = [
		{ headerText: 'All Enquires', subText: '290' },
		{ headerText: 'Smart File sent', subText: '290' },
		{ headerText: 'Expired', subText: '290' },
		{ headerText: 'All Enquires', subText: '290' },
		{ headerText: 'All Enquires', subText: '290' },
	];
	return (
		<div className="myWorkflowCard">
			<div className="workflowView"></div>
			{/* content container */}
			<div className="workflowContentContainer">
				<span className="myworkflowHeader">
					Comprehensive Wedding Photography Business Solution
				</span>
				<div className="actionBtnContainer">
					{actionCardds?.map((ele, index) => (
						<ActionCards index={index} />
					))}
				</div>

				<div className="statsCardSuperContainer">
					{statstCatsd?.map((ele, index) => (
						<StatsCard />
					))}
				</div>
			</div>
		</div>
	);
};

export default MyWorkflowsCard;
