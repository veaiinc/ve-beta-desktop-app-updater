import React, { memo } from 'react';
import '../../../assets/scss/privacyPolicy.scss';
import { ReactComponent as VE } from '../../../assets/svg/ve.svg';
import { ReactComponent as Back } from '../../../assets/svg/privacyPolicyBack.svg';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
	const navigate = useNavigate();
	const pdfUrl = 'https://drive.google.com/file/d/1eGn06UUp0CnLbBdL-KZDEB9S9dl0PBhJ/preview';

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

						<span className="privacyPolicyText">Terms of Service</span>
					</div>
				</div>
			</div>

			{/* PDF viewer */}
			<div className="pdfViewer">
				<iframe
					src={pdfUrl}
					title="Terms of Service"
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

export default memo(TermsOfService);
