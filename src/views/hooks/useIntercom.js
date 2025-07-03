import { useEffect } from 'react';
import Intercom from '@intercom/messenger-js-sdk';

const useIntercom = () => {
	// useEffect(() => {
	// 	if (!userDetailsData || !info) return;
	// 	Intercom('boot', {
	// 		app_id: 'vmvweabd',
	// 		user_id: userDetailsData._id,
	// 		name: `${userDetailsData.firstName} ${userDetailsData.lastName}`,
	// 		email: userDetailsData.email,
	// 		company: {
	// 			id:
	// 				info?.activeBusniessName?.activeWorkspaceId ??
	// 				localStorage.getItem('workspaceId'),
	// 			name: info?.activeBusniessName?.businessName,
	// 			region: info?.activeBusniessName?.region,
	// 		},
	// 	});
	// 	return () => {
	// 		Intercom('shutdown');
	// 	};
	// }, [userDetailsData, info]);
};

export default useIntercom;
