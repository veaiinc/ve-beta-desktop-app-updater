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
		label: 'After Form is submitted',
		value: 'enquiry',
	},

	{
		label: 'After Smart file is sent ',
		value: 'filesSent',
	},
	{
		label: 'After Smart file is viewed',
		value: 'filesViewed',
	},
	{
		label: 'After Proposal is  accepted',
		value: 'proposalAccepted',
	},
	{
		label: 'After Contract is signed',
		value: 'contractSigned',
	},

	{
		label: 'After Smart file is confirmed',
		value: 'confirmed',
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
	{
		label: 'Slack',
		value: 'slack',
	},
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
	if (type === 'minutes' || type === 'minute') {
		selectedDuration = {
			label: 'Minutes',
			value: 'minutes',
		};
	}
	if (type === 'hours' || type === 'hour') {
		selectedDuration = {
			label: 'Hours',
			value: 'hours',
		};
	}
	if (type === 'days' || type === 'day') {
		selectedDuration = {
			label: 'Days',
			value: 'days',
		};
	}
	if (type === 'weeks' || type === 'week') {
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
		value: 'contractSigned',
	},

	{
		label: 'Proposal Accepted',
		value: 'proposalAccepted',
	},
	// {
	// 	label: 'Payment is completed',
	// 	value: 'Payment is completed',
	// },
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
export const selectedValueStyling = {
	color: 'var(--ve-ai-dark-theme-secondary-color, #939393)',
	fontFamily: 'Inter',
	fontSize: '12px',
	fontStyle: 'normal',
	fontWeight: '500',
	lineHeight: 'normal',
};

export const getTotalNumnerofNodesRecursively = (nodeId, stepsMapper) => {
	if (!nodeId) {
		return 0;
	}

	const count1 = getTotalNumnerofNodesRecursively(
		stepsMapper?.[nodeId]?.data?.ifYes?.['nextStepId'],
		stepsMapper,
	);
	const count2 = getTotalNumnerofNodesRecursively(
		stepsMapper?.[nodeId]?.data?.ifNo?.['nextStepId'],
		stepsMapper,
	);
	return count1 + count2 + 1;
};
