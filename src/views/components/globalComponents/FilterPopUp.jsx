import React, { memo } from 'react';
import '../../../assets/scss/globalComponents/filterPopup.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';

const FilterPopUp = ({
	width = '220px',
	height = '200px',
	background = '#202123',
	borderRadius = '14px',
	top = '0',
	left = '0',
	className,
	open,
	options,
	hasMoreOptions,
	onOptionClick,
	fetchMoreOptions,
	searchInput = false,
	searchInputPlaceholder = 'Filter By',
	setSearchValue,
}) => {
	return (
		<>
			{open && (
				<div
					onClick={(e) => e?.stopPropagation()}
					style={{ width, height, background, borderRadius, top, left }}
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
					<div id="filterFocDocs" className="filterPopUpOptionsContainer">
						<InfiniteScroll
							dataLength={options?.length ?? 0}
							next={fetchMoreOptions}
							hasMore={hasMoreOptions ?? true}
							loader={<FetchMoreLoaderComp />}
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '8px',
								width: '100%',
							}}
							scrollableTarget="filterFocDocs"
						>
							{options?.map((option, idx) => (
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
			)}
		</>
	);
};

export default memo(FilterPopUp);
