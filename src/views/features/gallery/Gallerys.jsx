import React, { memo } from 'react';

const Gallerys = () => {
	return (
		<div className="gallery-page-container">
			<div className="analytic-container">
				<div className="analytics"></div>
				<div className="vistors">
					<div className="register">
						<div>
							<p>Visitor registrations over time</p>
							<p>250</p>
						</div>
					</div>
					<div className="ai-scanned">
						<div>
							<p>Ai faces scanned</p>
							<p>250</p>
						</div>
					</div>
				</div>
				<div className="storage-container"></div>
			</div>
			<div className="all-gallery-container"></div>
		</div>
	);
};

export default memo(Gallerys);
