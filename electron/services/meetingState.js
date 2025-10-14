let storeRef = null;

const noop = () => {};

const setStore = (store) => {
	storeRef = store;
};

const subscribe = (listener) => {
	if (!storeRef || typeof storeRef.subscribe !== 'function') {
		return noop;
	}

	const unsubscribe = storeRef.subscribe(
		(state) => state?.meeting?.activeMeetingId,
		(currentMeetingId, previousState) => {
			const prevId = previousState;
			if (currentMeetingId !== prevId) {
				listener({
					activeMeetingId: currentMeetingId,
					previousMeetingId: prevId,
					isInMeeting: Boolean(currentMeetingId),
				});
			}
		},
	);

	return () => {
		if (typeof unsubscribe === 'function') {
			unsubscribe();
		}
	};
};

const getActiveMeetingId = () => {
	if (!storeRef || typeof storeRef.getState !== 'function') {
		return null;
	}

	const state = storeRef.getState();
	return state?.meeting?.activeMeetingId || null;
};

const isInMeeting = () => Boolean(getActiveMeetingId());

module.exports = {
	setStore,
	subscribe,
	getActiveMeetingId,
	isInMeeting,
};
