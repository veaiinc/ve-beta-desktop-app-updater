import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/ai_assistant/AiPersonality.scss';
import { ReactComponent as PlayIcon } from '../../../assets/svg/ai_assistant/play.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';
import { ReactComponent as AgentIcon } from '../../../assets/svg/ai_assistant/agent.svg';
import { ReactComponent as UploadIcon } from '../../../assets/svg/ai_assistant/upload.svg';
import { ReactComponent as PencilWithLine } from '../../../assets/svg/tasks/pencilWithLine.svg';
import { ReactComponent as Plus } from '../../../assets/svg/ai_assistant/plus.svg';
import CustomInput from '../globalComponents/CustomInput';
import { Tooltip } from 'antd';
import CustomTextArea from '../globalComponents/CustomTextArea';
import Context from '../../../context/context';
import PersonalityInputArea from './PersonalityInputArea';
import KnowledgeAgentPrompt from './KnowledgeAgentPrompt';
const personas = [
	{
		option1: 'Formal',
		option2: 'Friendly',
	},
	{
		option1: 'Concise',
		option2: 'Detailed',
	},
	{
		option1: 'Professional',
		option2: 'Casual',
	},
	{
		option1: 'Optimistic',
		option2: 'Natural',
	},
	{
		option1: 'Straightforward',
		option2: 'Humorous',
	},
	{
		option1: 'Empathetic',
		option2: 'Objective',
	},
	{
		option1: 'Enthusiastic',
		option2: 'Reserved',
	},
	{
		option1: 'Simplistic',
		option2: 'Sophisticated',
	},
];

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

const KnowledgeAgentPersonality = ({
	assistant,
	updateAssistantData,
	isKnowledgeAgent = false,
}) => {
	// const {
	// 	knowledgeAgent: { },
	// } = useContext(Context);
	const [info, setInfo] = useState({
		voiceOptions: [],
		selectedVoice: 'Kierra',
		voiceListLoading: false,
		isSelectVoiceOpen: false,
		assistantName: assistant?.name,
		assistantResponseTone: assistant?.responseTone,
		assistantPersonality: assistant?.personality,
		initialMessage: assistant?.initialMessage,
		messagePlaceholder: assistant?.messagePlaceholder,
		initialMessageError: '',
		messagePlaceholderError: '',
		assitant_profile_picture_s3Key: assistant?.assitant_profile_picture_s3Key || '',
		assitant_chat_icon_s3Key: assistant?.assitant_chat_icon_s3Key || '',
		assistantUpdatedProfilePicture: null,
		assistantUpdatedChatIcon: null,
		profileLoading: false,
		chatLoading: false,
	});

	const profilePictureRef = useRef(null);
	const chatIconRef = useRef(null);

	const options = ['Kierra', 'Alex', 'Sam', 'Jordan'];

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			assistantName: assistant?.name,
			assistantResponseTone: assistant?.responseTone,
			assistantPersonality: assistant?.personality,
			initialMessage: assistant?.initialMessage,
			messagePlaceholder: assistant?.messagePlaceholder,
			assitant_profile_picture_s3Key: assistant?.assitant_profile_picture_s3Key || '',
			assitant_chat_icon_s3Key: assistant?.assitant_chat_icon_s3Key || '',
		}));
	}, [assistant]);

	const handleAssistantDataChange = useCallback(
		(key, value) => {
			updateAssistantData(key, value);
		},
		[updateAssistantData],
	);

	// const handleMoreVisibility = useCallback((visible) => {
	// 	setInfo((prev) => ({ ...prev, isSelectVoiceOpen: visible }));
	// }, []);

	// const handleVoiceChange = useCallback((value) => {
	// 	updateAiPersonalityInfo('selectedVoice', value);
	// 	handleMoreVisibility(false);
	// }, []);

	const handleResponseToneChange = useCallback(
		(index, value) => {
			const newResponseTone = [...(assistant?.responseTone || [])];
			newResponseTone[index] = value;
			updateAssistantData('responseTone', newResponseTone);
		},
		[assistant?.responseTone, updateAssistantData],
	);

	// const handleImageSelectBtnClick = useCallback((type) => {
	// 	if (type === 'profile') {
	// 		profilePictureRef?.current?.click();
	// 	}
	// 	if (type === 'chatIcon') {
	// 		chatIconRef?.current?.click();
	// 	}
	// }, []);

	// const handleImageChange = useCallback((file, type) => {
	// 	if (type === 'profile') {
	// 		updateAiPersonalityInfo('assistantUpdatedProfilePicture', file);
	// 	}
	// 	if (type === 'chatIcon') {
	// 		updateAiPersonalityInfo('assistantUpdatedChatIcon', file);
	// 	}
	// }, []);

	// const handleCancelImage = useCallback((type) => {
	// 	if (type === 'profile') {
	// 		updateAiPersonalityInfo('assistantUpdatedProfilePicture', null);
	// 		if (profilePictureRef.current) {
	// 			profilePictureRef.current.value = '';
	// 		}
	// 	}
	// 	if (type === 'chatIcon') {
	// 		updateAiPersonalityInfo('assistantUpdatedChatIcon', null);
	// 		if (chatIconRef.current) {
	// 			chatIconRef.current.value = '';
	// 		}
	// 	}
	// }, []);

	// const handleRemoveImage = useCallback(
	// 	async (type) => {
	// 		updateAiPersonalityInfo(`${type}Loading`, true);
	// 		const response = await removeFile(assistant?._id, type);
	// 		if (response?.[0]) {
	// 			updateAiPersonalityInfo(`${type}Loading`, false);
	// 			updateAiPersonalityInfo(
	// 				`assitant_${type === 'profile' ? 'profile_picture' : 'chat_icon'}_s3Key`,
	// 				null,
	// 			);
	// 			getActiveAiAssistantDetails(assistant?._id);
	// 		} else {
	// 			message.error('Failed to remove image. Please try again.');
	// 		}
	// 		updateAiPersonalityInfo(`${type}Loading`, false);
	// 	},
	// 	[updateAiPersonalityInfo, removeFile, assistant?._id, getActiveAiAssistantDetails],
	// );

	// const handleUploadImage = useCallback(
	// 	async (file, type) => {
	// 		updateAiPersonalityInfo(`${type}Loading`, true);
	// 		const response = await uploadFile(assistant?._id, file, type);
	// 		if (response?.ok) {
	// 			if (type === 'profile') {
	// 				profilePictureRef.current.value = '';
	// 				setInfo((prevInfo) => ({
	// 					...prevInfo,
	// 					assistantUpdatedProfilePicture: null,
	// 					assitant_profile_picture_s3Key: URL.createObjectURL(file),
	// 				}));
	// 			}
	// 			if (type === 'chat') {
	// 				chatIconRef.current.value = '';
	// 				setInfo((prevInfo) => ({
	// 					...prevInfo,
	// 					assistantUpdatedChatIcon: null,
	// 					assitant_chat_icon_s3Key: URL.createObjectURL(file),
	// 				}));
	// 			}
	// 			// getActiveAiAssistantDetails(assistant?._id);
	// 		}
	// 		updateAiPersonalityInfo(`${type}Loading`, false);
	// 	},
	// 	[assistant?._id, getActiveAiAssistantDetails, updateAiPersonalityInfo, uploadFile],
	// );

	return (
		<div className="personalityParentContainer">
			<PersonalityInputArea
				heading="Assistant Name"
				subHeading="User will see this as the AI name"
				value={assistant?.name}
				onChange={(e) => handleAssistantDataChange('name', e?.target?.value)}
			/>

			<PersonalityInputArea
				heading="Handle"
				subHeading="Give your agent a handle people can use to message it"
				value={assistant?.handle}
				prefix="@"
				onChange={(e) => handleAssistantDataChange('handle', e?.target?.value)}
			/>

			<PersonalityInputArea
				heading="Description"
				subHeading="Describe what this agent will help your team with"
				value={assistant?.description}
				onChange={(e) => handleAssistantDataChange('description', e?.target?.value)}
			/>
			{/* <div className="voiceContainer">
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
			</div> */}

			<div className="aiResponseToneContainer">
				<div className="aiResponseToneHeader">
					<span className="lineone">Response Tone</span>
					<span className="linetwo">User will see this as Assistant response tone</span>
				</div>
				<div className="aiResponseToneWrapper">
					{personas?.map((persona, index) => (
						<div className="aiResponseToneItem" key={index}>
							<label
								className="aiResponseToneItemOption"
								htmlFor={`aiResponseTone-${persona?.option1}`}
							>
								<input
									type="radio"
									name={index}
									id={`aiResponseTone-${persona?.option1}`}
									checked={
										assistant?.responseTone?.[index] ===
										persona?.option1.toLowerCase()
									}
									onChange={() =>
										handleResponseToneChange(
											index,
											persona?.option1.toLowerCase(),
										)
									}
								/>
								{persona?.option1}
							</label>
							<label
								className="aiResponseToneItemOption"
								htmlFor={`aiResponseTone-${persona?.option2}`}
							>
								<input
									type="radio"
									name={index}
									id={`aiResponseTone-${persona?.option2}`}
									checked={
										assistant?.responseTone?.[index] ===
										persona?.option2.toLowerCase()
									}
									onChange={() =>
										handleResponseToneChange(
											index,
											persona?.option2.toLowerCase(),
										)
									}
								/>
								{persona?.option2}
							</label>
						</div>
					))}
				</div>
			</div>

			{
				// 	<div className="aiProfileContainer">
				// 	<div className="aiProfileHeader">
				// 		<span className="lineone">Profile Picture</span>
				// 		<span className="linetwo">User will see this as Assistant face</span>
				// 	</div>
				// 	<div className="aiProfileWrapper">
				// 		<div className="profilePictureWrapper">
				// 			<button
				// 				className="imageSelectButton"
				// 				onClick={() => handleImageSelectBtnClick('profile')}
				// 			>
				// 				<PencilWithLine />
				// 			</button>
				// 			{info?.assistantUpdatedProfilePicture ||
				// 			info?.assitant_profile_picture_s3Key ? (
				// 				<img
				// 					src={
				// 						info?.assistantUpdatedProfilePicture
				// 							? URL.createObjectURL(info?.assistantUpdatedProfilePicture)
				// 							: info?.assitant_profile_picture_s3Key
				// 					}
				// 					alt="profile"
				// 				/>
				// 			) : (
				// 				<span className="noImage">Ai</span>
				// 			)}
				// 			<input
				// 				type="file"
				// 				ref={profilePictureRef}
				// 				style={{ display: 'none' }}
				// 				accept=".png, .svg, .jpg, .jpeg"
				// 				onChange={(e) => handleImageChange(e?.target?.files[0], 'profile')}
				// 			/>
				// 		</div>
				// 		{/* <AgentIcon width={70} height={70} /> */}
				// 		<div className="uploadContainer">
				// 			<div className="uploadIcons">
				// 				{info?.assistantUpdatedProfilePicture ? (
				// 					<button
				// 						className="uploadBtn"
				// 						onClick={() =>
				// 							handleUploadImage(
				// 								info?.assistantUpdatedProfilePicture,
				// 								'profile',
				// 							)
				// 						}
				// 						disabled={info?.profileLoading}
				// 					>
				// 						<UploadIcon />
				// 						Upload
				// 					</button>
				// 				) : (
				// 					<button
				// 						className="uploadBtn"
				// 						onClick={() => handleImageSelectBtnClick('profile')}
				// 					>
				// 						<PencilWithLine />
				// 						Edit
				// 					</button>
				// 				)}
				// 				{info?.assistantUpdatedProfilePicture ? (
				// 					<button
				// 						className="removeBtn"
				// 						onClick={() => handleCancelImage('profile')}
				// 						disabled={info?.profileLoading}
				// 					>
				// 						Cancel
				// 					</button>
				// 				) : (
				// 					<button
				// 						className="removeBtn"
				// 						onClick={() => handleRemoveImage('profile')}
				// 						disabled={info?.profileLoading}
				// 					>
				// 						Remove
				// 					</button>
				// 				)}
				// 			</div>
				// 			<span className="uploadLabel">
				// 				Supports JPG, PNG, and SVG files up to 1MB
				// 			</span>
				// 		</div>
				// 	</div>
				// </div>
			}

			{/* <div className="aiChatIconContainer">
				<div className="aiChatIconHeader">
					<span className="lineone">Chat Icon</span>
					<span className="linetwo">User will see this as Assistant chat icon</span>
				</div>

				<div className="aiChatIconWrapper">
					<div className="chatIconWrapper">
						<button
							className="imageSelectButton"
							onClick={() => handleImageSelectBtnClick('chatIcon')}
						>
							<PencilWithLine />
						</button>
						{info?.assistantUpdatedChatIcon || info?.assitant_chat_icon_s3Key ? (
							<img
								src={
									info?.assistantUpdatedChatIcon
										? URL.createObjectURL(info?.assistantUpdatedChatIcon)
										: info?.assitant_chat_icon_s3Key
								}
								alt="profile"
							/>
						) : (
							<span className="noImage">Ai</span>
						)}
						<input
							type="file"
							ref={chatIconRef}
							style={{ display: 'none' }}
							accept=".png, .svg, .jpg, .jpeg"
							onChange={(e) => handleImageChange(e?.target?.files[0], 'chatIcon')}
						/>
					</div>
					<div className="uploadContainer">
						<div className="uploadIcons">
							{info?.assistantUpdatedChatIcon ? (
								<button
									className="uploadBtn"
									onClick={() =>
										handleUploadImage(info?.assistantUpdatedChatIcon, 'chat')
									}
									disabled={info?.chatLoading}
								>
									<UploadIcon />
									Upload
								</button>
							) : (
								<button
									className="uploadBtn"
									onClick={() => handleImageSelectBtnClick('chatIcon')}
								>
									<PencilWithLine />
									Edit
								</button>
							)}
							{info?.assistantUpdatedChatIcon ? (
								<button
									className="removeBtn"
									onClick={() => handleCancelImage('chatIcon')}
									disabled={info?.chatLoading}
								>
									Cancel
								</button>
							) : (
								<button
									className="removeBtn"
									onClick={() => handleRemoveImage('chat')}
									disabled={info?.chatLoading}
								>
									Remove
								</button>
							)}
						</div>
						<span className="uploadLabel">
							Supports JPG, PNG, and SVG files up to 1MB
						</span>
					</div>
				</div>
			</div> */}
			<div className="promptContainer">
				<KnowledgeAgentPrompt assistant={assistant} />
			</div>
		</div>
	);
};

export default memo(KnowledgeAgentPersonality);
