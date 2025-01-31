import React from 'react';
import '../../../../assets/scss/tasks/galleryView.scss';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import CardItem from '../listView/CardItem';
import Skeleton from 'react-loading-skeleton';
const GalleryView = ({
	responseMetadata,
	colors,
	fetchMoreData,
	handleRowClick,
	handleUpdate,
	data,
	loading,
	hasMore,
	error,
	rowTypes,
	properties,
	handleAddButtonOnClick,
	infiniteScrollHeight,
}) => {
	return (
		<div className="gallery-view">
			{loading
				? [...Array(9)].map((_, index) => (
						<div className="cardItemSkeleton" key={index}>
							<Skeleton width="230px" height="200px" borderRadius="12px" />
						</div>
				  ))
				: data?.map((item) => (
						<CardItem
							key={item._id}
							task={item}
							responseMetadata={responseMetadata}
							colors={colors}
							rowTypes={rowTypes}
							properties={properties}
							handleUpdate={handleUpdate}
							onClick={() => handleRowClick(item)}
						/>
				  ))}
			<div className="gallery-view-add-card" onClick={handleAddButtonOnClick}>
				<PlusSvg /> Add Card
			</div>
		</div>
	);
};

export default GalleryView;
