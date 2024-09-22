import ReusableButtonSettings from '../ReusableButtonSettings';
import { BrandingColorPopUp } from '../popups/BrandingPopups';
import { BrandColorList } from '../../../features/settings/indexConstant';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/workspaceSettings/plus-button.svg';
import ColorPicker from '../../colorPicker/ColorPicker';
import { memo } from 'react';

const BrandColorComponent = ({ setbrandState, brandState, handleSelectedColor }) => {
	return (
		<>
			<div className="brandingTextContainer">
				<h1>Branding</h1>
			</div>
			<div className="brandColorContainer">
				{brandState?.brandingThemes?.map((singleColor) => (
					<div className="chooseBrandColor" key={singleColor?.label}>
						<div
							className="circleColor"
							style={{ background: `${singleColor?.value || ''}` }}
						></div>
						<p className="hashColor">{singleColor?.value}</p>
					</div>
				))}
				{/* <div className="chooseBrandColor">
					<div
						className="circleColor"
						style={{ background: `${brandState?.brandColor}` }}
					></div>
					<p className="hashColor">{brandState?.brandColor}</p>
				</div> */}
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
