import { memo } from 'react';
import s from '../../../../../assets/scss/notes/dropdown/viewLayouts.module.scss';
import { ReactComponent as CrossSvg } from '../../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as ArrowLeftSvg } from '../../../../../assets/svg/tasks/arrowLeft.svg';

import { ReactComponent as ListViewIcon } from '../../../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardViewIcon } from '../../../../../assets/svg/tasks/board.svg';
import { ReactComponent as TableViewIcon } from '../../../../../assets/svg/tasks/grid.svg';
import { ReactComponent as GalleryViewIcon } from '../../../../../assets/svg/tasks/blocks.svg';

const layouts = {
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

const layoutsArray = Object?.values(layouts);

const ViewLayouts = ({ handleBack, handleClose }) => {
	return (
		<div className={s.viewLayout}>
			<div className={s.header}>
				<ArrowLeftSvg className={s.cursorPointer} onClick={handleBack} />
				<span className={s.optionsDropdownHeaderTitle}>Layout</span>
				<CrossSvg className={s.cursorPointer} onClick={handleClose} />
			</div>
			<div className={s.divider} />
			<div className={s.viewsContainer}>
				{layoutsArray?.map((item) => (
					<div
						className={`${s.layoutWrapper} ${
							item.viewType === 'table' ? s.active : ``
						}`}
					>
						{item?.Icon}
						<div className={s.layoutText}>{item?.label}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(ViewLayouts);
