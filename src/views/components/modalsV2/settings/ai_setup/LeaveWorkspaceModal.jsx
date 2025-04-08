import React, { memo, useCallback, useEffect, useState } from 'react';
import ReactModal from '../../';
import '../../../../../assets/scss/settings/leaveWorkspaceModal.scss';
import { Spin } from 'antd';
import { useContext } from 'react';
import Context from '../../../../../context/context';
import useLogout from '../../../../hooks/useLogout';
import Cookies from 'js-cookie';
import { fetchDomainName } from '../../../../../helpers';
const LeaveWorkspaceModal = ({ isOpen, toggleModal }) => {
	const {
		templates: { leaveWorkspace },
		profileInfo: { userWorkSpaceList, getUserWorkSpaceList },
	} = useContext(Context);

	const logoutFunc = useLogout();
	const [info, setInfo] = useState({
		deleteLoader: false,
	});

	useEffect(() => {
		if (!userWorkSpaceList) {
			getUserWorkSpaceList();
		}
	}, [userWorkSpaceList]);

	const leaveWorksapaceClickHanlder = useCallback(async () => {
		if (info?.deleteLoader) {
			return;
		}
		setInfo((prev) => ({ ...prev, deleteLoader: true }));
		const response = await leaveWorkspace();
		if (response?.[0]) {
			if (userWorkSpaceList?.length < 2) {
				return logoutFunc();
			} else {
				const currentWorkspaceId = localStorage.getItem('workspaceId');
				for (let i = 0; i < userWorkSpaceList?.length; i++) {
					if (userWorkSpaceList?.[i]?.activeWorkspaceId !== currentWorkspaceId) {
						const { activeWorkspaceId, isOnboard } = userWorkSpaceList?.[i];
						localStorage.setItem('workspaceId', activeWorkspaceId);
						localStorage.setItem('isOnboard', isOnboard);
						const host = fetchDomainName();
						Cookies.set('workspaceID', activeWorkspaceId, {
							sameSite: 'lax',
							domain: host,
						});
						window.location.reload();
					}
				}
			}
		}
		setInfo((prev) => ({ ...prev, deleteLoader: false }));
	}, [userWorkSpaceList]);

	return (
		<ReactModal isOpen={isOpen} closeModal={toggleModal}>
			<div className="leaveWorkspaceParentContainer">
				<div className="dialog-content">
					<div className="dialog-header">
						<h2 className="dialog-title">Do you want to leave your workspace?</h2>
						<p className="dialog-description">
							When you leave your workspace, your work will be lost, and your team
							will be notified.You will be either moved to next available workspace or
							logged out.
						</p>
					</div>
					{!info?.deleteLoader ? (
						<div className="dialog-footer">
							<button className="button button-cancel" onClick={toggleModal}>
								Cancel
							</button>
							<button
								className="button button-leave"
								onClick={leaveWorksapaceClickHanlder}
							>
								Leave Workspace
							</button>
						</div>
					) : (
						<div className="dialog-footer">
							<Spin />
						</div>
					)}
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(LeaveWorkspaceModal);
