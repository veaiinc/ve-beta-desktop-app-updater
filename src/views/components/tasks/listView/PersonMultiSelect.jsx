import { memo, useState, useEffect } from 'react';
import '../../../../assets/scss/tasks/personMultiSelect.scss';
import { Tooltip } from 'antd';
import PersonDropdown from '../../dropDown/tasks/PersonDropdown';

const PersonMultiSelect = ({
	value = [],
	showTitle = false,
	title = '',
	onOptionClick,
	disabled = false,
	showLabel = false,
	showEmail = true,
}) => {
	const [info, setInfo] = useState({
		open: false,
		selected: [],
	});

	useEffect(() => {
		setInfo((prev) => ({ ...prev, selected: value }));
	}, [JSON.stringify(value)]);

	const handleOptionClick = (option) => {
		const isSelected = info?.selected?.some((item) => item._id === option._id);
		let newSelected;

		if (isSelected) {
			newSelected = info?.selected?.filter((item) => item._id !== option._id);
		} else {
			newSelected = [...info?.selected, option];
		}

		onOptionClick?.(newSelected);
		setInfo((prev) => ({ ...prev, selected: newSelected }));
	};

	return (
		<div className="person-multi-select-container">
			<Tooltip
				title={showTitle ? <div className="tooltip-inner">{title}</div> : ''}
				placement="bottom"
				overlayClassName="tooltip-overlay-container"
				color="transparent"
			>
				<Tooltip
					title={
						!disabled ? (
							<PersonDropdown
								title={title}
								selectedOptions={info?.selected}
								onOptionClick={handleOptionClick}
								selected={value}
								open={info?.open}
							/>
						) : null
					}
					open={info.open}
					onOpenChange={(open) => {
						if (!open) {
							setInfo((prev) => ({ ...prev, open: false }));
						}
					}}
					placement="bottom"
					trigger="click"
					arrow={false}
					color="transparent"
					overlayStyle={{ minWidth: 'fit-content' }}
					destroyOnHidden={true}
				>
					<div
						className="person-multi-select-selected"
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
													{showEmail && item?.email && (
														<span className="person-multi-select-selected-item-email">
															{item?.email}
														</span>
													)}
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
								<div className="person-multi-select-selected-item person-multi-select-add-item">
									<span className="person-multi-select-add-item-text">
										+ Select Clients
									</span>
								</div>
							</div>
						) : (
							`Select ${title}`
						)}
					</div>
				</Tooltip>
			</Tooltip>
		</div>
	);
};

export default memo(PersonMultiSelect);
