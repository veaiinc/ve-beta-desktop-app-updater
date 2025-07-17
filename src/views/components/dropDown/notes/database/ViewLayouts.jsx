import { memo, useState } from 'react';
import s from '../../../../../assets/scss/notes/dropdown/viewLayouts.module.scss';
import { ReactComponent as CrossSvg } from '../../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as ArrowLeftSvg } from '../../../../../assets/svg/tasks/arrowLeft.svg';

import { ReactComponent as ListViewIcon } from '../../../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardViewIcon } from '../../../../../assets/svg/tasks/board.svg';
import { ReactComponent as TableViewIcon } from '../../../../../assets/svg/tasks/grid.svg';
import { ReactComponent as GalleryViewIcon } from '../../../../../assets/svg/tasks/blocks.svg';

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

const layoutsArray = Object?.values(layouts);

const ViewLayouts = ({ handleBack, handleClose, view, updateView }) => {
	const [info, setInfo] = useState({ loading: false });
	const activeViewType = view?.type;

	const handleUpdate = async (type) => {
		if (info?.loading) return;
		setInfo((prevInfo) => ({ ...prevInfo, loading: true }));
		await updateView({ type });
		setInfo((prevInfo) => ({ ...prevInfo, loading: false }));
	};

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
					<button
						className={`${s.layoutWrapper} ${
							item.viewType === activeViewType ? s.active : ``
						}`}
						key={item?.viewType}
						onClick={() => handleUpdate(item?.viewType)}
						disabled={info?.loading}
					>
						{item?.Icon}
						<div className={s.layoutText}>{item?.label}</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default memo(ViewLayouts);
