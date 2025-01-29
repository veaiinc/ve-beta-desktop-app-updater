import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/ai_assistant/AiPersonality.scss';
import { ReactComponent as PlayIcon } from '../../../assets/svg/ai_assistant/play.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';
import { ReactComponent as AgentIcon } from '../../../assets/svg/ai_assistant/agent.svg';
import { ReactComponent as UploadIcon } from '../../../assets/svg/ai_assistant/upload.svg';
import { ReactComponent as Plus } from '../../../assets/svg/ai_assistant/plus.svg';
import CustomInput from '../globalComponents/CustomInput';
import { Tooltip } from 'antd';

const ProgressCircle = ({ color, isActive }) => (
	<div className="circle">
		<div className="circle__content">
			<div
				className="circle__content-fill"
				style={{
					background: `linear-gradient(90deg, ${color} 50%, white 50%)`,
				}}
			/>
		</div>
		{isActive && (
			<div className="circle__badge">
				<div className="circle__badge-inner">
					<svg viewBox="0 0 24 24">
						<polyline points="20 6 9 17 4 12" strokeWidth="2" />
					</svg>
				</div>
			</div>
		)}
	</div>
);

const ProgressCircles = () => (
	<div className="progress-circles">
		<ProgressCircle color="#8B5CF6" isActive={true} />
		<ProgressCircle color="#EF4444" isActive={false} />
		<ProgressCircle color="#3B82F6" isActive={false} />
		<div className="add-button">
			<Plus />
		</div>
	</div>
);

const AiPersonality = ({ assistant }) => {
	const [info, setInfo] = useState({
		voiceOptions: [],
		selectedVoice: 'Kierra',
		voiceListLoading: false,
		isSelectVoiceOpen: false,
		assistantData: assistant,
		assistantName: assistant?.name,
	});

	const options = ['Kierra', 'Alex', 'Sam', 'Jordan'];

	const updateInfo = useCallback((key, value) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			[key]: value,
		}));
	}, []);

	const handleMoreVisibility = useCallback((visible) => {
		setInfo((prev) => ({ ...prev, isSelectVoiceOpen: visible }));
	}, []);

	const handleVoiceChange = useCallback((value) => {
		updateInfo('selectedVoice', value);
		handleMoreVisibility(false);
	}, []);

	return (
		<div className="personalityParentContainer">
			<div className="nameContainer">
				<div className="headerWrapper">
					<span className="lineone">Assistant Name</span>
					<span className="linetwo">User will see this as the AI name</span>
				</div>

				<CustomInput
					placeholder="Assistant Name"
					className="aiNameInput"
					label="Assistant Name"
					value={info?.assistantName}
					onChange={(e) => updateInfo('assistantName', e.target.value)}
				/>
			</div>

			<div className="voiceContainer">
				<div className="headerWrapper">
					<span className="lineone">Assistant Voice</span>
					<span className="linetwo">User will hear this voice modulation</span>
				</div>

				<div className="chooseVoiceContainer">
					<Tooltip
						open={info?.isSelectVoiceOpen}
						onOpenChange={handleMoreVisibility}
						placement="bottom"
						title={
							<div className="voiceDropdown">
								{options?.map((option) => (
									<div
										key={option}
										className="voiceListItem"
										onClick={() => handleVoiceChange(option)}
									>
										{option}
									</div>
								))}
							</div>
						}
						arrow={false}
						trigger={'click'}
						color={'transparent'}
						overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
					>
						<div className="voiceList">
							{info?.selectedVoice}{' '}
							<DownSvg className={`${info?.isSelectVoiceOpen ? 'open' : ''}`} />
						</div>
					</Tooltip>

					<div className="voiceBtn">
						<PlayIcon />
						Play
					</div>
				</div>
			</div>

			<div className="aiProfileContainer">
				<div className="aiProfileHeader">
					<span className="lineone">Profile Picture</span>
					<span className="linetwo">User will see this as Assistant face</span>
				</div>

				<div className="aiProfileWrapper">
					<AgentIcon width={70} height={70} />
					<div className="uploadContainer">
						<div className="uploadIcons">
							<span className="uploadBtn">
								<UploadIcon />
								Upload
							</span>
							<span className="removeBtn">remove</span>
						</div>
						<span className="uploadLabel">
							Supports JPG, PNG, and SVG files up to 1MB
						</span>
					</div>
				</div>
			</div>

			<div className="colorThemeContainer">
				<div className="colorThemeHeader">
					<span className="lineone">Color Theme</span>
					<span className="linetwo">
						Assistant chat box color theme will be based on this{' '}
					</span>
				</div>
				<div className="colorThemeWrapper">
					<ProgressCircles />
				</div>
			</div>

			<div className="initialMessageContainer">
				<div className="initialMessageHeader">
					<span className="lineone">Initial Message</span>
					<span className="linetwo">User will get this message from Assistant first</span>
				</div>
				<CustomInput
					placeholder="Hi, I'm your AI assistant. How can I help you today?"
					className="aiNameInput"
					label="Initial Message"
				/>
			</div>

			<div className="userMessageContainer">
				<div className="userMessageHeader">
					<span className="lineone">User Message</span>
					<span className="linetwo">User will see this message from Assistant</span>
				</div>
				<CustomInput
					placeholder="Shoot anything"
					className="aiNameInput"
					label="User Message"
				/>
			</div>
		</div>
	);
};

export default memo(AiPersonality);
