import React from 'react';
import '../../../assets/scss/CompanySettings/planBilling.scss';
import ProgressBar from './ProgressBar';

const CompanyPlanBilling = () => {
	const noOfDay = 7;
	const expiresDate = '12 December 2024';
	const period = 'On Trial Plan';
	const AiCredits = '300';
	let progressBar = 50;
	const GB = 1;
	const usedGB = 3;

	return (
		<div className="companyPlanBillingContianer">
			<div className="companyPlanBilling">
				<div className="companyPlan">
					<h1>Your Plan</h1>
					<div className="expireDetailsContainer ">
						<div className="expireDetails">
							<p>
								Trial Plan expires in {noOfDay} days on : {expiresDate}
							</p>
							<button>Subscribe Now</button>
						</div>
						<div className="subscriptionDetailsContainer">
							<h2>your subscription details:</h2>
							<div className="subscriptionDetails">
								<div className="CRMcontainer">
									<p>CRM</p>
									<div className="CRMstatusContainer">
										<h3>
											Unlimited number of Lead Forms, Proposals & Templates
											and Projects. Manage Payments and Expenses and invite
											Unlimited team members with access controls for each
											team member.
										</h3>
										<p>
											Status : <span>{period}</span>
										</p>
									</div>
								</div>
								<div className="GALLERIEScontainer">
									<p>GALLERIES</p>
									<div className="storageContainer">
										<h3>
											Unlimited number of Galleries, Face scans & Guest
											registrations (with AI). No limit on number of Photos
											uploaded or Albums created. Clients & photographer, both
											can download original size photos, with no limit on
											number of downloads.
										</h3>
										<p>
											Storage : <span>{GB}</span> GB of <span>{usedGB}</span>{' '}
											GB
										</p>
										<ProgressBar progress={progressBar} />
									</div>
								</div>
								<div className="AIcontainer">
									<p>AI CREDITS</p>
									<div className="AiCredits">
										<h3>
											AI Credits enable you to use feature of face scans &
											Guest registrations for quick photo delivery to your
											event guests. AI Credits do not have a expiry date.
										</h3>
										<p>
											AI Credits remaining : <span>{AiCredits}</span>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="billingHistoryContainer">
					<h1>Billing History</h1>
					<div></div>
				</div>
			</div>
		</div>
	);
};

export default CompanyPlanBilling;
