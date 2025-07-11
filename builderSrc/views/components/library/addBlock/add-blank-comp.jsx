import React, { Component } from 'react';
import { ReactComponent as NewDelete } from '../svgs/LeftBar/NewDelete.svg';
import { ReactComponent as NewDown } from '../svgs/LeftBar/NewDown.svg';
import { ReactComponent as NewEdit } from '../svgs/LeftBar/NewEdit.svg';
import { ReactComponent as NewCopy } from '../svgs/LeftBar/NewCopy.svg';
import { ReactComponent as NewUp } from '../svgs/LeftBar/NewUp.svg';
import { ReactComponent as AddBlank } from '../svgs/LeftBar/AddBlank.svg';
import { ReactComponent as AddBlock } from '../svgs/LeftBar/Addblock.svg';

class AddBlankComp extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<>
				{this.props.showBlockActions && this.props.preview == false ? (
					<div className="block-action-bar">
						<span className="tooltip" onClick={(e) => this.props.handleBlock(e)}>
							<NewEdit />
							<label className="tooltip-text">Block&nbsp;Settings</label>
						</span>
						{!this.props?.activeModule?.showAsSlide && (
							<>
								<span
									className="tooltip"
									onClick={(e) => this.props.handleDuplicate(e)}
								>
									<NewCopy />
									<label className="tooltip-text">Duplicate</label>
								</span>
								<span
									className="tooltip"
									onClick={() => {
										if (!(this.props.index === this.props.itemsLength)) {
											this.props.moveItem(
												this.props.index,
												this.props.index + 1,
											);
										}
									}}
									disabled={this.props.index === this.props.itemsLength}
									style={{
										cursor:
											this.props.index === this.props.itemsLength
												? 'not-allowed'
												: 'pointer',
									}}
								>
									<NewDown />
									<label className="tooltip-text">Down</label>
								</span>
								<span
									className="tooltip"
									onClick={() => {
										if (!(this.props.index === 1)) {
											this.props.moveItem(
												this.props.index,
												this.props.index - 1,
											);
										}
									}}
									disabled={this.props.index === 1}
									style={{
										cursor: this.props.index === 1 ? 'not-allowed' : 'pointer',
									}}
								>
									<NewUp />
									<label className="tooltip-text">Up</label>
								</span>
							</>
						)}
						<span
							className="tooltip"
							onClick={(e) => this.props.handleDeleteSection(e)}
						>
							<NewDelete />
							<label className="tooltip-text">Delete</label>
						</span>
					</div>
				) : (
					''
				)}
				{!this.props?.activeModule?.showAsSlide && this.props.showBlockOptions ? (
					<div
						className="add-block-new-container "
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							this.setState({ showAddBlock: true });
							this.props?.hanldeAddBlock(e);
						}}
					>
						<div
							// onMouseEnter={() => {
							// 	this.addBlockHoverTimeout = setTimeout(() => {
							// 		this.setState({ showAddBlock: true }, () => {
							// 			this.hanldeAddBlock(this.state.showAddBlock);
							// 		});
							// 	}, 300); // 300ms delay
							// }}
							// onMouseLeave={() => {
							// 	clearTimeout(this.addBlockHoverTimeout);
							// }}

							className="addBlankContainer"
						>
							<AddBlock />
							<span className="tooltip-text">Add Layout</span>
						</div>
						<div className="addBlockDivider">Add</div>

						{/* <div className="addBlockDividerContainer">
						<div className="addBlockDivider"></div>
					</div>
					<div
						className="addBlankContainer"
						onClick={(e) =>
							this.props.handleAddLayout(
								{ emptyCardOrder: this.props?.index - 0.1 },
								true,
							)
						}
						style={{
							cursor: 'pointer',
							transition: 'color 0.3s ease',
							fontSize: '10px',
							fontWeight: 'bold',
							textAlign: 'center',
							width: '71.8px',
						}}
					>
						{this.state.isElement !== true ? (
							<div className="addBlank">Add Card</div>
						) : (
							''
						)}
					</div> */}
					</div>
				) : (
					''
				)}
			</>
		);
	}
}

export default AddBlankComp;
