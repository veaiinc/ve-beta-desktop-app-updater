import React, { memo, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/scss/workflowBuilder/workflowBuilderLayout.scss';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Helmet } from 'react-helmet';
import useAuth from '../hooks/useAuth';
import useSubscription from '../hooks/useSubscription';
import useTokenExpiry from '../hooks/useTokenExpiry';
import useAccessControls from '../hooks/useAcessControls';
import Context from '../../context/context';
import RenewBanner from '../components/globalComponents/RenewBanner';
const WorkflowBuilderLayout = ({ title, children, hideQuickNav = false }) => {
	const {
		subscriptionInfo: { renewBanner },
	} = useContext(Context);
	const checkAuth = useAuth();
	const data = useSubscription();
	const tokenData = useTokenExpiry();
	const accessControls = useAccessControls();
	useEffect(() => {
		checkAuth();
	}, []);
	return (
		<div className="workflowBuilderParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title} | VE</title>
			</Helmet>
			{renewBanner && <RenewBanner />}
			<SkeletonTheme baseColor={'var(--card)'} highlightColor={'var(--card-hover)'}>
				<div className="childrenContainer">{children}</div>
			</SkeletonTheme>
		</div>
	);
};

export default memo(WorkflowBuilderLayout);
