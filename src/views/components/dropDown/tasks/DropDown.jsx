import React, { memo, useCallback, useEffect, useRef } from 'react';
import '../../../../assets/scss/dropdown/tasks/dropDown.scss';
import { ReactComponent as Tick } from '../../../../assets/svg/tasks/checkmark.svg';
import { Tooltip } from 'antd';

const DropDown = ({
	title,
	children,
	options,
	valueSelector = 'label',
	selected,
	containerStyles,
	listItemStyles,
	titleStyles,
	onOptionClick,
}) => {
	const handlePropagation = useCallback((e) => {
		e.stopPropagation();
	}, []);
	return (
		<Tooltip
			// className="dropdown-parent"
			placement="bottom"
			title={
				<div
					className="listView-dropdown-container"
					style={containerStyles ? { ...containerStyles } : {}}
					onClick={handlePropagation}
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
					{options?.length > 0 ? (
						<>
							{options?.map((option, index) => (
								<div
									key={index}
									className="listItem"
									style={listItemStyles ? { ...listItemStyles } : {}}
									onClick={() => {
										if (onOptionClick) {
											onOptionClick(option?.[valueSelector]);
										}
									}}
								>
									<div className="list-details">
										{option?.icon ? option.icon : ''}
										{option?.[valueSelector] !== undefined ? (
											<span className="listItem-label">
												{option?.label
													? option?.label
													: option?.[valueSelector]}
											</span>
										) : (
											''
										)}
									</div>
									{selected === option?.[valueSelector] ? <Tick /> : ''}
								</div>
							))}
						</>
					) : (
						<div className="listItem">No options found</div>
					)}
				</div>
			}
			arrow={false}
			trigger={'click'}
			color={'transparent'}
			overlayStyle={{ minWidth: 'fit-content' }}
		>
			<div className="" style={{ cursor: 'pointer' }} onClick={handlePropagation}>
				{children}
			</div>
		</Tooltip>
	);
};

export default memo(DropDown);
