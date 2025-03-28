import React, { memo, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/scss/automation_builder/automationBuilderLayout.scss';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Helmet } from 'react-helmet';
import useAuth from '../hooks/useAuth';
import useSubscription from '../hooks/useSubscription';
import useTokenExpiry from '../hooks/useTokenExpiry';
import Context from '../../context/context';
import RenewBanner from '../components/globalComponents/RenewBanner';
const AutomationBuilderLayout = ({ title, children, hideQuickNav = false }) => {
	const {
		subscriptionInfo: { renewBanner },
	} = useContext(Context);
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
			{renewBanner && <RenewBanner />}
			<SkeletonTheme baseColor={'var(--card)'} highlightColor={'var(--card-hover)'}>
				<div className="childrenContainer">{children}</div>
			</SkeletonTheme>
		</div>
	);
};

export default memo(AutomationBuilderLayout);
