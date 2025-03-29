import { memo, useState } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import Spinner from '../loaders/Spinner';
// import { ReactComponent as DownArrow } from '../../../assets/svg/onboarding/down-arrow.svg';
// import WorkspaceTypeOptions from './WorkspaceTypeOptions';
import { ReactComponent as UploadIcon } from '../../../assets/svg/onboarding/upload-icon.svg';

const Stage2 = ({
	companyName,
	workspaceHandle,
	companyLogo,
	handleSetCompanyName,
	handleSetCompanyLogo,
	checkingWorkspaceHandle,
	isWorkspaceHandleAvailable,
	workspaceType,
	handleSetWorkspaceType,
}) => {
	// const [info, setInfo] = useState({
	// 	showDropdown: false,
	// });

	// const toggleDropdown = () => {
	// 	setInfo((prev) => ({
	// 		...prev,
	// 		showDropdown: !prev?.showDropdown,
	// 	}));
	// };

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
						<div className="companyLogoInputContainer">
							<label htmlFor="companyLogoInput">
								<input
									id="companyLogoInput"
									type="file"
									accept="image/*"
									onChange={handleSetCompanyLogo}
									className="companyLogoInput"
								/>
								{companyLogo ? (
									<img
										className="companyLogo"
										src={companyLogo}
										alt="Company Logo"
									/>
								) : (
									<UploadIcon />
								)}
							</label>
						</div>
					</div>

					<div className="domainInfoContainer">
						{workspaceHandle?.length > 1 && (
							<>
								<span className="domainName">{workspaceHandle}.ve.ai</span>
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
					<input
						type="text"
						placeholder="Company Type"
						className="workspaceTypeInput"
						value={workspaceType}
						onChange={handleSetWorkspaceType}
					/>
					{/* <div className="dropdown">
						<div className="labelContainer" onClick={toggleDropdown}>
							<span className="dropdownText">Please Select</span>
							<DownArrow />
						</div>
						{info?.showDropdown && <WorkspaceTypeOptions />}
					</div> */}
				</div>
			</main>
		</div>
	);
};

export default memo(Stage2);
