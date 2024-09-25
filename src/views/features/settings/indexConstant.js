import Theme1 from '../../../assets/images/settings/theme1.png';
import Theme2 from '../../../assets/images/settings/theme2.png';

export const menuItems = [
	{ id: 'my-profile', label: 'My Profile' },
	{ id: 'workspace', label: 'Workspace' },
	{ id: 'public-information', label: 'Public Information' },
	{ id: 'brand-setup', label: 'Brand Setup' },
	{ id: 'team-settings', label: 'Team Settings' },
	{ id: 'integrations', label: 'Integrations' },
	{ id: 'plan-billing', label: 'Plan Billing' },
];

export const businessTypesOptions = [
	{ value: 'makeUpArtist', label: 'Make up Artist' },
	{ value: 'consultant', label: 'Consultant' },
	{ value: 'salonAndSpa', label: 'Salon & Spa' },
	{ value: 'architecture', label: 'Architecture' },
	{ value: 'photographer', label: 'Photographer' },
	{ value: 'fashionDesigner', label: 'Fashion Designer' },
	{ value: 'eventManagement', label: 'Event Management' },
	{ value: 'interiorDesigner', label: 'Interior Designer' },
	{ value: 'businessCoach', label: 'Business Coach' },
	{ value: 'restaurateur', label: 'Restaurateur' },
];

export const timeZoneList = [
	{ label: 'India, Sri Lanka Time', value: '12:58 PM' },
	{ label: 'Kathmandu Time', value: '12:58 PM' },
	{ label: 'Pakistan, Maldives Time', value: '12:58 PM' },
	{ label: 'Asia/Omsk', value: '12:58 PM' },
];

export const currencyList = [
	{ label: 'Japanese Yen', value: '¥ JPY' },
	{ label: 'Euros', value: '€ EUR' },
	{ label: 'Indian Rupees', value: '₹ INR' },
	{ label: 'united States Dollars', value: '$ USD' },
];

export const brandColorList = [
	{ label: 'color1', value: '#6055EC' },
	{ label: 'color2', value: '#EAE294' },
	{ label: 'color3', value: '#0D55B0' },
];

export const avatarColorList = [
	'#6055EC',
	'#D36262',
	'#DFD57C',
	'#768ECB',
	'#EF4E7E',
	'#FF4E4E',
	'#C49581',
	'#8ACEBA',
	'#24624F',
];

export const fontList = [
	{ name: 'Bebas Neue', type: 'Regular' },
	{ name: 'Battambang', type: 'Regular' },
];

export const themesList = [
	{
		id: 'theme1',
		imageUrl: Theme1,
		properties: [
			{ label: 'Background Color', property: 'background', value: '#BBEBFF' },
			{
				label: 'Logo Shape Color',
				property: 'background',
				value: 'linear-gradient(139deg, #38BBF1 14.64%, #84305E 93.17%)',
			},
			{ label: 'Text Color', property: 'color', value: '#343434' },
			{ label: 'Button Color', property: 'background', value: '#71B1EE' },
			{ label: 'Button Text', property: 'color', value: '#343434' },
		],
	},
	{
		id: 'theme2',
		imageUrl: Theme2,
		properties: [
			{ label: 'Background Color', property: 'background', value: '#F6F8FA' },
			{
				label: 'Logo Shape Color',
				property: 'background',
				value: '#F6F8FA',
			},
			{ label: 'Text Color', property: 'color', value: '#343434' },
			{ label: 'Button Color', property: 'background', value: '#FFA3D7' },
			{ label: 'Button Text', property: 'color', value: '#FFFF' },
		],
	},
];
