import { useContext, useEffect } from 'react';
import Intercom from '@intercom/messenger-js-sdk';
import Context from '../context/context';
import useActiveWorkspace from './useActiveWorkspace';

const app_id = 'vmvweabd';

const useIntercom = () => {
	const workspaceId = useActiveWorkspace();

	const {
		profileInfo: { userDetailsData, tennantSettingsData },
	} = useContext(Context);

	useEffect(() => {
		try {
			if (!userDetailsData || !tennantSettingsData || !workspaceId) return;

			const { _id: user_id, firstName, lastName, email } = userDetailsData;
			const name = `${firstName ?? ''} ${lastName ?? ''}`;
			const { businessName } = tennantSettingsData;
			const region = localStorage.getItem('region') ?? 'ap-south-1';

			const company = {
				id: workspaceId,
				name: businessName,
				region,
			};

			const intercomData = {
				app_id,
				user_id,
				name,
				email,
				company,
			};

			Intercom(intercomData);
		} catch (error) {
			console.error('Intercom boot failed:', error);
		}
	}, [userDetailsData, tennantSettingsData, workspaceId]);
};

export default useIntercom;
