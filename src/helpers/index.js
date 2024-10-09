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
		postalCode: postal || '',
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
	return JSON.stringify(locationDetails);
};

export const getInitials = (firstName, lastName) => {
	const firstNameInitial = firstName ? firstName?.charAt(0) : '-';
	const lastNameInitial = lastName ? lastName?.charAt(0) : '';
	const initials = `${firstNameInitial?.toUpperCase()}${lastNameInitial?.toUpperCase()}`;
	return initials;
};

export const getBuisnessName = (name) => {
	const words = name?.split(' ');

	if (words?.length === 1) {
		return words?.[0]?.substring(0, 2).toUpperCase();
	} else {
		// If there are multiple words, return the initials of the first two words
		const initials = words
			?.slice(0, 2)
			?.map((word) => word?.charAt(0)?.toUpperCase())
			?.join('');
		return initials;
	}
};

export const getGreeting = () => {
	const hour = new Date().getHours();
	if (hour < 12) return 'Good morning';
	if (hour < 16) return 'Good afternoon';
	return 'Good evening';
};

export const getCurrentWorkspaceId = (userWorkSpaceList = []) => {
	const workspaceId = localStorage.getItem('workspaceId');

	if (!userWorkSpaceList) return workspaceId;

	const tenant = userWorkSpaceList?.find((item) => item?.activeWorkspaceId === workspaceId);

	if (!tenant) {
		return workspaceId;
	}

	const currentWorkspaceIds = tenant.workspaceIds || [workspaceId];
	return currentWorkspaceIds[currentWorkspaceIds.length - 1];
};
