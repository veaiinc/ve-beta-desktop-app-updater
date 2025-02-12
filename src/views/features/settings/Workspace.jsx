import React, { useContext, useEffect, useState, memo } from 'react';
import '../../../assets/scss/settings/workspacesection.scss';
import Context from '../../../context/context';
import WorkspaceHandleComponent from '../../components/settings/workspace/WorkspaceHandle';
import TimeZoneCurrencyComponent from '../../components/settings/workspace/TimezoneCurrency';
import DeleteWorkpsaceComponent from '../../components/settings/workspace/DeleteWorkspace';
import { Tooltip } from 'antd';

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
			<div className="brandVoiceContainer">
				<h1 className="title">Brand Voice</h1>
				<Tooltip title="Description">
					<BrandVoiceDescription />
				</Tooltip>
			</div>
			<div className="settingsBoxContainer timezoneCurrencyComponent">
				<TimeZoneCurrencyComponent overviewState={overviewState} />
			</div>

			{/* tmeporary Hide */}
			{/* <div className="settingsBoxContainer deleteWorkpsaceComponent">
				<DeleteWorkpsaceComponent />
			</div> */}
		</div>
	);
};

export default memo(SettingsWorkspace);

const BrandVoiceDescription = memo(() => {
	return (
		<div className="brandVoiceDescription">
			<p className="description">
				The voice description defines the core characteristics of your brand's voice. This
				should be detailed and specific enough for someone unfamiliar with your brand to
				successfully emulate your voice.
			</p>
		</div>
	);
});
