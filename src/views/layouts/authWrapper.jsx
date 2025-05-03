import React, { useEffect, memo, useContext, useRef, useState } from 'react';
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
import DynamicWidget from '../features/DynamicWidget/dynamicWidget';
import { useLocation } from 'react-router-dom';
import CommandKSearch from '../components/commandKSearch/CommandKSearch';

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
}) => {
	const {
		subscriptionInfo: { renewBanner },
	} = useContext(Context);
	const [workspaceId, setActiveWorkspaceId] = useActiveWorkspace();
	const location = useLocation();
	const checkAuth = useAuth();
	const data = useSubscription();
	const tokenData = useTokenExpiry();
	const accessControls = useAccessControls();
	useEffect(() => {
		checkAuth();
	}, []);
	const worspaceId = ['swaroop', 'veai', 'bhee'];

	return (
		<main className="main-container">
			{renewBanner && <RenewBanner />}
			<div
				className="authParentContainer"
				style={{ ...(authParentContainerStyle || {}) }}
			>
				<Helmet>
					<meta charSet="utf-8" />
					<title>{title}</title>
				</Helmet>

				{worspaceId.includes(workspaceId) && !location.pathname.includes('/chat') && (
					<DynamicWidget />
				)}
				<div
					style={{
						display: 'flex',
						height: renewBanner ? 'calc(100dvh - 57px)' : '100dvh',
						padding: '32px 32px 0',
						...outerContainerStyle,
					}}
				>
					<SkeletonTheme baseColor={'var(--card)'} highlightColor={'var(--card-hover)'}>
						<div
							style={{
								...sidebarContainerStyles,
								height: 'fit-content',
								position: 'relative',
							}}
							className={sidebarContainerClassName}
						>
							<Sidebar
								setActiveWorkspaceId={setActiveWorkspaceId}
								activeWorkspaceId={workspaceId}
							/>
						</div>

						<div
							style={{
								flex: 1,
								overflowY: 'auto',
								maxHeight: '100%',
								height: '100%',
							}}
							id="scrollableTarget"
						>
							<div className="childrenContainer" style={{ maxWidth: maxWidth || '' }}>
								{children}
							</div>
						</div>
					</SkeletonTheme>
				</div>
				{/* {showBottomToolbar ? <BottomToolbar outerContainerStyle={{ bottom: '10px' }} /> : ''} */}
				<CommandKSearch />
			</div>
		</main>
	);
};

export default memo(AuthWrapper);
