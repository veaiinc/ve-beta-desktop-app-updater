import React, { memo, useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import '../../../assets/scss/subscriptions/index.scss';
import SubscriptionCard from '../../components/subscription/subscriptionCard';
import { ReactComponent as BackArrowSvg } from '../../../assets/svg/subscription/back.svg';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
	const checkAuth = useAuth();
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		loading: true,
		subscritptionPlans: [{}, {}, {}],
	});

	//useEffects
	useEffect(() => {
		checkAuth();
	}, []);

	return (
		<div className="subscriptionParentContainer">
			<div className="planCardsContainer">
				{info?.subscritptionPlans?.map((ele, index) => (
					<SubscriptionCard key={index} />
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
