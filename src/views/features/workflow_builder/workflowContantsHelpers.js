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

export const PriorityOptions = [
	{
		label: 'Low',
		value: 'low',
	},

	{
		label: 'Medium',
		value: 'medium',
	},
	{
		label: 'High',
		value: 'high',
	},
];

export const statusOptions = [
	{
		label: 'To Do',
		value: 'todo',
	},

	{
		label: 'Done',
		value: 'done',
	},
	{
		label: 'Pending',
		value: 'pending',
	},
	{
		label: 'In Progress',
		value: 'inProgress',
	},
];

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

export const MoveStepsOptions = [
	{
		label: 'Yes',
		value: 'yes',
	},

	{
		label: 'No',
		value: 'no',
	},
];

export const containerStyle = {
	padding: '12px 24px',
	height: '44px',
	padding: '12px',
	color: 'var(--primary-font)',
	width: '100%',
	flex: 1,
	alignSelf: 'stretch',
	backgroundColor: 'var(--card)',
	borderRadius: '14px',
	border: '1px solid var(--stroke)',
};

export const dropDownStyle = {
	top: '55px',
	borderRadius: '14px',
	border: '1px solid var(--stroke)',
	backgroundColor: 'var(--card)',
};

export const dropDownTextStyling = {
	color: 'var(--primary-font)',
	fontFamily: 'var(--primary-font-family)',
	fontSize: '13px',
	fontStyle: 'normal',
	fontWeight: '400',
	lineHeight: 'normal',
};
export const selectedValueStyling = {
	color: 'var(--secondary-font)',
	fontFamily: 'var(--primary-font-family)',
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
