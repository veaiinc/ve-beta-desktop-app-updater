import React, { Component } from 'react';
import './elementSidebar.scss';

import Draggable from 'react-draggable';

import FormCardPopup from '../library/elementPopups/blockPopups/formCardPopup';
import TextPopup from '../library/elementPopups/textPopup';
import ImagePopup from '../library/elementPopups/imagePopup';
import ButtonPopup from '../library/elementPopups/buttonPopup';
import InvoiceCardPopup from '../library/elementPopups/blockPopups/InvoiceCardPopup';
import SignaturePopup from '../library/elementPopups/blockPopups/SignaturePopup';
import PaymentSchedulePopup from '../library/elementPopups/blockPopups/PaymentSchedule';
import SummaryPopup from '../library/elementPopups/blockPopups/SummaryPopup';
import EventPopup from '../library/elementPopups/blockPopups/EventPopup';

class BlockSidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeType: props.activeType,
			elementEndPosition: props.elementEndPosition,
			activePopupComponent: props.activePopupComponent,
			activeImageURL: null,
			// elementFontColor: props?.elementFontColor,
			// stretch: false,
		};
		this.sidebarRef = React.createRef();
	}
	componentDidMount() {}
	componentDidUpdate() {}
	componentWillUnmount() {}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeType !== this.state.activeType) {
			this.setState({
				activeType: nextProps.activeType,
			});
		}
		if (nextProps.elementEndPosition !== this.state.elementEndPosition) {
			this.setState({
				elementEndPosition: nextProps.elementEndPosition,
			});
		}
		if (nextProps.activePopupComponent !== this.state.activePopupComponent) {
			this.setState({
				activePopupComponent: nextProps.activePopupComponent,
			});
		}
		// if (nextProps.elementFontColor !== this.state.elementFontColor) {
		// 	this.setState({
		// 		elementFontColor: nextProps.elementFontColor,
		// 	});
		// }
	}
	getSidebarNode() {
		return this.sidebarRef.current;
	}

	render() {
		return (
			<Draggable
				handle=".draggerPoint"
				bounds={this.props?.showPopupInMobile || this.props?.isScheduler ? '' : '.builder'}
			>
				<div
					ref={this.sidebarRef}
					className="elementSidebarContainer"
					style={{
						top: this.state.elementEndPosition.y,
						left:
							this.state?.activeType === 'card'
								? ''
								: this.state.elementEndPosition.x,
						right: this.state?.activeType === 'card' ? '100px' : '',
					}}
					onClick={(e) => {
						e.stopPropagation();
						e.preventDefault();
					}}
				>
					<div className="draggerPoint">
						<div className="dragger-line"></div>
					</div>
					{/* blocks/elements popup */}

					{this.state?.activeType === 'form-v1' && (
						<FormCardPopup
							fonts={this.props?.fonts}
							activeComponent={this.props?.section}
							brandColors={this.props?.brandColors}
							modules={this.props?.modules}
							getModuleSections={(e) => this.props?.getModuleSections(e)}
							activeModuleSections={this.props?.activeModuleSections}
							setModalRef={(e) => this.props?.setModalRef(e)}
							isWorkflow={this.props.isWorkflow}
							previewType={this.props.previewType}
							handleCardPopupProps={this.props.handleCardPopupProps}
							style={this.state?.activePopupComponent?.style}
							activeWorkflowModuleId={this.props?.activeWorkflowModuleId}
							activeModuleId={this.props?.activeModuleId}
							handleIsValidBgVideoURL={this.props.handleIsValidBgVideoURL}
						/>
					)}

					{/* logical form text */}
					{this.state.activeType === 'text' && (
						<TextPopup
							activeComponent={this.state?.activePopupComponent}
							setActivePopupComponent={(value) => {
								this.setState(
									{
										activePopupComponent: value,
									},
									() => {
										this.props?.setActivePopupComponent(value);
									},
								);
							}}
							handleColor={(e, f) => {
								// this.props.handleFonts(e, f);
								this.props?.changeFontColor(f, e);
							}}
							fonts={this.props?.fonts}
							fontFamily={this.props?.fontFamily}
							changeFontColor={(e, f, e2 = null) =>
								this.props?.changeFontColor(e, f, e2)
							}
							activeColor={this.props?.activeColor}
							fontColor={this.props.fontColor}
							fontSize={this.props.fontSize}
							justifyleft={this.props.justifyleft}
							justifyright={this.props.justifyright}
							justifycenter={this.props.justifycenter}
							justifyfull={this.props.justifyfull}
							lineHeight={this.props.lineHeight}
							letterSpacing={this.props.letterSpacing}
							textTab={this.props.textTab}
							previewType={this.props.previewType}
							brandColors={this.props?.brandColors}
							elementFontColor={this.state?.elementFontColor}
							activeFontSize={this.props?.activeFontSize}
							debounceFuncForElementProps={this.props?.debounceFuncForElementProps}
							isLogicalFormText={this.props?.isLogicalFormText || false}
						/>
					)}

					{/* for images and form logo */}
					{this.state.activeType === 'shape' && (
						<ImagePopup
							activeComponent={this.state?.activePopupComponent}
							setActivePopupComponent={(value) => {
								this.setState(
									{
										activePopupComponent: value,
									},
									() => {
										this.props?.setActivePopupComponent(value);
									},
								);
							}}
							brandColors={this.props?.brandColors}
							modules={this.props?.modules}
							getModuleSections={(e) => this.props?.getModuleSections(e)}
							activeModuleSections={this.props?.activeModuleSections}
							setModalRef={(e) => this.props?.setModalRef(e)}
							setActiveImageSettings={(value) => {
								this.setState({ activePopupComponent: value }, () => {
									this.props?.setActiveImageSettings(value);
								});
							}}
							module={this.props.module}
							isWorkflow={this.props.isWorkflow}
							activeWorkflowModuleId={this.props?.activeWorkflowModuleId}
							activeModuleId={this.props?.activeModuleId}
							previewType={this.props.previewType}
							activeSectionID={this.props.activeSectionID}
							isLogicalFormLogo={this.props.isLogicalFormLogo || false}
							isLogicalFormImage={this.props.isLogicalFormImage || false}
						/>
					)}

					{/* logical form submit button */}
					{this.state.activeType === 'button' && (
						<ButtonPopup
							activeComponent={this.state?.activePopupComponent}
							setActivePopupComponent={(value) => {
								this.setState(
									{
										activePopupComponent: value,
									},
									() => {
										// callSingleBlockApi = true
										this.props?.setActivePopupComponent(value, true);
									},
								);
							}}
							brandColors={this.props?.brandColors}
							modules={this.props?.modules}
							getModuleSections={(e) => this.props?.getModuleSections(e)}
							activeModuleSections={this.props?.activeModuleSections}
							module={this.props.module}
							isWorkflow={this.props.isWorkflow}
							activeWorkflowModuleId={this.props?.activeWorkflowModuleId}
							activeModuleId={this.props?.activeModuleId}
							previewType={this.props.previewType}
							activeSectionID={this.props.activeSectionID}
							isLogicalFormText={this.props?.isLogicalFormText || false}
						/>
					)}

					{/* invoice card popup */}
					{this.state?.activeType === 'invoice' && (
						<InvoiceCardPopup
							activeComponent={this.props?.section}
							brandColors={this.props?.brandColors}
							modules={this.props?.modules}
							getModuleSections={(e) => this.props?.getModuleSections(e)}
							activeModuleSections={this.props?.activeModuleSections}
							setModalRef={(e) => this.props?.setModalRef(e)}
							isWorkflow={this.props.isWorkflow}
							previewType={this.props.previewType}
							handleCardPopupProps={this.props.handleCardPopupProps}
							style={this.state?.activePopupComponent?.style}
							activeWorkflowModuleId={this.props?.activeWorkflowModuleId}
							activeModuleId={this.props?.activeModuleId}
							handleIsValidBgVideoURL={this.props.handleIsValidBgVideoURL}
							currencySymbol={this.props?.currencySymbol}
							currencySymbol2={this.props?.currencySymbol2}
						/>
					)}
					{this.state?.activeType === 'signature' && (
						<SignaturePopup
							activeComponent={this.state?.activePopupComponent}
							setModalRef={(e) => this.props?.setModalRef(e)}
							activeModuleId={this.props?.activeModuleId}
							setActiveSection={(e) =>
								this.setState({ activePopupComponent: e }, () => {
									this.props?.setActiveSection(e);
								})
							}
						/>
					)}
					{this.state?.activeType === 'paymentSchedule' && (
						<PaymentSchedulePopup
							activeComponent={this.state?.activePopupComponent}
							setModalRef={(e) => this.props?.setModalRef(e)}
							setActiveSection={(e) => {
								this.setState({
									activeComponent: e,
								});
								this.props.setActiveSection(e);
							}}
							activeModuleId={this.props?.activeModuleId}
						/>
					)}
					{this.state?.activeType === 'summary' && (
						<SummaryPopup
							activeComponent={this.state?.activePopupComponent}
							brandColors={this.props?.brandColors}
							setModalRef={(e) => this.props?.setModalRef(e)}
							style={this.state?.activePopupComponent?.style}
							activeModuleId={this.props?.activeModuleId}
							handleIsValidBgVideoURL={this.props.handleIsValidBgVideoURL}
							setActiveSection={(e) => {
								this.setState({
									activeComponent: e,
								});
								this.props.setActiveSection(e);
							}}
							fonts={this.props?.fonts}
						/>
					)}

					{/* event popup */}
					{this.state.activeType === 'event' && (
						<EventPopup
							activeComponent={this.state?.activePopupComponent}
							activeModule={this.props?.isServiceItem ? 'serviceItem' : 'block'}
							setActiveSection={(newComponent) => {
								this.setState({ activePopupComponent: newComponent }, () => {
									this.props?.setActiveSection(newComponent);
								});
							}}
							activeModuleId={this.props?.activeModuleId}
							setModalRef={(e) => this.props?.setModalRef(e)}
							showImageModal={this.props.showImageModal}
						/>
					)}
				</div>
			</Draggable>
		);
	}
}

export default BlockSidebar;
