import React, { useEffect, memo } from 'react';
import '../../assets/scss/templatesWrapper.scss';
import { Helmet } from 'react-helmet';
import useActiveWorkspace from '../hooks/useActiveWorkspace';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Sidebar from '../components/sidebar/Sidebar';
import useAuth from '../hooks/useAuth';
import useSubscription from '../hooks/useSubscription';
import useTokenExpiry from '../hooks/useTokenExpiry';

const TemplatesWrapper = ({ title, children, maxWidth = '' }) => {
	const [workspaceId, setActiveWorkspaceId] = useActiveWorkspace();

	const customStyles = {
		// backgroundColor: 'transparent',
		// backdropFilter: 'blur(10px)',
		// border: '1px solid rgba(255, 255, 255, 0.20)',
		// boxShadow: 'none',
		// '&.sidebarComponent': {
		// 	backgroundColor: 'transparent !important',
		// },
	};

	const checkAuth = useAuth();
	// const data = useSubscription();
	const tokenData = useTokenExpiry();

	useEffect(() => {
		checkAuth();
	}, []);

	return (
		<div className="templatesParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title} | VE</title>
			</Helmet>

			<div
				style={{
					display: 'flex',
					height: '100vh',
					padding: '60px 0px 0px 32px',
				}}
			>
				<SkeletonTheme
					baseColor={'rgba(255, 255, 255, 0.05)'}
					highlightColor={'rgba(255, 255, 255, 0.05)'}
				>
					<Sidebar
						setActiveWorkspaceId={setActiveWorkspaceId}
						activeWorkspaceId={workspaceId}
						customStyles={customStyles}
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
		</div>
	);
};

export default memo(TemplatesWrapper);
