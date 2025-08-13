import React, { Component } from 'react';
import ImageItem from '../../elements/image';
import './NavbarCompStyles.scss';
import {
	ElementSidebar,
	DownloadPDF,
	Dropdown as DropDownSvg,
	EditNavbar as Edit,
} from '../../../builder_client_common';
import CartIcons from '../NabarWrapper/CartIcons';
import _ from 'lodash';
import { Tooltip } from 'antd';

class NavbarComponent extends Component {
	constructor(props) {
		super();
		this.state = {
			preview: props.preview,
			previewType: props.previewType,
			blocks: props.blocks,
			style: props.style,
			module: props.module,
			isWorkflow: props.isWorkflow,
			showBlockActions: false,
			modules: props.modules,
			showEditDesignModal: true,
			activeModuleId: props.activeModuleId,

			showStyleModal: props.showStyleModal,
			hoveredImage: false,
			hoveredModule: false,
			showHiddenModal: props.showHiddenModal,
			showMobileMenu: false,
			hoveredCart: false,
			section: props.section,
			showImageModalLibrary: false,
			dropDown: false,
			selectedDropdown: 0,
		};
		this.navbarRef = React.createRef();
		this.imageRef = React.createRef();
		this.dropDownRef = React.createRef();
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.blocks !== nextProps.blocks) {
			this.setState({
				blocks: nextProps.blocks,
			});
		}
		if (this.state.modules !== nextProps.modules) {
			this.setState({
				modules: nextProps.modules,
			});
		}
		if (this.state.activeModuleId !== nextProps.activeModuleId) {
			this.setState({
				activeModuleId: nextProps.activeModuleId,
			});
		}
		if (this.state.showStyleModal !== nextProps.showStyleModal) {
			this.setState({
				showStyleModal: nextProps.showStyleModal,
			});
		}
		if (this.state.showHiddenModal !== nextProps.showHiddenModal) {
			this.setState({
				showHiddenModal: nextProps.showHiddenModal,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.section !== nextProps.section) {
			this.setState({
				section: nextProps.section,
			});
		}
	};
	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
	}
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}
	handleClickOutside = (e) => {
		// Handle dropdown close - only if dropdown is open
		if (
			this.dropDownRef.current &&
			!this.dropDownRef.current.contains(e.target) &&
			this.state.dropDown
		) {
			this.setState({
				dropDown: false,
			});
		}
		if (
			this.navbarRef.current &&
			this.navbarRef.current.getSidebarNode && // check if method exists
			!this.navbarRef.current.getSidebarNode().contains(e.target) &&
			!this.state.showImageModalLibrary
		) {
			this.setState(
				{
					showStyleModal: false,
					showHiddenModal: false,
				},
				() => {
					this.props.setShowStyleModal(false);
				},
			);
		}
	};
	editDesign = () => {
		this.setState(
			{
				showEditDesignModal: true,
			},
			() => {
				this.props.setShowEditDesignModal(true);
			},
		);
	};
	handleNavbarAlign = (align) => {
		this.setState({
			navbarAlign: align,
		});
	};

	// handleNavbarUpdate = (type, value) => {
	// 	let newSection = { ...this.props.section };

	// 	if (type == 'image') {
	// 		newSection.blocks[0].subBlocks[0].imageURL = value?.imageURL;
	// 	}
	// 	this.setState(
	// 		{
	// 			section: newSection,
	// 		},
	// 		() => {
	// 			this.props.setActiveSection(newSection);
	// 		},
	// 	);
	// };

	// renderClientModules = () => {
	// 	let modules = [...(this.props?.clientPortalModules || [])];

	// 	// Filter out the public modules if isWorkflow is true (for live preview)
	// 	if (this.state.isWorkflow) {
	// 		modules = modules.filter((ele) => !ele?.isPublic);
	// 	}

	// 	// Find the index of the last module with isPublic: true
	// 	const lastPublicIndex = modules.reduce((lastIndex, module, index) => {
	// 		return module.isPublic ? index : lastIndex;
	// 	}, -1);

	// 	// Find the index of the "Invoice" module
	// 	const invoiceIndex = modules.findIndex((module) => module.module === 'invoice');

	// 	// Add the "Summary" module before the "Invoice" module
	// 	if (invoiceIndex && invoiceIndex !== -1) {
	// 		modules.splice(invoiceIndex, 0, {
	// 			module: 'summary',
	// 			_id: 'summaryModule', // Unique _id for the new module
	// 			label: 'summary',
	// 			isPublic: false, // Adjust properties as needed
	// 		});
	// 	}
	// 	const summaryIndex = modules.findIndex((module) => module.module === 'summary');
	// 	return modules.map((module, k) => {
	// 		if (module !== this.state.module) {
	// 			const isLastPublic = k === lastPublicIndex;
	// 			const moduleType = _.has(module, 'module') ? module.module : module.type;

	// 			return (
	// 				<React.Fragment key={module._id}>
	// 					<span
	// 						onClick={() => this.props.renderClientModulesClickFunction(module)}
	// 						className={`navbar-module-item ${
	// 							this.props?.selectedLabelId === module._id ? 'active' : ''
	// 						}`}
	// 						style={{
	// 							color: this.props?.section?.navigationColor || '#000000',
	// 							position: 'relative',
	// 							opacity: this.props?.selectedLabelId == module._id ? 1 : 0.7,
	// 							fontWeight:
	// 								this.props?.selectedLabelId == module._id ? 'bolder' : 'normal',
	// 						}}
	// 					>
	// 						{module.label}
	// 						{this.props?.selectedLabelId == module._id && (
	// 							<span
	// 								style={{
	// 									height: '3px',
	// 									width: '15px',
	// 									position: 'absolute',
	// 									borderRadius: '2px',
	// 									bottom: '-8px',
	// 									background: this.props.section.navigationColor || '#000000',
	// 								}}
	// 							></span>
	// 						)}
	// 					</span>

	// 					{isLastPublic && (
	// 						<div
	// 							style={{
	// 								width: '1px',
	// 								height: '24px',
	// 								backgroundColor: '#9B9290',
	// 								display: 'inline-block',
	// 								marginLeft: '5px',
	// 							}}
	// 						></div>
	// 					)}
	// 				</React.Fragment>
	// 			);
	// 		}
	// 		return null; // Return null for the current module to avoid rendering it
	// 	});
	// };

	renderModules = () => {
		let originaModules = [...(this.props?.modules || [])];
		// let modules = [...(this.props?.modules || [])];
		let minPages = 5;

		if (this.props?.activeModule?.showAsA4) {
			minPages = 2;
		}
		let modules = originaModules?.slice(0, minPages);

		// Filter out the public modules if isWorkflow is true (for live preview)
		if (this.state.isWorkflow) {
			modules = modules.filter((ele) => !ele?.isPublic);
		}

		// Find the index of the last module with isPublic: true
		const lastPublicIndex = modules.reduce((lastIndex, module, index) => {
			return module.isPublic ? index : lastIndex;
		}, -1);

		// Find the index of the "Invoice" module
		const invoiceIndex = modules.findIndex((module) => module.module === 'invoice');

		// Add the "Summary" module before the "Invoice" module
		if (invoiceIndex && invoiceIndex !== -1) {
			modules.splice(invoiceIndex, 0, {
				module: 'summary',
				_id: 'summaryModule', // Unique _id for the new module
				label: 'summary',
				isPublic: false, // Adjust properties as needed
			});
		}
		const summaryIndex = modules.findIndex((module) => module.module === 'summary');

		return modules.map((module, k) => {
			if (module !== this.state.module) {
				const isLastPublic = k === lastPublicIndex;
				const moduleType = _.has(module, 'module') ? module.module : module.type;

				return (
					<React.Fragment key={module._id}>
						<span
							onClick={(e) => {
								e.stopPropagation();

								this.props.getModuleInfo(module._id, moduleType);
							}}
							className={`navbar-module-item ${
								this.state.activeModuleId == module._id ? 'active' : ''
							}`}
							style={{
								color: this.props?.section?.navigationColor || '#000000',
								position: 'relative',
								opacity: this.state?.activeModuleId == module._id ? 1 : 0.7,
								fontWeight:
									this.state?.activeModuleId == module._id ? 'bolder' : 'normal',
								// whiteSpace: 'nowrap',
								// overflow: 'hidden',
								// textOverflow: 'ellipsis',
								// width: '100px',
							}}
						>
							<span className="navbar-module-item-label">{module.label}</span>
							{this.state.activeModuleId == module._id && (
								<span
									style={{
										height: '3px',
										width: '15px',
										position: 'absolute',
										borderRadius: '2px',
										bottom: '-8px',
										backgroundColor:
											this.props?.section?.navigationColor || '#000000',
									}}
								></span>
							)}
						</span>

						{isLastPublic && (
							<div
								style={{
									width: '1px',
									height: '24px',
									backgroundColor: '#9B9290',
									display: 'inline-block',
									marginLeft: '5px',
								}}
							></div>
						)}
					</React.Fragment>
				);
			}
			return null; // Return null for the current module to avoid rendering it
		});
	};
	renderClientModules = () => {
		let modules = [...(this.props?.clientPortalModules || [])];
		// Filter out the public modules if isWorkflow is true (for live preview)
		if (this.state.isWorkflow) {
			modules = modules.filter((ele) => !ele?.isPublic);
		}

		// Find the index of the last module with isPublic: true
		const lastPublicIndex = modules.reduce((lastIndex, module, index) => {
			return module.isPublic ? index : lastIndex;
		}, -1);

		// Find the index of the "Invoice" module
		const invoiceIndex = modules.findIndex((module) => module.module === 'invoice');

		// Add the "Summary" module before the "Invoice" module
		if (invoiceIndex && invoiceIndex !== -1) {
			modules.splice(invoiceIndex, 0, {
				module: 'summary',
				_id: 'summaryModule', // Unique _id for the new module
				label: 'summary',
				isPublic: false, // Adjust properties as needed
			});
		}
		const summaryIndex = modules.findIndex((module) => module.module === 'summary');

		let minPages = 5;
		if (this.props?.activeModule?.showAsA4) {
			minPages = 2;
		}
		const pages = modules.slice(0, minPages);
		const currentPages = modules.slice(minPages);

		const isDropdownPageSelected = currentPages.some(
			(module) => this.props?.selectedLabelId === module._id,
		);

		if (modules.length > minPages) {
			return (
				<>
					{minPages &&
						pages.map((module, k) => {
							if (module !== this.state.module) {
								const isLastPublic = k === lastPublicIndex;
								const moduleType = _.has(module, 'module')
									? module.module
									: module.type;

								return (
									<React.Fragment key={module._id}>
										<span
											key={k}
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												this.props.renderClientModulesClickFunction(module);
											}}
											className={`navbar-module-item ${
												this.props?.selectedLabelId === module._id
													? 'active'
													: ''
											}`}
											style={{
												color:
													this.props?.section?.navigationColor ||
													'#000000',
												position: 'relative',
												opacity:
													this.props?.selectedLabelId == module._id
														? 1
														: 0.7,
												fontWeight:
													this.props?.selectedLabelId == module._id
														? 'bolder'
														: 'normal',
											}}
										>
											<span className="navbar-module-item-label">
												{module.label}
											</span>
											{this.props?.selectedLabelId == module._id && (
												<span
													style={{
														height: '3px',
														width: '15px',
														position: 'absolute',
														borderRadius: '2px',
														bottom: '-8px',
														background:
															this.props.section.navigationColor ||
															'#000000',
													}}
												></span>
											)}
										</span>

										{isLastPublic && (
											<div
												style={{
													width: '1px',
													height: '24px',
													backgroundColor: '#9B9290',
													display: 'inline-block',
													marginLeft: '5px',
												}}
											></div>
										)}
									</React.Fragment>
								);
							}
							return null; // Return null for the current module to avoid rendering it
						})}

					{currentPages.length > 0 && (
						<div
							// ref={this.dropDownRef}
							className="select-section-main"
							onClick={() => {
								this.setState({
									dropDown: !this.state.dropDown,
								});
							}}
						>
							<div
								className={`select-div ${isDropdownPageSelected ? 'active' : ''}`}
								style={{
									color: this.props?.section?.navigationColor || '#000000',
									opacity: isDropdownPageSelected ? 1 : 0.7,
									fontWeight: isDropdownPageSelected ? 'bolder' : 'normal',
									cursor: 'pointer',
								}}
							>
								+ {currentPages.length}
								<span>
									{/* <Dropdown
										style={{
											stroke: this.props.section?.style?.navigationColor,
											cursor: 'pointer',
										}}
										className={`drop-icon${
											this.state.dropDown === false ? 'rotate' : ''
										}`}
									/> */}
									<DropDownSvg
										className={`drop-icon${
											this.state.dropDown === true ? 'rotate' : ''
										}`}
										fillColor={this.props?.section?.navigationColor}
										style={{
											transform: this.state.dropDown
												? 'rotate(180deg)'
												: 'rotate(0deg)',
										}}
									/>
								</span>
							</div>

							<Tooltip
								className="tooltip-container"
								placement="bottomRight"
								style={{
									background:
										this.props.section?.style?.sectionBackgroundColor.toLowerCase() ==
										'transparent'
											? '#ffffff'
											: this.props.section?.style?.sectionBackgroundColor,
								}}
								title={
									<div
										className="select-section"
										style={{
											background:
												this.props.section?.style?.sectionBackgroundColor.toLowerCase() ==
												'transparent'
													? '#ffffff'
													: this.props.section?.style
															?.sectionBackgroundColor,
											cursor: 'pointer',
										}}
									>
										{currentPages.map((module, i) => (
											<p
												style={{
													color:
														this.props?.section?.navigationColor ||
														'#000000',
													position: 'relative',
													opacity:
														this.props?.selectedLabelId == module._id
															? 1
															: 0.7,
													fontWeight:
														this.props?.selectedLabelId == module._id
															? 'bolder'
															: 'normal',
												}}
												onClick={(e) => {
													e.preventDefault();
													this.props.renderClientModulesClickFunction(
														module,
													);
													this.setState({
														dropDown: false,
													});
												}}
												className={`options${
													this.props?.selectedLabelId == module._id
														? 'active'
														: ''
												}`}
												value={module._id}
												key={module._id}
											>
												{module.label}
											</p>
										))}
									</div>
								}
								color={'var(--right-bar, #161618)'}
								arrow={false}
								trigger="click"
								overlayClassName="tooltip-container"
								open={this.state.dropDown}
								onOpenChange={() => this.setState({ dropDown: false })}
							></Tooltip>
						</div>
					)}
				</>
			);
		} else {
			return modules.map((module, k) => {
				if (module !== this.state.module) {
					const isLastPublic = k === lastPublicIndex;
					const moduleType = _.has(module, 'module') ? module.module : module.type;

					return (
						<React.Fragment key={module._id}>
							<span
								onClick={() => this.props.renderClientModulesClickFunction(module)}
								className={`navbar-module-item ${
									this.props?.selectedLabelId === module._id ? 'active' : ''
								}`}
								style={{
									color: this.props?.section?.navigationColor || '#000000',
									position: 'relative',
									opacity: this.props?.selectedLabelId == module._id ? 1 : 0.7,
									fontWeight:
										this.props?.selectedLabelId == module._id
											? 'bolder'
											: 'normal',
								}}
							>
								<span className="navbar-module-item-label">{module.label}</span>
								{this.props?.selectedLabelId == module._id && (
									<span
										style={{
											height: '3px',
											width: '15px',
											position: 'absolute',
											borderRadius: '2px',
											bottom: '-8px',
											background:
												this.props.section.navigationColor || '#000000',
										}}
									></span>
								)}
							</span>

							{isLastPublic && (
								<div
									style={{
										width: '1px',
										height: '24px',
										backgroundColor: '#9B9290',
										display: 'inline-block',
										marginLeft: '5px',
									}}
								></div>
							)}
						</React.Fragment>
					);
				}
				return null; // Return null for the current module to avoid rendering it
			});
		}
	};
	builderRenderNavbar = () => {
		const properties =
			this.props?.section?.blocks?.[0]?.subBlocks?.[0] || this.props.section || {};
		const styles = {
			backgroundColor: 'transparent',
			height: '100%',
			width: '100%',
		};

		let minPages = 5;
		if (this.props?.activeModule?.showAsA4) {
			minPages = 2;
		}

		return (
			<>
				<div className="navbar-component-wrapper">
					<div className="navbar-inner-div2">
						<div
							onMouseEnter={() => {
								if (
									this.props.isEditElement === true &&
									this.state.preview !== true
								) {
									this.setState({
										hoveredModule: true,
									});
								}
							}}
							onMouseLeave={() => {
								this.setState({
									hoveredModule: false,
								});
							}}
							// style={{
							// 	width:
							// 		this.props?.section?.style?.navbarAlign === 'one' ||
							// 		!this.props?.section?.style?.navbarAlign
							// 			? '474px'
							// 			: 'auto',
							// 	justifyContent:
							// 		this.props?.section?.style?.navbarAlign === 'two'
							// 			? 'center'
							// 			: this.props?.section?.style?.navbarAlign === 'three'
							// 			? 'flex-end'
							// 			: this.props?.section?.style?.navbarAlign === 'four' ||
							// 			  this.props?.section?.style?.navbarAlign === 'one' ||
							// 			  !this.props?.section?.style?.navbarAlign
							// 			? 'flex-start'
							// 			: 'center',

							// 	transition: 'all 0.3s ease',
							// }}
							style={{
								width:
									this.props?.activeModule?.showAsA4 &&
									(this.props?.section?.style?.navbarAlign === 'one' ||
										!this.props?.section?.style?.navbarAlign)
										? '200px'
										: this.props?.section?.style?.navbarAlign === 'one' ||
										  !this.props?.section?.style?.navbarAlign
										? '474px'
										: '100%',
								justifyContent:
									this.props?.section?.style?.navbarAlign === 'two'
										? 'center'
										: this.props?.section?.style?.navbarAlign === 'three'
										? 'flex-end'
										: this.props?.section?.style?.navbarAlign === 'four'
										? 'flex-start'
										: 'center',
								whiteSpace: 'nowrap',
							}}
							className="navbar-modules-wrapper"
						>
							<div
								style={{
									border: this.state.hoveredModule
										? '1px solid #f1f2f3'
										: '1px solid transparent',
									// padding: '10px',
									justifyContent:
										this.props?.section?.style?.navbarAlign === 'two'
											? 'center'
											: this.props?.section?.style?.navbarAlign === 'three'
											? 'flex-end'
											: 'flex-start',
									width: 'auto',
								}}
								className="navbar-modules-inner-wrapper"
							>
								{this.renderModules()}
								{this.state.hoveredModule &&
									this.props?.modules?.length <= minPages && (
										<div
											style={{
												cursor: 'pointer',
												background:
													this.props.section?.style?.sectionBackgroundColor.toLowerCase() ==
													'transparent'
														? '#ffffff'
														: this.props.section?.style
																?.sectionBackgroundColor,
											}}
											className="edit-module-wrapper"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												this.props.managePages(e);
											}}
										>
											{this.props?.modules?.length <= minPages && <Edit />}
										</div>
									)}
								{this.props?.modules?.length > minPages && (
									<p
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											this.props.managePages(e);
										}}
										style={{
											fontSize: '10px',
											fontWeight: 'bold',
											padding: '6px',
											position:
												this.props?.section?.navbarAlign === 'three'
													? 'absolute'
													: '',
											top: '10px',
											right: '-50px',
											cursor: 'pointer',
											color: this.props?.section?.navigationColor || 'black',
										}}
									>
										+{this.props.modules.length - minPages}Pages
									</p>
								)}
							</div>
						</div>
						<div
							style={{
								order:
									this.props?.section?.style?.navbarAlign === 'one' ||
									!this.props?.section?.style?.navbarAlign
										? 0
										: -1,
							}}
						>
							{this.props?.section?.style?.showLogo && (
								<div
									ref={this.imageRef}
									className="navbar-image-wrapper"
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										width:
											this.props?.section?.style?.siteTitle &&
											this.props?.section?.style?.showLogo &&
											!properties?.imageURL
												? '100px'
												: '100px',
										height: '60px',
										background: 'transparent',

										border: this.state.hoveredImage
											? '1px solid #fff'
											: ' 1px solid transparent',
										borderRadius: this.state.hoveredImage ? '8px' : '0px',
										transition: 'all 0.3s ease',
									}}
									onMouseEnter={() => {
										if (
											this.state.preview !== true &&
											this.props.isEditElement === true
										) {
											this.setState({
												hoveredImage: true,
											});
										}
									}}
									onMouseLeave={() => {
										this.setState({
											hoveredImage: false,
										});
									}}
								>
									{this.props?.section?.style?.siteTitle &&
									this.props?.section?.style?.showLogo &&
									!properties?.imageURL ? (
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'center',
												fontSize: '14px',
												fontWeight: 'bold',
												width: '100px',
												height: '70px',
												wordBreak: 'break-word',
												textAlign: 'center',
												textTransform: 'capitalize',
												overflow: 'hidden',
												color:
													this.props?.section?.navigationColor ||
													'#000000',
											}}
											className="site-title-wrapper"
										>
											{this.props?.section?.style?.siteTitle}
										</div>
									) : (
										// ) : this.props.section.objectFit ? (
										// 	<img
										// 		style={{
										// 			objectFit: this.props.section.objectFit,
										// 			height: '56px',
										// 			width: '56px',
										// 		}}
										// 		src={this.props?.section?.imageURL}
										// 	/>
										// )
										<ImageItem
											preview={this.state?.preview}
											previewType={this.state?.previewType}
											imageUrl={properties?.imageURL}
											imageSettings={properties?.image_settings}
											settingData={(e) => this.props.imgSettingData(e)}
											setActiveImage={(e) =>
												this.props.setActiveImage(
													this.props?.sectionID,
													this.state?.blocks[0]?._id,
													properties._id,
													properties.imageURL,
													e,
												)
											}
											activeSubBlockId={this.state.activeSubBlockId}
											refID={properties._id ? properties._id : null}
											client={this.props.client}
											label={properties?.label}
											ImgOverlayColor={properties?.ImgOverlayColor}
											ImgOverlayOpacity={properties?.ImgOverlayOpacity}
											uploadImageBase64={(e) =>
												this.props.uploadImageBase64(e)
											}
											generateAIImages={(e) => this.props.generateAIImages(e)}
											generateAIText={(e) => this.props.generateAIText(e)}
											isLogo={properties?.isLogo}
											sectionBg={this.state.style?.sectionBackgroundColor}
											imgSettingData={(e) => this.props.imgSettingData(e)}
											style={styles}
											navbarImage={true}
										/>
									)}

									{/* {this.state.hoveredImage && (
									{/* {this.state.hoveredImage && (
										<div
											ref={this.imageRef}
											className="edit-icon-wrapper"
											onClick={() => this.setState({ showImageModal: true })}
										>
											<Edit />
										</div>
									)} */}
								</div>
							)}
						</div>
						<div>
							<div className="cart-wrapper">
								<div
									// onMouseEnter={() => {
									// 	if (
									// 		this.state.preview !== true &&
									// 		this.props.isEditElement === true
									// 	) {
									// 		this.setState({
									// 			hoveredCart: true,
									// 		});
									// 	}
									// }}
									// onMouseLeave={() => {
									// 	this.setState({
									// 		hoveredCart: false,
									// 	});
									// }}
									// style={{
									// 	border: this.state.hoveredCart
									// 		? '1px solid #f1f2f3'
									// 		: '1px solid transparent',
									// 	padding: '5px',
									// }}
									style={{
										padding: '5px',
										display: 'flex',
										alignItems: 'center',
										// gap: '10px',
										width:
											(this.props?.section?.style?.navbarAlign === 'one' ||
												!this.props?.section?.style?.navbarAlign) &&
											this.props?.activeModule?.showAsA4
												? '200px'
												: this.props?.activeModule?.showAsA4
												? '160px'
												: this.props?.activeModule?.showAsA4 &&
												  this.props?.section?.style?.navbarAlign ===
														'three'
												? '160px'
												: this.props?.section?.style?.navbarAlign ===
														'one' ||
												  !this.props?.section?.style?.navbarAlign
												? '474px'
												: '190px',

										justifyContent: 'flex-end',
										gap: this.props?.activeModule?.showAsA4 ? '0px' : '10px',
									}}
									className="cart-div"
								>
									<div
										// style={{
										// 	display: 'flex',
										// 	flexDirection: 'row',
										// 	gap: '10px',
										// 	justifyContent: 'flex-end',
										// 	width:
										// 		this.props?.section?.style?.navbarAlign === 'three'
										// 			? 'auto'
										// 			: (this.props?.section?.style?.navbarAlign ==
										// 					'one' ||
										// 					!this.props?.section?.style
										// 						?.navbarAlign) &&
										// 			  this.props?.activeModule?.showAsA4
										// 			? '300px'
										// 			: this.props?.section?.style?.navbarAlign ==
										// 					'one' ||
										// 			  !this.props?.section?.style?.navbarAlign
										// 			? '474px'
										// 			: this.props?.activeModule?.showAsA4
										// 			? '150px'
										// 			: '200px',

										// 	// border:
										// 	// 	this.props?.section?.style?.cartBorder !== 'dash' &&
										// 	// 	this.props?.section?.style?.cartBorder
										// 	// 		? `1px solid ${
										// 	// 				this.props?.section?.navigationColor ||
										// 	// 				'#8B75BA'
										// 	// 		  }`
										// 	// 		: '1 px solid transparent',
										// 	// borderRadius:
										// 	// 	this.props?.section?.style?.cartBorder !== 'dash'
										// 	// 		? this.props?.section?.style?.cartBorder ===
										// 	// 		  'hexagon'
										// 	// 			? '7px'
										// 	// 			: this.props?.section?.style?.cartBorder ===
										// 	// 			  'circle'
										// 	// 			? '100px'
										// 	// 			: ''
										// 	// 		: '',
										// 	// width: 'auto',
										// 	// padding: '10px 5px',
										// }}
										style={{
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'flex-end',
											gap: '10px',
											padding: '5px',
											// marginRight: '20px',
										}}
										className="cart-icon"
									>
										{/* <Cart
											fillColor={
												this.props?.section?.navigationColor || '#8B75BA'
											}
										/> */}
										{(this.props?.section?.style?.downloadIcon ||
											!_.has(this.props?.section?.style, 'downloadIcon')) && (
											<DownloadPDF
												fillColor={
													this.props?.section?.navigationColor ||
													'#000000'
												}
											/>
										)}
										{(this.props?.section?.style?.showCart ||
											!_.has(this.props?.section?.style, 'showCart')) && (
											<CartIcons
												iconType={this.props?.section?.style?.cartIcon || 0}
												fillColor={
													this.props?.section?.navigationColor ||
													'#000000'
												}
											/>
										)}
										{(this.props?.section?.style?.cartValue ||
											!_.has(this.props?.section?.style, 'cartValue')) &&
											(this.props?.section?.style?.showCart ||
												!_.has(this.props?.section?.style, 'showCart') ||
												this.props?.section?.style?.downloadIcon ||
												!_.has(
													this.props?.section?.style,
													'downloadIcon',
												)) && (
												<div
													style={{
														width: '1px',
														height: '16px',
														marginTop: '4px',
														backgroundColor: '#9B9290',
													}}
													className="cart-divider"
												></div>
											)}
										{(this.props?.section?.style?.cartValue ||
											!_.has(this.props?.section?.style, 'cartValue')) && (
											<div
												style={{
													color:
														this.props?.section?.navigationColor ||
														'#000000',
												}}
												className="cart-count"
											>
												{this.props?.currencySymbol}
												{this.props?.finalTotalCost || 0}
											</div>
										)}
									</div>
								</div>
								{/* {this.state.hoveredCart && (
									<div
										ref={this.imageRef}
										className="edit-icon-hover"
										onClick={() => this.setState({ showCartModal: true })}
									>
										<Edit />
									</div>
								)} */}
							</div>
						</div>
					</div>
				</div>

				{this.state.showStyleModal && (
					<ElementSidebar
						ref={this.navbarRef}
						elementEndPosition={{ x: '50%', y: '100%' }}
						activeType={'navbar'}
						isWorkflow={this.props.isWorkflow}
						modules={this.props?.modules}
						module={this.props.module}
						noBounds={'.builder'}
						activePopupComponent={this.props?.section}
						setActivePopupComponent={(value) => {
							this.setState(
								{
									section: value,
								},
								() => {
									this.props?.setActiveSection(value);
								},
							);
						}}
						activeModuleId={this.props?.activeModuleId}
						setModalRef={(e) => {
							this.setState({
								showImageModalLibrary: e,
							});
						}}
					/>
				)}
			</>
		);
	};

	clientRenderNavbar = () => {
		const properties =
			this.props?.section?.blocks?.[0]?.subBlocks?.[0] || this.props.section || {};
		const styles = {
			backgroundColor: 'transparent',
			height: '100%',
			width: '100%',
		};
		return (
			<>
				<div className="navbar-component-wrapper">
					<div className="navbar-inner-div2" style={{ padding: '10px' }}>
						<div
							style={{
								width:
									this.props?.activeModule?.showAsA4 &&
									(this.props?.section?.style?.navbarAlign === 'one' ||
										!this.props?.section?.style?.navbarAlign)
										? '200px'
										: this.props?.section?.style?.navbarAlign === 'one' ||
										  !this.props?.section?.style?.navbarAlign
										? '474px'
										: '100%',
								justifyContent:
									this.props?.section?.style?.navbarAlign === 'two'
										? 'center'
										: this.props?.section?.style?.navbarAlign === 'three'
										? 'flex-end'
										: this.props?.section?.style?.navbarAlign === 'four'
										? 'flex-start'
										: 'center',
								whiteSpace: 'nowrap',
							}}
							className="navbar-modules-wrapper"
						>
							<div
								style={{
									border: this.state.hoveredModule
										? '1px solid #f1f2f3'
										: '1px solid transparent',
									justifyContent:
										this.props?.section?.style?.navbarAlign === 'two'
											? 'center'
											: this.props?.section?.style?.navbarAlign === 'three'
											? 'flex-end'
											: 'flex-start',
									gap:
										(this.props?.activeModule?.showAsA4 &&
											this.props?.section?.style?.navbarAlign === 'one') ||
										!this.props?.section?.style?.navbarAlign
											? '0px'
											: '10px',
									minWidth:
										this.props?.activeModule?.showAsA4 &&
										this.props?.section?.style?.navbarAlign === 'one'
											? '200px'
											: '100%',
								}}
								className="navbar-modules-inner-wrapper"
							>
								{this.renderClientModules()}
							</div>
						</div>
						<div
							style={{
								order:
									this.props?.section?.style?.navbarAlign === 'one' ||
									!this.props?.section?.style?.navbarAlign
										? 0
										: -1,
							}}
						>
							{this.props?.section?.style?.showLogo && properties?.imageURL && (
								<div
									ref={this.imageRef}
									className="navbar-image-wrapper"
									style={{
										width:
											this.props?.activeModule?.showAsA4 &&
											this.props?.section?.style?.navbarAlign === 'one'
												? '100px'
												: '150px',
										height: '60px',
										background: 'transparent',
										border: this.state.hoveredImage
											? '1px solid #fff'
											: ' 1px solid transparent',
										borderRadius: this.state.hoveredImage ? '8px' : '0px',
										transition: 'all 0.3s ease',
									}}
								>
									<ImageItem
										preview={this.state?.preview}
										previewType={this.state?.previewType}
										imageUrl={properties?.imageURL}
										imageSettings={properties?.image_settings}
										settingData={(e) => this.props.imgSettingData(e)}
										setActiveImage={(e) =>
											this.props.setActiveImage(
												this.props?.sectionID,
												this.state?.blocks[0]?._id,
												properties._id,
												properties.imageURL,
												e,
											)
										}
										activeSubBlockId={this.state.activeSubBlockId}
										refID={properties._id ? properties._id : null}
										client={this.props.client}
										label={properties?.label}
										ImgOverlayColor={properties?.ImgOverlayColor}
										ImgOverlayOpacity={properties?.ImgOverlayOpacity}
										uploadImageBase64={(e) => this.props.uploadImageBase64(e)}
										generateAIImages={(e) => this.props.generateAIImages(e)}
										generateAIText={(e) => this.props.generateAIText(e)}
										isLogo={properties?.isLogo}
										sectionBg={this.state.style?.sectionBackgroundColor}
										imgSettingData={(e) => this.props.imgSettingData(e)}
										style={styles}
										navbarImage={true}
									/>
								</div>
							)}
						</div>
						<div>
							<div
								style={{
									padding: '5px',
									display: 'flex',
									alignItems: 'center',
									// gap: '10px',
									width:
										(this.props?.section?.style?.navbarAlign === 'one' ||
											!this.props?.section?.style?.navbarAlign) &&
										this.props?.activeModule?.showAsA4
											? '200px'
											: this.props?.activeModule?.showAsA4
											? '160px'
											: this.props?.activeModule?.showAsA4 &&
											  this.props?.section?.style?.navbarAlign === 'three'
											? '160px'
											: this.props?.section?.style?.navbarAlign === 'one' ||
											  !this.props?.section?.style?.navbarAlign
											? '474px'
											: '190px',

									justifyContent: 'flex-end',
									gap: this.props?.activeModule?.showAsA4 ? '0px' : '10px',
								}}
								className="cart-div"
							>
								{(this.props?.section?.style?.downloadIcon ||
									!_.has(this.props?.section?.style, 'downloadIcon')) && (
									<div
										onClick={this.props?.handleDownload}
										style={{
											cursor: 'pointer',
										}}
									>
										<DownloadPDF
											fillColor={
												this.props?.section?.navigationColor || '#000000'
											}
										/>
									</div>
								)}
								{/* {this.props?.section?.style?.downloadIcon ||
									(!_.has(this.props?.section?.style, 'downloadIcon') && (
										<div className="cart-divider"></div>
									))} */}
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'flex-end',
										gap: '10px',
										// border:
										// 	this.props?.section?.style?.cartBorder !== 'dash' &&
										// 	this.props?.section?.style?.cartBorder
										// 		? `1px solid ${
										// 				this.props?.section?.navigationColor ||
										// 				'#8B75BA'
										// 		  }`
										// 		: '1 px solid transparent',
										// borderRadius:
										// 	this.props?.section?.style?.cartBorder !== 'dash'
										// 		? this.props?.section?.style?.cartBorder ===
										// 		  'hexagon'
										// 			? '7px'
										// 			: this.props?.section?.style?.cartBorder ===
										// 			  'circle'
										// 			? '100px'
										// 			: ''
										// 		: '',
										// width: '200px',
										// padding: '10px 5px',
									}}
									className="cart-icon"
								>
									{/* <Cart
		fillColor={
			this.props?.section?.navigationColor || '#8B75BA'
		}
	/> */}
									{(this.props?.section?.style?.showCart ||
										!_.has(this.props?.section?.style, 'showCart')) && (
										<CartIcons
											iconType={this.props?.section?.style?.cartIcon || 0}
											fillColor={
												this.props?.section?.navigationColor || '#000000'
											}
										/>
									)}
									{this.props?.section?.style?.cartValue ||
										(!_.has(this.props?.section?.style, 'cartValue') &&
											(this.props?.section?.style?.showCart ||
												!_.has(this.props?.section?.style, 'showCart') ||
												this.props?.section?.style?.downloadIcon ||
												!_.has(
													this.props?.section?.style,
													'downloadIcon',
												)) && (
												<div
													style={{
														width: '1px',
														height: '16px',
														marginTop: '4px',
														backgroundColor: '#9B9290',
													}}
													className="cart-divider"
												></div>
											))}
									{(this.props?.section?.style?.cartValue ||
										!_.has(this.props?.section?.style, 'cartValue')) &&
										this.props?.returnCartValue() != Number(0) && (
											<div
												style={{
													color:
														this.props?.section?.navigationColor ||
														'#000000',
													flexWrap: 'wrap',
													whiteSpace: 'nowrap',
												}}
												className="cart-count"
											>
												{this.props?.returnCartValue() == Number(0)
													? ''
													: `${
															this.props?.currencySymbol
													  } ${this.props?.returnCartValue()}`?.toLocaleString(
															'en-IN',
															{
																currency: 'INR',
															},
													  )}
											</div>
										)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	};
	render() {
		return this.props?.client ? this.clientRenderNavbar() : this.builderRenderNavbar();
	}
}

export default NavbarComponent;
