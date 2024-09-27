import ReusableButtonSettings from '../ReusableButtonSettings';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/workspaceSettings/plus-button.svg';
import ColorPicker from '../../colorPicker/ColorPicker';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/settings/CrossWhite.svg';
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
				<h1>Branding</h1>
			</div>
			<div className="brandColorContainer">
				{brandState?.brandingThemes?.map((singleColor, index) => (
					<div
						className="fullColorWrapper"
						onMouseEnter={() => setdeleteColor(singleColor?.value)}
						onMouseLeave={() => setdeleteColor('')}
						key={index}
					>
						<div className="chooseBrandColor" key={singleColor?.label}>
							<div
								className="circleColor"
								style={{ background: `${singleColor?.value || ''}` }}
							></div>
							<p className="hashColor">{singleColor?.value}</p>
						</div>

						<div
							className="cancelDiv"
							style={{ right: singleColor?.value === deleteColor ? '-7px' : '51px' }}
							onClick={() => handleRemoveColorFunc(singleColor?.value)}
						>
							<CloseSvg />
						</div>
					</div>
				))}
			</div>

			<div>
				<ReusableButtonSettings
					icon={<PlusSvg />}
					className="reuseableButton"
					text={'Add'}
					func={() => setbrandState((prev) => ({ ...prev, brandingPopup: true }))}
				/>
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
