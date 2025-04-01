import { memo } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import Spinner from '../loaders/Spinner';
import { ReactComponent as DownArrow } from '../../../assets/svg/onboarding/down-arrow.svg';
import WorkspaceTypeOptions from './WorkspaceTypeOptions';
import { ReactComponent as UploadIcon } from '../../../assets/svg/onboarding/upload-icon.svg';
import { Tooltip } from 'antd';
import ToolTipContainer from '../popover/ToolTipContainer';
import { customContainerStyle, contentStyling } from './UserDetailsForm';

const WorkspaceDetailsForm = ({
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
	return (
		<div className="stage2">
			<header className="header">
				<h1 className="title">Create a new workspace</h1>
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
						<Tooltip
							title={
								<ToolTipContainer
									customContainerStyle={customContainerStyle}
									contentStyling={contentStyling}
									title={''}
									content={'Upload your company logo'}
									removeClassName={true}
								/>
							}
							arrow={true}
							color={'var(--card)'}
						>
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
						</Tooltip>
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
					<Tooltip
						trigger={'click'}
						title={
							<WorkspaceTypeOptions
								handleSetWorkspaceType={handleSetWorkspaceType}
								searchTerm={workspaceType}
							/>
						}
						placement="bottom"
						color={'transparent'}
					>
						<div className="workspaceTypeInputContainer">
							<input
								type="text"
								placeholder="Company Type"
								className="workspaceTypeInput"
								value={workspaceType}
								onChange={handleSetWorkspaceType}
							/>
							<div className="workspaceTypeDropdown">
								<div className="labelContainer">
									<DownArrow />
								</div>
							</div>
						</div>
					</Tooltip>
				</div>
			</main>
		</div>
	);
};

export default memo(WorkspaceDetailsForm);
