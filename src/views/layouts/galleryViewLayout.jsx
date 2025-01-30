import React, { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/scss/gallery/galleryViewLayout.scss';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Helmet } from 'react-helmet';
import { ReactComponent as VE } from '../../assets/svg/smallVe.svg';
import useAuth from '../hooks/useAuth';
import useTokenExpiry from '../hooks/useTokenExpiry';
import { useSubscription } from '@apollo/client';

const GalleryViewLayout = ({ title, children }) => {
	const checkAuth = useAuth();
	// const data = useSubscription();
	const tokenData = useTokenExpiry();
	useEffect(() => {
		checkAuth();
	}, []);
	return (
		<div className="galleryViewLayoutParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title} | VE</title>
			</Helmet>
			<div className="galleryViewHeader">
				<VE />
			</div>
			<SkeletonTheme baseColor={'#313131'} highlightColor={'#525252'}>
				<div className="childrenContainer">{children}</div>
			</SkeletonTheme>
		</div>
	);
};

export default memo(GalleryViewLayout);
