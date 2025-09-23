import React, { Component } from 'react';
import Cart from '../../../library/svgs/Navbar/Cart';
import {
	HandBurger,
	Divider,
	DownloadPDF,
	ElementSidebar,
	EditNavbar,
	Exit,
} from '../../../builder_client_common';
import HamburgerIcons from './HamburgerICons';
import CartIcons from './CartIcons';
// import { HamburgerOne } from '../../svgs/Navbar/Hamburger/HamburgerComponent';
import _ from 'lodash';
import ImageItem from '../../elements/image';

// Utility function to detect iOS devices
const isIOSDevice = () => {
	return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};
class MobileNavbarComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showMobileCart: false,
			showMobileHamburger: false,
			mobileNavbarHover: false,
			mobileNavbarEdit: this.props.navbarMobileEdit,
			clientMobileNavbarEdit: false,
			mobileHoverCartEdit: false,
			mobileHoverHamburgerEdit: false,
			mobileHoverLogoEdit: false,
		};
	}
	componentWillReceiveProps = (nextProps) => {
		if (nextProps.navbarMobileEdit !== this.state.mobileNavbarEdit) {
			this.setState({
				mobileNavbarEdit: nextProps.navbarMobileEdit,
			});
		}
	};

	builderRenderNavbar = () => {
		let properties = this.props.navBar?.blocks[0]?.subBlocks[0] || {};
		const newMImageSettings = {
			crop: properties?.image_settings?.crop || { x: 1, y: 1 },
			zoom: properties?.image_settings?.zoom || 1,
			aspect: properties?.image_settings?.aspect || 1.5,
		};
		return (
			<>
				<div
					className={`navbar-inner-mobile-wrapper ${
						this.props?.showMobileMenu
							? 'navbar-inner-mobile-wrapper-active'
							: this.props?.showReverceAnimation && !this.props?.showMobileMenu
							? 'mobile-animation-reverse'
							: this.state.mobileNavbarHover
							? 'mobile-navbar-hover'
							: ''
					}`}
					onMouseEnter={() => {
						if (!this.state.mobileNavbarEdit && !this.props?.showMobileMenu) {
							this.setState({ mobileNavbarHover: true });
						}
					}}
					onMouseLeave={() => this.setState({ mobileNavbarHover: false })}
				>
					<div
						className="navbar-mobile-container"
						style={{
							justifyContent: 'space-between',
						}}
					>
						<div
							style={{
								width:
									this.props?.navBar?.style?.mNavbarAlign === 'two'
										? '100px'
										: 'auto',
							}}
						>
							{this.props?.navBar?.style?.showLogo && (
								<div
									className="navbar-inner-mobile"
									style={{
										marginRight:
											this.props?.navBar?.style?.mNavbarAlign === 'four'
												? '20px'
												: '',
										border: this.state.mobileHoverLogoEdit
											? `1px solid #ffffff`
											: '1px solid transparent',
										// padding: '5px',
										height: '40px',
										width: '80px',
									}}
									// onMouseEnter={() => {
									// 	this.setState({ mobileHoverLogoEdit: true });
									// }}
									// onMouseLeave={() => {
									// 	this.setState({ mobileHoverLogoEdit: false });
									// }}
								>
									{properties?.imageURL ? (
										// {this.props?.navBar?.blocks?.[0]?.subBlocks?.[0]?.mImageURL ? (
										// <img
										// 	src={
										// 		this.props?.navBar?.blocks?.[0]?.subBlocks?.[0]
										// 			?.mImageURL
										// 	}
										// 	alt="logo"
										// 	height={'40px'}
										// 	width={'40px'}
										// 	style={{
										// 		objectFit: 'contain',
										// 	}}
										// />
										<ImageItem
											preview={this.props?.preview}
											previewType={this.props?.previewType}
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
											style={this.props.navBar?.styles}
											navbarImage={true}
										/>
									) : (
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'center',
												height: '50px',
												width: '100px',
												fontSize: '12px',
												lineHeight: 'normal',
												textAlign: 'center',
												textTransform: 'capitalize',
												wordBreak: 'break-word',
												fontWeight: 'bold',
												overflow: 'hidden',
												color:
													this.props?.navBar?.navigationColor ||
													'#000000',
											}}
											className="navbar-inner-mobile-title"
										>
											{this.props?.navBar?.style?.siteTitle || 'Logo'}
										</div>
									)}
									{/* {this.state.mobileHoverLogoEdit && (
										<div
											className="mobile-logo-edit-icon"
											onClick={() => {
												this.props.setShowPopupInMobile(
													true,
													'navImage',
													this.props?.section,
												);
											}}
											style={{
												cursor: 'pointer',
											}}
										>
											<EditNavbar />
										</div>
									)} */}
								</div>
							)}
						</div>
						<div
							style={{
								order:
									this.props?.navBar?.style?.mNavbarAlign === 'one' ||
									!_.has(this.props?.navBar?.style, 'mNavbarAlign')
										? '-1'
										: '',
								maxWidth:
									this.props?.navBar?.style?.mNavbarAlign === 'one' ||
									!_.has(this.props?.navBar?.style, 'mNavbarAlign')
										? '140px'
										: '100%',
								minWidth:
									this.props?.navBar?.style?.mNavbarAlign === 'two' ||
									this.props?.navBar?.style?.mNavbarAlign === 'one'
										? '100px'
										: '',
								width:
									this.props?.navBar?.style?.mNavbarAlign === 'three' ||
									this.props?.navBar?.style?.mNavbarAlign === 'four'
										? '100%'
										: '',
							}}
						>
							<div
								className="navbar-mobile-cart"
								style={{
									justifyContent:
										this.props?.navBar?.style?.mNavbarAlign === 'three'
											? 'flex-end'
											: this.props?.navBar?.style?.mNavbarAlign === 'four'
											? 'flex-start'
											: 'center',
								}}
							>
								<div
									className="mobile-cart-container"
									style={{
										// border:
										// 	this.props?.navBar?.style?.cartBorder !== 'dash' &&
										// 	this.props?.navBar?.style?.cartBorder
										// 		? `1px solid ${
										// 				this.props?.navBar?.navigationColor ||
										// 				'#8B75BA'
										// 		  }`
										// 		: this.state.mobileHoverCartEdit
										// 		? `1px solid #ffffff`
										// 		: '',
										border: this.state.mobileHoverCartEdit
											? `1px solid #ffffff`
											: '1px solid transparent',
										// borderRadius:
										// 	this.props?.navBar?.style?.cartBorder !== 'dash'
										// 		? this.props?.navBar?.style?.cartBorder ===
										// 		  'hexagon'
										// 			? '7px'
										// 			: this.props?.navBar?.style?.cartBorder ===
										// 			  'circle'
										// 			? '100px'
										// 			: ''
										// 		: '',
										width: '100px',
										// display: 'contents',
									}}
									// onMouseEnter={() => {
									// 	this.setState({ mobileHoverCartEdit: true });
									// }}
									// onMouseLeave={() => {
									// 	this.setState({ mobileHoverCartEdit: false });
									// }}
								>
									{(this.props?.navBar?.style?.downloadIcon ||
										!_.has(this.props?.navBar?.style, 'downloadIcon')) &&
										!isIOSDevice() && (
											<div>
												<DownloadPDF
													fillColor={
														this.props?.navBar?.navigationColor ||
														'#000000'
													}
												/>
											</div>
										)}
									{(this.props?.navBar?.style?.showCart ||
										!_.has(this.props?.navBar?.style, 'showCart')) && (
										<div>
											<CartIcons
												iconType={this.props?.navBar?.style?.cartIcon || 0}
												fillColor={
													this.props?.navBar?.navigationColor || '#000000'
												}
												style={{ cursor: 'pointer' }}
											/>
										</div>
									)}
									{/* {(this.props?.navBar?.style?.cartValue ||
										!_.has(this.props?.navBar?.style, 'cartValue')) &&
										(this.props?.navBar?.style?.showCart ||
											!_.has(this.props?.navBar?.style, 'showCart') ||
											this.props?.navBar?.style?.downloadIcon ||
											!_.has(this.props?.navBar?.style, 'downloadIcon')) && (
											<Divider />
										)} */}
									{(this.props?.navBar?.style?.cartValue ||
										!_.has(this.props?.navBar?.style, 'cartValue')) && (
										<span
											style={{
												color:
													this.props?.navBar?.navigationColor ||
													'#000000',
											}}
											className="navbar-mobile-cart-total"
										>
											{this.props?.currencySymbol}
											{this.props?.finalTotalCost || '0'}
										</span>
									)}
									{/* {this.state.mobileHoverCartEdit && (
										<div
											className="mobile-cart-edit-icon"
											onClick={() =>
												this.props.setShowPopupInMobile(
													true,
													'mNavbarCart',
													this.props?.section,
												)
											}
											style={{
												cursor: 'pointer',
											}}
										>
											<EditNavbar />
										</div>
									)} */}
								</div>
							</div>
						</div>
						<div
							style={{
								width: '100px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-end',
							}}
						>
							{this.props?.duplicateModules?.length > 1 && (
								<div
									style={{
										marginLeft:
											this.props?.navBar?.style?.mNavbarAlign === 'three'
												? '20px'
												: '',
										border: this.state.mobileHoverHamburgerEdit
											? `1px solid #ffffff`
											: '1px solid transparent',
										padding: '5px',
									}}
									// onMouseEnter={() => {
									// 	this.setState({ mobileHoverHamburgerEdit: true });
									// }}
									// onMouseLeave={() => {
									// 	this.setState({ mobileHoverHamburgerEdit: false });
									// }}
									className="navbar-inner-mobile-right"
								>
									<div>
										<HamburgerIcons
											iconType={this.props?.navBar?.style?.hamburgerIcon ?? 4}
											fillColor={
												this.props?.navBar?.navigationColor || '#000000'
											}
											style={{ cursor: 'pointer' }}
										/>
										{/* {this.state.mobileHoverHamburgerEdit && (
											<div
												className="mobile-hamburger-edit-icon"
												onClick={(e) => {
													e.stopPropagation();
													this.props.setShowPopupInMobile(
														true,
														'mNavbarHamburger',
														this.props?.section,
													);
												}}
												style={{
													cursor: 'pointer',
												}}
											>
												<EditNavbar />
											</div>
										)} */}
									</div>
								</div>
							)}
						</div>
					</div>

					{this.props?.showMobileMenu && (
						<div
							className="navbar-mobile-module"
							style={{
								backgroundColor:
									this.props?.navBar?.style?.sectionBackgroundColor || '#ffffff',
							}}
						>
							<div
								style={{
									display: 'flex',
									gap: '24px',
									margin: '140px 40px',
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										gap: '32px',
									}}
								>
									{this.props?.duplicateModules?.map((module, index) => (
										<div
											className="navbar-module-item"
											key={index}
											style={{
												cursor: 'pointer',
												color:
													this.props?.navBar?.navigationColor ||
													'#000000',

												opacity:
													this.props?.activeModuleId == module._id
														? 1
														: 0.6,
												fontWeight:
													this.props?.activeModuleId == module._id
														? 700
														: 400,
											}}
											onClick={(e) => {
												e.stopPropagation();
												if (this.props?.activeModule !== module._id) {
													this.props.getModuleInfo(
														module._id,
														module.module,
													);
												}
											}}
										>
											{module?.label}
										</div>
									))}
								</div>
								<div
									style={{
										height: '100%',
										width: '1px',
										backgroundColor:
											this.props?.navBar?.navigationColor || '#585C63',
										opacity: 0.6,
									}}
								/>
							</div>
						</div>
					)}
					{this.state.mobileNavbarHover && (
						<div className="mobile-hover-overlay">
							<div
								onClick={() => {
									this.props?.setEditMobileNavFunction(true);
								}}
								className="mobile-hover-overlay-item"
							>
								Edit Header
							</div>
						</div>
					)}
				</div>
			</>
		);
	};

	clientRenderNavbar = () => {
		let properties = this.props.navBar?.blocks[0]?.subBlocks[0] || {};
		const newMImageSettings = {
			crop: properties?.mImage_settings?.crop || { x: 1, y: 1 },
			zoom: properties?.mImage_settings?.zoom || 1,
			aspect: properties?.mImage_settings?.aspect || 1.5,
		};

		return (
			<div
				className={`navbar-inner-mobile-wrapper ${
					this.state.clientMobileNavbarEdit
						? 'navbar-inner-mobile-wrapper-active'
						: this.props?.showReverceAnimation && !this.props?.showMobileMenu
						? 'mobile-animation-reverse'
						: ''
				}`}
			>
				<div
					className="navbar-mobile-container"
					style={{
						justifyContent: 'space-between',
					}}
				>
					<div>
						{this.props?.navBar?.style?.showLogo && (
							<div
								className="navbar-inner-mobile"
								style={{
									marginRight:
										this.props?.navBar?.style?.mNavbarAlign === 'four'
											? '20px'
											: '',
									height: '40px',
									width: '80px',
								}}
							>
								{this.props?.navBar?.blocks?.[0]?.subBlocks?.[0]?.imageURL ? (
									<ImageItem
										preview={this.props?.preview}
										previewType={this.props?.previewType}
										imageUrl={
											properties?.imageURL ||
											this.props?.navBar?.blocks?.[0]?.subBlocks?.[0]
												?.imageURL
										}
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
										style={this.props.navBar?.styles}
										navbarImage={true}
									/>
								) : (
									<div className="navbar-inner-mobile-title">
										{this.props?.navBar?.style?.title || ''}
									</div>
								)}
							</div>
						)}
					</div>
					<div
						style={{
							order:
								this.props?.navBar?.style?.mNavbarAlign === 'one' ||
								!_.has(this.props?.navBar?.style, 'mNavbarAlign')
									? '-1'
									: '',
							maxWidth:
								this.props?.navBar?.style?.mNavbarAlign === 'one' ||
								!_.has(this.props?.navBar?.style, 'mNavbarAlign')
									? '140px'
									: '100%',
							minWidth:
								this.props?.navBar?.style?.mNavbarAlign === 'two' ||
								this.props?.navBar?.style?.mNavbarAlign === 'one'
									? '100px'
									: '',
							width:
								this.props?.navBar?.style?.mNavbarAlign === 'three' ||
								this.props?.navBar?.style?.mNavbarAlign === 'four'
									? '100%'
									: '',
						}}
					>
						<div
							className="navbar-mobile-cart"
							style={{
								justifyContent:
									this.props?.navBar?.style?.mNavbarAlign === 'three'
										? 'flex-end'
										: this.props?.navBar?.style?.mNavbarAlign === 'four'
										? 'flex-start'
										: 'center',
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '5px',
									padding: '4px 6px',
									border:
										this.props?.navBar?.style?.cartBorder !== 'dash' &&
										this.props?.navBar?.style?.cartBorder
											? `1px solid ${
													this.props?.navBar?.navigationColor || '#8B75BA'
											  }`
											: '',
									borderRadius:
										this.props?.navBar?.style?.cartBorder !== 'dash'
											? this.props?.navBar?.style?.cartBorder === 'hexagon'
												? '7px'
												: this.props?.navBar?.style?.cartBorder === 'circle'
												? '100px'
												: ''
											: '',
								}}
							>
								{/* <DownloadIcon onClick={this.props?.handleDownload} /> */}
								{(this.props?.navBar?.style?.downloadIcon ||
									!_.has(this.props?.navBar?.style, 'downloadIcon')) &&
									!isIOSDevice() && (
										<>
											<div
												style={{ cursor: 'pointer' }}
												onClick={this.props?.handleDownload}
											>
												<DownloadPDF
													fillColor={
														this.props?.navBar?.navigationColor ||
														'#000000'
													}
												/>
											</div>

											{/* {this.props?.navBar?.style?.downloadIcon &&
											this.props?.navBar?.style?.cartValue && (
												<Divider height="20px" />
											)} */}
										</>
									)}
								{(this.props?.navBar?.style?.showCart ||
									!_.has(this.props?.navBar?.style, 'showCart')) && (
									<>
										<Cart
											fillColor={
												this.props?.navBar?.navigationColor || '#000000'
											}
										/>
										{this.props?.navBar?.style?.showCart &&
											this.props?.navBar?.style?.cartValue &&
											this.props?.returnCartValue() != Number(0) && (
												<Divider height="20px" />
											)}
									</>
								)}
								{(this.props?.navBar?.style?.cartValue ||
									!_.has(this.props?.navBar?.style, 'cartValue')) && (
									<span
										style={{
											color: this.props?.navBar?.navigationColor || '#000000',
										}}
										className="navbar-mobile-cart-total"
									>
										{this.props?.returnCartValue() === Number('0')
											? ''
											: `${
													this.props?.currencySymbol
											  } ${this.props?.returnCartValue()}`?.toLocaleString(
													'en-IN',
													{
														currency: 'INR',
													},
											  )}
									</span>
								)}
							</div>
						</div>
					</div>
					<div
						style={{
							width:
								this.props?.navBar?.style?.mNavbarAlign === 'two' ||
								this.props?.navBar?.style?.mNavbarAlign === 'three'
									? 'auto'
									: '100px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end',
						}}
					>
						{this.props?.clientPortalModules?.length > 1 && (
							<div className="navbar-inner-mobile-right">
								<div
									style={{
										cursor: 'pointer',
										marginLeft:
											this.props?.navBar?.style?.mNavbarAlign === 'three'
												? '20px'
												: '',
									}}
									onClick={(e) => {
										e.stopPropagation();
										// Force state update to ensure toggle works consistently
										this.props?.handleNavbarHamburger();
										this.setState({
											clientMobileNavbarEdit:
												!this.state.clientMobileNavbarEdit,
										});
									}}
								>
									{this.state.clientMobileNavbarEdit ? (
										<Exit />
									) : (
										<HamburgerIcons
											iconType={this.props?.navBar?.style?.hamburgerIcon || 0}
											fillColor={
												this.props?.navBar?.navigationColor || '#000000'
											}
											style={{ cursor: 'pointer' }}
										/>
									)}
								</div>
							</div>
						)}
					</div>
				</div>

				{this.state?.clientMobileNavbarEdit && (
					<div
						style={{
							backgroundColor:
								this.props?.navBar?.style?.sectionBackgroundColor || '#ffffff',
						}}
						className="navbar-mobile-module"
					>
						<div
							style={{
								display: 'flex',
								gap: '24px',
								margin: '140px 40px',
							}}
						>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: '32px',
								}}
							>
								{this.props?.clientPortalModules?.map((module, index) => (
									<div
										className="navbar-module-item"
										key={index}
										style={{
											cursor: 'pointer',
											color: this.props?.navBar?.navigationColor || '#000000',
											opacity:
												this.props?.selectedLabelId == module._id ? 1 : 0.6,
											fontWeight:
												this.props?.selectedLabelId == module._id
													? 700
													: 400,
										}}
										onClick={(e) => {
											e.stopPropagation();
											this.props?.renderClientModulesClickFunction(module);
										}}
									>
										{module?.label}
									</div>
								))}
							</div>
							<div
								style={{
									height: '100%',
									width: '1px',
									backgroundColor:
										this.props?.navBar?.navigationColor || '#585C63',
									opacity: 0.6,
								}}
							/>
						</div>
					</div>
				)}
			</div>
		);
	};

	render() {
		return this.props?.client ? this.clientRenderNavbar() : this.builderRenderNavbar();
	}
}

export default MobileNavbarComponent;
