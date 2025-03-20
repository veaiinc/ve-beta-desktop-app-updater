import React, { memo, useState, useContext, useEffect } from 'react';
import Context from '../../../../context/context';
import { ReactComponent as DividerLineVerticalWhite } from '../../../../assets/svg/Settings/divider-line-vertical-white.svg';
import '../../../../assets/scss/settings/aiSetupPage.scss';
import Skeleton from 'react-loading-skeleton';
import Spinner from '../../loaders/Spinner';
import { message } from 'antd';

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

const AiPersonalityCustomization = () => {
	let {
		aiSetup: { updateAiAssistant, activeAiAssistantDetails },
	} = useContext(Context);

	const [info, setInfo] = useState({
		aiAssistantName: '',
		aiAssistantNameFocus: false,
		selectedPersonas: [],
		aiPersonalityDescription: '',
		isAiAssistantDetailsLoading: true,
		dataFromAPI: null,
	});

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			isAiAssistantDetailsLoading: true,
		}));
		if (activeAiAssistantDetails) {
			const initialSelectedPersonas = activeAiAssistantDetails?.responseTone?.map(
				(tone, i) => ({
					activeOption:
						personas[i]['option1'].toLowerCase() === tone ? 'option1' : 'option2',
				}),
			);
			setInfo((prevInfo) => ({
				...prevInfo,
				aiAssistantName: activeAiAssistantDetails?.name || '',
				aiPersonalityDescription: activeAiAssistantDetails?.personality || '',
				selectedPersonas: initialSelectedPersonas,
				isAiAssistantDetailsLoading: false,
				dataFromAPI: JSON.stringify({
					aiAssistantName: activeAiAssistantDetails?.name || '',
					aiPersonalityDescription: activeAiAssistantDetails?.personality || '',
					selectedPersonas: initialSelectedPersonas,
				}),
			}));
		}
	}, [activeAiAssistantDetails]);

	const handleSetAiAssistantName = (e) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			aiAssistantName: e?.target?.value,
		}));
	};

	const handleSetAiAssistantNameFocus = (focusState) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			aiAssistantNameFocus: focusState,
		}));
	};

	const handleSetActiveOption = (index, option) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selectedPersonas: [
				...prevInfo?.selectedPersonas?.map((persona, i) =>
					i === index ? { ...persona, activeOption: option } : persona,
				),
			],
		}));
	};

	const handleSetAiPersonalityDescription = (e) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			aiPersonalityDescription: e?.target?.value,
		}));
	};

	const handlePersonifyAssistant = () => {
		const updatedData = JSON.stringify({
			aiAssistantName: info?.aiAssistantName,
			aiPersonalityDescription: info?.aiPersonalityDescription,
			selectedPersonas: info?.selectedPersonas,
		});
		if (updatedData === info?.dataFromAPI) {
			message.error('Warning: No changes were made to the AI Assistant');
			return;
		}
		setInfo((prevInfo) => ({
			...prevInfo,
			isAiAssistantDetailsLoading: true,
		}));
		const selectedPersonas = info?.selectedPersonas?.map((persona, i) =>
			personas[i][persona?.activeOption].toLowerCase(),
		);

		updateAiAssistant(activeAiAssistantDetails?._id, {
			name: info?.aiAssistantName,
			responseTone: selectedPersonas,
			personality: info?.aiPersonalityDescription,
		});
		message.success('Your AI assistant has been personified successfully!', 1.5);
	};

	return (
		<div className="ai-personality-customization">
			<p className="description">
				Customize your AI bot's personality to match your brand! Adjust its tone and style,
				and interaction preferences to create a unique experience.
			</p>

			<div className="ai-assistant-name-container">
				<h1 className="ai-assistant-name">Setup AI Assistant's Name</h1>
				{/* <div
					className={`ai-assistant-name-input-container ${
						info.aiAssistantNameFocus ? 'ai-assistant-name-input-container-focus' : ''
					}`}
				> */}
				{info?.isAiAssistantDetailsLoading ? (
					<Skeleton width={'100%'} height={48} />
				) : (
					<input
						value={info?.aiAssistantName}
						onInput={handleSetAiAssistantName}
						onFocus={() => handleSetAiAssistantNameFocus(true)}
						onBlur={() => handleSetAiAssistantNameFocus(false)}
						className="ai-assistant-name-input"
						type="text"
						placeholder="Optimus"
					/>
				)}
				{/* </div> */}
			</div>

			<div className="ai-assistant-name-container">
				<h1 className="ai-assistant-name">Embed AI Assistant in your website</h1>
				{info?.isAiAssistantDetailsLoading ? (
					<Skeleton width={'100%'} height={48} />
				) : (
					<div style={{ display: 'flex', gap: 16 }}>
						<input
							value={`<script src="https://widget.ve.ai/public.js" data-ai-assistant-id=${activeAiAssistantDetails?._id}  data-ai-assistant-name=${info?.aiAssistantName} data-nscript="afterInteractive"></script>`}
							onInput={handleSetAiAssistantName}
							className="ai-assistant-name-input"
							type="text"
							placeholder="Optimus"
							readOnly
							disabled
						/>

						<button
							className="createBtn"
							onClick={() => {
								navigator.clipboard.writeText(
									`<script src="https://widget.ve.ai/public.js" data-ai-assistant-id=${activeAiAssistantDetails?._id}  data-ai-assistant-name=${info?.aiAssistantName} data-nscript="afterInteractive"></script>`,
								);
								message.success('Script copied to clipboard!', 1.5);
							}}
							style={{
								minWidth: '120px',
								backgroundColor: 'var(--primary-button)',
								color: 'var(--primary-button-font)',
								borderRadius: '8px',
								border: 'none',
								padding: '12px 16px',
								cursor: 'pointer',
								fontWeight: '500',
							}}
						>
							Copy Script
						</button>
					</div>
				)}
				{/* </div> */}
			</div>
			<div className="ai-assistant-name-container">
				<h1 className="ai-assistant-name">Setup AI Assistant's Name</h1>
				{/* <div
					className={`ai-assistant-name-input-container ${
						info.aiAssistantNameFocus ? 'ai-assistant-name-input-container-focus' : ''
					}`}
				> */}
				{info?.isAiAssistantDetailsLoading ? (
					<Skeleton width={'100%'} height={48} />
				) : (
					<input
						value={info?.aiAssistantName}
						onInput={handleSetAiAssistantName}
						onFocus={() => handleSetAiAssistantNameFocus(true)}
						onBlur={() => handleSetAiAssistantNameFocus(false)}
						className="ai-assistant-name-input"
						type="text"
						placeholder="Optimus"
					/>
				)}
				{/* </div> */}
			</div>
			<div className="ai-personality-description">
				<h1>Personality</h1>
				<h2>Add background, identity and expertise to your bot.</h2>
			</div>
			{info?.isAiAssistantDetailsLoading ? (
				<Skeleton width={'100%'} height={156} />
			) : (
				<textarea
					className="ai-personality-textarea"
					placeholder="You are Optimus, and you will lead the Autobots to victory!"
					onChange={handleSetAiPersonalityDescription}
					value={info?.aiPersonalityDescription}
				></textarea>
			)}
			<div className="ai-response-tone">
				<div className="description">
					<h1>Response Tone</h1>
					<h2>Choose one Persona from each row</h2>
				</div>
				<div className="ai-persona-container">
					{info?.isAiAssistantDetailsLoading ? (
						<Skeleton width={'100%'} height={490} />
					) : (
						<ul>
							{info?.selectedPersonas?.length > 0 &&
								personas?.map((persona, index) => (
									<li className="persona-option-container" key={index}>
										<div
											onClick={() => handleSetActiveOption(index, 'option1')}
											className={`persona-option ${
												info?.selectedPersonas?.[index]?.activeOption ===
												'option1'
													? 'persona-option-selected'
													: ''
											}`}
										>
											{persona.option1}
										</div>
										<DividerLineVerticalWhite />
										<div
											onClick={() => handleSetActiveOption(index, 'option2')}
											className={`persona-option ${
												info?.selectedPersonas?.[index]?.activeOption ===
												'option2'
													? 'persona-option-selected'
													: ''
											}`}
										>
											{persona?.option2}
										</div>
									</li>
								))}
						</ul>
					)}
					<button
						disabled={info?.isAiAssistantDetailsLoading}
						style={{
							opacity: info?.isAiAssistantDetailsLoading ? 0.5 : 1,
							cursor: info?.isAiAssistantDetailsLoading ? 'not-allowed' : 'pointer',
						}}
						onClick={handlePersonifyAssistant}
						className="createBtn"
					>
						{info?.isAiAssistantDetailsLoading ? (
							<div className="spinner-container">
								<p>Personifying Assistant...</p>
								<Spinner width={24} height={24} />
							</div>
						) : (
							'Personify Assistant'
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default memo(AiPersonalityCustomization);
