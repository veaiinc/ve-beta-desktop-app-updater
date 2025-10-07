import slack from '../../../assets/svg/Settings/slack.svg';
import google from '../../../assets/svg/Settings/google.svg';
import googleDrive from '../../../assets/svg/Settings/google-drive.svg';
import googleCalendar from '../../../assets/svg/Settings/google-calendar-logo.png';
import dropbox from '../../../assets/svg/Settings/drop-box-logo.png';
import notion from '../../../assets/svg/Settings/notion.svg';
import PayPal from '../../../assets/svg/Settings/paypal.svg';
import Zoho from '../../../assets/svg/Settings/zoho-logo.svg';
import outlookCalendar from '../../../assets/svg/Settings/outlook-calendar.svg';
import outlookMail from '../../../assets/svg/Settings/outlook-mail.svg';

export const availableIntegrations = [
	{
		id: 1,
		icon: google,
		title: 'Gmail',
		connectType: 'gmail',
		description: 'Easily connect with Gmail to sync your emails and streamline communication.',
		showIn: ['private', 'shared'],
	},
	{
		id: 2,
		icon: outlookCalendar,
		title: 'Outlook Calendar',
		connectType: 'outlook-calendar',
		description:
			'Easily connect with Outlook Calendar to sync your schedule and manage appointments.',
		showIn: ['private', 'shared'],
	},
	{
		id: 3,
		icon: outlookMail,
		title: 'Outlook Mail',
		connectType: 'outlook-mail',
		description:
			'Easily connect with Outlook Mail to sync your emails and streamline communication.',
		showIn: ['private', 'shared'],
	},
	{
		id: 4,
		icon: googleCalendar,
		title: 'Google Calendar',
		connectType: 'google-calendar',
		description:
			'Easily connect with Google Calendar to sync your schedule and manage appointments.',
		showIn: ['private', 'shared'],
	},
	{
		id: 5,
		icon: notion,
		title: 'Notion',
		connectType: 'notion',
		description: 'Easily connect with Notion to sync your tasks and manage projects.',
		showIn: ['private', 'shared'],
	},
];

export const requestIntegrations = [
	{ id: 1, iconSlug: 'paypal', title: 'PayPal' },
	{ id: 2, title: 'Microsoft 365' },
	{ id: 5, iconSlug: 'zoom', title: 'Zoom' },
	{ id: 6, iconSlug: 'confluence', title: 'Confluence (Atlassian)' },
	{ id: 8, iconSlug: 'salesforce', title: 'Salesforce' },
	{ id: 9, iconSlug: 'github', title: 'GitHub' },
	{ id: 10, iconSlug: 'jira', title: 'Jira (Atlassian)' },
	{ id: 11, iconSlug: 'workday', title: 'Workday' },
	{ id: 12, iconSlug: 'box', title: 'Box' },
	{ id: 13, iconSlug: 'dropbox', title: 'Dropbox' },
	{ id: 14, iconSlug: 'okta', title: 'Okta (SSO/user directory)' },
	{ id: 15, title: 'ServiceNow' },
	{ id: 16, iconSlug: 'zendesk', title: 'Zendesk' },
	{ id: 17, iconSlug: 'asana', title: 'Asana' },
	{ id: 18, iconSlug: 'trello', title: 'Trello' },
	{ id: 19, iconSlug: 'figma', title: 'Figma' },
	{ id: 20, title: 'Tableau' },
	{ id: 21, title: 'Power BI' },
	{ id: 22, iconSlug: 'gitlab', title: 'GitLab' },
	{ id: 23, iconSlug: 'hubspot', title: 'HubSpot' },
	{ id: 24, iconSlug: 'intercom', title: 'Intercom' },
	{ id: 25, title: 'BambooHR' },
	{ id: 26, iconSlug: 'greenhouse', title: 'Greenhouse' },
	{ id: 27, title: 'Lattice' },
	{ id: 28, iconSlug: 'airtable', title: 'Airtable' },
	{ id: 29, title: 'Monday.com' },
	{ id: 30, title: 'Smartsheet' },
	{ id: 31, title: 'Azure DevOps' },
	{ id: 32, title: 'Freshdesk' },
	{ id: 33, iconSlug: 'egnyte', title: 'Egnyte' },
	{ id: 34, iconSlug: 'miro', title: 'Miro' },
	{ id: 35, title: 'DocuSign' },
	{ id: 36, iconSlug: 'adp', title: 'ADP' },
	{ id: 37, title: 'ZoomInfo' },
	{ id: 38, title: 'Gong' },
	{ id: 39, title: 'Domo' },
	{ id: 40, iconSlug: 'looker', title: 'Looker' },
	{ id: 41, title: 'Splunk' },
	{ id: 42, iconSlug: 'pagerduty', title: 'PagerDuty' },
	{ id: 43, title: 'Outreach.io' },
	{ id: 44, title: 'Salesloft' },
	{ id: 45, iconSlug: 'loom', title: 'Loom' },
	{ id: 46, iconSlug: 'calendly', title: 'Calendly' },
	{ id: 47, iconSlug: 'linear', title: 'Linear' },
	{ id: 48, iconSlug: 'bitbucket', title: 'Bitbucket' },
	{ id: 49, iconSlug: 'clickup', title: 'ClickUp' },
	{ id: 50, title: 'Wrike' },
	{ id: 51, iconSlug: 'basecamp', title: 'Basecamp' },
	{ id: 52, title: 'Zoho CRM' },
	{ id: 53, title: 'Pipedrive' },
	{ id: 54, title: 'Freshsales' },
	{ id: 55, title: 'Help Scout' },
	{ id: 56, title: 'Kayako' },
	{ id: 57, title: 'Front App' },
	{ id: 58, title: 'Kustomer' },
	{ id: 59, title: 'Guru' },
	{ id: 60, title: 'Slite' },
	{ id: 61, title: 'Nuclino' },
	{ id: 62, title: 'Marketo' },
	{ id: 63, iconSlug: 'mailchimp', title: 'Mailchimp' },
	{ id: 64, title: 'Braze' },
	{ id: 65, title: 'Iterable' },
	{ id: 66, title: 'Adobe Creative Cloud' },
	{ id: 67, iconSlug: 'canva', title: 'Canva' },
	{ id: 68, iconSlug: 'sketch', title: 'Sketch' },
	{ id: 69, iconSlug: 'invision', title: 'InVision' },
	{ id: 70, title: 'Mode Analytics' },
	{ id: 71, title: 'Sisense' },
	{ id: 72, title: 'OneLogin' },
	{ id: 73, title: 'Duo Security' },
	{ id: 74, title: 'Jamf' },
	{ id: 75, title: 'QuickBooks Online' },
	{ id: 76, iconSlug: 'xero', title: 'Xero' },
	{ id: 77, title: 'Bill.com' },
	{ id: 78, iconSlug: 'expensify', title: 'Expensify' },
	{ id: 79, title: 'Ironclad' },
	{ id: 80, title: 'Lucidchart' },
	{ id: 81, title: 'Chili Piper' },
	{ id: 82, title: 'Chorus.ai' },
	{ id: 83, title: 'Clearbit' },
	{ id: 84, title: 'Twist' },
	{ id: 85, iconSlug: 'mattermost', title: 'Mattermost' },
	{ id: 86, title: 'Flock' },
	{ id: 87, title: 'Redbooth' },
	{ id: 88, title: 'ProofHub' },
	{ id: 89, title: 'Citrix ShareFile' },
	{ id: 90, title: 'Docker Hub' },
	{ id: 91, iconSlug: 'jenkins', title: 'Jenkins' },
	{ id: 92, iconSlug: 'circleci', title: 'CircleCI' },
	{ id: 93, iconSlug: 'terraform', title: 'Terraform' },
	{ id: 94, title: 'Lever' },
	{ id: 95, title: 'Paylocity' },
	{ id: 96, iconSlug: 'gusto', title: 'Gusto' },
	{ id: 97, title: 'Rippling' },
	{ id: 98, title: 'Namely' },
	{ id: 99, title: 'Document360' },
	{ id: 100, title: 'Helpjuice' },
	{ id: 101, title: 'ActiveCampaign' },
	{ id: 103, iconSlug: 'googleCalendar', title: 'Google Calendar' },
];

export const getIntegrationInfo = (appType) => {
	const integrationMap = {
		'google-calendar': { icon: googleCalendar, title: 'Google Calendar' },
		'google-drive': { icon: googleDrive, title: 'Google Drive' },
		gmail: { icon: google, title: 'Gmail' },
		notion: { icon: notion, title: 'Notion' },
		slack: { icon: slack, title: 'Slack' },
		zoho: { icon: Zoho, title: 'Zoho' },
		dropbox: { icon: dropbox, title: 'Dropbox' },
		paypal: { icon: PayPal, title: 'PayPal' },
		'outlook-calendar': { icon: outlookCalendar, title: 'Outlook Calendar' },
		'outlook-mail': { icon: outlookMail, title: 'Outlook Mail' },
		// Handle variations of Outlook app types
		outlook: { icon: outlookMail, title: 'Outlook' },
		'microsoft-outlook': { icon: outlookMail, title: 'Microsoft Outlook' },
		outlook_calendar: { icon: outlookCalendar, title: 'Outlook Calendar' },
		outlook_mail: { icon: outlookMail, title: 'Outlook Mail' },
		'microsoft-outlook-calendar': { icon: outlookCalendar, title: 'Outlook Calendar' },
		'microsoft-outlook-mail': { icon: outlookMail, title: 'Outlook Mail' },
	};

	const info = integrationMap[appType];
	if (!info) {
		console.warn(`No integration info found for app type: ${appType}`);
		// Try to determine if it's an Outlook-related app by checking the appType string
		if (appType && appType.toLowerCase().includes('outlook')) {
			// If it contains 'outlook' but doesn't match exactly, try to determine if it's calendar or mail
			if (appType.toLowerCase().includes('calendar')) {
				return { icon: outlookCalendar, title: 'Outlook Calendar' };
			} else if (appType.toLowerCase().includes('mail')) {
				return { icon: outlookMail, title: 'Outlook Mail' };
			} else {
				// Default to Outlook Mail if we can't determine
				return { icon: outlookMail, title: 'Outlook' };
			}
		}
		return { icon: google, title: appType };
	}
	return info;
};

export const formatTimestamp = (timestamp) => {
	if (!timestamp) return '-';
	const date = new Date(timestamp * 1000);
	const now = new Date();
	const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

	if (diffInHours < 1) return 'Just now';
	if (diffInHours < 24) return `${diffInHours} hours ago`;
	if (diffInHours < 48) return '1 day ago';
	return `${Math.floor(diffInHours / 24)} days ago`;
};

export const getIntegrationStatus = (item) => {
	if (item.isActive !== undefined) return item.isActive;
	if (item.status === 'active') return true;
	if (item.status === 'inactive') return false;
	if (item.connected !== undefined) return item.connected;
	if (item.isConnected !== undefined) return item.isConnected;
	return true;
};
