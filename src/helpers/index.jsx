import Spinner from '../views/components/loaders/Spinner';
import { ReactComponent as TextSvg } from '../assets/svg/ai_agents/text.svg';
import { ReactComponent as DocxSvg } from '../assets/svg/files/docSvg.svg';
import { ReactComponent as JsonSvg } from '../assets/svg/ai_agents/json.svg';
import { ReactComponent as PdfSvg } from '../assets/svg/ai_agents/pdf.svg';
import { ReactComponent as JpgSvg } from '../assets/svg/ai_agents/jpg.svg';
import { ReactComponent as PngSvg } from '../assets/svg/ai_agents/png.svg';
import { ReactComponent as MdSvg } from '../assets/svg/ai_agents/md.svg';
import { ReactComponent as ExcelSvg } from '../assets/svg/ai_agents/excel.svg';
import GmailSvg from '../assets/svg/login_page/GmailIcon';
import { ReactComponent as SlackSvg } from '../assets/svg/slack.svg';
import { ReactComponent as NotionSvg } from '../assets/svg/notion.svg';
import { ReactComponent as VeLogoSvg } from '../assets/svg/veLogo.svg';
import { ReactComponent as DriveSvg } from '../assets/svg/drive.svg';
import { ReactComponent as LinkSvg } from '../assets/svg/link.svg';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.updateLocale('en', {
	relativeTime: {
		future: 'in %s',
		past: '%s ago',
		s: '%d sec',
		m: '1 min',
		mm: '%d min',
		h: '1 hr',
		hh: '%d hr',
		d: '1 day',
		dd: '%d days',
		M: '1 month',
		MM: '%d months',
		y: '1 year',
		yy: '%d years',
	},
});

export const nameShortner = (name) => {
	let newName = name?.split(' ');
	let str = '';
	str += newName?.[0]?.[0] + (newName?.[1]?.[0] ? newName?.[1]?.[0] : '');
	return str?.toUpperCase();
};

// export const FetchMoreLoaderComp = () => {
// 	return (
// 		<h4
// 			style={{
// 				display: 'flex',
// 				gap: '12px',
// 				color: '#fff',
// 				justifyContent: 'center',
// 				alignItems: 'center',
// 			}}
// 		>
// 			<Spinner width={'12px'} height={'12px'} />
// 			Fetching More...
// 		</h4>
// 	);
// };

export const FetchMoreLoaderComp = ({
	wrapperStyle = {},
	spinnerWidth = '12px',
	spinnerHeight = '12px',
	spinnerColor = 'var(--spinner-color)',
	text = 'Fetching More...',
	gap = '12px',
}) => {
	const defaultStyles = {
		display: 'flex',
		gap,
		color: spinnerColor,
		justifyContent: 'center',
		alignItems: 'center',
	};

	// Merge default styles with provided styles
	const combinedStyles = { ...defaultStyles, ...wrapperStyle };

	return (
		<h4 style={combinedStyles}>
			<Spinner width={spinnerWidth} height={spinnerHeight} color={spinnerColor} />
			{text}
		</h4>
	);
};

export const getRelativeDayLabel = (timestamp) => {
	const date = dayjs(timestamp * 1000); // Convert seconds to milliseconds
	const now = dayjs();

	if (date.isToday()) {
		const hoursAgo = now.diff(date, 'hour');
		if (hoursAgo < 1) {
			const minutesAgo = now.diff(date, 'minute');
			if (minutesAgo < 1) {
				return 'Just now';
			}
			return `${minutesAgo} min${minutesAgo === 1 ? '' : 's'} ago`;
		}
		if (hoursAgo < 24) {
			return `${hoursAgo} hr${hoursAgo === 1 ? '' : 's'} ago`;
		}
		return 'Today';
	}
	if (date.isYesterday()) {
		return 'Yesterday';
	}

	const daysAgo = now.startOf('day').diff(date.startOf('day'), 'day');
	return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
};

export const getLocationsDetails = async () => {
	const localStorageLocationDetails = localStorage.getItem('locationDetails');
	if (
		(localStorageLocationDetails && localStorageLocationDetails !== 'undefined') ||
		localStorageLocationDetails !== null
	) {
		return JSON.parse(localStorageLocationDetails);
	}

	var locationDetailsUrl = 'https://ipapi.co/json';
	var locationDetailsResponse = null;

	try {
		const response = await axios.get(locationDetailsUrl);
		const {
			country_code,
			region_code,
			region,
			country_name,
			city,
			timezone,
			postal,
			currency,
			ip,
		} = response?.data;
		locationDetailsResponse = response?.data;
	} catch (error) {
		console.error('Location API Error:', error.message, error.response?.status);
		if (error?.response?.status === 429) {
			if (import.meta.env.VITE_IPAPI_API_KEY) {
				locationDetailsUrl = `https://ipapi.co/json?key=${
					import.meta.env.VITE_IPAPI_API_KEY
				}`;
			}
			const response = await axios.get(locationDetailsUrl);
			const {
				country_code,
				region_code,
				region,
				country_name,
				city,
				timezone,
				postal,
				currency,
				ip,
			} = response?.data;
			locationDetailsResponse = response?.data;
		}
	}
	const locationDetails = {
		countryCode: locationDetailsResponse?.country_code,
		countryRegionCode: locationDetailsResponse?.region_code,
		countryRegion: locationDetailsResponse?.region,
		country: locationDetailsResponse?.country_name,
		city: locationDetailsResponse?.city,
		timezone: locationDetailsResponse?.timezone,
		postalCode: locationDetailsResponse?.postal || '',
		currency: locationDetailsResponse?.currency,
	};

	let apiRegion = 'us-east-1';
	// Dynamic origin selection based on country/region
	if (locationDetailsResponse?.country_code === 'IN') {
		// Route Indian traffic to ap-south-1
		apiRegion = 'ap-south-1';
	} else if (locationDetailsResponse?.country_code === 'US') {
		if (
			locationDetailsResponse?.region_code === 'CA' ||
			locationDetailsResponse?.region_code === 'OR' ||
			locationDetailsResponse?.region_code === 'WA'
		) {
			apiRegion = 'us-east-1';
		} else {
			// Default to us-east-1
			apiRegion = 'us-east-1';
		}
	}

	locationDetails.region = apiRegion;
	localStorage.setItem('region', apiRegion);
	localStorage.setItem('locationDetails', JSON.stringify(locationDetails));
	localStorage.setItem('ipAddress', locationDetailsResponse?.ip);
	return locationDetails;
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

export const generatePDFsBatchId = (assistantId) => {
	const timestamp = Date.now();
	return `${timestamp}_${assistantId}`;
};

export const getImageSizeFormat = (size) => {
	if (size > 1024 * 1024) {
		return (size / (1024 * 1024)).toFixed(2) + ' GB';
	} else if (size > 1024) {
		return (size / 1024).toFixed(2) + ' MB';
	} else {
		return size.toFixed(2) + ' KB';
	}
};

export const isURL = (url) => {
	try {
		new URL(url);
		return true;
	} catch (error) {
		return false;
	}
};

let urlMapper = {
	localhost: 'http://localhost:5173',
	've.ai': 'https://builder.ve.ai',
	've.co': 'https://builder.ve.co',
	'www.ve.ai': 'https://builder.ve.ai',
	'www.ve.co': 'https://builder.ve.co',
};

export const fetchOriginSelection = () => {
	const hostname = window.location.hostname;
	return urlMapper?.[hostname];
};

const hostNameMapper = {
	localhost: 'localhost',
	've.ai': 've.ai',
	've.co': 've.co',
	'www.ve.co': 've.co',
	'www.ve.ai': 've.ai',
};

export const fetchDomainName = () => {
	const hostname = window.location.hostname;
	return hostNameMapper?.[hostname];
};

export const isSafariBrowser = () => {
	const userAgent = navigator.userAgent;
	let check = /^((?!chrome|android).)*safari/i.test(userAgent);
	return check;
};
export const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

// format username to capitalize first letter of first name & last name and remove special characters
export const formatUsername = (username) => {
	username = username?.replace(/[^a-zA-Z\s]/g, '');
	let firstNameWithSpace = false;
	if (username?.includes(' ') && username?.split(' ')[1]?.length === 0) {
		firstNameWithSpace = true;
		username = username?.trim() + ' ';
	}

	const firstName = username?.split(' ')[0];
	const lastName = username?.split(' ')[1];
	const capitalizedFirstName = firstName
		? firstName?.charAt(0)?.toUpperCase() + firstName?.slice(1)?.toLowerCase()
		: '';
	if (lastName) {
		const capitalizedLastName = lastName
			? lastName?.charAt(0)?.toUpperCase() + lastName?.slice(1)?.toLowerCase()
			: '';

		const formattedName = `${capitalizedFirstName} ${capitalizedLastName}`;
		return formattedName;
	} else {
		const formattedName = capitalizedFirstName;
		return firstNameWithSpace ? username : formattedName;
	}
};

export const checkDevices = async () => {
	try {
		const devices = await navigator.mediaDevices.enumerateDevices();
		const hasMic = devices.some((device) => device.kind === 'audioinput');
		const hasCamera = devices.some((device) => device.kind === 'videoinput');

		return { hasMic, hasCamera };
	} catch (error) {
		console.error('Error checking devices:', error);
	}
};

const faviconCache = new Map();

export const getFaviconUrl = (url) => {
	try {
		if (faviconCache?.has(url)) {
			return faviconCache?.get(url);
		}

		const domain = new URL(url)?.hostname;
		const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

		faviconCache?.set(domain, faviconUrl);
		return faviconUrl;
	} catch (error) {
		return null;
	}
};

export const getWebsiteName = (url) => {
	try {
		const domain = new URL(url)?.hostname;
		// Remove common TLDs and www
		const name = domain?.replace(/^www\./i, '');
		// Capitalize first letter
		return name;
	} catch (error) {
		return url;
	}
};

export const fileTypeIcons = {
	docx: <DocxSvg />,
	txt: <TextSvg />,
	png: <PngSvg />,
	pdf: <PdfSvg />,
	jpg: <JpgSvg />,
	json: <JsonSvg />,
	url: <LinkSvg />,
	md: <MdSvg />,
	jpeg: <JpgSvg />,
	xlsx: <ExcelSvg />,
	xls: <ExcelSvg />,
	gmail: <GmailSvg />,
	slack: <SlackSvg />,
	drive: <DriveSvg />,
	notion: <NotionSvg />,
	workflowId: <VeLogoSvg />,
	'image/png': <PngSvg />,
	'image/jpeg': <JpgSvg />,
	'image/jpg': <JpgSvg />,
	'application/pdf': <PdfSvg />,
	'application/docx': <DocxSvg />,
	'application/txt': <TextSvg />,
	'application/json': <JsonSvg />,
	'application/md': <MdSvg />,
	'application/jpeg': <JpgSvg />,
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <ExcelSvg />,
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <DocxSvg />,
	'text/plain': <TextSvg />,
};

export const redirectTo = (type, id) => {
	if (!id) return;

	const urls = {
		gmail: `https://mail.google.com/mail/u/0/#inbox/${id}`,
		notion: id,
		url: id,
		workflowId: `/builder/workflow/${id}`,
		slack: `https://app.slack.com/client/${id}`,
		s3_key: id,
		drive: `https://drive.google.com/file/d/${id}/view`,
		notes: `https://ve.ai/note/${id}`,
		proactiveai: `https://ve.ai/proactiveai/${id}`,
	};

	const url = urls?.[type];
	if (url) {
		window.open(url, '_blank');
	}
};

export const redirectTypeMapper = {
	url: 'url',
	notion: 'notion',
	workflowId: 'workflow_id',
	gmail: 'thread_id',
	slack: 'channel_id',
	s3_key: 's3_key',
	drive: 'drive_id',
	notes: 'note_id',
	proactiveai: 'proactiveai_id',
};

// Email validation utility
export const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const getUserBrowser = () => {
	const userAgent = navigator.userAgent;
	const browser = userAgent.match(/Firefox|Chrome|Safari|Opera|Edge/)[0];
	return browser;
};

export const getUserDevice = () => {
	const ua = navigator.userAgent;

	if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
	if (/Android/i.test(ua)) return 'Android';
	if (/Windows Phone/i.test(ua)) return 'Windows Phone';
	if (/Mac/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua)) return 'Mac';
	if (/Windows/i.test(ua)) return 'Windows';
	if (/Linux/i.test(ua)) return 'Linux';

	return 'Unknown';
};
