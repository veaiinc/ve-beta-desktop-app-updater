import { memo } from 'react';
import s from '../../../assets/scss/notesPage/notesPage.module.scss';

// Icons
import CardsViewIcon from '../../../assets/svg/notesPage/CardsViewIcon';
import ListViewIcon from '../../../assets/svg/notesPage/ListViewIcon';
import SortIcon from '../../../assets/svg/notesPage/SortIcon';
import FilterIcon from '../../../assets/svg/notesPage/FilterIcon';

const ViewModeSortFilter = ({ viewMode, setViewMode }) => {
	return (
		<div className={s.ctaContainer}>
			{/* <div className={s.viewModeAndFilters}>
				<div className={s.viewMode}>
					<button
						onClick={() => setViewMode('cards')}
						aria-label="Switch to card view"
						className={`${s.viewModeIcon} ${viewMode === 'cards' ? s.active : ''}`}
					>
						<CardsViewIcon active={viewMode === 'cards'} />
					</button>
					<button
						onClick={() => setViewMode('list')}
						aria-label="Switch to list view"
						className={`${s.viewModeIcon} ${viewMode === 'list' ? s.active : ''}`}
					>
						<ListViewIcon active={viewMode === 'list'} />
					</button>
				</div>
				<div className={s.sortContainer}>
					<button aria-label="Sort" className={s.sortIcon}>
						<SortIcon />
					</button>
				</div>
				<div className={s.filterContainer}>
					<button aria-label="Filter" className={s.filterIcon}>
						<FilterIcon />
					</button>
				</div>
			</div> */}
		</div>
	);
};

export default memo(ViewModeSortFilter);
