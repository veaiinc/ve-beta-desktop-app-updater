import { memo, useState, useRef, useEffect } from 'react';
import s from '../../../assets/scss/chat/selectDropdown.module.scss';
import { Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const customStyles = { padding: 0 };
const inputCustomStyles = { margin: 0 };

const SelectDropdown = ({
	options = [],
	setOption,
	searchable = false,
	visible,
	setVisible,
	value,
	children,
}) => {
	const [searchValue, setSearchValue] = useState('');
	const dropdownRef = useRef(null);

	const selectedLabel = options.find((opt) => opt.value === value)?.label || '';

	const filteredOptions = options.filter((option) =>
		option.label?.toLowerCase().includes(searchValue.toLowerCase()),
	);

	

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (!visible) {
			setSearchValue('');
		}
	}, [visible]);
	
	const handleSelect = (option) => {
		setOption(option);
		setVisible(false);
		setSearchValue('');
	};

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setVisible(false);
		}
	};

	return (
		<div className={s.selectDropdownContainer} ref={dropdownRef}>
			<Tooltip
				trigger={[]}
				placement="bottomLeft"
				color="transparent"
				open={visible}
				onOpenChange={() => {}}
				overlayInnerStyle={{
					padding: 0,
					backgroundColor: 'var(--card, #181a1b)',
					border: '1px solid var(--stroke, #2c2d2e)',
					borderRadius: '8px',
				}}
				overlayClassName={s.buildTooltipWrapper}
				title={
					<div
						className={s.buildTooltipContainer}
						onMouseDown={(e) => e.preventDefault()}
					>
						{searchable && (
							<input
								type="text"
								className={s.searchInput}
								placeholder="Search..."
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								onClick={(e) => e.stopPropagation()}
								onMouseDown={(e) => e.stopPropagation()}
								autoFocus
							/>
						)}
						{filteredOptions.length > 0 ? (
							filteredOptions
								.filter((option) => !option.disabled)
								.map((option) => (
									<div
										className={s.option}
										key={option.value}
										onMouseDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
											handleSelect(option);
										}}
									>
										{option.label}
									</div>
								))
						) : (
							<div className={s.noOptions}>No results found</div>
						)}
					</div>
				}
			>
				<div
					className={s.selectDropdown}
					style={visible && searchable ? customStyles : {}}
					onClick={(e) => {
						e.stopPropagation();
						setVisible(!visible);
					}}
				>
					{children}
					{visible && searchable ? (
						<input
							type="text"
							className={s.inlineSearchInput}
							placeholder={selectedLabel || 'Search...'}
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							autoFocus
							onClick={(e) => e.stopPropagation()}
							onMouseDown={(e) => e.stopPropagation()}
							style={inputCustomStyles}
						/>
					) : (
						<span className={s.selectedValue}>{selectedLabel || 'Please select'}</span>
					)}
					<DownOutlined />
				</div>
			</Tooltip>
		</div>
	);
};

export default memo(SelectDropdown);
