import { useContext, useEffect, useState, memo, useCallback } from 'react';
import '../../../assets/scss/settings/workspacesection.scss';
import Context from '../../../context/context';
import WorkspaceHandleComponent from '../../components/settings/workspace/WorkspaceHandle';
import TimeZoneCurrencyComponent from '../../components/settings/workspace/TimezoneCurrency';
import PublicInformation from './PublicInformation';
import BrandSetup from './BrandSetup';
import { message } from '../../components/globalComponents/CustomToast';
import CustomDomain from '../../components/settings/workspace/CustomDomain';

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
		brandDescription: 'Your brand description will appear here',
	});

	useEffect(() => {
		if (tennantSettingsData) {
			setInfo({
				...info,
				brandDescription:
					tennantSettingsData?.brandMetadata?.brandVoice ||
					'Your brand description will appear here',
			});
		}
	}, [tennantSettingsData]);

	useEffect(() => {
		setOverviewState((prev) => ({
			...prev,
			timeZone: tennantSettingsData?.locationDetails?.timezone || '',
			currency: tennantSettingsData?.locationDetails?.currency || '',
			tennatWorkspaceIds: tennantSettingsData?.workspaceIds || [],
		}));
	}, [tennantSettingsData]);

	const brandVoiceonChange = useCallback((event) => {
		if (event?.target?.value?.length > 5000) {
			message?.error('Oops! You have reached the word count limit of 5000');
			return;
		}
		setInfo({ ...info, brandDescription: event?.target?.value });
	}, []);

	return (
		<div className="publicandworkspaceContainer">
			<PublicInformation />
			<div className="workspaceContainer">
				<div className="settingsBoxContainer workspaceHandleComponent">
					<WorkspaceHandleComponent overviewState={overviewState} />
				</div>
				<div className="orContainer"></div>
				<CustomDomain />
				{/* <div className="brandVoiceContainer">
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
								background: 'var(--card)',
							}}
							contentStyling={{
								color: 'var(--primary-font)',
								fontFamily: 'var(--primary-font-family)',
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
					onChange={brandVoiceonChange}
				></textarea>
				<div className="wordCountContainer">
					<span className="wordCount">{info?.brandDescription?.length}/5000</span>
				</div>
			</div> */}
				<BrandSetup />
				<div className="settingsBoxContainer timezoneCurrencyComponent">
					<TimeZoneCurrencyComponent overviewState={overviewState} />
				</div>

				{/* tmeporary Hide */}
				{/* <div className="settingsBoxContainer deleteWorkpsaceComponent">
				<DeleteWorkpsaceComponent />
			</div> */}
			</div>
		</div>
	);
};

export default memo(SettingsWorkspace);
