import React, { Component } from 'react';
import ImageItem from '../../elements/image';
import { EditNavbar as Edit } from '../../../builder_client_common';
import Cart from '../../../library/svgs/Navbar/Cart';
import './NavbarCompStyles.scss';
import { ElementSidebar, DownloadIcon, DownloadPDF } from '../../../builder_client_common';
import CartIcons from '../NabarWrapper/CartIcons';
import _ from 'lodash';
class NavbarComponent extends Component {
	constructor(props) {
		super(props);
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
			showImageModal: false,
			showHiddenModal: props.showHiddenModal,
			showMobileMenu: false,
			hoveredCart: false,
			showCartModal: false,
			section: props.section,
		};
		this.navbarRef = React.createRef();
		this.imageRef = React.createRef();
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
		if (
			this.navbarRef.current &&
			this.navbarRef.current.getSidebarNode && // check if method exists
			!this.navbarRef.current.getSidebarNode().contains(e.target) &&
			!this.state.showImageModalLibrary
		) {
			this.setState(
				{
					showStyleModal: false,
					showImageModal: false,
					showHiddenModal: false,
					showCartModal: false,
				},
				() => {
					this.props.setShowStyleModal(false);
				},
			);
		}
	};
	renderModules = () => {
		let modules = [...(this.props?.modules || [])];

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
							onClick={() => this.props.getModuleInfo(module._id, moduleType)}
							className={`navbar-module-item ${
								this.state.activeModuleId == module._id ? 'active' : ''
							}`}
							style={{
								color: this.props?.section?.navigationColor || '#000000',
								position: 'relative',
								opacity: this.state.activeModuleId == module._id ? 1 : 0.7,
								fontWeight:
									this.state.activeModuleId == module._id ? 'bolder' : 'normal',
							}}
						>
							{module.label}
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

	handleNavbarUpdate = (type, value) => {
		// let newSection = { ...this.props.section };
		// // newSection[type] = value

		// if (type == 'image') {
		// 	newSection.blocks[0].subBlocks[0].imageURL = value?.imageURL;
		// }
		this.setState(
			{
				// section: newSection,
				section: value,
			},
			() => {
				this.props.setActiveSection(value);
			},
		);
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
									this.props?.selectedLabelId == module._id ? 'bolder' : 'normal',
							}}
						>
							{module.label}
							{this.props?.selectedLabelId == module._id && (
								<span
									style={{
										height: '3px',
										width: '15px',
										position: 'absolute',
										borderRadius: '2px',
										bottom: '-8px',
										background: this.props.section.navigationColor || '#000000',
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
	builderRenderNavbar = () => {
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
							style={{
								width:
									this.props?.section?.style?.navbarAlign === 'one' ||
									!this.props?.section?.style?.navbarAlign
										? 'auto'
										: '100%',
								justifyContent:
									this.props?.section?.style?.navbarAlign === 'two'
										? 'center'
										: this.props?.section?.style?.navbarAlign === 'three'
										? 'flex-end'
										: this.props?.section?.style?.navbarAlign === 'four'
										? 'flex-start'
										: 'center',

								transition: 'all 0.3s ease',
							}}
							className="navbar-modules-wrapper"
						>
							<div
								style={{
									border: this.state.hoveredModule
										? '1px solid #f1f2f3'
										: '1px solid transparent',
									padding: '10px',
								}}
								className="navbar-modules-inner-wrapper"
							>
								{this.renderModules()}

								{this.state.hoveredModule && (
									<div
										style={{ cursor: 'pointer' }}
										className="edit-module-wrapper"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											this.props.managePages(e);
										}}
									>
										<Edit />
									</div>
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
												: '60px',
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
									) : this.props.section.objectFit ? (
										<img
											style={{
												objectFit: this.props.section.objectFit,
												height: '56px',
												width: '56px',
											}}
											src={this.props?.section?.imageURL}
										/>
									) : (
										<ImageItem
											preview={this.state?.preview}
											previewType={this.state?.previewType}
											imageUrl={this.props?.section?.imageURL}
											imageSettings={this.props?.section?.image_settings}
											settingData={(e) => this.props.imgSettingData(e)}
											setActiveImage={(e) =>
												this.props.setActiveImage(
													this.state.sectionID,
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

									{this.state.hoveredImage && (
										<div
											ref={this.imageRef}
											className="edit-icon-wrapper"
											onClick={() => this.setState({ showImageModal: true })}
										>
											<Edit />
										</div>
									)}
								</div>
							)}
						</div>
						<div>
							<div
								onClick={() => this.setState({ showCartModal: true })}
								className="cart-wrapper"
							>
								<div
									onMouseEnter={() => {
										if (
											this.state.preview !== true &&
											this.props.isEditElement === true
										) {
											this.setState({
												hoveredCart: true,
											});
										}
									}}
									onMouseLeave={() => {
										this.setState({
											hoveredCart: false,
										});
									}}
									style={{
										border: this.state.hoveredCart
											? '1px solid #f1f2f3'
											: '1px solid transparent',
										padding: '5px',
									}}
									className="cart-div"
								>
									<div
										style={{
											display: 'flex',
											flexDirection: 'row',
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
											width: 'auto',
											// padding: '10px 5px',
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
								{this.state.hoveredCart && (
									<div
										ref={this.imageRef}
										className="edit-icon-hover"
										onClick={() => this.setState({ showCartModal: true })}
									>
										<Edit />
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				{this.state.showCartModal && (
					<ElementSidebar
						ref={this.navbarRef}
						elementEndPosition={{ x: '80%', y: 125 }}
						activeType={'mNavbarCart'}
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
					/>
				)}
				{this.state.showStyleModal && (
					<ElementSidebar
						ref={this.navbarRef}
						elementEndPosition={{ x: '80%', y: 125 }}
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
					/>
				)}
				{this.state.showImageModal && (
					<ElementSidebar
						ref={this.navbarRef}
						elementEndPosition={{ x: 100, y: 125 }}
						activeType={'navImage'}
						setModalRef={(e) => {
							this.setState({
								showImageModalLibrary: e,
							});
						}}
						isWorkflow={this.props.isWorkflow}
						modules={this.props?.modules}
						module={this.props.module}
						noBounds={'.builder'}
						activePopupComponent={this.props?.section}
						setActivePopupComponent={(value) => {
							this.handleNavbarUpdate('image', value);
						}}
						activeModuleId={this.props?.activeModuleId}
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
					<div className="navbar-inner-div2">
						<div
							style={{
								width:
									this.props?.section?.style?.navbarAlign === 'one' ||
									!this.props?.section?.style?.navbarAlign
										? 'auto'
										: '100%',
								justifyContent:
									this.props?.section?.style?.navbarAlign === 'two'
										? 'center'
										: this.props?.section?.style?.navbarAlign === 'three'
										? 'flex-end'
										: this.props?.section?.style?.navbarAlign === 'four'
										? 'flex-start'
										: 'center',

								transition: 'all 0.3s ease',
							}}
							className="navbar-modules-wrapper"
						>
							<div
								style={{
									border: this.state.hoveredModule
										? '1px solid #f1f2f3'
										: '1px solid transparent',
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
										width: '60px',
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
										imageUrl={this.props?.section?.imageURL}
										imageSettings={this.props?.section?.image_settings}
										settingData={(e) => this.props.imgSettingData(e)}
										setActiveImage={(e) =>
											this.props.setActiveImage(
												this.state.sectionID,
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
									gap: '10px',
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
								{this.props?.section?.style?.downloadIcon ||
									(!_.has(this.props?.section?.style, 'downloadIcon') && (
										<div className="cart-divider"></div>
									))}
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										gap: '10px',
										border:
											this.props?.section?.style?.cartBorder !== 'dash' &&
											this.props?.section?.style?.cartBorder
												? `1px solid ${
														this.props?.section?.navigationColor ||
														'#8B75BA'
												  }`
												: '1 px solid transparent',
										borderRadius:
											this.props?.section?.style?.cartBorder !== 'dash'
												? this.props?.section?.style?.cartBorder ===
												  'hexagon'
													? '7px'
													: this.props?.section?.style?.cartBorder ===
													  'circle'
													? '100px'
													: ''
												: '',
										width: '150px',
										padding: '10px 5px',
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
