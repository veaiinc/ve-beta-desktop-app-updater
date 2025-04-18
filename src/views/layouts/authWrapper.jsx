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
import CommandKSearch from '../components/commandKSearch/CommandKSearch';
import { createPortal } from 'react-dom';
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
	const worspaceId = ['swaroop', 'veai', 'bhee'];
	const [openSearchModal, setOpenSearchModal] = useState(false);

	const handleCloseSearchModal = () => {
		setOpenSearchModal(false);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			setOpenSearchModal((prev) => !prev);
		}
		if (e.key === 'Escape') {
			handleCloseSearchModal();
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<div className="authParentContainer" style={{ ...(authParentContainerStyle || {}) }}>
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title} | VE</title>
			</Helmet>
			{renewBanner && <RenewBanner />}
			{worspaceId.includes(workspaceId) && <DynamicWidget />}
			{openSearchModal && createPortal(<CommandKSearch />, document.body)}
			<div
				style={{
					display: 'flex',
					height: renewBanner ? 'calc(100dvh - 41px)' : '100dvh',
					padding: '32px 32px 0 32px',
					...outerContainerStyle,
				}}
			>
				<SkeletonTheme baseColor={'var(--card)'} highlightColor={'var(--card-hover)'}>
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
			{/* {showBottomToolbar ? <BottomToolbar outerContainerStyle={{ bottom: '10px' }} /> : ''} */}
		</div>
	);
};

export default memo(AuthWrapper);
