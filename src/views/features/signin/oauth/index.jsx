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
		accessibleWorkspaces = decodeURIComponent(accessibleWorkspaces);
		accessibleWorkspaces = JSON.parse(accessibleWorkspaces);

		let region = params.get('region');

		if (accessToken) {
			if (accessibleWorkspaces && accessibleWorkspaces?.length) {
				localStorage.setItem('accessibleWorkspaces', JSON.stringify(accessibleWorkspaces));
				localStorage.setItem('workspaceId', accessibleWorkspaces?.[0]?.workspaceId);
				localStorage.setItem('usertoken', accessToken);
				localStorage.setItem('region', region || 'ap-south-1');
				localStorage.setItem('isOnboard', accessibleWorkspaces?.[0]?.isOnboard);

				Cookies.set('usertoken', accessToken, {
					sameSite: 'lax',
					domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
				});
				Cookies.set('workspaceID', accessibleWorkspaces?.[0]?.workspaceId, {
					sameSite: 'lax',
					domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
				});
				Cookies.set('region', region || 'ap-south-1', {
					sameSite: 'lax',
					domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
				});
				// localStorage.removeItem('locationDetails');
				return navigate('/home');
			}
			if (
				!accessibleWorkspaces ||
				accessibleWorkspaces == null ||
				!accessibleWorkspaces.length
			) {
				localStorage.setItem('usertoken', accessToken);
				navigate('/create-workspace');
				return;
			}
		}
	}, [params]);
	return <div></div>;
};

export default OauthVerify;
