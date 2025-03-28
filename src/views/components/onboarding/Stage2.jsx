import { memo, useState } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import Spinner from '../loaders/Spinner';
import { ReactComponent as DownArrow } from '../../../assets/svg/onboarding/down-arrow.svg';
import WorkspaceTypeOptions from './WorkspaceTypeOptions';

const Stage2 = ({
	companyName,
	companyLogo,
	handleSetCompanyName,
	handleSetCompanyLogo,
	checkingWorkspaceHandle,
	isWorkspaceHandleAvailable,
}) => {
	const [info, setInfo] = useState({
		showDropdown: false,
	});

	const toggleDropdown = () => {
		setInfo((prev) => ({
			...prev,
			showDropdown: !prev?.showDropdown,
		}));
	};

	return (
		<div className="stage2">
			<header className="header">
				<h1 className="title">Create a shared workspace</h1>
				<h2 className="subtitle">A home for your team</h2>
			</header>
			<main className="stage2Content">
				<div className="companyNameContainer">
					<p className="question">What is the name of your company or team?</p>
					<div className="companyNameAndLogoInputs">
						<input
							className="companyNameInput"
							type="text"
							placeholder="Company Name"
							value={companyName}
							onChange={handleSetCompanyName}
							autoFocus
						/>
						<label htmlFor="companyLogoInput">
							<input
								id="companyLogoInput"
								type="file"
								accept="image/*"
								onChange={handleSetCompanyLogo}
								className="companyLogoInput"
							/>
							{companyLogo ? (
								<div className="companyLogoContainer">
									<img
										className="companyLogo"
										src={companyLogo}
										alt="Company Logo"
									/>
								</div>
							) : (
								<span className="companyLogoLabel">Upload Logo</span>
							)}
						</label>
					</div>

					<div className="domainInfoContainer">
						{companyName?.length > 1 && (
							<>
								<span className="domainName">{companyName}@ve.ai</span>
								{checkingWorkspaceHandle ? (
									<Spinner width="16px" height="16px" />
								) : isWorkspaceHandleAvailable === true ? (
									<span className="available"> will be your domain</span>
								) : isWorkspaceHandleAvailable === false ? (
									<span className="unavailable"> is already taken</span>
								) : null}
							</>
						)}
					</div>
				</div>
				<div className="workspaceTypeContainer">
					<p className="question">What is your company type?</p>
					<div className="dropdown">
						<div className="labelContainer" onClick={toggleDropdown}>
							<span className="dropdownText">Please Select</span>
							<DownArrow />
						</div>
						{info?.showDropdown && <WorkspaceTypeOptions />}
					</div>
				</div>
			</main>
		</div>
	);
};

export default memo(Stage2);
