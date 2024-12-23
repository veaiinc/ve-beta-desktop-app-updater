import React, { memo, useState } from 'react';
import '../../../../assets/scss/ai_agents/agentsWorkflows.scss';
import { ReactComponent as Link } from '../../../../assets/svg/ai_agents/link.svg';
import { ReactComponent as Edit } from '../../../../assets/svg/ai_agents/edit.svg';
import StatsCard from '../../sales/StatsCard';
import { ReactComponent as ArrowSvg } from '../../../../assets/svg/worflow_builder/smallArrow.svg';
const AgentsWorkflows = () => {
	const [info, setInfo] = useState({
		AgentsWorkflows: [{}, {}, {}],
		statstCards: [
			{
				headerText: 'Enquiry',
				subText: 3,
				status: 'enquiry',
				type: 'statstCards',
				modalHeader: 'Enquiry',
			},
			{
				headerText: 'Smart File sent',
				subText: 1,
				status: 'filesSent',
				type: 'statstCards',
				modalHeader: 'Smart File sent',
			},
			{
				headerText: 'Smart Files Viewed',
				subText: 2,
				status: 'filesViewed',
				type: 'statstCards',
				modalHeader: 'Smart Files Viewed',
			},
			{
				headerText: 'Contract Signed',
				subText: 0,
				status: 'contractSigned',
				type: 'statstCards',
				modalHeader: 'Contract Signed',
			},
			{
				headerText: 'Booking Confirmed',
				subText: 1,
				status: 'confirmed',
				type: 'statstCards',
				modalHeader: 'Booking Confirmed',
			},
		],
	});
	return (
		<div className="agentsWorkflowsParentContainer">
			{/* //agentsWorkflowsCards */}
			{info?.AgentsWorkflows?.map((ele, index) => (
				<div className="agentWorkflowsCards" key={index}>
					<div className="agentWorkflowsCardHeader">
						<span className="agentWorkflowCardTitle">Workflow name - {index + 1}</span>
						<div className="agentWorkflowsCardHeaderActionsContainer">
							<span className="agentWorkflowsCardHeaderActionsButtons">
								<Link />
								Copy link
							</span>
							<span className="agentWorkflowsCardHeaderActionsButtons">
								<Edit />
								Edit Workflow
							</span>
						</div>
					</div>
					<div className="statsCardSuperContainer">
						{info?.statstCards?.map((ele, index) => (
							<div className="statsInnerContainer" key={index}>
								<StatsCard cardsData={ele} onClickfunc={() => {}} />
								{info?.statstCards?.length - 2 > index ? (
									<ArrowSvg />
								) : index < info?.statstCards?.length - 1 ? (
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
			))}
		</div>
	);
};

export default memo(AgentsWorkflows);
