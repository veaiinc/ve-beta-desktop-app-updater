import ReusableButtonSettings from '../ReusableButtonSettings';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/workspaceSettings/plus-button.svg';
import ColorPicker from '../../colorPicker/ColorPicker';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/Settings/CrossWhite.svg';
import { ReactComponent as InfoIcon } from '../../../../assets/svg/workspaceSettings/info.svg';
import { memo, useState } from 'react';

const BrandColorComponent = ({
	setbrandState,
	brandState,
	handleSelectedColor,
	handleRemoveColorFunc,
}) => {
	const [deleteColor, setdeleteColor] = useState('');
	return (
		<>
			<div className="brandingTextContainer">
				<div className="headerSection">
					<h1>Colours</h1>
					<p>Add your brand colours</p>
				</div>
				<button onClick={() => setbrandState((prev) => ({ ...prev, brandingPopup: true }))}>
					Add a colour
				</button>
			</div>
			<div className="brandColorContainer">
				{brandState?.brandingThemes?.map((singleColor, index) => (
					<div className="colorCard" key={index}>
						<div
							className="colorCircle"
							style={{ backgroundColor: singleColor?.value }}
						/>
						<div className="colorInfo">
							<span className="colorCode">{singleColor?.value}</span>
							<span className="colorType">
								{index === 0
									? 'Primary Colour'
									: index === 1
									? 'Secondary Colour'
									: 'Tertiary Colour'}
							</span>
						</div>
						<button className="infoButton">
							<InfoIcon />
						</button>
					</div>
				))}
			</div>

			{brandState.brandingPopup && (
				<ColorPicker
					closeModal={() => setbrandState((prev) => ({ ...prev, brandingPopup: false }))}
					isOpen={brandState?.brandingPopup}
					colorValue={brandState?.brandColor}
					getSelectedColorFunc={handleSelectedColor}
				/>
			)}
		</>
	);
};

export default memo(BrandColorComponent);
