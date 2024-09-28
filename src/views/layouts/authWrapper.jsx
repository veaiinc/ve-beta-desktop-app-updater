import React, { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/scss/authWrapper.scss';
import Header from '../components/Header';
import { Helmet } from 'react-helmet';
import useActiveWorkspace from '../hooks/useActiveWorkspace';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Footer from '../components/Footer';
import useAuth from '../hooks/useAuth';
const AuthWrapper = ({ title, children, hideQuickNav = false }) => {
	const checkAuth = useAuth();
	const [workspaceId, setActiveWorkspaceId] = useActiveWorkspace();

	useEffect(() => {
		checkAuth();
	}, []);

	return (
		<div className="authParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title} | VE</title>
			</Helmet>

			<Header
				title={title}
				hideQuickNav={hideQuickNav}
				setActiveWorkspaceId={setActiveWorkspaceId}
				activeWorkspaceId={workspaceId}
			/>
			<SkeletonTheme baseColor={'#313131'} highlightColor={'#525252'}>
				<div className="childrenContainer">{children}</div>
			</SkeletonTheme>
			<Footer />
		</div>
	);
};

export default memo(AuthWrapper);
