import React, { memo } from 'react';
import { ReactComponent as FlowArrowSvg } from '../../../../assets/svg/Settings/FlowArrow.svg';
import { ReactComponent as TableSvg } from '../../../../assets/svg/Settings/Table.svg';
import { ReactComponent as ImagesSvg } from '../../../../assets/svg/Settings/Images.svg';
import { ReactComponent as InvoiceSvg } from '../../../../assets/svg/Settings/Invoice.svg';
import { ReactComponent as HandshakeSvg } from '../../../../assets/svg/Settings/Handshake.svg';
import { ReactComponent as LibraryCheckSvg } from '../../../../assets/svg/Settings/Library_add_check.svg';
import { ReactComponent as InsertLinkSvg } from '../../../../assets/svg/Settings/Insert_link.svg';
import { ReactComponent as SubscriptionButtonSvg } from '../../../../assets/svg/Settings/ArrowCross.svg';
import { useNavigate } from 'react-router-dom';

const PlansList = [
	{ label: 'Workflow Automations', icon: <FlowArrowSvg /> },
	{ label: 'Form Responses', icon: <TableSvg /> },
	{ label: 'Proposals', icon: <ImagesSvg /> },
	{ label: 'Invoices', icon: <InvoiceSvg /> },
	{ label: 'Contracts', icon: <HandshakeSvg /> },
	{ label: 'Tasks', icon: <LibraryCheckSvg /> },
	{ label: 'Link in Bio', icon: <InsertLinkSvg /> },
];
const SubscriptionDetailsComponent = () => {
	const navigate = useNavigate();
	return (
		<div className="subscriptionDiv">
			<div className="title">
				<h1>Your Subscription Details</h1>
			</div>

			<div className="planDetailsContainer">
				<div className="pricingDiv">
					<h3>FREE PLAN</h3>
					<h1>
						$0
						<br />
						<p>per month</p>
					</h1>
				</div>

				<div className="lineDiv"></div>

				<div className="subcriptionListDiv">
					{PlansList.map((item, index) => (
						<div className="singleListDetails" key={index}>
							<div>{item?.icon}</div>
							<p>{item?.label}</p>
						</div>
					))}
				</div>
			</div>

			<div className="upgradSubscriptionButton">
				<div className="button" onClick={() => navigate('/subscription')}>
					<p>Upgrade Subscription</p>

					<div className="circleDiv">
						<SubscriptionButtonSvg />
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(SubscriptionDetailsComponent);
