import { Divider } from 'antd';
import React, { memo, useState } from 'react';
import '../../../../assets/scss/dropdown/tasks/optionsDropDown.scss';
import { ReactComponent as ListIcon } from '../../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardIcon } from '../../../../assets/svg/tasks/board.svg';
import ToggleSlider from '../../input/slider';
import { ReactComponent as DownArrow } from '../../../../assets/svg/Settings/Downarrowwhite.svg';
import DropDown from './DropDown';

const OptionsDropDown = ({ properties, togglePropertyVisibility }) => {
	const [info, setInfo] = useState({ groupDropDownOpen: false, orderDropDownOpen: false });

	const updateOptionDropDownInfo = (key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	};
	return (
		<div className={`listView-options-dropdown-container`}>
			<div className="view-selection-wrapper">
				<input type="radio" name="view-type" defaultChecked id="list-view-radio" />
				<label htmlFor="list-view-radio" className="view-selection">
					<ListIcon />
					<span className="view-name">List</span>
				</label>
				<input type="radio" name="view-type" id="board-view-radio" />
				<label htmlFor="board-view-radio" className="view-selection">
					<BoardIcon />
					<span className="view-name">Board</span>
				</label>
			</div>
			<div className="group-container text-bright">
				<span>Grouping</span>
				<DropDown
					containerStyles={{ right: '0', width: '153px' }}
					options={properties}
					valueSelector="propName"
					selected="tags"
					open={info?.groupDropDownOpen}
					defaultValue={'No grouping'}
					closeDropdown={() => updateOptionDropDownInfo('groupDropDownOpen', false)}
				>
					<div
						className="dropdown"
						onClick={() =>
							updateOptionDropDownInfo('groupDropDownOpen', !info?.groupDropDownOpen)
						}
					>
						<span className="dropdown-text">{'No grouping'}</span>
						<DownArrow
							style={{
								transform: info?.groupDropDownOpen
									? 'rotate(180deg)'
									: 'rotate(0deg)',
							}}
						/>
					</div>
				</DropDown>
			</div>
			<div className="order-container text-bright">
				<span>Ordering</span>
				<DropDown
					containerStyles={{ right: '0', width: '153px' }}
					options={properties}
					valueSelector="propName"
					selected=""
					open={info?.orderDropDownOpen}
					defaultValue={'Manual'}
					closeDropdown={() => updateOptionDropDownInfo('orderDropDownOpen', false)}
				>
					<div
						className="dropdown"
						onClick={() =>
							updateOptionDropDownInfo('orderDropDownOpen', !info?.orderDropDownOpen)
						}
					>
						<span className="dropdown-text">{'No ordering'}</span>
						<DownArrow
							style={{
								transform: info?.orderDropDownOpen
									? 'rotate(180deg)'
									: 'rotate(0deg)',
							}}
						/>
					</div>
				</DropDown>
			</div>
			<Divider style={{ backgroundColor: '#1D1D1D', margin: '0' }} />
			<div className="sub-issues-container">
				<span className="text-fade">Show sub-issues</span>
				<ToggleSlider onChange={() => {}} value={false} />
			</div>
			<Divider style={{ backgroundColor: '#1D1D1D', margin: '0' }} />

			<span className="list-heading text-bright">List option</span>
			<div className="empty-group-container">
				<span className="text-fade">Show empty group</span>
				<ToggleSlider onChange={() => {}} value={false} />
			</div>
			<div className="properties-container">
				<span className="text-fade">Display properties</span>
				<div className="properties-wrapper">
					{properties
						? properties.map((property, index) => (
								<div
									className={`property-item text-fade ${
										property.show ? `selected` : ``
									}`}
									onClick={() => togglePropertyVisibility(index, !property.show)}
									key={index}
								>
									{property?.label}
								</div>
						  ))
						: ''}
				</div>
			</div>
			<Divider style={{ backgroundColor: '#1D1D1D', margin: '0' }} />
			<div className="resent-btn-container">
				<button className="btn-reset">Reset to dafault</button>
			</div>
		</div>
	);
};

export default memo(OptionsDropDown);
