import React, { memo, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
import '../../assets/scss/gallery/galleryViewLayout.scss';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Helmet } from 'react-helmet';
import { ReactComponent as VE } from '../../assets/svg/smallVe.svg';
import useAuth from '../../hooks/useAuth';
import useTokenExpiry from '../../hooks/useTokenExpiry';
import useSubscription from '../../hooks/useSubscription';
import useAccessControls from '../../hooks/useAccessControls';
import useTheme from '../../hooks/useTheme';
// import Context from '../../context/context';
// import RenewBanner from '../components/globalComponents/RenewBanner';
const GalleryViewLayout = ({ title, children }) => {
	// const {
	// 	subscriptionInfo: { renewBanner },
	// } = useContext(Context);
	useTheme();
	const checkAuth = useAuth();
	useSubscription();
	const tokenData = useTokenExpiry();
	const accessControls = useAccessControls();
	useEffect(() => {
		checkAuth();
	}, []);
	return (
		<div className="galleryViewLayoutParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title}</title>
			</Helmet>
			<div className="galleryViewHeader">
				<VE />
			</div>
			{/* {renewBanner && <RenewBanner />} */}
			<SkeletonTheme baseColor={'var(--card)'} highlightColor={'var(--card-hover)'}>
				<div className="childrenContainer">{children}</div>
			</SkeletonTheme>
		</div>
	);
};

export default memo(GalleryViewLayout);
