import React, { memo } from 'react';

const ThemePreferenceComponent = ({ updateThemeSubmitHandler, activeTheme }) => {
	return (
		<div className={'themeMain'}>
			<h4>Theme Preference</h4>
			<div>
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
