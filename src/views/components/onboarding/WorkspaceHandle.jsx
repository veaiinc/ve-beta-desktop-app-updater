// import { Tooltip } from 'antd';
import { memo } from 'react';
import DomainInfo from './DomainInfo';
// import ToolTipContainer from '../popover/ToolTipContainer';
import InfoToolTip from './InfoToolTip';

const workspaceHandleInfoText = 'any sharable links will be using this sub domain';
const WorkspaceHandle = ({
	companyName,
	handleSetCompanyName,
	workspaceHandle,
	checkingWorkspaceHandle,
	isWorkspaceHandleAvailable,
	customContainerStyle,
	contentStyling,
	handleSetCompanyLogo,
}) => {
	return (
		<div className="companyNameContainer">
			<p className="question">
				What's the name of your company or business?{' '}
				<InfoToolTip text={workspaceHandleInfoText} />
			</p>
			<div className="companyNameAndLogoInputs">
				<input
					className="companyNameInput"
					type="text"
					placeholder="Company Name"
					value={companyName}
					onChange={handleSetCompanyName}
				/>
				{/* <Tooltip
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
							{info?.companyLogo ? (
                    <img
                        className="companyLogo"
                        src={info?.companyLogo}
                        alt="Company Logo"
                    />
                ) : (
                    <UploadIcon />
                )}
						</label>
					</div>
				</Tooltip> */}
			</div>
			<DomainInfo
				workspaceHandle={workspaceHandle}
				checkingWorkspaceHandle={checkingWorkspaceHandle}
				isWorkspaceHandleAvailable={isWorkspaceHandleAvailable}
			/>
		</div>
	);
};

export default memo(WorkspaceHandle);
