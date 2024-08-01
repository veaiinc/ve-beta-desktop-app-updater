import React, { memo } from 'react';
import '../../../assets/scss/sales/MyWorkflowsCard.scss';
import ActionCards from './ActionCards';
import StatsCard from './StatsCard';
import { ReactComponent as ArrowSvg } from '../../../assets/svg/worflow_builder/smallArrow.svg';
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
						<div className="statsInnerContainer" key={index}>
							<StatsCard />
							{statstCatsd?.length - 2 > index ? (
								<ArrowSvg />
							) : index < statstCatsd?.length - 1 ? (
								<div className="innerSeperator">
									<div className="verticalSeperator"></div>
								</div>
							) : (
								''
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default memo(MyWorkflowsCard);
