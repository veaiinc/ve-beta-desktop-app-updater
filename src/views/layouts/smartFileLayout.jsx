import React, { memo } from 'react';
import '../../assets/scss/sales/smartFileLayout.scss';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Helmet } from 'react-helmet';
import { ReactComponent as VE } from '../../assets/svg/smallVe.svg';
import useAuth from '../../hooks/useAuth';
import useSubscription from '../../hooks/useSubscription';
// 	import useTokenExpiry from '../../hooks/useTokenExpiry';
import BottomToolbar from '../components/ai_agents/BottomToolbar';
import useAccessControls from '../../hooks/useAccessControls';
import useTheme from '../../hooks/useTheme';

const SmartFileLayout = ({ title, children, hideQuickNav = false, showBottomToolbar = true }) => {
	useTheme();
	useAuth();
	useSubscription();
	// useTokenExpiry();
	useAccessControls();

	return (
		<div className="smartFileLayoutParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title}</title>
			</Helmet>
			<div className="smartFileHeader">
				<VE />
			</div>
			<SkeletonTheme baseColor={'var(--card)'} highlightColor={'var(--card-hover)'}>
				<div className="childrenContainer">{children}</div>
			</SkeletonTheme>

			{showBottomToolbar ? <BottomToolbar outerContainerStyle={{ bottom: '10px' }} /> : ''}
		</div>
	);
};

export default memo(SmartFileLayout);
