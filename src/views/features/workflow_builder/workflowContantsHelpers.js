import moment from 'moment';
export const options = [
	{
		label: 'Minutes',
		value: 'minutes',
	},

	{
		label: 'Hours',
		value: 'hours',
	},
	{
		label: 'Days',
		value: 'days',
	},
	{
		label: 'Weeks',
		value: 'weeks',
	},
];

export const smartFileActions = [
	{
		label: 'After Form response is submitted',
		value: 'After Form response is submitted',
	},

	{
		label: 'After Smart file is sent for un Accepted Proposals',
		value: 'After Smart file is sent for un Accepted Proposals',
	},
	{
		label: 'After Proposal accepted',
		value: 'After Proposal accepted',
	},
	{
		label: 'After Proposal accepted, Unsigned Contract',
		value: 'After Proposal accepted, Unsigned Contract',
	},
	{
		label: 'After Form response is submitted',
		value: 'After Form response is submitted',
	},

	{
		label: 'After Smart file is sent for un Accepted Proposals',
		value: 'After Smart file is sent for un Accepted Proposals',
	},
	{
		label: 'After Proposal accepted',
		value: 'After Proposal accepted',
	},
	{
		label: 'After Proposal accepted, Unsigned Contract',
		value: 'After Proposal accepted, Unsigned Contract',
	},
];

export const actionOptions = [
	{
		label: 'Send notification',
		value: 'notification',
	},

	{
		label: 'Actions',
		value: 'action',
	},
	{
		label: 'Move pipeline stage',
		value: 'pipeline',
	},
];

export const channelOptions = [
	{
		label: 'Email',
		value: 'email',
	},

	{
		label: 'Whatsapp',
		value: 'whatsapp',
	},
	// {
	// 	label: 'Instagram',
	// 	value: 'instagram',
	// },
	// {
	// 	label: 'Facebook',
	// 	value: 'facebook',
	// },
];
export const calculateTimeStamp = async (selectedDuration, duration) => {
	const now = moment();
	if (selectedDuration === 'minutes') {
		now.add(duration, 'minutes');
	}
	if (selectedDuration === 'hours') {
		now.add(duration, 'hours');
	}
	if (selectedDuration === 'days') {
		now.add(duration, 'days');
	}
	if (selectedDuration === 'weeks') {
		now.add(duration, 'weeks');
	}

	return now.unix();
};

export const calculateTimeDifference = (targetTimestamp) => {
	const now = moment();
	const targetTime = moment.unix(targetTimestamp);

	const duration = moment.duration(targetTime.diff(now));
	const totalSeconds = duration.asSeconds();
	const totalWeeks = totalSeconds / (7 * 24 * 3600);
	const totalDays = totalSeconds / (24 * 3600);
	const totalHours = totalSeconds / 3600;
	const totalMinutes = totalSeconds / 60;

	let roundedValue;
	let unit;

	if (totalWeeks >= 1) {
		roundedValue = Math.round(totalWeeks);
		unit = 'week';
	} else if (totalDays >= 1) {
		roundedValue = Math.round(totalDays);
		unit = 'day';
	} else if (totalHours >= 1) {
		roundedValue = Math.round(totalHours);
		unit = 'hour';
	} else {
		roundedValue = Math.round(totalMinutes);
		unit = 'minute';
	}

	unit += roundedValue === 1 ? '' : 's';

	return `${roundedValue} ${unit}`?.split(' ');
};

export const returnDurationOption = (type) => {
	let selectedDuration;
	if (type === 'minutes') {
		selectedDuration = {
			label: 'Minutes',
			value: 'minutes',
		};
	}
	if (type === 'hours') {
		selectedDuration = {
			label: 'Hours',
			value: 'hours',
		};
	}
	if (type === 'days') {
		selectedDuration = {
			label: 'Days',
			value: 'days',
		};
	}
	if (type === 'weeks') {
		selectedDuration = {
			label: 'Weeks',
			value: 'weeks',
		};
	}
	return selectedDuration;
};
export const conditionOptions = [
	{
		label: 'Contract Signed',
		value: 'Contract Signed',
	},

	{
		label: 'Accept proposal ',
		value: 'Accept proposal ',
	},
	{
		label: 'Payment is completed',
		value: 'Payment is completed',
	},
];

export const movePipeLineOptions = [
	{
		label: 'Pipeline name 1',
		value: 'Pipeline name 1',
	},

	{
		label: 'Pipeline name 2',
		value: 'Pipeline name 2',
	},
	{
		label: 'Pipeline name 3',
		value: 'Pipeline name 3',
	},
];

export const takeActionsOptions = [
	{
		label: 'Create Meeting',
		value: 'Create Meeting',
	},

	{
		label: 'Create task',
		value: 'Create task',
	},
	{
		label: 'Create Scheduler',
		value: 'Create Scheduler',
	},
];

export const containerStyle = {
	padding: '12px 24px',
	height: '44px',
	padding: '12px',
	color: '#e4e5e6',
	width: '100%',
	flex: 1,
	alignSelf: 'stretch',
	backgroundColor: '#151515',
	borderRadius: '14px',
	border: '1px solid var(--ve-ai-dark-theme-text-field-stroke-pop-up, #2C2D2E)',
};

export const dropDownStyle = {
	top: '55px',
	backgroundColor: 'red',
	borderRadius: '14px',
	border: '1px solid var(--ve-ai-dark-theme-text-field-stroke-pop-up, #2C2D2E)',
	backgroundColor: '#202123',
};

export const dropDownTextStyling = {
	color: 'var(--ve-ai-dark-theme-primary-font-color, #E8E8E8)',
	fontFamily: 'Inter',
	fontSize: '13px',
	fontStyle: 'normal',
	fontWeight: '400',
	lineHeight: 'normal',
};
