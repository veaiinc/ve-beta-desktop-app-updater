import { Tooltip } from 'antd';
import { useState, memo } from 'react';
import '../../../../assets/scss/dropdown/file/filterDropdown.scss';
import ChevronRightThinSvg from '../../../../assets/svg/tasks/chevronRightThin.svg?react';
import ArrowSvg from '../../../../assets/svg/file/arrow.svg?react';

const FilterDropdown = ({
	selected,
	options,
	onOptionClick,
	width = '175px',
	showSelectedEndArrow,
	hideOnOptionClick = true,
}) => {
	const [info, setInfo] = useState({
		isOpen: false,
	});

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	return (
		<Tooltip
			placement="bottomLeft"
			open={info?.isOpen}
			onOpenChange={(open) => {
				if (!open) {
					handleInfoChange({ isOpen: false });
				}
			}}
			title={
				<div className="file-filter-dropdown-tooltip" style={{ width }}>
					{options?.map((item) => (
						<div
							className="file-filter-option-items"
							key={item?.value}
							onClick={() => {
								onOptionClick(item);
								if (!hideOnOptionClick) return;
								handleInfoChange({ isOpen: false });
							}}
						>
							{selected?.value === item?.value ? (
								<div className="selected-indicator-dot"></div>
							) : null}

							<div className="option-value-wrapper">{item?.label}</div>
							{showSelectedEndArrow && selected?.value === item?.value && (
								<ArrowSvg
									className={`sortType ${
										selected?.sortType === -1 && `sortType-up`
									}`}
								/>
							)}
						</div>
					))}
				</div>
			}
			arrow={false}
			trigger={'click'}
			color={'transparent'}
			overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
			style={{ padding: 0 }}
		>
			<div
				className="file-filter-dropdown"
				onClick={() => handleInfoChange({ isOpen: !info?.isOpen })}
			>
				<span className="file-filter-dropdown-text">{selected?.label}</span>
				<ChevronRightThinSvg className={info?.isOpen ? 'chevron-open' : 'chevron-close'} />
			</div>
		</Tooltip>
	);
};

export default memo(FilterDropdown);
