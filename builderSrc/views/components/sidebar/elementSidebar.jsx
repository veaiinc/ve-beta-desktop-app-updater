import React, { Component } from 'react';
import './elementSidebar.scss';
import ImagePopup from '../library/elementPopups/imagePopup';
import ButtonPopup from '../library/elementPopups/buttonPopup';
import TextPopup from '../library/elementPopups/textPopup';
import Draggable from 'react-draggable';
import ShapePopup from '../library/elementPopups/ShapePopup';
import VideoPopup from '../library/elementPopups/VideoPopup';
import EmbedPopup from '../library/elementPopups/EmbedPopup';
import CardPopup from '../library/elementPopups/CardPopup';
import NavbarPopup from '../library/elementPopups/NavbarPopup';
import IconPopup from '../library/elementPopups/IconPopup';
import SmartFieldPopup from '../library/elementPopups/SmartFieldPopup';
import DividerPopup from '../library/elementPopups/DividerPopup';
// import NavHiddenPopup from '../library/elementPopups/NavHiddenPopup';
// import NavImagePopup from '../library/elementPopups/NavImagePopup';
import MenubarPopup from '../library/elementPopups/MenubarPopup';
import SchedulerPopup from '../library/elementPopups/schedulerPopup';
import MobileNavHamburger from '../library/elementPopups/MobileHamburgerPopup';
import MobileNavbarCart from '../library/elementPopups/MobileCartPopup';
class ElementSidebar extends Component {
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
					{this.state.activeType === 'shape' && (
						<ImagePopup
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
						/>
					)}
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
							getModuleSections={(e) => {
								this.props?.getModuleSections(e);
							}}
							activeModuleSections={this.props?.activeModuleSections}
							module={this.props.module}
							isWorkflow={this.props.isWorkflow}
							activeWorkflowModuleId={this.props?.activeWorkflowModuleId}
							activeModuleId={this.props?.activeModuleId}
							previewType={this.props.previewType}
							activeSectionID={this.props.activeSectionID}
						/>
					)}
					{this.state?.activeType == 'sticker' && (
						<ShapePopup
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
							handleElementDebounceSave={(value) => {
								this.setState({ activePopupComponent: value }, () => {
									this.props.handleElementDebounceSave(value);
								});
							}}
						/>
					)}
					{this.state.activeType === 'video' && (
						<VideoPopup
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
							isvalidActiveVideoURL={this.props.isvalidActiveVideoURL}
						/>
					)}
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
							handleColor={(e, f) => this.props.handleFonts(e, f)}
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
							handleVerticleAlign={this.props?.handleVerticleAlign}
						/>
					)}
					{this.state?.activeType == 'iframe' && (
						<EmbedPopup
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
							isvalidActiveVideoURL={this.props.isvalidActiveVideoURL}
						/>
					)}
					{this.state?.activeType == 'jIcon' && (
						<IconPopup
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
							setModalRef={(e) => this.props?.setModalRef(e)}
							isWorkflow={this.props.isWorkflow}
							previewType={this.props.previewType}
							handleCardPopupProps={this.props.handleCardPopupProps}
						/>
					)}
					{this.state?.activeType === 'divider' && (
						<DividerPopup
							activeComponent={this.state?.activePopupComponent}
							setActivePopupComponent={(value) => {
								this.setState({ activePopupComponent: value }, () => {
									// callSingleBlockApi = true
									this.props?.setActivePopupComponent(value, true);
								});
							}}
						/>
					)}
					{/* smart field popup */}
					{this.state?.activeType === 'smartField' && (
						<SmartFieldPopup
							activeComponent={this.state?.activePopupComponent}
							setActivePopupComponent={(value) => {
								this.setState({ activePopupComponent: value }, () => {
									this.props?.setActivePopupComponent(value);
								});
							}}
							variables={this.props?.smartVariables}
							paramsTemplateID={this.props?.paramsTemplateID}
							updateActiveVariables={this.props?.updateActiveVariables}
							handleShowSmartModal={this.props?.handleShowSmartModal}
							handleDeleteVariable={this.props?.handleDeleteVariable}
							handleEditVariable={this.props?.handleEditVariable}
						/>
					)}

					{/* card popup */}
					{this.state?.activeType === 'card' && (
						<CardPopup
							activeComponent={this.state?.activePopupComponent}
							brandColors={this.props?.brandColors}
							setModalRef={(e) => this.props?.setModalRef(e)}
							module={this.props.module}
							isWorkflow={this.props.isWorkflow}
							activeWorkflowModuleId={this.props?.activeWorkflowModuleId}
							activeModuleId={this.props?.activeModuleId}
							previewType={this.props.previewType}
							handleCardPopupProps={this.props.handleCardPopupProps}
							debounceFuncForElementProps={this.props?.debounceFuncForElementProps}
						/>
					)}

					{this.state?.activeType === 'navbar' && (
						<NavbarPopup
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
							isMobileNavbar={this.props.isMobileNavbar}
							activeModuleId={this.props?.activeModuleId}
							setModalRef={(e) => this.props?.setModalRef(e)}
						/>
					)}
					{/* 
					{this.state?.activeType == 'navImage' && (
						<NavImagePopup
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
							modules={this.props?.modules}
							module={this.props.module}
							isWorkflow={this.props.isWorkflow}
							activeWorkflowModuleId={this.props?.activeWorkflowModuleId}
							activeModuleId={this.props?.activeModuleId}
							previewType={this.props.previewType}
							activeSectionID={this.props.activeSectionID}
							setModalRef={(e) => this.props?.setModalRef(e)}
							isMobileNavbar={this.props.isMobileNavbar}
						/>
					)} */}

					{this.state?.activeType === 'mNavbarCart' && (
						<MobileNavbarCart
							activeComponent={this.state?.activePopupComponent}
							setActivePopupComponent={(value) => {
								this.setState({ activePopupComponent: value }, () => {
									this.props?.setActivePopupComponent(value);
								});
							}}
							// setMobileNavCart={this.props.setMobileNavCart}
						/>
					)}
					{this.state?.activeType === 'mNavbarHamburger' && (
						<MobileNavHamburger
							activeComponent={this.state?.activePopupComponent}
							setActivePopupComponent={(value) => {
								this.setState({ activePopupComponent: value }, () => {
									this.props?.setActivePopupComponent(value);
								});
							}}
							setMobileNavCart={this.props.setMobileNavCart}
						/>
					)}
					{this.state.activeType === 'scheduler' && (
						<SchedulerPopup
							section={this.props.section}
							fonts={this.props?.fonts}
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
							isWorkflow={this.props.isWorkflow}
							previewType={this.props.previewType}
							handleCardPopupProps={this.props.handleCardPopupProps}
							allSchedules={this.props?.allSchedules}
							onSessionSelect={this.props.onSessionSelect}
							handleScheduleStyles={(data) => this.props.handleScheduleStyles(data)}
						/>
					)}

					{this.state?.activeType === 'menubar' && (
						<MenubarPopup
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
						/>
					)}
				</div>
			</Draggable>
		);
	}
}

export default ElementSidebar;
