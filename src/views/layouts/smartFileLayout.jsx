import React, { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/scss/sales/smartFileLayout.scss';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Helmet } from 'react-helmet';
import { ReactComponent as VE } from '../../assets/svg/smallVe.svg';
import useAuth from '../hooks/useAuth';
import useSubscription from '../hooks/useSubscription';
import useTokenExpiry from '../hooks/useTokenExpiry';
import BottomToolbar from '../components/ai_agents/BottomToolbar';
const SmartFileLayout = ({ title, children, hideQuickNav = false, showBottomToolbar = true }) => {
	const checkAuth = useAuth();
	// const data = useSubscription();
	const tokenData = useTokenExpiry();
	useEffect(() => {
		checkAuth();
	}, []);
	return (
		<div className="smartFileLayoutParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title} | VE</title>
			</Helmet>
			<div className="smartFileHeader">
				<VE />
			</div>
			<SkeletonTheme baseColor={'#313131'} highlightColor={'#525252'}>
				<div className="childrenContainer">{children}</div>
			</SkeletonTheme>

			{showBottomToolbar ? <BottomToolbar outerContainerStyle={{ bottom: '10px' }} /> : ''}
		</div>
	);
};

export default memo(SmartFileLayout);
