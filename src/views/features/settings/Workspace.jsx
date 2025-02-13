import React, { useContext, useEffect, useState, memo } from 'react';
import '../../../assets/scss/settings/workspacesection.scss';
import Context from '../../../context/context';
import WorkspaceHandleComponent from '../../components/settings/workspace/WorkspaceHandle';
import TimeZoneCurrencyComponent from '../../components/settings/workspace/TimezoneCurrency';
import DeleteWorkpsaceComponent from '../../components/settings/workspace/DeleteWorkspace';
import { Tooltip } from 'antd';
import ToolTipContainer from '../../components/popover/ToolTipContainer';
import { ReactComponent as QuestionMark } from '../../../assets/svg/Settings/question_circle.svg';

const temporaryPlaceholderText = `The voice is innovative, assertive, and informative. It has a confident and forward-thinking personality that encourages embracing new technologies. It communicates with a mix of bold statements, detailed descriptions, and persuasive language to convey the advanced capabilities of the platform.

The voice embodies values of:
- Innovation: Highlights cutting-edge features and transformative potential
- Clarity: Provides clear and concise descriptions of features and benefits
- Persuasiveness: Uses strong, assertive language to encourage adoption
- Efficiency: Emphasizes speed and effectiveness in achieving goals
To replicate this voice in your writing:
- Use strong, assertive language to make bold claims about capabilities
- Employ concise, direct sentences to communicate benefits
- Highlight innovative features and their potential to transform processes
- Use persuasive language to encourage action and adoption
- Incorporate technical terms and jargon to convey expertise`;

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

	const [info, setInfo] = useState({
		brandDescription: temporaryPlaceholderText,
	});

	const wordCount = info?.brandDescription?.length;

	useEffect(() => {
		setOverviewState((prev) => ({
			...prev,
			timeZone: tennantSettingsData?.locationDetails?.timezone || '',
			currency: tennantSettingsData?.locationDetails?.currency || '',
			tennatWorkspaceIds: tennantSettingsData?.workspaceIds || [],
		}));
	}, [tennantSettingsData]);

	const handleSetBrandDescription = (e) => {
		setInfo({ ...info, brandDescription: e?.target?.value });
	};

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
				<textarea
					className="brandVoiceContent"
					value={info?.brandDescription}
					onChange={handleSetBrandDescription}
				></textarea>
				<span className="wordCount">{wordCount}/500</span>
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
