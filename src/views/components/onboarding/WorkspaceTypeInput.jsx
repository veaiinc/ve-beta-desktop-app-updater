import { Tooltip } from 'antd';
import { memo } from 'react';
import WorkspaceTypeOptions from './WorkspaceTypeOptions';
import InfoToolTip from './InfoToolTip';

const workspaceTypeInfoText =
	'Describe the kind of work your team does. This helps us tailor features, agents, and suggestions for you.';

const WorkspaceTypeInput = ({
	workspaceTypeContainerOpen,
	workspaceTypeContainerWidth,
	handleSetWorkspaceType,
	handleWorkspaceTypeInput,
	workspaceType,
	setWorkspaceTypeContainerOpen,
}) => {
	return (
		<div className="workspaceTypeContainer">
			<p className="question">
				Your workspace type? <InfoToolTip text={workspaceTypeInfoText} />
			</p>
			<Tooltip
				open={workspaceTypeContainerOpen}
				trigger={[]}
				title={
					<WorkspaceTypeOptions
						width={workspaceTypeContainerWidth}
						handleSetWorkspaceType={handleSetWorkspaceType}
						searchTerm={workspaceType}
						setWorkspaceTypeContainerOpen={setWorkspaceTypeContainerOpen}
					/>
				}
				placement="bottom"
				color={'transparent'}
			>
				<div className="workspaceTypeInputContainer">
					<input
						type="text"
						placeholder="Type to search"
						className="workspaceTypeInput"
						value={workspaceType}
						onChange={handleWorkspaceTypeInput}
					/>
					{/* <div className="workspaceTypeDropdown">
										<div className="labelContainer">
											<DownArrow />
										</div>
									</div> */}
				</div>
			</Tooltip>
		</div>
	);
};

export default memo(WorkspaceTypeInput);
