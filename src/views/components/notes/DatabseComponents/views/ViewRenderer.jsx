import React, { memo } from 'react';
import TableView from './TableView';
import ListView from './ListView';
import BoardView from './BoardView';
import GalleryView from './GalleryView';

const viewsMapper = {
	table: TableView,
	list: ListView,
	board: BoardView,
	gallery: GalleryView,
};

const ViewRenderer = ({
	selectedDatabaseView,
	groupData,
	metaInfo,
	columns,
	databaseId,
	pageId,
	block,
}) => {
	const ViewComponent = viewsMapper[selectedDatabaseView?.type] || TableView;

	return (
		<ViewComponent
			groupData={groupData}
			metaInfo={metaInfo}
			columns={columns}
			databaseId={databaseId}
			pageId={pageId}
			block={block}
		/>
	);
};

export default memo(ViewRenderer);
