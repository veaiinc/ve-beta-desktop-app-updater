import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { fetchDomainName } from '../../../../helpers';
import './oauthVerify.scss';
import Spinner from '../../../components/loaders/Spinner';

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

		if (accessToken) {
			if (
				accessibleWorkspaces &&
				accessibleWorkspaces?.workspaceId &&
				accessibleWorkspaces?.isOnboard !== undefined &&
				accessibleWorkspaces?.workspaceId !== undefined
			) {
				localStorage.setItem('workspaceId', accessibleWorkspaces?.workspaceId);
				localStorage.setItem('usertoken', accessToken);
				localStorage.setItem('region', accessibleWorkspaces?.region || 'us-east-1');
				localStorage.setItem('isOnboard', accessibleWorkspaces?.isOnboard);
				const host = fetchDomainName();
				Cookies.set('usertoken', accessToken, {
					sameSite: 'lax',
					domain: host,
				});
				Cookies.set('workspaceId', accessibleWorkspaces?.workspaceId, {
					sameSite: 'lax',
					domain: host,
				});
				Cookies.set('region', accessibleWorkspaces?.region || 'us-east-1', {
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
				localStorage.setItem('region', accessibleWorkspaces?.region || 'us-east-1');
				const host = fetchDomainName();
				Cookies.set('usertoken', accessToken, {
					sameSite: 'lax',
					domain: host,
				});
				Cookies.set('region', accessibleWorkspaces?.region || 'us-east-1', {
					sameSite: 'lax',
					domain: host,
				});

				navigate('/onboarding');
				return;
			}
		}
	}, [params]);

	return (
		<div className="oauth-verify">
			<div className="oauth-verify__container">
				<div className="oauth-verify__status">Setting up your workspace...</div>

				<div className="oauth-verify__loading">
					<Spinner
						width="18px"
						height="18px"
						color="var(--primary-button)"
						borderTopColor="transparent"
						borderWidth={1.5}
					/>
				</div>

				<div className="oauth-verify__message">Please wait while we redirect you...</div>
			</div>
		</div>
	);
};

export default OauthVerify;
