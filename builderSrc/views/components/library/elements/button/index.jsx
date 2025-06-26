import React, { Component } from 'react';
import './button.scss';
import Text from '../text';
import { message } from 'antd/lib';
import _ from 'lodash';

class Button extends Component {
	constructor(props) {
		super();
		this.state = {
			actionType: props.actionType,
			actionValue: props.actionValue,
			preview: props.preview,
			href: props.href ? props.href : '',
			openInNewTab: props.openInNewTab ? props.openInNewTab : false,
			shape: props.shape ? props.shape : '',
			btStyles: props.btStyles ? props.btStyles : '',
			activeSubBlockId: props?.activeSubBlockId,
			refID: props?.refID,
			showElementOptions: false,
			isFluid: props?.isFluid,
			triggerFont: props.triggerFont,
			properties: props.properties,
			previewType: props.previewType,
		};
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.actionType !== nextProps.actionType) {
			this.setState({
				actionType: nextProps.actionType,
			});
		}
		if (this.state.properties !== nextProps.properties) {
			this.setState({
				properties: nextProps.properties,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.isFluid !== nextProps.isFluid) {
			this.setState({
				isFluid: nextProps.isFluid,
			});
		}
		if (this.state.triggerFont !== nextProps.triggerFont) {
			this.setState({
				triggerFont: nextProps.triggerFont,
			});
		}
		if (this.state.activeSubBlockId !== nextProps.activeSubBlockId) {
			this.setState({
				activeSubBlockId: nextProps.activeSubBlockId,
			});
		}
		if (this.state.refID !== nextProps.refID) {
			this.setState({
				refID: nextProps.refID,
			});
		}
		if (this.state.actionValue !== nextProps.actionValue) {
			this.setState({
				actionValue: nextProps.actionValue,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.href !== nextProps.href) {
			this.setState({
				href: nextProps.href,
			});
		}
		if (this.state.openInNewTab !== nextProps.openInNewTab) {
			this.setState({
				openInNewTab: nextProps.openInNewTab,
			});
		}
		if (this.state.shape !== nextProps.shape) {
			this.setState({
				shape: nextProps.shape,
			});
		}
		if (this.state.btStyles !== nextProps.btStyles) {
			this.setState({
				btStyles: nextProps.btStyles,
			});
		}
	};
	handleOnClick = async (e) => {
		if (this.props.sectionType === 'accept' && this.props?.client) {
			if (this.props.status != 'proposalAccepted') {
				this.props.handleOpenAcceptProposalModal(e);
			} else {
				message.info('You have already accepted the Document');
			}
		} else if (this.props?.isLogicalForm && this.props?.client) {
			this.props?.handleFromSubmit(e);
		} else if (this.props?.client) {
			// e.stopPropagation(),
			// !old logic for navigation
			// this.state.properties?.linkTo === 'url'
			// 	? window.open(this.state.href, this.state.openInNewTab ? '_blank' : '_self')
			// 	: this.state.properties?.linkTo === 'page'
			// 	? this.props.getModuleInfo(this.state.properties?.pageId, '')
			// 	: this.state.properties?.linkTo === 'section'
			// 	? this.props.scrollToSection(
			// 			this.state.properties?.sectionId,
			// 			this.state.properties?.pageId,
			// 	  )
			// 	: '';

			//!new logic for navigation -Abddullah
			this.state.properties?.linkType === 'url'
				? window.open(
						this.state.properties?.linkUrl,
						this.state.openInNewTab ? '_blank' : '_self',
				  )
				: this.props?.properties?.linkType === 'section'
				? [
						await this.props.getModuleInfo(
							this.props?.properties?.linkModuleId,
							this.props?.properties?.linkModuleType,
						),

						await setTimeout(() => {
							this.props.scrollToSection(this.props?.properties?.sectionId);
						}, 500),
				  ]
				: '';
		} else {
			this.setState({ isClicked: true });
			this.state.preview == true
				? this.state.isFluid && this.state.previewType === 'm'
					? ''
					: [
							e.stopPropagation(),
							this.state.properties?.linkTo === 'url'
								? window.open(
										this.state.href,
										this.state.openInNewTab ? '_blank' : '_self',
								  )
								: this.state.properties?.linkTo === 'page'
								? this.props.getModuleInfo(this.state.properties?.pageId, '')
								: this.state.properties?.linkTo === 'section'
								? this.props.scrollToSection(this.state.properties?.sectionId)
								: '',
					  ]
				: [
						this.props.setLink(this.state.href),
						this.props.setTab(e),
						this.props.setOpenNewTab({
							isOpen: this.state.openInNewTab,
						}),
						this.props.setBtStyles(this.state.btStyles),
						this.props.setShape(this.state.shape),
				  ];
		}
	};
	render() {
		return (
			<div
				className={`component button ${
					this.state.showElementOptions ? 'borderedElement' : ''
				}`}
				style={{
					border:
						!this.state.preview &&
						this.state.isClicked &&
						this.state.activeSubBlockId === this.state.refID
							? '1px solid #3474e0'
							: '',
					...(this.state.isFluid
						? {
								display: 'flex',
								gridArea: 'inherit',
								flex: 1,
						  }
						: {}),
				}}
				onMouseEnter={() => {
					if (this.state.preview !== true) {
						this.setState({
							showElementOptions: true,
						});
					}
				}}
				onMouseLeave={() => this.setState({ showElementOptions: false })}
			>
				<div
					className={` ${this.props.shape}`}
					style={{
						...this.props.style,
						// ...this.state.btStyles,
						background: this.state?.btStyles?.background,
						...(this.state?.btStyles?.stroke
							? { ...this.state?.btStyles }
							: { borderStyle: 'none' }),
						...(this.state.isFluid
							? {
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									gridArea: 'inherit',
									flex: 1,
							  }
							: {}),
						...(this.state.properties?.isTheme
							? { ...this.state.properties?.ThemeStylings }
							: {}),
					}}
					onClick={(e) => {
						this.handleOnClick(e);
					}}
				>
					<Text
						isWorkflow={this.props.isWorkflow}
						reference={this.props.reference}
						// text={this.props.content}
						text={
							this.props.client && this.props.status == 'proposalAccepted'
								? 'Accepted'
								: this.state.previewType === 'm'
								? _.has(this.props.properties, 'mContent')
									? this.props.properties.mContent
									: this.props.properties.content
								: this.props.content
						}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						preview={this.state.preview}
						handleSelection={(e, activeTextBlock) =>
							this.props.handleSelection(e, activeTextBlock)
						}
						setContent={(e) => this.props.setContent(e)}
						setTab={(e) => this.props.setTextTab(e)}
						activeFontColor={this.props.activeFontColor}
						refID={this.state.refID ? this.state.refID : null}
						activeSectionID={this.props.activeSectionID}
						sectionID={this.props.sectionID}
						activeTextBlock={this.props.activeTextBlock}
						subBlockID={this.props.subBlockID}
						activeSubBlockId={this.props.activeSubBlockId}
						sectionType={this.props.sectionType}
						clearStyling={() => this.props.clearStyling()}
						sectionBg={this.props?.sectionBg}
						setTriggerFont={(e) => this.props.setTriggerFont(e)}
						triggerFont={this.state.triggerFont}
						isFluidButton={this.state.isFluid}
						isFluid={this.state.isFluid}
						triggerTextChange={(e) => ''}
						openColorPicker={(e, tab) => this.props?.openColorPicker(e, tab)}
						divStyles={this?.props?.divStyles || {}}
						isLogicalForm={this.props?.isLogicalForm || false}
						themes={this.props?.themes}
					/>
				</div>
			</div>
		);
	}
}

export default Button;
