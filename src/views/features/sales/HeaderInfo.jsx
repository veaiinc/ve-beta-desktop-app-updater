import React, { memo, useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../../context/context';
import { getGreeting } from '../../../helpers';
import moment from 'moment';

const HeaderInfo = () => {
	const [headerInfo, setHeaderInfo] = useState({
		greeting: getGreeting(),
		currentTime: moment().format('HH:mm'),
		currentDate: moment().format('dddd Do MMM, YYYY'),
		location: 'Fetching location...',
	});

	let {
		profileInfo: { userDetailsData },
	} = useContext(Context);

	useEffect(() => {
		const timer = setInterval(updateHeaderInfo, 1000);
		const locationDetails = JSON.parse(localStorage.getItem('locationDetails'));
		setHeaderInfo((prevState) => ({
			...prevState,
			location: locationDetails?.countryRegion + ', ' + locationDetails?.country,
		}));

		return () => clearInterval(timer);
	}, []);

	const updateHeaderInfo = useCallback(() => {
		setHeaderInfo((prevState) => ({
			...prevState,
			greeting: getGreeting(),
			currentTime: moment().format('HH:mm'),
			currentDate: moment().format('dddd Do MMM, YYYY'),
		}));
	}, []);

	return (
		<div>
			<div className="left-content">
				<p>Hey, {userDetailsData?.firstName || 'User'}!</p>
				<h1>{headerInfo.greeting} 😃</h1>
			</div>
			<div className="right-content">
				<p>{headerInfo.currentDate}</p>
				<h1>{headerInfo.currentTime}</h1>
				<p>{headerInfo.location}</p>
			</div>
		</div>
	);
};

export default memo(HeaderInfo);
