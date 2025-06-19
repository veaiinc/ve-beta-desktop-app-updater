import { useContext, useEffect, useState } from 'react';
import Context from '../../context/context';

const useWorkspaceMode = () => {
	const [info, setInfo] = useState({
		workspaceMode: 'stable',
		workspaceModeList: null,
		loading: false,
		error: false,
	});

	const {
		profileInfo: { userWorkSpaceList, getUserWorkSpaceList },
	} = useContext(Context);

	const fetchWorkspaceModes = async (workspaceId) => {
		if (info.loading) return;
		setInfo((prev) => ({ ...prev, loading: true }));
		try {
			if (userWorkSpaceList !== null) {
				const workspaceModeList = userWorkSpaceList.reduce((workspaceMode, workspace) => {
					workspaceMode[workspace.activeWorkspaceId] = workspace.workspaceMode;
					return workspaceMode;
				}, {});
				const workspaceMode = workspaceModeList[workspaceId];
				setInfo((prev) => ({
					...prev,
					workspaceMode,
					workspaceModeList,
				}));
				return;
			}
			const response = await getUserWorkSpaceList();
			const success = response[0];
			if (success) {
				const workspaceList = response[1];
				const workspaceModeList = workspaceList.reduce((workspaceMode, workspace) => {
					workspaceMode[workspace.activeWorkspaceId] = workspace.workspaceMode;
					return workspaceMode;
				}, {});
				const workspaceMode = workspaceModeList[workspaceId];
				setInfo((prev) => ({
					...prev,
					workspaceMode,
					workspaceModeList,
				}));
			}
		} catch (error) {
			setInfo((prev) => ({
				...prev,
				error,
			}));
		}
		setInfo((prev) => ({ ...prev, loading: false }));
	};

	useEffect(() => {
		const workspaceId = localStorage.getItem('workspaceId');
		fetchWorkspaceModes(workspaceId);
	}, []);

	return info;
};

export default useWorkspaceMode;
