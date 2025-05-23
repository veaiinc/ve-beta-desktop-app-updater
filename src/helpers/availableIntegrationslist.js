import slack from '../assets/svg/Settings/slack.svg';
import google from '../assets/svg/Settings/google.svg';
import googleDrive from '../assets/svg/Settings/google-drive.svg';
import googleCalendar from '../assets/svg/Settings/google-calendar-logo.png';
import notion from '../assets/svg/Settings/notion.svg';

const availableIntegrations = [
	{
		id: 1,
		icon: google,
		title: 'Gmail',
		connectType: 'gmail',
		description: 'Easily connect with Gmail to sync your emails and streamline communication.',
		isConnected: false,
	},
	{
		id: 2,
		icon: notion,
		title: 'Notion',
		connectType: 'notion',
		description:
			'Effortlessly connect to Notion to manage tasks, organize projects, and centralize your work—all in one place.',
		isConnected: false,
	},
	{
		id: 3,
		icon: slack,
		title: 'Slack',
		connectType: 'slack',
		description:
			'Stay connected and streamline communication by integrating with Slack. Receive updates, share insights, and collaborate seamlessly.',
		isConnected: false,
	},
	{
		id: 4,
		icon: googleDrive,
		title: 'Google Drive',
		connectType: 'google-drive',
		description:
			'Easily connect with Google Drive to sync your files and streamline communication.',
		isConnected: false,
	},
	{
		id: 5,
		icon: googleCalendar,
		title: 'Google Calendar',
		connectType: 'google-calendar',
		description: 'Easily connect with Google Calendar to sync your calendar.',
		isConnected: false,
	},
	// {
	// 	id: 6,
	// 	icon: zoho,
	// 	title: 'Zoho',
	// 	connectType: 'zoho',
	// 	description: 'Easily connect to Zoho to access your CRM and sales data.',
	// 	isConnected: false,
	// },
	// {
	// 	id: 7,
	// 	icon: dropbox,
	// 	title: 'Salesforce	',
	// 	connectType: 'salesforce',
	// 	description: 'Easily connect with Salesforce to sync your CRM and sales data.',
	// 	isConnected: false,
	// },
	// {
	// 	id: 8,
	// 	icon: dropbox,
	// 	title: 'Hubspot',
	// 	connectType: 'hubspot',
	// 	description: 'Easily connect with Hubspot to sync your CRM and sales data.',
	// 	isConnected: false,
	// },
	// {
	// 	id: 9,
	// 	icon: dropbox,
	// 	title: 'Dropbox',
	// 	connectType: 'dropbox',
	// 	description: 'Easily connect with Dropbox to sync your files.',
	// 	isConnected: false,
	// },
];

export default availableIntegrations;
