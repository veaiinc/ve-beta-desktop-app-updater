import React, { memo, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/scss/gallery/galleryViewLayout.scss';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Helmet } from 'react-helmet';
import { ReactComponent as VE } from '../../assets/svg/smallVe.svg';
import useAuth from '../hooks/useAuth';
import useTokenExpiry from '../hooks/useTokenExpiry';
import useSubscription from '../hooks/useSubscription';
import useAccessControls from '../hooks/useAcessControls';
import Context from '../../context/context';
import RenewBanner from '../components/globalComponents/RenewBanner';
const GalleryViewLayout = ({ title, children }) => {
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
		<div className="galleryViewLayoutParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title} | VE</title>
			</Helmet>
			<div className="galleryViewHeader">
				<VE />
			</div>
			{renewBanner && <RenewBanner />}
			<SkeletonTheme baseColor={'#313131'} highlightColor={'#525252'}>
				<div className="childrenContainer">{children}</div>
			</SkeletonTheme>
		</div>
	);
};

export default memo(GalleryViewLayout);
