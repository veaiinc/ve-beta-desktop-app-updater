import React, { memo, useContext, useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import '../../../assets/scss/subscriptions/index.scss';
import SubscriptionCard from '../../components/subscription/subscriptionCard';
import { ReactComponent as BackArrowSvg } from '../../../assets/svg/subscription/back.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const Subscription = () => {
	const checkAuth = useAuth();
	const navigate = useNavigate();

	let {
		subscriptionInfo: { getAllSubscriptionPlan, subscriptionPlans, getAllCoupons },
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: true,
		plans: null,
	});

	//useEffects
	useEffect(() => {
		checkAuth();
		getAllSubscriptionPlan();
		getAllCoupons();
	}, []);

	useEffect(() => {
		if (subscriptionPlans) {
			setInfo((prev) => ({ ...prev, loading: false, plans: subscriptionPlans }));
		}
	}, [subscriptionPlans]);

	return (
		<div className="subscriptionParentContainer">
			<div className="planCardsContainer">
				{info?.loading
					? [{}, {}, {}]?.map((ele, index) => (
							<SkeletonTheme
								baseColor={'#313131'}
								highlightColor={'#525252'}
								key={index}
							>
								<Skeleton
									width={'300px'}
									height={'394px'}
									style={{ borderRadius: '14px' }}
								/>
							</SkeletonTheme>
					  ))
					: info?.plans?.map((ele, index) => (
							<SubscriptionCard key={index} planData={ele} />
					  ))}
			</div>
			<div className="gobackBtn" onClick={() => navigate(-1)}>
				<BackArrowSvg />
				Go back
			</div>
		</div>
	);
};
export default memo(Subscription);
