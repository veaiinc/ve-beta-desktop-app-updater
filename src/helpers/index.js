import Spinner from '../views/components/loaders/Spinner';
import axios from 'axios';

export const nameShortner = (name) => {
	let newName = name?.split(' ');
	let str = '';
	str += newName?.[0]?.[0] + (newName?.[1]?.[0] ? newName?.[1]?.[0] : '');
	return str?.toUpperCase();
};

export const FetchMoreLoaderComp = () => {
	return (
		<h4
			style={{
				display: 'flex',
				gap: '12px',
				color: '#fff',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Spinner width={'12px'} height={'12px'} />
			Fetching More...
		</h4>
	);
};

export const getLocationsDetails = async () => {
	const response = await axios.get('https://ipapi.co/json/');
	const { country_code, region_code, region, country_name, city, timezone, postal, currency } =
		response?.data;
	const locationDetails = {
		countryCode: country_code,
		countryRegionCode: region_code,
		countryRegion: region,
		country: country_name,
		city,
		timezone,
		postalCode: postal,
		currency,
	};

	let apiRegion;
	// Dynamic origin selection based on country/region
	if (country_code === 'IN') {
		// Route Indian traffic to ap-south-1
		apiRegion = 'ap-south-1';
	} else if (country_code === 'US') {
		if (region_code === 'CA' || region_code === 'OR' || region_code === 'WA') {
			apiRegion = 'us-east-1';
		} else {
			// Default to us-east-1
			apiRegion = 'us-east-1';
		}
	}

	locationDetails.region = apiRegion;
	localStorage.setItem('region', apiRegion);
	localStorage.setItem('locationDetails', JSON.stringify(locationDetails));
};
