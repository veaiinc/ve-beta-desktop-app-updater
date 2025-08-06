import { memo } from 'react';
import Spinner from '../loaders/Spinner';

const DomainInfoInput = ({
	workspaceHandle,
	checkingWorkspaceHandle,
	isWorkspaceHandleAvailable,
}) => {
	return (
		<div className="domainInfoContainer">
			{workspaceHandle?.length > 0 &&
				(workspaceHandle.length < 4 ? (
					<span className="unavailable">
						Workspace handle must be at least 4 characters
					</span>
				) : (
					<>
						<span className="domainName">{workspaceHandle}.ve.ai</span>
						{checkingWorkspaceHandle ? (
							<Spinner width="16px" height="16px" />
						) : isWorkspaceHandleAvailable ? (
							<span className="available">will be your domain</span>
						) : (
							<span className="unavailable">is already taken</span>
						)}
					</>
				))}
		</div>
	);
};

export default memo(DomainInfoInput);
