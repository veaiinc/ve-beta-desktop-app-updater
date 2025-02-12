import React, { useContext, useEffect, useState, memo } from 'react';
import '../../../assets/scss/settings/workspacesection.scss';
import Context from '../../../context/context';
import WorkspaceHandleComponent from '../../components/settings/workspace/WorkspaceHandle';
import TimeZoneCurrencyComponent from '../../components/settings/workspace/TimezoneCurrency';
import DeleteWorkpsaceComponent from '../../components/settings/workspace/DeleteWorkspace';
import { Tooltip } from 'antd';
import ToolTipContainer from '../../components/popover/ToolTipContainer';
import { ReactComponent as QuestionMark } from '../../../assets/svg/Settings/question_circle.svg';

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
				<Tooltip
					placement="topRight"
					trigger={'hover'}
					title={
						<ToolTipContainer
							customContainerStyle={{
								position: 'absolute',
								left: '16px',
								top: '-38px',
								width: '352px',
								display: 'flex',
								padding: '10px',
								justifyContent: 'center',
								alignItems: 'center',
								gap: '10px',
								borderRadius: '12px',
								background: '#F2F2F3',
							}}
							contentStyling={{
								color: '#0E0F0F',
								fontFamily: 'Inter',
								fontSize: '12px',
								fontStyle: 'normal',
								fontWeight: '500',
								lineHeight: 'normal',
							}}
							title={''}
							content={
								"The voice description defines the core characteristics of your brand's voice. This should be detailed and specific enough for someone unfamiliar with your brand to successfully emulate your voice."
							}
							removeClassName={true}
						/>
					}
					arrow={true}
					color={'transparent'}
				>
					<p className="description-tooltip">
						Description <QuestionMark />
					</p>
				</Tooltip>
				<div className="brandVoiceContent"></div>
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
