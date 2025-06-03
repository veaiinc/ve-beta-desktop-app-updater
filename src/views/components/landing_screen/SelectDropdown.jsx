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

	const handleSelect = (option) => {
		console.log('Selected option:', option); // Debug: Confirm selection
		setOption(option);
		setVisible(false);
		setSearchValue('');
	};

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			console.log('Clicked outside, closing dropdown'); // Debug: Confirm outside click
			setVisible(false);
		}
	};

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

	return (
		<div className={s.selectDropdownContainer} ref={dropdownRef}>
			<Tooltip
				trigger="click"
				placement="bottomLeft"
				color="transparent"
				visible={visible}
				onVisibleChange={(v) => {
					console.log('Tooltip visibility:', v); // Debug: Confirm tooltip toggle
					setVisible(v);
				}}
				overlayInnerStyle={{ padding: 0 }}
				title={
					<div
						className={s.buildTooltipContainer}
						onClick={(e) => e.stopPropagation()} // Prevent clicks inside tooltip from closing it
					>
						{filteredOptions.length > 0 ? (
							filteredOptions
								.filter((option) => !option.disabled)
								.map((option) => (
									<div
										className={s.option}
										key={option.value}
										onClick={(e) => {
											// e.stopPropagation(); // Prevent click from bubbling to tooltip
											console.log('Option clicked:', option); // Debug: Confirm option click
											handleSelect(option);
										}}
										style={{ cursor: 'pointer', padding: '8px' }} // Ensure clickable
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
						e.stopPropagation(); // Prevent double toggling
						console.log('Dropdown clicked, opening'); // Debug: Confirm dropdown click
						setVisible(true);
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
							onClick={(e) => e.stopPropagation()} // Prevent input click from toggling
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
