import React, { memo } from 'react';
import '../../../assets/scss/globalComponents/filterPopup.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';

const FilterPopUp = ({
	width = '220px',
	height = '200px',
	background = '#202123',
	borderRadius = '14px',
	className,
	options,
	hasMoreOptions,
	onOptionClick,
	fetchMoreOptions,
	searchInput = false,
	searchInputPlaceholder = 'Filter By',
	searchValue,
	setSearchValue,
}) => {
	const filteredOptions = options?.filter((option) => {
		const searchField = option?.name || option?.title; // Use `name` if it exists, otherwise use `title`
		return searchField?.includes(searchValue);
	});

	return (
		<div
			style={{ width, height, background, borderRadius }}
			className={`filterPopUpContainer ${className}`}
		>
			{searchInput && (
				<div className="filterPopUpHeader">
					<input
						className="filterPopUpSearchInput"
						type="text"
						placeholder={searchInputPlaceholder}
						onChange={(e) => setSearchValue(e?.target?.value)}
						autoFocus
					/>
				</div>
			)}
			<div className="filterPopUpOptionsContainer">
				<InfiniteScroll
					dataLength={filteredOptions?.length ?? 0}
					next={fetchMoreOptions}
					hasMore={hasMoreOptions ?? true}
					loader={<FetchMoreLoaderComp />}
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
						width: '100%',
					}}
					height={height}
					// scrollableTarget="filterFocDocs"
				>
					{filteredOptions?.map((option, idx) => (
						<div
							key={option?.id ?? idx}
							className="filterPopUpOption"
							onClick={() => onOptionClick(option)}
						>
							<span>{option?.name ?? option?.title}</span>
						</div>
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default memo(FilterPopUp);
