import React, { memo } from 'react';
import '../../../assets/scss/privacyPolicy.scss';
import VE from '../../../assets/svg/ve.svg?react';
import Back from '../../../assets/svg/privacyPolicyBack.svg?react';
import { useNavigate } from 'react-router-dom';
import { PRIVACY_POLICY_URL_PREVIEW } from '../../../helpers/ConstantUrls';

const PrivacyPolicy = () => {
	const navigate = useNavigate();
	const pdfUrl = PRIVACY_POLICY_URL_PREVIEW;

	return (
		<div className="privacyPolicyMainContainer">
			{/* header section */}
			<div className="privacypolicyHeader">
				<div className="privacypolicyHeaderLogo">
					<VE />
				</div>
				<div className="privacyPolicyHeaderContentContainer">
					<div className="privacypolicyheaderContent">
						<span className="backBtnWrapper" onClick={() => navigate(-1)}>
							<Back />
						</span>

						<span className="privacyPolicyText">Privacy Policy</span>
					</div>
				</div>
			</div>

			{/* PDF viewer */}
			<div className="pdfViewer">
				<iframe
					src={pdfUrl}
					title="Privacy Policy"
					width="100%"
					height="600px"
					style={{ border: 'none' }}
					allowFullScreen
					className="pdfViewerIframer"
				/>
			</div>
		</div>
	);
};

export default memo(PrivacyPolicy);
