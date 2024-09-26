import ReusableButtonSettings from '../ReusableButtonSettings';
import { fontList } from '../../../features/settings/indexConstant';
import { memo } from 'react';
import ChangeFontPopup from './ChangeFontPopup';

//  brand fonts component
const BrandFontsComponent = ({ setbrandState, brandState }) => {
	return (
		<>
			<div className="brandTextContainer">
				<h1>Brand Fonts</h1>
			</div>

			<div className="fontslistcontainer">
				{fontList?.map((font, index, arr) => (
					<div key={index}>
						<div className="singleListDiv">
							<div
								style={{
									fontFamily: `${font?.name}`,
								}}
								className="fontName"
							>
								{font?.name}
							</div>
							<div className="fontType">{font?.type}</div>
						</div>

						<div
							style={{
								height: '1px',
								backgroundColor: '#2827287A',
								margin: '16px 0',
							}}
						/>
					</div>
				))}
			</div>

			<div className="button">
				<ReusableButtonSettings
					text={'Manage Font'}
					func={() => setbrandState((prev) => ({ ...prev, fontPopup: true }))}
				/>
			</div>

			{brandState?.fontPopup && (
				<ChangeFontPopup
					handleClose={() => setbrandState((prev) => ({ ...prev, fontPopup: false }))}
					show={brandState?.fontPopup}
				/>
			)}
		</>
	);
};

export default memo(BrandFontsComponent);
