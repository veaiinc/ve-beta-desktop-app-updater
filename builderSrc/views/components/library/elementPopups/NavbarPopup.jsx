import React from 'react';
import './elementPopup.scss';
import ColorPicker from '../../properties/colorpicker';
import { Switch } from 'antd/lib';
import { ReactComponent as Option1 } from '../../library/svgs/Navbar/FirstActive.svg';
import { ReactComponent as Option2 } from '../../library/svgs/Navbar/SecondOption.svg';
import { ReactComponent as Option3 } from '../../library/svgs/Navbar/ThirdOption.svg';
import { ReactComponent as Option4 } from '../../library/svgs/Navbar/ForthOption.svg';
import { ReactComponent as Cart } from '../../library/svgs/Navbar/Cart/Cart1.svg';
import { ReactComponent as Hamburger } from '../../library/svgs/Navbar/Hamburger/Hamberger4.svg';
import _ from 'lodash';
class NavbarPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeEditDesign: 'design',
			navbarAlign: 'center',
			activeNavbarAlign: 'one',
			activeComponent: props.activeComponent,
			activeBackground: 'solid',
			activeBackgroundColor: 'solid',
			selectedOption: 'Realistic',
			spread: -20,
			blur: 20,
			distance: 20,
			pageSpacing: 20,
			verticalPadding: 20,
			showShadow: false,
		};
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeComponent !== this.state.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
			});
		}
	}
	handleNavbarStyles = (type, value) => {
		let newComponent = { ...this.state.activeComponent };
		if (
			type == 'navbarAlign' ||
			type == 'mNavbarAlign' ||
			type == 'showLogo' ||
			type == 'showCart' ||
			type == 'position' ||
			type == 'downloadIcon' ||
			type == 'cartValue' ||
			type == 'sectionBackgroundColor'
		) {
			this.setState({ activeNavbarAlign: value });
			newComponent = {
				...newComponent,
				style: { ...newComponent.style, [type]: value },
			};
		} else {
			newComponent = { ...newComponent, [type]: value };
		}
		this.setState({ activeComponent: newComponent }, () => {
			this.props?.setActivePopupComponent(newComponent);
		});
	};

	handleEditDesign = (type) => {
		this.setState({ activeEditDesign: type });
	};
	handleOptionClick = (option) => {
		this.setState({ selectedOption: option });
	};

	handleSliderChange = (property, event) => {
		this.setState({ [property]: parseInt(event.target.value) });
	};
	render() {
		return (
			<div className="edit-design-modal">
				<div className="edit-design-modal-header">
					<div
						onClick={() => this.handleEditDesign('design')}
						className={`navbar-title ${
							this.state.activeEditDesign === 'design' ? 'navbar-title-active' : ''
						}`}
					>
						Edit Design
					</div>
					<div
						onClick={() => this.handleEditDesign('background')}
						className={`navbar-title ${
							this.state.activeEditDesign === 'background'
								? 'navbar-title-active'
								: ''
						}`}
					>
						{' '}
						Background
					</div>
				</div>
				{this.state.activeEditDesign === 'design' && (
					<div className="navbar-design-body">
						<div className="fixed-possition">
							<div className="toggle-navbar">
								<div
									className=" bs-item bs-item-row animated-item"
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										textTransform: 'capitalize',
										fontSize: '12px',
										color: '#E8E8E8',
										width: '100%',
									}}
								>
									<span
									// style={{ textTransform: 'capitalize' }}
									>
										Fixed Position
									</span>

									<label
										className="switch"
										onClick={() => {
											this.handleNavbarStyles(
												'position',
												!this.state.activeComponent?.style?.position,
											);
										}}
									>
										<input
											type="checkbox"
											checked={
												this.state.activeComponent?.style?.position || false
											}
										/>
										<span
											style={{
												backgroundColor:
													this.state.activeComponent?.style?.position &&
													'#F1F1F1',
											}}
											className="slider-round-white round"
										></span>
									</label>
								</div>
							</div>
							<div
								className=" bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									textTransform: 'capitalize',
									fontSize: '12px',
									color: '#E8E8E8',
									width: '100%',
								}}
							>
								<span
								// style={{ textTransform: 'capitalize' }}
								>
									Logo
								</span>

								<label
									className="switch"
									onClick={() => {
										this.handleNavbarStyles(
											'showLogo',
											!this.state.activeComponent?.style?.showLogo,
										);
									}}
								>
									<input
										type="checkbox"
										checked={
											this.state.activeComponent?.style?.showLogo || false
										}
									/>
									<span
										style={{
											backgroundColor:
												this.state.activeComponent?.style?.showLogo &&
												'#F1F1F1',
										}}
										className="slider-round-white round"
									></span>
								</label>
							</div>
							<div
								className=" bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									textTransform: 'capitalize',
									fontSize: '12px',
									color: '#E8E8E8',
									width: '100%',
								}}
							>
								<span
								// style={{ textTransform: 'capitalize' }}
								>
									Cart Icon
								</span>

								<label
									className="switch"
									onClick={() => {
										this.handleNavbarStyles(
											'showCart',
											!this.state.activeComponent?.style?.showCart,
										);
									}}
								>
									<input
										type="checkbox"
										checked={
											this.state.activeComponent?.style?.showCart || false
										}
									/>
									<span
										style={{
											backgroundColor:
												this.state.activeComponent?.style?.showCart &&
												'#F1F1F1',
										}}
										className="slider-round-white round"
									></span>
								</label>
							</div>
							<div
								className=" bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									textTransform: 'capitalize',
									fontSize: '12px',
									color: '#E8E8E8',
									width: '100%',
								}}
							>
								<span
								// style={{ textTransform: 'capitalize' }}
								>
									Download Icon
								</span>

								<label
									className="switch"
									onClick={() => {
										this.handleNavbarStyles(
											'downloadIcon',
											!this.state.activeComponent?.style?.downloadIcon,
										);
									}}
								>
									<input
										type="checkbox"
										checked={
											this.state.activeComponent?.style?.downloadIcon ||
											!_w.has(
												this.state.activeComponent?.style,
												'downloadIcon',
											)
												? true
												: false
										}
									/>
									<span
										style={{
											backgroundColor:
												this.state.activeComponent?.style?.downloadIcon &&
												'#F1F1F1',
										}}
										className="slider-round-white round"
									></span>
								</label>
							</div>
							<div
								className=" bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									textTransform: 'capitalize',
									fontSize: '12px',
									color: '#E8E8E8',
									width: '100%',
								}}
							>
								<span
								// style={{ textTransform: 'capitalize' }}
								>
									Cart Value
								</span>

								<label
									className="switch"
									onClick={() => {
										this.handleNavbarStyles(
											'cartValue',
											!this.state.activeComponent?.style?.cartValue,
										);
									}}
								>
									<input
										type="checkbox"
										checked={
											this.state.activeComponent?.style?.cartValue ||
											!_.has(this.state.activeComponent?.style, 'cartValue')
												? true
												: false
										}
									/>
									<span
										style={{
											backgroundColor:
												this.state.activeComponent?.style?.cartValue &&
												'#F1F1F1',
										}}
										className="slider-round-white round"
									></span>
								</label>
							</div>
						</div>
						{/* <div className="fixed-header-styles">
							<div className="design-paragraph">Fixed header styles</div>
							<div className="fixed-header-styles-options">
								<div
									onClick={() => this.handleNavbarStyles('scroll', 'static')}
									className={`fixed-item ${
										(_.has(this.props?.activeComponent, 'scroll') &&
											this.props?.activeComponent?.scroll === 'static') ||
										!_.has(this.props?.activeComponent, 'scroll')
											? 'navbar-title-active'
											: ''
									}`}
								>
									Static
								</div>
								<div
									onClick={() => this.handleNavbarStyles('scroll', 'scrollBack')}
									className={`fixed-item ${
										this.props?.activeComponent?.scroll === 'scrollBack'
											? 'navbar-title-active'
											: ''
									}`}
								>
									Scroll Back
								</div>
							</div>
						</div> */}
						{/* <div className="divider"></div> */}

						<div className="design-styles">
							<div className="design-paragraph">Styles</div>
							{!this.props?.isMobileNavbar ? (
								<div className="design-styles-options">
									<div
										onClick={() =>
											this.handleNavbarStyles('navbarAlign', 'one')
										}
										className={`design-style-item ${
											(_.has(
												this.props?.activeComponent?.style,
												'navbarAlign',
											) &&
												this.props?.activeComponent?.style?.navbarAlign ===
													'one') ||
											!_.has(
												this.props?.activeComponent?.style,
												'navbarAlign',
											)
												? 'active-design-style'
												: ''
										}`}
									>
										<Option1 />
									</div>
									<div
										onClick={() =>
											this.handleNavbarStyles('navbarAlign', 'two')
										}
										className={`design-style-item ${
											this.props?.activeComponent?.style?.navbarAlign ===
											'two'
												? 'active-design-style'
												: ''
										}`}
									>
										<Option2 />
									</div>
									<div
										onClick={() =>
											this.handleNavbarStyles('navbarAlign', 'three')
										}
										className={`design-style-item ${
											this.props?.activeComponent?.style?.navbarAlign ===
											'three'
												? 'active-design-style'
												: ''
										}`}
									>
										<Option3 />
									</div>
									<div
										onClick={() =>
											this.handleNavbarStyles('navbarAlign', 'four')
										}
										className={`design-style-item ${
											this.props?.activeComponent?.style?.navbarAlign ===
											'four'
												? 'active-design-style'
												: ''
										}`}
									>
										<Option4 />
									</div>
								</div>
							) : (
								<div className="design-styles-options-mobile">
									<div
										onClick={() =>
											this.handleNavbarStyles('mNavbarAlign', 'one')
										}
										className="cartAlign-one"
										style={{
											border:
												this.props?.activeComponent?.style?.mNavbarAlign ===
													'one' ||
												!_.has(
													this.props?.activeComponent?.style,
													'mNavbarAlign',
												)
													? '1px solid #f2f2f3'
													: '',
										}}
									>
										<Cart />
										<div
											style={{
												backgroundColor:
													this.props?.activeComponent?.style
														?.mNavbarAlign === 'one' ||
													!_.has(
														this.props?.activeComponent?.style,
														'mNavbarAlign',
													)
														? '#f2f2f3'
														: '',
											}}
											className="logo-text-mobile"
										>
											Logo
										</div>
										<Hamburger />
									</div>
									<div
										onClick={() =>
											this.handleNavbarStyles('mNavbarAlign', 'two')
										}
										className="cartAlign-one"
										style={{
											border:
												this.props?.activeComponent?.style?.mNavbarAlign ===
												'two'
													? '1px solid #f2f2f3'
													: '',
										}}
									>
										<div
											style={{
												backgroundColor:
													this.props?.activeComponent?.style
														?.mNavbarAlign === 'two'
														? '#f2f2f3'
														: '',
											}}
											className="logo-text-mobile"
										>
											Logo
										</div>

										<Cart />
										<Hamburger />
									</div>
									<div
										onClick={() =>
											this.handleNavbarStyles('mNavbarAlign', 'three')
										}
										className="cartAlign-one"
										style={{
											border:
												this.props?.activeComponent?.style?.mNavbarAlign ===
												'three'
													? '1px solid #f2f2f3'
													: '',
										}}
									>
										<div
											style={{
												backgroundColor:
													this.props?.activeComponent?.style
														?.mNavbarAlign === 'three'
														? '#f2f2f3'
														: '',
											}}
											className="logo-text-mobile"
										>
											Logo
										</div>
										<div
											style={{
												width: '100%',
												display: 'flex',
												justifyContent: 'flex-end',
											}}
										>
											<Cart />
										</div>
										<Hamburger />
									</div>
									<div
										onClick={() =>
											this.handleNavbarStyles('mNavbarAlign', 'four')
										}
										className="cartAlign-one"
										style={{
											border:
												this.props?.activeComponent?.style?.mNavbarAlign ===
												'four'
													? '1px solid #f2f2f3'
													: '',
										}}
									>
										<div
											style={{
												backgroundColor:
													this.props?.activeComponent?.style
														?.mNavbarAlign === 'four'
														? '#f2f2f3'
														: '',
											}}
											className="logo-text-mobile"
										>
											Logo
										</div>
										<div style={{ width: '100%' }}>
											<Cart />
										</div>
										<Hamburger />
									</div>
								</div>
							)}
						</div>
						{/* hide shadow */}
						{/* <div className="shadow-editor">
							<div className="shadow-editor__section">
								<div className="shadow-editor__header">
									<h3>Drop shadow</h3>
									<svg style={{transform: this.state.showShadow ? 'rotate(180deg)' : 'rotate(0deg)'}} onClick={() => this.setState({showShadow: !this.state.showShadow})}
										className="shadow-editor__arrow"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M6 9L12 15L18 9"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
							

								<div className="shadow-editor__option-group">
									<button
										className={`shadow-editor__option ${
											selectedOption === 'Realistic'
												? 'shadow-editor__option--selected'
												: ''
										}`}
										onClick={() => this.handleOptionClick('Realistic')}
									>
										Realistic
									</button>
									<button
										className={`shadow-editor__option ${
											selectedOption === 'Bold'
												? 'shadow-editor__option--selected'
												: ''
										}`}
										onClick={() => this.handleOptionClick('Bold')}
									>
										Bold
									</button>
									<button
										className={`shadow-editor__option ${
											selectedOption === 'Custom'
												? 'shadow-editor__option--selected'
												: ''
										}`}
										onClick={() => this.handleOptionClick('Custom')}
									>
										Custom
									</button>
								</div>
							</div>

							<div className="shadow-editor__slider-container">
								<label className="shadow-editor__label">Spread</label>
								<div className="shadow-editor__slider-wrapper">
									<input
										type="range"
										min="-50"
										max="50"
										value={spread}
										className="shadow-editor__slider"
										onChange={(e) => this.handleSliderChange('spread', e)}
									/>
									<div
										className="shadow-editor__slider-thumb"
										style={{ left: `calc(${((spread + 50) / 100) * 100}%)` }}
									></div>
									<span className="shadow-editor__value">{spread}</span>
								</div>
							</div>

							<div className="shadow-editor__slider-container">
								<label className="shadow-editor__label">Blur</label>
								<div className="shadow-editor__slider-wrapper">
									<input
										type="range"
										min="0"
										max="100"
										value={blur}
										className="shadow-editor__slider"
										onChange={(e) => this.handleSliderChange('blur', e)}
									/>
									<div
										className="shadow-editor__slider-thumb"
										style={{ left: `${blur}%` }}
									></div>
									<span className="shadow-editor__value">{blur}</span>
								</div>
							</div>

							<div className="shadow-editor__slider-container">
								<label className="shadow-editor__label">Distance</label>
								<div className="shadow-editor__slider-wrapper">
									<input
										type="range"
										min="0"
										max="100"
										value={distance}
										className="shadow-editor__slider"
										onChange={(e) => this.handleSliderChange('distance', e)}
									/>
									<div
										className="shadow-editor__slider-thumb"
										style={{ left: `${distance}%` }}
									></div>
									<span className="shadow-editor__value">{distance}</span>
								</div>
							</div>

							<div className="shadow-editor__divider"></div>

							<div className="shadow-editor__slider-container">
								<label className="shadow-editor__label">Page spacing</label>
								<div className="shadow-editor__slider-wrapper">
									<input
										type="range"
										min="0"
										max="100"
										value={pageSpacing}
										className="shadow-editor__slider"
										onChange={(e) => this.handleSliderChange('pageSpacing', e)}
									/>
									<div
										className="shadow-editor__slider-thumb"
										style={{ left: `${pageSpacing}%` }}
									></div>
									<span className="shadow-editor__value">{pageSpacing}</span>
								</div>
							</div>

							<div className="shadow-editor__slider-container">
								<label className="shadow-editor__label">Vertical padding</label>
								<div className="shadow-editor__slider-wrapper">
									<input
										type="range"
										min="0"
										max="100"
										value={verticalPadding}
										className="shadow-editor__slider"
										onChange={(e) =>
											this.handleSliderChange('verticalPadding', e)
										}
									/>
									<div
										className="shadow-editor__slider-thumb"
										style={{ left: `${verticalPadding}%` }}
									></div>
									<span className="shadow-editor__value">{verticalPadding}</span>
								</div>
							</div>
						
						</div> */}
					</div>
				)}
				{this.state.activeEditDesign === 'background' && (
					<div className="background-body">
						<div className="background-title">Background</div>
						<div className="fixed-header-styles-options">
							<div
								onClick={() => this.handleNavbarStyles('background', 'adaptive')}
								className={`fixed-item ${
									this.props?.activeComponent?.background === 'adaptive'
										? 'navbar-title-active'
										: ''
								}`}
							>
								Adaptive
							</div>
							<div
								onClick={() => this.handleNavbarStyles('background', 'solid')}
								className={`fixed-item ${
									(_.has(this.props?.activeComponent, 'background') &&
										this.props?.activeComponent?.background === 'solid') ||
									!_.has(this.props?.activeComponent, 'background')
										? 'navbar-title-active'
										: ''
								}`}
							>
								Solid
							</div>
						</div>
						<div className="line"></div>
						{(this.props?.activeComponent?.background === 'solid' ||
							!_.has(this.props?.activeComponent, 'background')) && (
							<>
								<div
									className="block_styles"
									style={
										{
											// height: this.state?.heightForPopup ? '425px' : 'auto',
										}
									}
								>
									<ColorPicker
										title={'Background Color'}
										color={
											this.state?.activeComponent?.style
												?.sectionBackgroundColor || '#fff'
										}
										handleColor={(e) =>
											this.handleNavbarStyles('sectionBackgroundColor', e)
										}
										brandColors={this.props?.brandColors}
										zoom={0.8}
										setHeightForPopup={(e) => {
											this.setState({
												heightForPopup: e,
											});
										}}
										shapePopup={true}
									/>
								</div>
								<div
									className="block_styles"
									style={
										{
											// height: this.state?.heightForPopup ?  'auto' : '425px',
										}
									}
								>
									<ColorPicker
										title={'Navigation Color'}
										color={
											this.state?.activeComponent?.navigationColor || '#fff'
										}
										handleColor={(e) =>
											this.handleNavbarStyles('navigationColor', e)
										}
										brandColors={this.props?.brandColors}
										zoom={0.8}
										setHeightForPopup={(e) => {
											this.setState({
												heightForPopup: e,
											});
										}}
										shapePopup={true}
									/>
								</div>
							</>
						)}
					</div>
				)}
			</div>
		);
	}
}

export default NavbarPopup;
