import { fontList } from '../../../features/settings/indexConstant';
import { memo } from 'react';
import ChangeFontPopup from './ChangeFontPopup';
import { ReactComponent as InfoIcon } from '../../../../assets/svg/workspaceSettings/info.svg';

const BrandFontsComponent = ({ setbrandState, brandState }) => {
	return (
		<>
			<div className="brandTextContainer">
				<div className="headerSection">
					<h1>Fonts</h1>
					<p>Add your brand fonts</p>
				</div>
				<button onClick={() => setbrandState((prev) => ({ ...prev, fontPopup: true }))}>
					Manage fonts
				</button>
			</div>

			<div className="fontsContainer">
				{fontList?.map((font, index) => (
					<div className="fontCard" key={index}>
						<div className="fontPreview" style={{ fontFamily: font?.name }}>
							{font?.name}
						</div>
						{/* <button className="infoButton">
						</button> */}
					</div>
				))}
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
