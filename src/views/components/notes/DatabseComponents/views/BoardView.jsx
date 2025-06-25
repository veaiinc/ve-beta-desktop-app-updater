import { memo, useCallback, useContext } from 'react';
import s from '../../../../../assets/scss/notes/databaseComponents/boardView.module.scss';
import { rowTypes } from '../../Database';
import Context from '../../../../../context/context';
import { colors } from '../../../../../helpers/databaseHelpers';
import Board from './Board';

const BoardView = ({ groupData, metaInfo, columns, databaseId, pageId, view, blockId }) => {
	return (
		<div className={s.boardViewWrapper}>
			{view?.groupBy?.defaultGroups?.map((item, index) => (
				<Board
					key={item?._id}
					item={item}
					groupData={groupData}
					columns={columns}
					databaseId={databaseId}
					blockId={blockId}
					view={view}
					pageId={pageId}
				/>
			))}
		</div>
	);
};

export default memo(BoardView);
