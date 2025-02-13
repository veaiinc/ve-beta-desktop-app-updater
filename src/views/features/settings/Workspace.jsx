import React, { useContext, useEffect, useState, memo } from 'react';
import '../../../assets/scss/settings/workspacesection.scss';
import Context from '../../../context/context';
import WorkspaceHandleComponent from '../../components/settings/workspace/WorkspaceHandle';
import TimeZoneCurrencyComponent from '../../components/settings/workspace/TimezoneCurrency';
import DeleteWorkpsaceComponent from '../../components/settings/workspace/DeleteWorkspace';
import { message, Tooltip } from 'antd';
import ToolTipContainer from '../../components/popover/ToolTipContainer';
import { ReactComponent as QuestionMark } from '../../../assets/svg/Settings/question_circle.svg';

const temporaryPlaceholderText = `
The voice embodies values of:
- Innovation: Highlights cutting-edge features and transformative potential
- Clarity: Provides clear and concise descriptions of features and benefits
- Persuasiveness: Uses strong, assertive language to encourage adoption
- Efficiency: Emphasizes speed and effectiveness in achieving goals`;

const SettingsWorkspace = () => {
	const {
		profileInfo: { tennantSettingsData },
	} = useContext(Context);

	const [overviewState, setOverviewState] = useState({
		isAdmin: '',
		timeZone: '',
		currency: '',
		workspaceId: localStorage.getItem('workspaceId'),
		tennatWorkspaceIds: [],
	});

	const [info, setInfo] = useState({
		brandDescription: '',
	});

	useEffect(() => {
		setInfo({
			...info,
			brandDescription: tennantSettingsData?.brandMetadata?.brandVoice ?? '',
		});
	}, [tennantSettingsData]);

	const wordCount = info?.brandDescription?.length;

	useEffect(() => {
		setOverviewState((prev) => ({
			...prev,
			timeZone: tennantSettingsData?.locationDetails?.timezone || '',
			currency: tennantSettingsData?.locationDetails?.currency || '',
			tennatWorkspaceIds: tennantSettingsData?.workspaceIds || [],
		}));
	}, [tennantSettingsData]);

	useEffect(() => {
		// if (wordCount > 500) message?.error('Word count limit exceeded');
		// if (info?.brandDescription?.length > 500) {
		// 	setInfo({ ...info, brandDescription: info?.brandDescription?.slice(0, 500) });
		// }
	}, [wordCount, info?.brandDescription]);

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
					onChange={(e) => setInfo({ ...info, brandDescription: e?.target?.value })}
				></textarea>
				<div className="wordCountContainer">
					<span className="wordCount">{wordCount}/500</span>
				</div>
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
