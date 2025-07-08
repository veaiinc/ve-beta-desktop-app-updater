import { memo } from 'react';
import s from '../../../../assets/scss/notes/databaseComponents/databaseViewTabs.module.scss';
import { ReactComponent as PlusIcon } from '../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as ListViewIcon } from '../../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardViewIcon } from '../../../../assets/svg/tasks/board.svg';
import { ReactComponent as TableViewIcon } from '../../../../assets/svg/tasks/grid.svg';
import { ReactComponent as GalleryViewIcon } from '../../../../assets/svg/tasks/blocks.svg';

export const layouts = {
	list: {
		Icon: <ListViewIcon />,
		label: 'List',
		viewType: 'list',
	},
	board: {
		Icon: <BoardViewIcon />,
		label: 'Board',
		viewType: 'board',
	},
	table: {
		Icon: <TableViewIcon />,
		label: 'Table',
		viewType: 'table',
	},
	gallery: {
		Icon: <GalleryViewIcon />,
		label: 'Widget',
		viewType: 'gallery',
	},
};

const DatabaseViewTabs = () => {
	return (
		<div className={s.databaseViewTabs}>
			<div className={s.tabsArea}>
				<div className={s.tab}>
					<div className={s.tabIcon}>
						<ListViewIcon />
					</div>
					<div className={s.tabLabel}>Table</div>
				</div>
				<div className={s.tab}>
					<div className={s.tabIcon}>
						<TableViewIcon />
					</div>
					<div className={s.tabLabel}>Table</div>
				</div>
			</div>
			<div className={s.actionButtons}>
				<button className={s.addTabButton}>
					<PlusIcon />
				</button>
			</div>
		</div>
	);
};

export default memo(DatabaseViewTabs);
