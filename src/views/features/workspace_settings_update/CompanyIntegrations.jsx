import React from 'react';
import google from '../../../assets/images/companySettings/google.svg';
import meta from '../../../assets/images/companySettings/meta.svg';
import stripe from '../../../assets/images/companySettings/stripe.svg';
import '../../../assets/scss/CompanySettings/integrations.scss';
import Line from './Line';

const ComapanyIntegrations = () => {
	return (
		<div className="companyIntegrationsMainContainer">
			<div className="companyIntegrationsContainer">
				<h1 className="title">Integrations</h1>
				<div className="integrationsTypes">
					<div className="integrationContainer">
						<div className="imageContainer">
							<img src={meta} alt="meta" />
							<div className="textContainer">
								<h1>Meta Leads</h1>
								<p>Integrate your Facebook Suite</p>
							</div>
						</div>
						<button>Connect</button>
					</div>
					<Line />
					<div className="integrationContainer">
						<div className="imageContainer">
							<img src={google} alt="google" />
							<div className="textContainer">
								<h1>Google Integration</h1>
								<p>Sync your Google Account</p>
							</div>
						</div>
						<button>Connect</button>
					</div>
					<Line />
					<div className="integrationContainer">
						<div className="imageContainer">
							<img src={stripe} alt="stripe" />
							<div className="textContainer">
								<h1>Stripe Integration</h1>
								<p>Sync Stripe to your account for all your payments</p>
							</div>
						</div>
						<button>Connect</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ComapanyIntegrations;
