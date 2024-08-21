import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const OauthVerify = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	useEffect(() => {
		const accessToken = params.get('accessToken');
		let accessibleWorkspaces = params.get('workspaceId');

		if (accessToken) {
			if (accessibleWorkspaces && accessibleWorkspaces?.length) {
				accessibleWorkspaces = accessibleWorkspaces?.split(',');
				localStorage.setItem('accessibleWorkspaces', JSON.stringify(accessibleWorkspaces));
				localStorage.setItem('workspaceId', accessibleWorkspaces?.[0]);
				localStorage.setItem('usertoken', accessToken);

				Cookies.set('usertoken', accessToken, {
					// sameSite: 'lax',
					sameSite: 'none',
					domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
				});
				Cookies.set('workspaceID', accessibleWorkspaces?.[0], {
					// sameSite: 'lax',
					sameSite: 'none',
					domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
				});

				return navigate('/sales');
			}
			if (
				!accessibleWorkspaces ||
				accessibleWorkspaces == null ||
				!accessibleWorkspaces.length
			) {
				localStorage.setItem('usertoken', accessToken);
				navigate('/create-workspace');
			}
		}
	}, [params]);
	return <div></div>;
};

export default OauthVerify;
