import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
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
	const [info, setInfo] = useState({ isOpen: false });
	const handlePropagation = useCallback((e) => {
		e.stopPropagation();
	}, []);

	const handleDropDown = (value) => {
		setInfo((prevInfo) => ({ ...prevInfo, isOpen: value }));
	};

	return (
		<Tooltip
			// className="dropdown-parent"
			placement="bottom"
			open={info?.isOpen}
			onOpenChange={(open) => {
				if (!open) {
					handleDropDown(false);
				}
			}}
			title={
				<div
					className={options?.length === 0 ? '' : 'listView-dropdown-container'}
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
											handleDropDown(false);
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
						''
						// <div className="listItem">No options found</div>
					)}
				</div>
			}
			arrow={false}
			trigger={'click'}
			color={'transparent'}
			overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
		>
			<div
				className=""
				style={{ cursor: 'pointer' }}
				onClick={(e) => {
					handlePropagation(e);
					handleDropDown(true);
				}}
			>
				{children}
			</div>
		</Tooltip>
	);
};

export default memo(DropDown);
