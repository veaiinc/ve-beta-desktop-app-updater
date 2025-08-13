import { memo } from 'react';
import Spinner from '../loaders/Spinner';
import s from '../../../assets/scss/notes/toolsSuggestionMenu.module.scss';

const ToolsSuggestionMenu = ({ items, selectedIndex }) => {
	return (
		<div className={s.toolsSuggestionMenu}>
			{items?.map((item, index) => (
				<div
					key={item.key || index}
					className={`${s.toolItem} ${selectedIndex === index ? s.selected : ''}`}
					onClick={item.onItemClick}
				>
					<div className={s.icon}></div>
					<div className={s.name}>{item.title}</div>
				</div>
			))}
			{items.length === 0 && <div className={s.noResults}>No results found</div>}
		</div>
	);
};

export default memo(ToolsSuggestionMenu);
