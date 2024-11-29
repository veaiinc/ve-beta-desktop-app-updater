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
		value: 'actions',
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
	{
		label: 'Instagram',
		value: 'instagram',
	},
	{
		label: 'Facebook',
		value: 'facebook',
	},
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
