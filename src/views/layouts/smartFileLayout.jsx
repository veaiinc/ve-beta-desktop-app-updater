import React, { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/scss/sales/smartFileLayout.scss';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Helmet } from 'react-helmet';
import { ReactComponent as VE } from '../../assets/svg/smallVe.svg';
const SmartFileLayout = ({ title, children, hideQuickNav = false }) => {
	const navigate = useNavigate();
	useEffect(() => {
		if (!localStorage.getItem('usertoken')) {
			return navigate('/');
		}
	}, [navigate]);
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
		</div>
	);
};

export default memo(SmartFileLayout);
