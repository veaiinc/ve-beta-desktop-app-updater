// meetingMonitor.js
const activeWin = require('active-win');
const { systemPreferences } = require('electron');
const log = require('electron-log');

let showNotificationFn = null;
let lastInMeeting = false;
let lastNotificationTime = 0;
let pendingMeeting = null;

const POLL_INTERVAL = 3000; // Check every 3 seconds
const NOTIFICATION_COOLDOWN = 5 * 60 * 1000; // 10 minutes

// Keywords that suggest a meeting
function hasMeetingIndicators(title, url) {
	const lower = (title + ' ' + url).toLowerCase();
	const meetingKeywords = [
		'meeting',
		'join',
		'present',
		'conference',
		'huddle',
		'call',
		'screen share',
		'interview',
		'workshop',
		'session',
		'live',
		'webinar',
	];
	return meetingKeywords.some((k) => lower.includes(k));
}

// Detect meeting-like URL patterns (e.g., /j/, /meeting/, .meet, etc.)
function isMeetingLikeUrl(url) {
	const patterns = [
		/\/j\/[^/]/, // zoom.us/j/abc, ve.ai/j/xyz
		/\/meeting\/[^/]/, // /meeting/123
		/\/call\/[^/]/, // /call/abc
		/\/huddle\/[^/]/,
		/\/rooms?\/[^/]/,
		/\/webinars?\/[^/]/,
		/\.meet$/, // myapp.meet
		/\.call$/, // ai.call
		/\.live$/, // stream.live
	];
	return patterns.some((pattern) => pattern.test(url));
}

// Main detection logic
async function isUserInMeeting() {
	try {
		const win = await activeWin();
		if (!win) return false;

		const title = win.title || '';
		const url = win.url ? win.url.toLowerCase() : '';
		const app = win.owner.name.toLowerCase();

		// Heuristic 1: Camera or mic active + meeting clues
		if (process.platform === 'darwin') {
			const cameraActive = systemPreferences.getMediaAccessStatus('camera') === 'granted';
			const micActive = systemPreferences.getMediaAccessStatus('microphone') === 'granted';
			if ((cameraActive || micActive) && hasMeetingIndicators(title, url)) {
				return true;
			}
		}

		// Heuristic 2: Meeting keywords in title or URL
		if (hasMeetingIndicators(title, url)) return true;

		// Heuristic 3: Meeting-like URL pattern
		if (isMeetingLikeUrl(url)) return true;

		// Heuristic 4: Known collaboration apps or domains
		const knownApps = [
			'zoom',
			'meet',
			'teams',
			'webex',
			'whereby',
			'jitsi',
			've.ai',
			'gathertown',
			'kumospace',
			'lifesize',
			'gotomeeting',
		];
		return knownApps.some((domain) => app.includes(domain) || url.includes(domain));
	} catch (err) {
		// log.warn('Error in meeting detection:', err.message);
		return false;
	}
}

// Start polling for meeting state
function startMeetingMonitor() {
	setInterval(async () => {
		const now = Date.now();
		let inMeeting = false;

		try {
			inMeeting = await isUserInMeeting();
		} catch (err) {
			log.debug('Meeting check failed:', err.message);
		}

		if (inMeeting && !lastInMeeting) {
			// Debounce: wait 5 seconds to confirm it's real
			pendingMeeting = setTimeout(() => {
				if (now - lastNotificationTime > NOTIFICATION_COOLDOWN) {
					if (showNotificationFn) {
						showNotificationFn(
							'You’re in a meeting',
							'Would you like to enable AI notes or live assistance?',
						);
						lastNotificationTime = now;
					}
				}
				pendingMeeting = null;
			}, 5000); // 5-second delay
		}

		if (!inMeeting) {
			if (pendingMeeting) {
				clearTimeout(pendingMeeting);
				pendingMeeting = null;
			}
			lastInMeeting = false;
		} else {
			lastInMeeting = true;
		}
	}, POLL_INTERVAL);
}

// Allow main.js to inject the notification function
function setNotificationHandler(fn) {
	showNotificationFn = fn;
}

module.exports = {
	startMeetingMonitor,
	setNotificationHandler,
	isUserInMeeting, // Optional: for debugging
};
