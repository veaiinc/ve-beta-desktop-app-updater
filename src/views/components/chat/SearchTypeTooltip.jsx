import { Tooltip } from 'antd';
import React from 'react';
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
			placement="top"
			open={isOpen}
			onOpenChange={onOpenChange}
			color="transparent"
			trigger="click"
			title={
				<div className="search-type-container">
					<div className="title">Search Type</div>
					<div className="items-container">
						{Object?.keys(searchTypeOptions)?.map((type) => (
							<div className="item" key={type}>
								<div className="icon">{searchTypeOptions[type]?.icon}</div>
								<div className="text">{searchTypeOptions[type]?.label}</div>
								<div className="toggle-button-container">
									<Switch
										checked={searchType?.[type]}
										onChange={(checked) => {
											onSearchTypeChange(type, checked);
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			}
		>
			{children}
		</Tooltip>
	);
};

export default SearchTypeTooltip;
