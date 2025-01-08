import React, { memo } from 'react';
// theme preference component
const ThemePreferenceComponent = ({ updateThemeSubmitHandler, activeTheme }) => {
	return (
		<div className={'themeMain'}>
			<h4>Theme Preference</h4>
			<div>
				<button
					className={activeTheme === 'system' ? 'activeButton' : ''}
					onClick={() => updateThemeSubmitHandler('system')}
					disabled={activeTheme === 'system' ? true : false}
				>
					System
				</button>
				<button
					className={activeTheme === 'dark' ? 'activeButton' : ''}
					onClick={() => updateThemeSubmitHandler('dark')}
					disabled={activeTheme === 'dark' ? true : false}
				>
					Dark
				</button>
				<button
					className={activeTheme === 'light' ? 'activeButton' : ''}
					onClick={() => updateThemeSubmitHandler('light')}
					disabled={activeTheme === 'light' ? true : false}
				>
					Light
				</button>
			</div>
		</div>
	);
};

export default memo(ThemePreferenceComponent);
