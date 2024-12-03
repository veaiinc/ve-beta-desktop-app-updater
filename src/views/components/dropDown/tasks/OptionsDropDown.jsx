import { Divider } from 'antd';
import React, { memo } from 'react';
import '../../../../assets/scss/dropdown/tasks/optionsDropDown.scss';
import { ReactComponent as ListIcon } from '../../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardIcon } from '../../../../assets/svg/tasks/board.svg';
import ToggleSlider from '../../input/slider';

const OptionsDropDown = ({ properties, togglePropertyVisibility, open }) => {
	return (
		<div className={`dropdown-container ${open ? `` : `dropdown-hide`}`}>
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
			</div>
			<div className="order-container text-bright">
				<span>Ordering</span>
			</div>
			<Divider style={{ backgroundColor: '#1D1D1D', margin: '0' }} />
			<div className="sub-issues-container">
				<span className="text-fade">Show sub-issues</span>
				<ToggleSlider onChange={() => {}} />
			</div>
			<Divider style={{ backgroundColor: '#1D1D1D', margin: '0' }} />

			<span className="list-heading text-bright">List option</span>
			<div className="empty-group-container">
				<span className="text-fade">Show empty group</span>
				<ToggleSlider onChange={() => {}} />
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
									onClick={() => togglePropertyVisibility(index)}
									key={index}
								>
									{property.propName}
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
