import React, { useContext, useEffect, useState, memo } from 'react';
import '../../../assets/scss/settings/workspacesection.scss';
import Context from '../../../context/context';
import WorkspaceHandleComponent from '../../components/settings/workspace/WorkspaceHandle';
import TimeZoneCurrencyComponent from '../../components/settings/workspace/TimezoneCurrency';
import DeleteWorkpsaceComponent from '../../components/settings/workspace/DeleteWorkspace';

const SettingsWorkspace = () => {
	// # Contexts
	const {
		profileInfo: { tennantSettingsData },
	} = useContext(Context);

	// # useStates
	const [overviewState, setOverviewState] = useState({
		isAdmin: '',
		timeZone: '',
		currency: '',
		workspaceId: localStorage.getItem('workspaceId'),
		tennatWorkspaceIds: [],
	});

	// useEffects
	useEffect(() => {
		setOverviewState((prev) => ({
			...prev,
			timeZone: tennantSettingsData?.locationDetails?.timezone || '',
			currency: tennantSettingsData?.locationDetails?.currency || '',
			tennatWorkspaceIds: tennantSettingsData?.workspaceIds || [],
		}));
	}, [tennantSettingsData]);

	return (
		<div className="workspaceContainer">
			<div className="settingsBoxContainer workspaceHandleComponent">
				<WorkspaceHandleComponent overviewState={overviewState} />
			</div>

			<div className="settingsBoxContainer timezoneCurrencyComponent">
				<TimeZoneCurrencyComponent overviewState={overviewState} />
			</div>

			<div className="settingsBoxContainer deleteWorkpsaceComponent">
				<DeleteWorkpsaceComponent />
			</div>
		</div>
	);
};

export default memo(SettingsWorkspace);
