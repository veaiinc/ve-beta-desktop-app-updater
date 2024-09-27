import React, { memo } from 'react';
import { ReactComponent as FlowArrowSvg } from '../../../../assets/svg/settings/FlowArrow.svg';
import { ReactComponent as TableSvg } from '../../../../assets/svg/settings/Table.svg';
import { ReactComponent as ImagesSvg } from '../../../../assets/svg/settings/Images.svg';
import { ReactComponent as InvoiceSvg } from '../../../../assets/svg/settings/Invoice.svg';
import { ReactComponent as HandshakeSvg } from '../../../../assets/svg/settings/Handshake.svg';
import { ReactComponent as LibraryCheckSvg } from '../../../../assets/svg/settings/Library_add_check.svg';
import { ReactComponent as InsertLinkSvg } from '../../../../assets/svg/settings/Insert_link.svg';
import { ReactComponent as SubscriptionButtonSvg } from '../../../../assets/svg/settings/ArrowCross.svg';

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
				<div className="button">
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
