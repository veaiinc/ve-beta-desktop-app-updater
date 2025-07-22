import React, { Component } from 'react';
import { SliderPicker } from 'react-color';
import 'react-color-palette/css';
import '../../../../assets/scss/color-picker.scss';

import _ from 'lodash';
import Modal from '../../library/modals';
import { ReactComponent as Close } from '../../library/svgs/Close.svg';
import { ReactComponent as Spinner } from '../../library/svgs/Spinner.svg';
import { ReactComponent as Plus } from '../../library/svgs/summary/Plus.svg';
// import { ReactComponent as Vector } from '../../';
class ColorPicker extends Component {
	constructor(props) {
		super();
		this.state = {
			color: props.color,
			inputColor: props.color,
			showColorModal: false,
			type: props.type ? props.type : null,
			showBrandColors: false,
			addBrandColors: false,
			openToTop: props.openToTop ? props.openToTop : false,
			colors: [
				{
					0: [
						'#EACEC5',
						'#FEB99A',
						'#FA3E31',
						'#E5573F',
						'#A8616A',
						'#BC6352',
						'#F7D755',
						'#FFF700',
						'#B78300',
					],
				},
				{
					1: [
						'#E0B1A9',
						'#ECC5C3',
						'#FD6E60',
						'#7C3D2B',
						'#DFAAAB',
						'#CCA96E',
						'#D19B80',
						'#F0B216',
						'#F7DE00',
						'#91776C',
					],
				},
				{
					2: [
						'#FBEFEB',
						'#DED2C3',
						'#CD393A',
						'#B8793E',
						'#D35C85',
						'#D897A0',
						'#F39983',
						'#EBCFB8',
						'#FFF886',
					],
				},
				{
					3: [
						'#D46E6C',
						'#FFD0AE',
						'#FF4275',
						'#A81902',
						'#F1AC7E',
						'#E8CA70',
						'#FF9110',
						'#FF9110',
						'#EECE7C',
						'#F4EBDD',
						'#677659',
					],
				},
				{
					4: [
						'#FBDFD9',
						'#EFB5A1',
						'#F6642B',
						'#FF9247',
						'#D9855E',
						'#F1B314',
						'#EAD226',
						'#E3DAC0',
						'#F7E3C3',
					],
				},
				{
					5: [
						'#DFDAC2',
						'#BAD1C1',
						'#43A42E',
						'#55AEA3',
						'#78B8AD',
						'#70BAD1',
						'#A0FBFE',
						'#73BDF8',
						'#B7C0DC',
						'#FF5FAD',
					],
				},
				{
					6: [
						'#ABA77C',
						'#2DD29B',
						'#A3DABC',
						'#B3CCAD',
						'#2B63D2',
						'#008BD2',
						'#9FC1DB',
						'#CCBAC7',
						'#DB829D',
					],
				},
				{
					7: [
						'#B1BBAF',
						'#9CC4C8',
						'#48A77E',
						'#DCFFE1',
						'#96ACA7',
						'#A4E9EE',
						'#8599C5',
						'#465FEB',
						'#DACFEE',
						'#B984AA',
					],
				},
				{
					8: [
						'#ADAFAC',
						'#B4C97C',
						'#55B794',
						'#01584E',
						'#2DA0D2',
						'#9DB8FF',
						'#C4D5FF',
						'#C8B4E6',
						'#FB99B9',
					],
				},
				{
					9: [
						'#CCE3FF',
						'#D0D5D2',
						'#76AAB0',
						'#33887E',
						'#2A2F8D',
						'#6A95BB',
						'#9EACE8',
						'#79A7DB',
						'#BE96D9',
						'#F4E0FF',
					],
				},
				{
					10: [
						'#000000',
						'#383838',
						'#797979',
						'#999999',
						'#B8B8B8',
						'#D7D7D7',
						'#ECECEC',
						'#FFFFFF',
						'',
					],
				},
			],
			brandColors: props?.brandColors,
			colorKey: null,
			colorInput: '',
		};
		this.dropdownref = React.createRef();
	}
	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside);
		// if (this.props?.shapePopup) {
		// 	this.props?.setHeightForPopup(true);
		// }
	};
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}
	handleClickOutside = (event) => {
		if (this.dropdownref.current && !this.dropdownref.current.contains(event.target)) {
			this.setState(
				{
					showColorModal: false,
				},
				() => {
					if (this.props?.shapePopup) {
						this.props?.setHeightForPopup(false);
					}
				},
			);
		}
	};
	componentWillReceiveProps = (nextProps) => {
		if (this.state.color !== nextProps.color) {
			this.setState({
				color: nextProps.color,
				inputColor: nextProps.color,
			});
		}
		if (this.state.openToTop !== nextProps.openToTop) {
			this.setState({
				openToTop: nextProps.openToTop ? nextProps.openToTop : false,
			});
		}
		if (this.state.inputColor !== nextProps.inputColor) {
			this.setState({
				color: nextProps.inputColor || this.state.color,
				inputColor: nextProps.inputColor || this.state.inputColor,
			});
		}
		if (this.state.type !== nextProps.type) {
			this.setState({
				type: nextProps.type,
			});
		}
		if (this.state.brandColors !== nextProps.brandColors) {
			this.setState({
				brandColors: nextProps.brandColors,
			});
		}
	};
	toggleColorModal = (e) => {
		e.stopPropagation();
		this.setState(
			{
				showColorModal: true,
			},
			() => {
				if (this.props?.shapePopup) {
					this.props?.setHeightForPopup(true);
				}
			},
		);
	};
	changeColorInput = (e) => {
		let hexRegex = /^#([0-9a-f]{3}){1,2}$/i;
		let value = e.target.value;

		if (hexRegex.test(value) == false) {
			this.setState(
				{
					color: '',
					inputColor: value,
				},
				() => (this.state.type !== null ? '' : this.props.handleColor(value)),
			);
		} else {
			this.setState(
				{
					color: value,
					inputColor: value,
				},
				() => this.props.handleColor(value),
			);
		}
	};
	sendColorInput = (e) => {
		this.props.handleColor(this.state.color);
	};
	handleSetColorFromPicks = (e, v) => {
		e.stopPropagation();
		this.setState(
			{
				color: v,
				inputColor: v,
			},
			() => {
				this.props.handleColor(v);
			},
		);
	};
	handleAddBrandColors = () => {
		this.setState({
			showBrandColors: true,
		});
	};
	handleAddColor = (key) => {
		this.setState({
			addBrandColors: true,
			colorKey: key,
		});
	};
	saveColorInput = (value) => {
		// Update input value immediately
		this.setState({ colorInput: value });

		// Skip validation if empty
		if (!value) {
			this.setState({ invalidColorInput: false });
			return;
		}

		// Remove '#' if present for validation
		const colorValue = value.startsWith('#') ? value.slice(1) : value;

		// Validate hex color (3 or 6 characters)
		const isValidHex = /^([0-9A-F]{3}){1,2}$/i.test(colorValue);

		this.setState({
			invalidColorInput: !isValidHex,
			colorInput: value.startsWith('#') ? value : `#${value}`,
		});
	};
	handleSaveColor = (e) => {
		e.stopPropagation();

		const isColorExist = this.state.brandColors.find(
			(color) => color.value === this.state.colorInput,
		);
		if (this.state?.invalidColorInput) {
			return;
		} else if (isColorExist) {
			this.setState({
				showBrandColors: false,
			});
			return;
		} else {
			const updatedBrandColors = [
				...this.state.brandColors,
				{ label: this.state.colorInput, value: this.state.colorInput },
			];

			this.setState(
				{
					brandColors: [
						...this.state.brandColors,
						{ label: this.state.colorInput, value: this.state.colorInput },
					],
					showBrandColors: false,
				},
				() => {
					this.props?.addBrandColors(this.state?.brandColors);
				},
			);
		}
	};
	render() {
		return (
			<>
				<div className="bs-item" style={{ width: '100%', position: 'relative' }}>
					<b>{this.props.title}</b>
					<div className="bg-item">
						<a
							style={{
								backgroundColor: this.state.color || '#000',
								border: '1px solid #e4e5e6',
								cursor: 'pointer',
							}}
							onClick={(e) => this.toggleColorModal(e)}
						></a>
						{/* <p>{this.state.color}</p> */}

						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<input
								className="input-color-text"
								value={this.state.inputColor}
								onChange={(e) => this.changeColorInput(e)}
								placeholder={this.state.inputColor === '' ? 'No Color' : ''}
								maxLength={7}
								onBlur={(e) =>
									this.state.type !== null ? this.sendColorInput(e) : ''
								}
							/>
						</div>
					</div>
					{this.state.showColorModal ? (
						<div
							className="color-modal"
							ref={this.dropdownref}
							style={{
								bottom: this.state.openToTop ? '100%' : 'auto',
								top: this.state.openToTop ? 'auto' : '100%',
								zoom: this.props?.zoom || 1,
								background: this.props?.isDarkBg ? '#191819' : '#fff',
								boxShadow: this.props?.isDarkBg
									? `0px 0px 2px 0px rgba(255, 255, 250, 0.12)`
									: '',
							}}
						>
							<div className="colors">
								{_.map(this.state.colors, (value, key) => {
									return (
										<div
											className="color-column"
											style={{
												marginTop: key % 2 === 0 ? '0' : '-10px',
											}}
										>
											{_.map(value, (val, k) => {
												return _.map(val, (v, i) => {
													return (
														<span
															style={{
																backgroundColor: v,
																position: 'relative',
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																borderColor: this.props?.isDarkBg
																	? '#d9d9d969'
																	: '',
															}}
															className={
																this.state.color == v
																	? 'active'
																	: ''
															}
															onClick={(e) =>
																this.handleSetColorFromPicks(e, v)
															}
														>
															{v === '' ? (
																<b className="no-color"></b>
															) : (
																''
															)}
														</span>
													);
												});
											})}
										</div>
									);
								})}
							</div>
							{this.state?.brandColors?.length > 0 ? (
								<div className="color-item-main-container">
									<div className="color-item-main-title">Brand Colors</div>

									<div className="color-item-main">
										{this.state?.brandColors?.map((ele, k) => (
											<>
												<span
													onClick={(e) =>
														this.handleSetColorFromPicks(e, ele?.value)
													}
													style={{ backgroundColor: ele?.value }}
													className="color-item"
												></span>
											</>
										))}
										{this.state.brandColors.length <= 9 && (
											<span
												onClick={(e) => this.handleAddBrandColors(e)}
												className="color-add-item"
											>
												<Plus />
											</span>
										)}
									</div>
								</div>
							) : this.props?.isDarkBg ? (
								''
							) : (
								<div
									onClick={(e) => this.handleAddBrandColors(e)}
									className="add-brand-colors"
								>
									Add your brand colours
								</div>
							)}
							<div className="brands-colors">
								<SliderPicker
									color={this.state.color}
									onChange={(e) =>
										this.setState(
											{
												color: e.hex,
												inputColor: e.hex,
											},
											() => {
												this.props.handleColor(e.hex);
											},
										)
									}
								/>
							</div>

							<div
								className="brand-colors"
								style={{
									position: 'relative',
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<input
									onClick={(e) => e.stopPropagation()}
									className="color-input"
									value={this.state.inputColor}
									onChange={(e) => this.changeColorInput(e)}
									placeholder={this.state.inputColor === '' ? 'No Color' : ''}
									style={{
										background: this.props?.isDarkBg ? '#191819' : '#fff',
										color: this.props?.isDarkBg ? '#f1f1f1' : '#4e4441',
									}}
								/>
								<legend className="color-input-circle" style={{ border: 'none' }}>
									<input
										onClick={(e) => e.stopPropagation()}
										type="color"
										onChange={(e) => this.props.handleColor(e.target.value)}
										value={this.state.color}
										style={{
											border: 'none',
											outline: 'none',
											borderRadius: '50%',
											width: 20,
											height: 20,
											padding: 0,
										}}
									/>
								</legend>
							</div>
						</div>
					) : (
						''
					)}
				</div>
				<Modal
					show={this.state.showBrandColors}
					modalType={'center'}
					handleClose={(e) => {
						this.setState({
							showBrandColors: false,
						});
					}}
				>
					<div className="add-brand-colors-modal">
						<div className="add-brand-colors-modal-header">
							<div className="add-brand-colors-modal-title">Add brand colours</div>
							<div
								onClick={(e) =>
									this.setState({ showBrandColors: false, addBrandColors: false })
								}
								className="modal-close"
							>
								<Close />
							</div>
						</div>

						<div className="add-brand-colors-modal-body">
							{_.map(this.state.colors, (value, key) => {
								return (
									<div
										className="color-column"
										style={{
											marginTop: key % 2 === 0 ? '0' : '-10px',
										}}
									>
										{_.map(value, (val, k) => {
											return _.map(val, (v, i) => {
												return (
													<span
														style={{
															backgroundColor: v,
															position: 'relative',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
														}}
														className={
															this.state.color == v ? 'active' : ''
														}
														onClick={() =>
															this.setState({
																colorInput: v,
															})
														}
													>
														{v === '' ? (
															<b className="no-color"></b>
														) : (
															''
														)}
													</span>
												);
											});
										})}
									</div>
								);
							})}
						</div>
						<div className="brands-colors">
							<SliderPicker
								color={this.state.colorInput}
								onChange={(e) =>
									this.setState(
										{
											colorInput: e.hex,
											inputColor: e.hex,
										},
										() => {
											this.props.handleColor(e.hex);
										},
									)
								}
							/>
						</div>

						<div className="orDiv">
							<div className="line"></div>
							<div className="orText">OR</div>
							<div className="line"></div>
						</div>
						<div class="color-inputDiv">
							<span
								class="colorDiv"
								style={{
									backgroundColor: this.state.colorInput,
								}}
							></span>
							<input
								className="colorInput"
								type="text"
								placeholder="Enter hex code"
								onChange={(e) => this.saveColorInput(e.target.value)}
								maxLength={7}
								value={this.state.colorInput}
							/>
						</div>

						{this.state?.invalidColorInput && (
							<span className="color-input-error" style={{ color: 'red' }}>
								Please enter a valid hex code
							</span>
						)}

						<div onClick={(e) => this.handleSaveColor(e)} className="buttonDiv">
							Choose Colour
						</div>

						{/* <div className="slider-colorDiv">
                    <SliderPicker
                        color={colorPickerValue}
                        onChange={(e) => onChangeValue('slider', e)}
                    />
                </div>
                <div className="orDiv">
                    <div className="line"></div>
                    <p>OR</p>
                    <div className="line"></div>
                </div>
                <div className="color-inputDiv">
                    <span
                        style={{
                            backgroundColor: `${colorPickerValue}`,
                        }}
                        className="colorDiv"
                    ></span>
                    <input
                        type="text"
                        value={colorPickerValue}
                        onChange={(e) => onChangeValue('input', e.target.value)}
                        placeholder="Enter color code"
                    />
                </div>
                <div className="buttonDiv">
                    <button onClick={onClickFunction}>Choose Colour</button>
                </div> */}

						{/* <div className="color-picker-modal-body">
							{this.state.addBrandColors ? (
								<div className="add-color-modal-body">
									<div>
										<div>
											<input
												style={{
													border: this.state?.invalidColorInput
														? '1px solid red'
														: '1px solid #d2cdcc',
													borderRadius: '5px',
												}}
												className="color-picker-modal-input"
												type="text"
												value={this.state.colorInput}
												placeholder="Enter hex code"
												onChange={(e) =>
													this.saveColorInput(e.target.value)
												}
												maxLength={7}
											/>
										</div>
										{this.state?.invalidColorInput ? (
											<span style={{ color: 'red' }}>
												Please enter a valid hex code
											</span>
										) : (
											<span style={{ visibility: 'hidden' }}>hex code</span>
										)}
									</div>

									<div className="color-submit-btn">
										<div
											className="color-submit-btn-cancel"
											onClick={() => {
												this.setState({
													colorInput: '',
													invalidColorInput: false,
												});
											}}
										>
											Cancel
										</div>
										{this.state.responseDelay === true ? (
											<div className="loading-spinner">
												<Spinner className="spinner" />
											</div>
										) : (
											<div
												className="color-submit-btn-save"
												onClick={() => this.handleSaveColor()}
											>
												Save
											</div>
										)}
									</div>
								</div>
							) : (
								<div className="color-body">
									{ this.state?.brandColors?.map((element, key) => {
										return (
											<span
												style={{
													backgroundColor: this.state.brandColors[element?.value],
												}}
												key={key}
												onClick={(e) => this.handleAddColor(key)}
												className="color-body-item"
											>
												
											</span>
										);
									})}
									
								</div>
							)}
						</div> */}
					</div>
				</Modal>
			</>
		);
	}
}

export default ColorPicker;
