import React, { useEffect, memo, useContext } from 'react';
import '../../assets/scss/authWrapper.scss';
import { Helmet } from 'react-helmet';
import useActiveWorkspace from '../hooks/useActiveWorkspace';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Sidebar from '../components/sidebar/Sidebar';
import useAuth from '../hooks/useAuth';
import useSubscription from '../hooks/useSubscription';
import useTokenExpiry from '../hooks/useTokenExpiry';
import BottomToolbar from '../components/ai_agents/BottomToolbar';
import useAccessControls from '../hooks/useAcessControls';
import RenewBanner from '../components/globalComponents/RenewBanner';
import Context from '../../context/context';
const AuthWrapper = ({
	title,
	children,
	maxWidth = '',
	showBottomToolbar = true,
	outerContainerStyle = {},
	authParentContainerStyle = {},
}) => {
	const {
		subscriptionInfo: { renewBanner },
	} = useContext(Context);
	const [workspaceId, setActiveWorkspaceId] = useActiveWorkspace();

	const checkAuth = useAuth();
	const data = useSubscription();
	const tokenData = useTokenExpiry();
	const accessControls = useAccessControls();
	useEffect(() => {
		checkAuth();
	}, []);

	return (
		<div className="authParentContainer" style={{ ...(authParentContainerStyle || {}) }}>
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title} | VE</title>
			</Helmet>
			{renewBanner && <RenewBanner />}
			<div
				style={{
					display: 'flex',
					height: '100vh',
					padding: '60px 0 0 32px',
					...outerContainerStyle,
				}}
			>
				<SkeletonTheme baseColor={'#313131'} highlightColor={'#525252'}>
					<Sidebar
						setActiveWorkspaceId={setActiveWorkspaceId}
						activeWorkspaceId={workspaceId}
					/>

					<div
						style={{ flex: 1, overflowY: 'auto', maxHeight: '100%', height: '100%' }}
						id="scrollableTarget"
					>
						<div className="childrenContainer" style={{ maxWidth: maxWidth || '' }}>
							{children}
						</div>
					</div>
				</SkeletonTheme>
			</div>
			{showBottomToolbar ? <BottomToolbar outerContainerStyle={{ bottom: '10px' }} /> : ''}
		</div>
	);
};

export default memo(AuthWrapper);
