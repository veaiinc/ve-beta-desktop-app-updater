import React from 'react';
import s from './shortcuts.module.scss';
import { ReactComponent as ShortcutBarSvg } from '../../assets/shortcutBar.svg';

const shortcuts = [
	{
		id: 'glass-mode',
		name: 'Glass Mode',
		keys: ['⌘', 'G'],
	},
	{
		id: 'overlay',
		name: 'Overlay',
		keys: ['⌘', '\\'],
	},
	{
		id: 'ask-ai',
		name: 'Ask AI',
		keys: ['⌘', 'Return'],
	},
	{
		id: 'open-ve',
		name: 'Open VE',
		keys: ['⌘', '•'],
	},
	{
		id: 'incognito-mode',
		name: 'Incognito mode',
		keys: ['⌘', 'Shift', 'P'],
	},
];

const Shortcuts = ({ onClose }) => {
	const handleClose = () => {
		if (onClose) return onClose();
		try {
			document.body.click();
		} catch (e) {}
	};

	return (
		<div className={s.overlayContainer}>
			<div className={s.shortcutsHeader}>
				<h2 className={s.title}>Shortcuts</h2>
			</div>
			<div className={s.shortcutsList}>
				{shortcuts.map((shortcut) => (
					<div key={shortcut.id} className={s.shortcutItem}>
						<span className={s.shortcutName}>{shortcut.name}</span>
						<div className={s.shortcutKeys}>
							{shortcut.keys.map((key, index) => (
								<span key={index} className={s.keyButton}>
									{key}
								</span>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Shortcuts;
