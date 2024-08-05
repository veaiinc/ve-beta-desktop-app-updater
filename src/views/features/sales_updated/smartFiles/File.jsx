import React, { memo } from 'react';
import '../.././../../assets/scss/sales/smartFile.scss';
import Events from '../../../components/smartFileComponets/Events';
import Services from '../../../components/smartFileComponets/Services';
import PaymentSchedule from '../../../components/smartFileComponets/PaymentSchedule';
import Variables from '../../../components/smartFileComponets/Variables';

const File = ({ templateData }) => {
	console.log('fskdbvsjkdv', templateData);
	return (
		<div className="fileParentContainer">
			<div className="previewContainer">
				{templateData?.templates?.map((ele, index) => (
					<div className="imageContainer">
						<div className="coverImage">
							<div
								dangerouslySetInnerHTML={{
									__html: ele?.parsedHtmlContent,
								}}
								style={{ width: '100%' }}
							/>
						</div>
					</div>
				))}
			</div>
			<div className="editParentContainer">
				<Variables />
				<Events />
				<Services />
				<PaymentSchedule />
			</div>
		</div>
	);
};

export default memo(File);
