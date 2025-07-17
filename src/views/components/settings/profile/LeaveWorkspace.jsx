import React, { memo, useCallback, useState } from 'react';
import LeaveWorkspaceModal from '../../modalsV2/settings/ai_setup/LeaveWorkspaceModal';
import { ReactComponent as Signout } from '../../../../assets/svg/signOut.svg';

const LeaveWorkspaceComponent = () => {
	const [info, setInfo] = useState({
		leaveWorskapceModal: false,
	});

	const closeLeaveWorkspaceModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, leaveWorskapceModal: false }));
	}, []);

	return (
		<div className={'accessContainer'}>
			<div className={'leaveComponent'}>
				<h4>Do you want to leave your workspace?</h4>
				<p>
					When you leave your workspace, your work will be lost, and your team will be
					notified. Select a workspace you would like to leave
				</p>
				<button
					className="button button-cancel"
					onClick={() => setInfo((prev) => ({ ...prev, leaveWorskapceModal: true }))}
					style={{ cursor: 'pointer' }}
				>
					<Signout /> Leave workspace
				</button>
			</div>
			<LeaveWorkspaceModal
				isOpen={info?.leaveWorskapceModal}
				toggleModal={closeLeaveWorkspaceModal}
			/>
		</div>
	);
};
export default memo(LeaveWorkspaceComponent);
