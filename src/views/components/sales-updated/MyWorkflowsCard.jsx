import React, { memo } from 'react';
import '../../../assets/scss/sales/MyWorkflowsCard.scss';
import ActionCards from './ActionCards';
import StatsCard from './StatsCard';
import { ReactComponent as ArrowSvg } from '../../../assets/svg/worflow_builder/smallArrow.svg';
const actionCardds = [
	{ headerText: 'Actions Required', subText: '15' },
	{ headerText: 'All Enquires', subText: '290' },
	{ headerText: 'Smart File sent', subText: '290' },
	{ headerText: 'Expired', subText: '290' },
	{ headerText: 'Success Rate', subText: '290' },
];
const statstCatsd = [
	{ headerText: 'Enquiry', subText: '11' },
	{ headerText: 'Smart File sent', subText: '290' },
	{ headerText: 'Smart Files Viewed', subText: '290' },
	{ headerText: 'Contract	Signed', subText: '290' },
	{ headerText: 'Booking Confirmed', subText: '290' },
	{ headerText: 'Proposal Expired', subText: '290' },
];
const MyWorkflowsCard = ({ data, openModal }) => {
	return (
		<div className="myWorkflowCard">
			<div className="imageContainer">
				<div className="coverImage">
					<div
						dangerouslySetInnerHTML={{
							__html: data?.templates?.[0]?.parsedHtmlContent,
						}}
						style={{ width: '100%' }}
					/>
				</div>
			</div>
			{/* content container */}
			<div className="workflowContentContainer">
				<span className="myworkflowHeader">{data?.title}</span>
				<div className="actionBtnContainer">
					{actionCardds?.map((ele, index) => (
						<ActionCards index={index} cardData={ele} onClickfunc={openModal} />
					))}
				</div>

				<div className="statsCardSuperContainer">
					{statstCatsd?.map((ele, index) => (
						<div className="statsInnerContainer" key={index}>
							<StatsCard cardsData={ele} onClickfunc={openModal} />
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
