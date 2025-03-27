import { memo } from 'react';
import PhoneInput from 'react-phone-input-2';
import { ReactComponent as DarkIcon } from '../../../assets/svg/onboarding/dark.svg';
import { ReactComponent as LightIcon } from '../../../assets/svg/onboarding/light.svg';

const themePreferences = [
	{
		id: 1,
		label: 'System Default',
		icon: null,
		value: 'systemDefault',
	},
	{
		id: 2,
		label: 'Dark',
		icon: <DarkIcon />,
		value: 'dark',
	},
	{
		id: 3,
		label: 'Light',
		icon: <LightIcon />,
		value: 'light',
	},
];

const Stage1 = ({
	username,
	phoneNumber,
	countryCode,
	themePreference,
	handleSetUsername,
	handleSetPhoneNumber,
	handleSetThemePreference,
}) => {
	return (
		<div className="stage1">
			<header className="header">
				<h1 className="title">Let's get started</h1>
				<h2 className="subtitle">Personalize your experience</h2>
			</header>
			<main className="stage1Content">
				<div className="nameInputContainer">
					<p className="question">What's your name?</p>
					<input
						className="nameInput"
						value={username}
						onChange={handleSetUsername}
						type="text"
						placeholder="Full Name"
						autoFocus
					/>
				</div>
				<div className="phoneInputContainer">
					<p className="question">Enter your phone number</p>
					<PhoneInput
						containerClass="phoneContainerClass"
						inputClass="phoneInputClass"
						placeholder="Enter phone number"
						value={phoneNumber}
						onChange={handleSetPhoneNumber}
						country={countryCode}
						countryCallingCodeEditable={true}
						autoComplete="tel"
					/>
				</div>
				<div className="themeInputContainer">
					<p className="question">Select your theme preference</p>
					<div className="themeOptionsContainer">
						{themePreferences?.map((theme) => (
							<button
								className={`themeOption ${
									themePreference === theme?.value ? 'active' : ''
								}`}
								key={theme?.id}
								onClick={() => handleSetThemePreference(theme?.value)}
							>
								{theme?.icon}
								<span className="themeOptionLabel">{theme?.label}</span>
							</button>
						))}
					</div>
				</div>
			</main>
		</div>
	);
};

export default memo(Stage1);
