import { memo } from 'react';
import s from './agentsList.module.scss';
import ListViewIcon from '../../../../assets/svg/notesPage/ListViewIcon';
import CardsViewIcon from '../../../../assets/svg/notesPage/CardsViewIcon';
const ViewToggle = ({ viewMode, onViewModeChange }) => {
	return (
		<div className={s.viewToggleContainer}>
			<button
				className={`${s.viewToggleBtn} ${viewMode === 'card' ? s.active : ''}`}
				onClick={() => onViewModeChange('card')}
				title="Card View"
			>
				<div className={s.viewToggleIcon}>
					<CardsViewIcon active={viewMode === 'card'} />
				</div>
			</button>
			<button
				className={`${s.viewToggleBtn} ${viewMode === 'list' ? s.active : ''}`}
				onClick={() => onViewModeChange('list')}
				title="List View"
			>
				<div className={s.viewToggleIcon}>
					<ListViewIcon active={viewMode === 'list'} />
				</div>
			</button>
		</div>
	);
};

export default memo(ViewToggle);
