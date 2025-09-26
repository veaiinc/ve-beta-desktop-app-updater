import { useContext, useEffect } from 'react';
import Intercom, { shutdown, show } from '@intercom/messenger-js-sdk';
import Context from '../context/context';
import moment from 'moment';

const app_id = import.meta.env.VITE_INTERCOM_APP_ID;
const session_duration = 86400000; // 24 hours

const useIntercom = () => {
	const {
		profileInfo: { userDetailsData, getIntercomToken, tennantSettingsData, userWorkSpaceList },
		subscriptionInfo: { currentPlan },
		authInfo: { workspaceId },
	} = useContext(Context);

	const launchIntercom = async () => {
		try {
			if (!userDetailsData) return;

			const { _id: user_id, email, firstName, lastName, phoneNumber, role } = userDetailsData;

			// Get Intercom JWT token
			const response = await getIntercomToken(user_id);
			const success = response[0];
			if (!success) return;

			const intercom_user_jwt = response[1].token;

			// Calculate company creation date from tenant_id
			const createdAt = tennantSettingsData?._id
				? moment.unix(parseInt(tennantSettingsData._id.toString().substr(0, 8), 16))
				: null;

			// Prepare comprehensive company data
			const companyData = {
				// Basic company info
				avatar: tennantSettingsData?.logo_s3_500w_key,
				name: tennantSettingsData?.businessName,
				company_id: tennantSettingsData?._id,
				'Company created at': createdAt,

				// Business details
				'Company Industry': tennantSettingsData?.businessType,
				website: tennantSettingsData?.website,
				workspaceMode: tennantSettingsData?.workspaceMode,
				isOnboard: tennantSettingsData?.isOnboard,

				// Location details
				country: tennantSettingsData?.locationDetails?.country,
				countryCode: tennantSettingsData?.locationDetails?.countryCode,
				countryRegion: tennantSettingsData?.locationDetails?.countryRegion,
				countryRegionCode: tennantSettingsData?.locationDetails?.countryRegionCode,
				city: tennantSettingsData?.locationDetails?.city,
				postalCode: tennantSettingsData?.locationDetails?.postalCode,
				timezone: tennantSettingsData?.locationDetails?.timezone,
				currency: tennantSettingsData?.locationDetails?.currency,
				region: tennantSettingsData?.locationDetails?.region,

				// Workspace info
				workspaceIds: tennantSettingsData?.workspaceIds,
				currentWorkspaceId: workspaceId,

				// Storage and usage
				storageInGB:
					parseInt(tennantSettingsData?.totalStorageInBytes / (1024 * 1024 * 1024)) || 0,
				cumulativeStorageInGB:
					parseInt(tennantSettingsData?.cumulativeStorageInBytes) /
						(1024 * 1024 * 1024) || 0,

				// User count and roles
				'Company size': tennantSettingsData?.tenantUsers?.length || 0,
				// Subscription details
				expiryInDays: currentPlan?.expiresAt
					? moment(moment.unix(currentPlan.expiresAt)).diff(moment(), 'days')
					: null,
				isPaid: currentPlan?.isPaid || false,
				'Expiry Date': currentPlan?.expiresAt,

				// Access permissions
				apps: currentPlan?.apps,
			};

			// Prepare comprehensive user data
			const userData = {
				user_id: user_id,
				email,
				name: `${firstName} ${lastName || ''}`.trim(),
				phone: phoneNumber,
				role,

				// Profile picture (Intercom expects string URL)
				avatar: userDetailsData?.dp_s3_500w_key,
				createdAt: userDetailsData?.createdAt,
				// Company association
				company: companyData,
			};

			// Boot Intercom with comprehensive data
			Intercom({
				app_id,
				intercom_user_jwt,
				session_duration,
				...userData,
			});
		} catch (error) {
			console.error('Intercom boot failed:', error);
		}
	};

	// Auto-launch Intercom by default when data is available
	useEffect(() => {
		let hasLaunched = false;
		let retryInterval = null;

		const launchWhenReady = async () => {
			// Prevent duplicate launches
			if (hasLaunched || !userDetailsData || !tennantSettingsData) {
				return;
			}

			hasLaunched = true;

			try {
				await launchIntercom();
				// Clear retry interval once successfully launched
				if (retryInterval) {
					clearInterval(retryInterval);
					retryInterval = null;
				}
			} catch (error) {
				console.error('Auto-launch Intercom failed:', error);
				hasLaunched = false; // Allow retry on error
			}
		};

		// Launch immediately if data is already available
		launchWhenReady();

		// Set up retry mechanism only if not already launched
		if (!hasLaunched) {
			retryInterval = setInterval(() => {
				launchWhenReady();
			}, 1000);
		}

		// Clean up interval after 30 seconds to avoid infinite retries
		const cleanupTimeout = setTimeout(() => {
			if (retryInterval) {
				clearInterval(retryInterval);
				retryInterval = null;
			}
		}, 30000);

		return () => {
			if (retryInterval) {
				clearInterval(retryInterval);
			}
			clearTimeout(cleanupTimeout);
		};
	}, [userDetailsData, tennantSettingsData]);

	return { showIntercom: show, shutdownIntercom: shutdown, launchIntercom };
};

export default useIntercom;
