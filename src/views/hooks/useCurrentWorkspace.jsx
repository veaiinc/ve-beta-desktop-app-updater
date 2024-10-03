import { useContext, useMemo } from 'react';
import Context from '../../context/context';

const useCurrentWorkspaceId = () => {
	const {
		profileInfo: { userWorkSpaceList },
	} = useContext(Context);

	const workspaceId = localStorage.getItem('workspaceId');

	const workspaceIds = useMemo(() => {
		if (!userWorkSpaceList) return workspaceId;

		const tenant = userWorkSpaceList?.find((item) => item.activeWorkspaceId === workspaceId);

		if (!tenant) return workspaceId;

		const currentWorkspaceId = tenant?.workspaceIds || [workspaceId];
		return currentWorkspaceId[currentWorkspaceId.length - 1];
	}, [workspaceId, userWorkSpaceList]);

	return workspaceIds;
};

export default useCurrentWorkspaceId;
