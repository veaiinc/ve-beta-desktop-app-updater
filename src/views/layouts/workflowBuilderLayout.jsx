import React, { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/scss/workflowBuilder/workflowBuilderLayout.scss';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Helmet } from 'react-helmet';
import useAuth from '../hooks/useAuth';
import useSubscription from '../hooks/useSubscription';
import useTokenExpiry from '../hooks/useTokenExpiry';
const WorkflowBuilderLayout = ({ title, children, hideQuickNav = false }) => {
	const checkAuth = useAuth();
	const data = useSubscription();
	const tokenData = useTokenExpiry();
	useEffect(() => {
		checkAuth();
	}, []);
	return (
		<div className="workflowBuilderParentContainer">
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

export default memo(WorkflowBuilderLayout);
