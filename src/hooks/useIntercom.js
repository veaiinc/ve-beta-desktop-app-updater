import { useContext } from 'react';
import Intercom, { shutdown, show } from '@intercom/messenger-js-sdk';
import Context from '../context/context';

const app_id = import.meta.env.VITE_INTERCOM_APP_ID;
const session_duration = 86400000; // 24 hours

const useIntercom = () => {
	const {
		profileInfo: { userDetailsData, getIntercomToken },
	} = useContext(Context);

	const launchIntercom = async () => {
		try {
			if (!userDetailsData) return;
			const { _id: user_id } = userDetailsData;
			const response = await getIntercomToken(user_id);
			const success = response[0];
			if (success) {
				const intercom_user_jwt = response[1].token;
				Intercom({
					app_id,
					intercom_user_jwt,
					session_duration,
				});
			}
		} catch (error) {
			console.error('Intercom boot failed:', error);
		}
	};

	return { showIntercom: show, shutdownIntercom: shutdown, launchIntercom };
};

export default useIntercom;
