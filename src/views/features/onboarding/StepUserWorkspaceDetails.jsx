import React, { useState } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import { ReactComponent as GreenTick } from '../../../assets/svg/onboarding/green-tick.svg';
import { ReactComponent as DarkIcon } from '../../../assets/svg/onboarding/dark.svg';
import { ReactComponent as LightIcon } from '../../../assets/svg/onboarding/light.svg';
import { ReactComponent as UploadIcon } from '../../../assets/svg/onboarding/upload-icon.svg';
import { ReactComponent as DownArrow } from '../../../assets/svg/onboarding/down-arrow.svg';
// import { Tooltip } from 'antd';
// import ToolTipContainer from '../../components/popover/ToolTipContainer';
// import WorkspaceTypeOptions from '../../components/onboarding/WorkspaceTypeOptions';
// import Spinner from '../../components/loaders/Spinner';

const themePreferences = [
	{ id: 1, label: 'System Default', icon: null, value: 'systemDefault' },
	{ id: 2, label: 'Dark', icon: <DarkIcon />, value: 'dark' },
	{ id: 3, label: 'Light', icon: <LightIcon />, value: 'light' },
];

const StepUserWorkspaceDetails = ({ data = {}, onNext }) => {
	const [form, setForm] = useState({
		username: data.username || '',
		phoneNumber: data.phoneNumber || '',
		isPhoneNumberVerified: data.isPhoneNumberVerified || false,
		profilePicture: data.profilePicture || null,
		themePreference: data.themePreference || 'systemDefault',
		companyName: data.companyName || '',
		workspaceHandle: data.workspaceHandle || '',
		workspaceType: data.workspaceType || '',
		companyLogo: data.companyLogo || null,
		checkingWorkspaceHandle: false,
		isWorkspaceHandleAvailable: null,
		otp: '',
		otpSent: false,
		resendOtpLoading: false,
		verifyPhoneNumberLoading: false,
		verifyOtpLoader: false,
		isWorkspaceHandleLengthInvalid: true,
	});
	const [workspaceTypeContainerWidth, setWorkspaceTypeContainerWidth] = useState(0);
	const [workspaceTypeContainerOpen, setWorkspaceTypeContainerOpen] = useState(false);

	// ...handlers for all fields, similar to previous logic, omitted for brevity...

	// Validation
	const continueBtnDisabled =
		!form.username ||
		!form.isPhoneNumberVerified ||
		!form.companyName ||
		!form.workspaceHandle ||
		!form.isWorkspaceHandleAvailable ||
		!form.workspaceType;

	const handleContinue = () => {
		if (!continueBtnDisabled) {
			onNext(form);
		}
	};

	return (
		<div className="stageContainer">
			<div className="singleStage">
				<header className="header">
					<h1 className="title">Let's get started</h1>
					<h2 className="subtitle">
						Personalize your experience and create your workspace
					</h2>
				</header>
				<main className="singleStageContent">
					{/* User Details Section */}
					<div className="userDetailsSection">
						{/* ...fields for name, phone, profile picture, theme, etc... */}
						{/* ...use codebase SCSS classes and structure... */}
					</div>
					{/* Workspace Details Section */}
					<div className="workspaceDetailsSection">
						{/* ...fields for company name, handle, type, logo, etc... */}
					</div>
				</main>
			</div>
			<div className="btnsContainer">
				<button
					style={{
						opacity: continueBtnDisabled ? 0.4 : 1,
						cursor: continueBtnDisabled ? 'not-allowed' : 'pointer',
					}}
					disabled={continueBtnDisabled}
					className="continueBtn"
					onClick={handleContinue}
				>
					Continue
				</button>
			</div>
		</div>
	);
};

export default StepUserWorkspaceDetails;
