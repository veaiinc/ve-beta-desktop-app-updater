import { Tooltip } from 'antd';
import React, { memo } from 'react';
import { Switch } from 'antd';

const SearchTypeTooltip = ({
	children,
	searchTypeOptions,
	onOpenChange,
	isOpen,
	searchType,
	onSearchTypeChange,
}) => {
	return (
		<Tooltip
			placement={'bottom'}
			open={isOpen}
			onOpenChange={onOpenChange}
			color="transparent"
			trigger="click"
			rootClassName="search-type-tooltip"
			title={
				<div className="search-type-container">
					<div className="items-container">
						{Object?.keys(searchTypeOptions)?.map((type) => {
							const Icon = searchTypeOptions[type]?.icon;

							return (
								<div className="item" key={type}>
									<div className="icon">
										<Icon active={searchType?.[type]} />
									</div>
									<div className="search-type-text-container">
										<div
											className="title-text"
											style={{
												color: `${
													searchType?.[type]
														? 'var(--primary-button)'
														: 'var(--primary-font'
												}`,
											}}
										>
											{searchTypeOptions[type]?.title || ''}
										</div>
										<div className="subtitle-text">
											{searchTypeOptions[type]?.subTitle || ''}
										</div>
									</div>
									<div className="toggle-button-container">
										<Switch
											checked={searchType?.[type]}
											onChange={(checked) => {
												onSearchTypeChange(type, checked);
											}}
											size="small"
											style={{
												background: `${
													searchType?.[type]
														? 'var(--primary-button)'
														: 'var(--primary-font)'
												}`,
											}}
											className="custom-switch"
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			}
		>
			{children}
		</Tooltip>
	);
};

export default memo(SearchTypeTooltip);
