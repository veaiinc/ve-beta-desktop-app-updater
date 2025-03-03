import React, { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/scss/automation_builder/automationBuilderLayout.scss';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Helmet } from 'react-helmet';
import useAuth from '../hooks/useAuth';
import useSubscription from '../hooks/useSubscription';
import useTokenExpiry from '../hooks/useTokenExpiry';
const AutomationBuilderLayout = ({ title, children, hideQuickNav = false }) => {
	const checkAuth = useAuth();
	const data = useSubscription();
	const tokenData = useTokenExpiry();
	useEffect(() => {
		checkAuth();
	}, []);
	return (
		<div className="automationBuilderParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title} | VE</title>
			</Helmet>
			<SkeletonTheme baseColor={'#313131'} highlightColor={'#525252'}>
				<div className="childrenContainer">{children}</div>
			</SkeletonTheme>
		</div>
	);
};

export default memo(AutomationBuilderLayout);
