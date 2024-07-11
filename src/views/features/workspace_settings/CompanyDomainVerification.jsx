import React, { useState } from 'react';
import InputForModules from '../../components/input/inputForModules';
import '../../../assets/scss/CompanySettings/domainVerification.scss';
const CompanyDomainVerification = () => {
	const [domainName, setDomainName] = useState('');
	const handleChange = (e) => {
		setDomainName(e.target.value);
	};
	return (
		<div className="domainVerificationMainContainer">
			<div className="verificationContainer">
				<h1>Verify your Domain</h1>
				<div className="domainInputContainer">
					<InputForModules
						label={'Your Domain'}
						placeholder={'Type here..'}
						type={'text'}
						value={domainName}
						name={'domainName'}
						onChange={handleChange}
						isError={false}
						errorMessage={''}
					/>
					<div className="domainButtonsContianer">
						<button>DKIM</button>
						<button>SPF</button>
						<button>DMARC</button>
					</div>
					<p>
						Your domain is currently unverified. Get started by adding DKIM, SPF and
						DMARC records below.
					</p>
					<button>Verify Now</button>
				</div>
			</div>
		</div>
	);
};

export default CompanyDomainVerification;
