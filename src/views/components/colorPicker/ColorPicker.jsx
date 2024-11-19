import React, { useState } from 'react';
import { SliderPicker } from 'react-color';
import 'react-color-palette/css';
import '../../../assets/scss/ColorPicker/colorpicker.scss';
import _ from 'lodash';
import ReactModal from '../modalsV2';
import { ReactComponent as CrossIcon } from '../../../assets/svg/workspaceSettings/cross.svg';

const colors = [
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
];

const ColorPicker = ({
	isOpen,
	title = '',
	colorValue = '#FFFFFF',
	closeModal,
	getSelectedColorFunc,
}) => {
	const [colorPickerValue, setcolorPickerValue] = useState(colorValue);

	const onChangeValue = (type, hex) => {
		if (type === 'colors') {
			setcolorPickerValue(hex);
			return;
		} else if (type === 'slider') {
			setcolorPickerValue(hex?.hex);
		} else if (type === 'input') {
			setcolorPickerValue(hex);
		}
	};

	const onClickFunction = () => {
		getSelectedColorFunc(colorPickerValue);
		closeModal();
	};
	return (
		<ReactModal isOpen={isOpen} closeModal={closeModal}>
			<div className="color-modal">
				<div className="headerBody">
					<div className="titleDiv">
						<h1>{title ? title : 'Choose Accent Colour'}</h1>
					</div>
					<div className="closeDiv">
						<span onClick={closeModal}>
							<CrossIcon />
						</span>
					</div>
				</div>

				<div className="colors">
					{_.map(colors, (value, key) => {
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
												className={colorPickerValue == v ? 'active' : ''}
												onClick={() => onChangeValue('colors', v)}
											>
												{v === '' ? <b className="no-color"></b> : ''}
											</span>
										);
									});
								})}
							</div>
						);
					})}
				</div>

				<div className="slider-colorDiv">
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
				</div>
			</div>
		</ReactModal>
	);
};

export default ColorPicker;
