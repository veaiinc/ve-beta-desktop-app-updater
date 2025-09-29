import React, { memo } from 'react';
import '../../assets/scss/workflowBuilder/workflowBuilderLayout.scss';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Helmet } from 'react-helmet';
import useAuth from '../../hooks/useAuth';
import useSubscription from '../../hooks/useSubscription';
// import useTokenExpiry from '../../hooks/useTokenExpiry';
import useAccessControls from '../../hooks/useAccessControls';
import useTheme from '../../hooks/useTheme';

const WorkflowBuilderLayout = ({ title, children }) => {
	useTheme();
	useAuth();
	useSubscription();
	// useTokenExpiry();
	useAccessControls();

	return (
		<div className="workflowBuilderParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title}</title>
			</Helmet>
			<SkeletonTheme baseColor={'var(--card)'} highlightColor={'var(--card-hover)'}>
				<div className="childrenContainer">{children}</div>
			</SkeletonTheme>
		</div>
	);
};

export default memo(WorkflowBuilderLayout);
