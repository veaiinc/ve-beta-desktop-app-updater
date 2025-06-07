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
					<div className="add-block-new-container">
						<div
							onClick={(e) => this.props.hanldeAddBlock(e)}
							className="addBlankContainer"
						>
							<AddBlock />
							<label className="tooltip-text">Add Block</label>
						</div>
						<div className="addBlockDividerContainer">
							<div className="addBlockDivider"></div>
						</div>
						<div className="addBlankContainer">
							{this.props.isElement !== true ? (
								<div
									className={`addBlank ${
										this.props.activeTab === 'fluid' ? 'active' : ''
									}`}
									onClick={(e) => this.props.handleAddLayout(null, true)}
								>
									<AddBlank />
								</div>
							) : (
								''
							)}

							<label className="tooltip-text">Add Blank</label>
						</div>
					</div>
				) : (
					''
				)}
			</>
		);
	}
}

export default AddBlankComp;
