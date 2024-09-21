// theme preference component
const ThemePreferenceComponent = ({ updateThemeSubmitHandler, activeTheme }) => {
	return (
		<div className={'themeMain'}>
			<h4>Theme performance</h4>
			<div>
				<button
					className={activeTheme === 'system' ? 'activeButton' : ''}
					onClick={() => updateThemeSubmitHandler('system')}
				>
					Follow system preferences
				</button>
				<button
					className={activeTheme === 'light' ? 'activeButton' : ''}
					onClick={() => updateThemeSubmitHandler('light')}
				>
					Light
				</button>
				<button
					className={activeTheme === 'dark' ? 'activeButton' : ''}
					onClick={() => updateThemeSubmitHandler('dark')}
				>
					Dark
				</button>
			</div>
		</div>
	);
};

export default ThemePreferenceComponent;
