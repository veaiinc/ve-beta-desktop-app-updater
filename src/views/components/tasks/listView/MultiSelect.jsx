import React, { useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

const MultiSelect = ({ value, options = [] }) => {
	const [info, setInfo] = useState({
		selected: [...value],
		options: [...options],
		isDropdownOpen: false,
	});

	const updateMultiSelectInfo = (key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	};
	return (
		<div className="listItem-multiSelect">
			<div
				className="multiSelectContainer"
				onClick={() => updateMultiSelectInfo('isDropdownOpen', !info?.isDropdownOpen)}
			>
				{info?.selected?.map((item, index) => (
					<div className="multiListItem" key={index}>
						<div
							className="multiListDot"
							style={{
								backgroundColor: item?.color,
								boxShadow: `0 0 5px 1px ${item?.color}`,
							}}
						/>
						<div className="multiListText">{item?.label}</div>
					</div>
				))}
			</div>
			{info?.isDropdownOpen ? (
				<div className="dropdownContainer">
					<h3>Change status</h3>
					<ul>
						{info?.options?.map((option, index) => (
							<label key={index}>
								<div className="optionDetails">
									<input type="checkbox" className="icon" />

									<div
										className="multiListDot"
										style={{
											backgroundColor: option?.color,
											boxShadow: `0 0 5px 1px ${option?.color}`,
										}}
									/>
									<div className="labelText">{option?.label}</div>
								</div>
							</label>
						))}
					</ul>
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default MultiSelect;
