// import React, { memo, useState, useEffect } from 'react';

// const DateTimeLocation = ({ setGreeting }) => {
// 	const [currentTime, setCurrentTime] = useState(moment().format('HH:mm'));
// 	const [currentDate, setCurrentDate] = useState(moment().format('dddd Do MMM, YYYY'));
// 	const [location, setLocation] = useState('Fetching location...');

// 	useEffect(() => {
// 		const locationDetails = JSON.parse(localStorage.getItem('locationDetails'));
// 		setLocation(locationDetails?.countryRegion + ', ' + locationDetails?.country);

// 		const timer = setInterval(() => {
// 			setCurrentTime(moment().format('HH:mm'));
// 			setCurrentDate(moment().format('dddd Do MMM, YYYY'));
// 			setGreeting(getGreeting());
// 		}, 1000);

// 		return () => clearInterval(timer);
// 	}, []);

// 	return (
// 		<>
// 			<p>{currentDate}</p>
// 			<h1>{currentTime}</h1>
// 			<p>{location}</p>
// 		</>
// 	);
// };

// export default memo(DateTimeLocation);
