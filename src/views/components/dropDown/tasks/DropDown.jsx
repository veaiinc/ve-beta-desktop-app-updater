import React, { memo, useEffect, useRef } from 'react';
import '../../../../assets/scss/dropdown/tasks/dropDown.scss';
import { ReactComponent as Tick } from '../../../../assets/svg/tasks/checkmark.svg';
import { Tooltip } from 'antd';

const DropDown = ({
	title,
	children,
	options,
	valueSelector = 'label',
	selected,
	defaultValue,
	containerStyles,
	listItemStyles,
	titleStyles,
}) => {
	return (
		<Tooltip
			// className="dropdown-parent"
			placement="bottom"
			title={
				<div
					className="listView-dropdown-container"
					style={containerStyles ? { ...containerStyles } : {}}
				>
					{title ? (
						<div
							className="dropdown-title"
							style={titleStyles ? { ...titleStyles } : {}}
						>
							{title}
						</div>
					) : (
						''
					)}
					{options ? (
						<>
							{options?.map((option, index) => (
								<div
									key={index}
									className="listItem"
									style={listItemStyles ? { ...listItemStyles } : {}}
								>
									<div className="list-details">
										{option?.icon ? option.icon : ''}
										{option?.[valueSelector] ? (
											<span className="listItem-label">
												{option?.[valueSelector]}
											</span>
										) : (
											''
										)}
									</div>
									{selected === option?.[valueSelector] ? <Tick /> : ''}
								</div>
							))}
							{defaultValue ? (
								<div className="listItem" key={'default-value'}>
									<div className="list-details">
										<span className="listItem-label">{defaultValue}</span>
									</div>
									{selected === defaultValue || !selected ? <Tick /> : ''}
								</div>
							) : (
								''
							)}
						</>
					) : (
						''
					)}
				</div>
			}
			arrow={false}
			trigger={'click'}
			color={'transparent'}
			overlayStyle={{ minWidth: 'fit-content' }}
		>
			{children}
		</Tooltip>
	);
};

export default memo(DropDown);
