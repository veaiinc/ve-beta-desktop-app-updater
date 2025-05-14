import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { fetchDomainName } from '../../../../helpers';

const OauthVerify = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	useEffect(() => {
		const accessToken = params.get('accessToken');
		let accessibleWorkspaces = params.get('workspaceId');
		accessibleWorkspaces = decodeURIComponent(accessibleWorkspaces);
		if (accessibleWorkspaces !== undefined || accessibleWorkspaces !== 'undefined') {
			accessibleWorkspaces = JSON.parse(accessibleWorkspaces);
		}
		let region = params.get('region');

		if (accessToken) {
			if (
				accessibleWorkspaces &&
				accessibleWorkspaces?.workspaceId &&
				accessibleWorkspaces?.isOnboard !== undefined &&
				accessibleWorkspaces?.workspaceId !== undefined
			) {
				localStorage.setItem('workspaceId', accessibleWorkspaces?.workspaceId);
				localStorage.setItem('usertoken', accessToken);
				localStorage.setItem('region', region || 'ap-south-1');
				localStorage.setItem('isOnboard', accessibleWorkspaces?.isOnboard);
				const host = fetchDomainName();
				Cookies.set('usertoken', accessToken, {
					sameSite: 'lax',
					domain: host,
				});
				Cookies.set('workspaceID', accessibleWorkspaces?.workspaceId, {
					sameSite: 'lax',
					domain: host,
				});
				Cookies.set('region', region || 'ap-south-1', {
					sameSite: 'lax',
					domain: host,
				});

				return navigate('/home');
			}
			if (
				!accessibleWorkspaces ||
				accessibleWorkspaces == null ||
				!accessibleWorkspaces.length ||
				accessibleWorkspaces === 'undefined'
			) {
				localStorage.setItem('usertoken', accessToken);
				localStorage.setItem('region', region || 'ap-south-1');
				const host = fetchDomainName();
				Cookies.set('usertoken', accessToken, {
					sameSite: 'lax',
					domain: host,
				});
				Cookies.set('region', region || 'ap-south-1', {
					sameSite: 'lax',
					domain: host,
				});

				navigate('/onboarding');
				return;
			}
		}
	}, [params]);
	return <div></div>;
};

export default OauthVerify;
