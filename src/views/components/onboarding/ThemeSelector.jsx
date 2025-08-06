import { memo } from 'react';
import { ReactComponent as DarkIcon } from '../../../assets/svg/onboarding/dark.svg';
import { ReactComponent as LightIcon } from '../../../assets/svg/onboarding/light.svg';
import { ReactComponent as DeskTopIcon } from '../../../../builderSrc/assets/svg/smartFile/Desktop.svg';
const themePreferences = [
	{
		id: 1,
		label: 'System Default',
		icon: <DeskTopIcon />,
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

const ThemeSelector = ({ themePreference, handleSetThemePreference }) => {
	return (
		<div className="themeInputContainer">
			<p className="question" style={{ color: 'var(--primary-font)' }}>
				How do you want things to look?
			</p>
			<div className="themeOptionsContainer">
				{themePreferences.map((theme) => (
					<div
						key={theme.id}
						className={`themeOption ${themePreference === theme.value ? 'active' : ''}`}
						onClick={() => handleSetThemePreference(theme.value)}
					>
						{theme.icon}
						<span className="themeOptionLabel" style={{ color: 'var(--primary-font)' }}>
							{theme.label}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(ThemeSelector);
