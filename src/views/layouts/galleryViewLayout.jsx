import React, { memo } from 'react';
import '../../assets/scss/gallery/galleryViewLayout.scss';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Helmet } from 'react-helmet';
import { ReactComponent as VE } from '../../assets/svg/smallVe.svg';
import useAuth from '../../hooks/useAuth';
// import useTokenExpiry from '../../hooks/useTokenExpiry';
import useSubscription from '../../hooks/useSubscription';
import useAccessControls from '../../hooks/useAccessControls';
import useTheme from '../../hooks/useTheme';

const GalleryViewLayout = ({ title, children }) => {
	useTheme();
	useAuth();
	useSubscription();
	// useTokenExpiry();
	useAccessControls();

	return (
		<div className="galleryViewLayoutParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title}</title>
			</Helmet>
			<div className="galleryViewHeader">
				<VE />
			</div>
			<SkeletonTheme baseColor={'var(--card)'} highlightColor={'var(--card-hover)'}>
				<div className="childrenContainer">{children}</div>
			</SkeletonTheme>
		</div>
	);
};

export default memo(GalleryViewLayout);
