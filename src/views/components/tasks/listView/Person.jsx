/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, memo, useState, useEffect } from 'react';
import '../../../../assets/scss/tasks/person.scss';
import { Tooltip } from 'antd';
import TeamMembersDropdown from '../../dropDown/tasks/TeamMembersDropdown';

const Person = ({
	value,
	showLabel = false,
	title,
	onOptionClick,
	multiSelect = false,
	disabled = false,
	showTitle = false,
}) => {
	const [info, setInfo] = useState({
		open: false,
		selected: [],
	});

	useEffect(() => {
		if (!value || value?.length === 0) return;
		setInfo((prev) => ({
			...prev,
			selected: multiSelect
				? value?.map((item) => ({ _id: item?._id, name: item?.name }))
				: [{ _id: value?._id, name: value?.name }],
		}));
	}, [value]);
	const handleOptionClick = useCallback(
		(option) => {
			const isSelected = info?.selected?.some((item) => item._id === option._id);
			let newSelected;

			if (multiSelect) {
				if (isSelected) {
					newSelected = info?.selected?.filter((item) => item._id !== option._id);
				} else {
					newSelected = [
						...(info?.selected || []),
						{ name: option?.name, _id: option?._id },
					];
				}
				onOptionClick?.(newSelected);
			} else {
				newSelected = isSelected ? [] : [{ name: option?.name, _id: option?._id }];
				onOptionClick?.(newSelected[0] || null);
			}

			setInfo((prev) => ({ ...prev, selected: newSelected }));
		},
		[info?.selected],
	);

	return (
		<Tooltip
			title={
				showTitle
					? info?.selected?.length > 0 && (
							<div className="person-tooltip-container">
								{`${title} ${
									info?.selected?.length
										? `${info.selected[0]?.name}${
												info.selected.length > 1
													? ` +${info.selected.length - 1} more`
													: ''
										  }`
										: ''
								}`}
							</div>
					  )
					: ''
			}
			placement="bottom"
			overlayClassName="person-tooltip-wrapper"
			color="transparent"
		>
			<Tooltip
				title={
					!disabled && (
						<TeamMembersDropdown
							onOptionClick={handleOptionClick}
							selected={info?.selected}
							title={title}
						/>
					)
				}
				placement="bottom"
				trigger="click"
				arrow={false}
				color="transparent"
				overlayStyle={{ minWidth: 'fit-content' }}
				destroyTooltipOnHide
			>
				<div
					className="person-multi-select-selected filter-wrapper"
					onClick={(e) => {
						e?.stopPropagation();
						setInfo((prev) => ({ ...prev, open: !info?.open }));
					}}
				>
					{info?.selected?.length > 0 ? (
						<div className="person-multi-select-selected-list">
							{(showLabel ? info?.selected : info?.selected?.slice(0, 3)).map(
								(item) => (
									<div
										className={
											'person-multi-select-selected-item ' +
											(!showLabel
												? 'person-multi-select-selected-item-stacked'
												: '')
										}
										key={item?._id}
									>
										<div className="person-multi-select-selected-item-avatar">
											{item?.name?.charAt(0)}
										</div>
										{showLabel && (
											<div className="person-multi-select-selected-item-name">
												<span className="person-multi-select-selected-item-name-text">
													{item?.name}
												</span>
											</div>
										)}
									</div>
								),
							)}
							{!showLabel && info?.selected?.length > 3 && (
								<div
									className="person-multi-select-selected-item person-multi-select-selected-item-stacked"
									onClick={() => setInfo((prev) => ({ ...prev, open: true }))}
								>
									<div className="person-multi-select-selected-item-avatar">
										+{info?.selected?.length - 3}
									</div>
								</div>
							)}
						</div>
					) : (
						`Select ${title}`
					)}
				</div>
			</Tooltip>
		</Tooltip>
	);
};

export default memo(Person);
