import React, { memo } from 'react';
import '../../../assets/scss/subscriptions/subscriptionsCard.scss';
import { ReactComponent as Tasks } from '../../../assets/svg/subscription/tasks.svg';
import { ReactComponent as Forms } from '../../../assets/svg/subscription/forms.svg';
import { ReactComponent as Invoices } from '../../../assets/svg/subscription/invoice.svg';
import { ReactComponent as Automation } from '../../../assets/svg/subscription/automation.svg';
import { ReactComponent as Contracts } from '../../../assets/svg/subscription/contract.svg';
import { ReactComponent as Proposals } from '../../../assets/svg/subscription/proposal.svg';
const data = [
	{
		icon: <Automation />,
		title: 'Workflow Automation',
	},
	{
		icon: <Forms />,
		title: 'Forms',
	},
	{
		icon: <Proposals />,
		title: 'Proposal',
	},
	{
		icon: <Invoices />,
		title: 'Invoice',
	},
	{
		icon: <Contracts />,
		title: 'Contract',
	},
	{
		icon: <Tasks />,
		title: 'Tasks',
	},
];
const subscriptionCard = () => {
	return (
		<div className="subscriptionCardContainer">
			<div className="subscriptionCardHeaderContainer">
				<div className="subscriptionHeaderContent">
					<span className="subscriptionHeaderTitle">Purple pack</span>
					<span className="subscriptionHeaderSubTitle">
						Build and enhance your business with AI , Personalised guidance{' '}
					</span>
				</div>
				<div className="pricingContainer">
					<span className="pricingText">$35</span>
					<span className="monthText">/ month</span>
				</div>
			</div>
			<div className="subscriptionChoosebtn">Choose plan</div>
			<div className="subscriptionFooterContainer">
				{data?.map((ele, index) => (
					<div className="subscriptionfeaturesDiv" key={index}>
						{ele?.icon}
						<span className="featureTitle">{ele?.title}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(subscriptionCard);
