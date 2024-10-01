import React, { useEffect, memo } from 'react';
import '../../assets/scss/authWrapper.scss';
import { Helmet } from 'react-helmet';
import useActiveWorkspace from '../hooks/useActiveWorkspace';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Sidebar from '../components/sidebar/Sidebar';
import useAuth from '../hooks/useAuth';

const AuthWrapper = ({ title, children }) => {
	const [workspaceId, setActiveWorkspaceId] = useActiveWorkspace();

	const checkAuth = useAuth();

	useEffect(() => {
		checkAuth();
	}, []);

	return (
		<div className="authParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title} | VE</title>
			</Helmet>

			<div
				style={{
					display: 'flex',
					height: '100vh',
					overflowY: 'auto',
					padding: '60px 0 0 32px',
				}}
			>
				<Sidebar
					setActiveWorkspaceId={setActiveWorkspaceId}
					activeWorkspaceId={workspaceId}
				/>

				<SkeletonTheme baseColor={'#313131'} highlightColor={'#525252'}>
					<div style={{ flex: 1, overflowY: 'auto', maxHeight: '100%', height: '100%' }}>
						<div className="childrenContainer">{children}</div>
					</div>
				</SkeletonTheme>
			</div>
		</div>
	);
};

export default memo(AuthWrapper);
