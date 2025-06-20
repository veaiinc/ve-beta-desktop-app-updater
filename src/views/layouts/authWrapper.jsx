import { useEffect, memo, useContext, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import useActiveWorkspace from '../hooks/useActiveWorkspace';
import Sidebar from '../components/sidebar/Sidebar';
import useAuth from '../hooks/useAuth';
import useSubscription from '../hooks/useSubscription';
import useTokenExpiry from '../hooks/useTokenExpiry';

import useAccessControls from '../hooks/useAccessControls';
import CommandKSearch from '../components/commandKSearch/CommandKSearch';
import Spinner from '../components/loaders/Spinner';

import '../../assets/scss/authWrapper.scss';

const AuthWrapper = ({
	title,
	children,
	maxWidth = '',
	showBottomToolbar = true,
	outerContainerStyle = {},
	authParentContainerStyle = {},
	sidebarContainerStyles = {},
	showDynamicWidget = true,
	sidebarContainerClassName = '',
	childrenContainerStyles = {},
	showSidebar = true,
}) => {
	// const {
	// 	subscriptionInfo: { renewBanner },
	// } = useContext(Context);
	const [workspaceId, setActiveWorkspaceId] = useActiveWorkspace();
	const location = useLocation();
	const checkAuth = useAuth();
	const data = useSubscription();
	const tokenData = useTokenExpiry();
	const accessControls = useAccessControls();

	useEffect(() => {
		checkAuth();
	}, []);
	// const workspaceIds = ['swaroop', 'veai', 'bhee'];

	return (
		<main className="main-container">
			{/* {renewBanner && <RenewBanner />} */}
			<div className="authParentContainer" style={{ ...(authParentContainerStyle || {}) }}>
				<Helmet>
					<meta charSet="utf-8" />
					<title>{title}</title>
				</Helmet>
				{/* {workspaceIds?.includes(workspaceId) && !location?.pathname?.includes('/chat') && (
					<DynamicWidget />
				)} */}
				<div
					style={{
						display: 'flex',
						// height: renewBanner ? 'calc(100dvh - 57px)' : '100dvh',
						height: '100dvh',
						padding: '0',
						...outerContainerStyle,
					}}
					className="auth-wrapper-container"
				>
					<SkeletonTheme baseColor={'var(--card)'} highlightColor={'var(--card-hover)'}>
						{showSidebar && (
							<div
								style={{
									...sidebarContainerStyles,
									height: 'fit-content',
									position: 'relative',
									padding: '0',
									margin: '0',
								}}
								className={sidebarContainerClassName}
							>
								<Sidebar
									setActiveWorkspaceId={setActiveWorkspaceId}
									activeWorkspaceId={workspaceId}
								/>
							</div>
						)}

						<div
							style={{
								flex: 1,
								overflowY: 'auto',
								maxHeight: '100%',
								height: '100%',
								padding: ' 0',
							}}
							id="scrollableTarget"
						>
							<div
								className="childrenContainer"
								style={{ maxWidth: maxWidth || '', ...childrenContainerStyles }}
							>
								{children}
							</div>
						</div>
					</SkeletonTheme>
				</div>
				{/* {showBottomToolbar ? <BottomToolbar outerContainerStyle={{ bottom: '10px' }} /> : ''} */}
				{/* <CommandKSearch /> */}
			</div>
		</main>
	);
};

export default memo(AuthWrapper);
