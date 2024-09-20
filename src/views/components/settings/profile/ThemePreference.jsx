// theme preference component
const ThemePreferenceComponent = ({ setActiveTheme, activeTheme }) => {
	return (
		<div className={'themeMain'}>
			<h4>Theme performance</h4>
			<div>
				<button
					className={activeTheme === 'system' ? 'activeButton' : ''}
					onClick={() => setActiveTheme('system')}
				>
					Follow system preferences
				</button>
				<button
					className={activeTheme === 'light' ? 'activeButton' : ''}
					onClick={() => setActiveTheme('light')}
				>
					Light
				</button>
				<button
					className={activeTheme === 'dark' ? 'activeButton' : ''}
					onClick={() => setActiveTheme('dark')}
				>
					Dark
				</button>
			</div>
		</div>
	);
};

export default ThemePreferenceComponent;
