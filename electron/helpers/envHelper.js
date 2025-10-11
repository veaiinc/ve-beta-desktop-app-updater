require('dotenv').config();
const DEFAULT_AUTO_UPDATE_IDLE_THRESHOLD_MINUTES = 15;
const DEFAULT_AUTO_UPDATE_CHECK_INTERVAL_MINUTES = 60;

const parseInteger = (value) => {
	const numericValue = Number.parseInt(String(value).trim(), 10);
	return Number.isFinite(numericValue) ? numericValue : null;
};

const getEnvValue = (key) => {
	const rawValue = process.env[key];
	return typeof rawValue === 'string' && rawValue.length > 0 ? rawValue : null;
};

const getAutoUpdateIdleThresholdMinutes = () => {
	const rawValue =
		getEnvValue('VE_AUTO_UPDATE_IDLE_THRESHOLD_MINUTES') ||
		getEnvValue('AUTO_UPDATE_IDLE_THRESHOLD_MINUTES');

	const parsed = rawValue ? parseInteger(rawValue) : null;

	if (!parsed || parsed <= 0) {
		return DEFAULT_AUTO_UPDATE_IDLE_THRESHOLD_MINUTES;
	}

	return parsed;
};

const getAutoUpdateIdleThresholdMilliseconds = () =>
	getAutoUpdateIdleThresholdMinutes() * 60 * 1000;

const getAutoUpdateCheckIntervalMinutes = () => {
	const rawValue =
		getEnvValue('VITE_UPDATE_CHECK_INTERVAL_MINUTES') ||
		getEnvValue('VE_AUTO_UPDATE_CHECK_INTERVAL_MINUTES');
	const parsed = rawValue ? parseInteger(rawValue) : null;

	if (!parsed || parsed <= 0) {
		return DEFAULT_AUTO_UPDATE_CHECK_INTERVAL_MINUTES;
	}

	return parsed;
};

const getAutoUpdateCheckIntervalMilliseconds = () =>
	getAutoUpdateCheckIntervalMinutes() * 60 * 1000;

module.exports = {
	DEFAULT_AUTO_UPDATE_IDLE_THRESHOLD_MINUTES,
	DEFAULT_AUTO_UPDATE_CHECK_INTERVAL_MINUTES,
	getAutoUpdateIdleThresholdMinutes,
	getAutoUpdateIdleThresholdMilliseconds,
	getAutoUpdateCheckIntervalMinutes,
	getAutoUpdateCheckIntervalMilliseconds,
};
