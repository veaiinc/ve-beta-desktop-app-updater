import React, { useContext, useEffect, useState, memo } from 'react';
import '../../../assets/scss/AccountSettings/workspacesection.scss';
import jwt_decode from 'jwt-decode';
import Context from '../../../context/context';
import validator from 'validator';
import WorkspaceHandleComponent from '../../components/settings/workspace/WorkspaceHandle';
import TimeZoneCurrencyComponent from '../../components/settings/workspace/TimezoneCurrency';
import DeleteWorkpsaceComponent from '../../components/settings/workspace/DeleteWorkspace';

const SettingsWorkspace = () => {
	const {
		profileInfo: { getTenantSettings, tennantSettingsData, updateBusniessName },
		companyInfo: { updateTenantContactDetails },
	} = useContext(Context);

	const [error, setErrors] = useState({});
	const [isEditMode, setIsEditMode] = useState(false);

	const [overviewState, setOverviewState] = useState({
		isAdmin: '',
		timeZone: '',
		currency: '',
		workspaceId: localStorage.getItem('workspaceId'),
		tennatWorkspaceIds: [],
	});
	const [initialState, setInitialState] = useState({ ...overviewState });

	console.log(tennantSettingsData);

	useEffect(() => {
		setOverviewState((prev) => ({
			...prev,
			timeZone: tennantSettingsData?.locationDetails?.timezone || '',
			currency: tennantSettingsData?.locationDetails?.currency || '',
			tennatWorkspaceIds: tennantSettingsData?.workspaceIds || [],
		}));
	}, [tennantSettingsData]);

	// useEffect(() => {
	// 	if (!tennantSettingsData) {
	// 		getTenantSettings();
	// 	}
	// }, []);

	return (
		<div className="workspaceContainer">
			<div className="workspaceHandleComponent">
				<WorkspaceHandleComponent overviewState={overviewState} />
			</div>

			<div className="timezoneCurrencyComponent">
				<TimeZoneCurrencyComponent overviewState={overviewState} />
			</div>

			<div className="deleteWorkpsaceComponent">
				<DeleteWorkpsaceComponent />
			</div>
		</div>
	);
};

export default memo(SettingsWorkspace);
