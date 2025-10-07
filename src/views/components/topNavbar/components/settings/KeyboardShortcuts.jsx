import React from 'react';
import { useGlassMode } from '../../../../../context/GlassModeContext';
import s from './keyboardShortcuts.module.scss';

const KeyboardShortcuts = () => {
	const { isGlassModeEnabled, toggleGlassMode } = useGlassMode();

	const shortcuts = [
		{
			action: 'Toggle Glass Mode',
			shortcut: '⌘ + G',
			description: 'Enable/disable glass morphism effects',
			status: isGlassModeEnabled ? 'enabled' : 'disabled',
		},
		{
			action: 'Toggle Overlay',
			shortcut: '⌘ + \\',
			description: 'Show/hide the overlay window',
		},
		{
			action: 'Toggle Ask AI',
			shortcut: '⌘ + Enter',
			description: 'Open/close the Ask AI chatbox',
		},
		{
			action: 'Toggle Main Window',
			shortcut: '⌘ + .',
			description: 'Show/hide the main application window',
		},
		{
			action: 'Content Protection',
			shortcut: '⌘ + Shift + P',
			description: 'Toggle invisibility mode',
		},
	];

	return (
		<div className={s.keyboardShortcuts}>
			<div className={s.header}>
				<h2>Keyboard Shortcuts</h2>
				<p>Quick access to app features using keyboard shortcuts</p>
			</div>

			<div className={s.shortcutsList}>
				{shortcuts.map((shortcut, index) => (
					<div key={index} className={s.shortcutItem}>
						<div className={s.shortcutInfo}>
							<div className={s.action}>
								{shortcut.action}
								{shortcut.status && (
									<span className={`${s.status} ${s[shortcut.status]}`}>
										{shortcut.status}
									</span>
								)}
							</div>
							<div className={s.description}>{shortcut.description}</div>
						</div>
						<div className={s.shortcutKey}>{shortcut.shortcut}</div>
					</div>
				))}
			</div>

			<div className={s.glassModeDemo}>
				<h3>Glass Mode Demo</h3>
				<p>Try the Command+G shortcut to see glass morphism effects in action!</p>
				<button className={s.demoButton} onClick={toggleGlassMode}>
					{isGlassModeEnabled ? 'Disable' : 'Enable'} Glass Mode
				</button>
			</div>

			<div className={s.note}>
				<p>
					<strong>Note:</strong> On Windows, if Command+G doesn't work, try Ctrl+Alt+G as
					an alternative.
				</p>
			</div>
		</div>
	);
};

export default KeyboardShortcuts;
