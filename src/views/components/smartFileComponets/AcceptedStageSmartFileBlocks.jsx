import React, { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';
import { nameShortner } from '../../../helpers';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import Context from '../../../context/context';

const AcceptedStageSmartFileBlocks = ({
	smartFileStatus,
	clientDetails,
	propsalData,
	contractData,
	workflowStatus,
}) => {
	let {
		templates: { contractSignedLocalState, updateStateValues },
	} = useContext(Context);
	const [info, setInfo] = useState({
		clientSignature: null,
		dashBoardSignature: null,
		dashboardUserInfo: null,
		proposalInfo: null,
	});

	useEffect(() => {
		if (contractData) {
			const { signatures } = contractData || {};

			let clientSignature, dashBoardSignature;
			for (let i = 0; i < signatures?.length; i++) {
				if (signatures?.[i]?.userType === 'endUser') {
					clientSignature = signatures?.[i];
				} else {
					dashBoardSignature = signatures?.[i];
				}
			}
			setInfo((prev) => ({ ...prev, clientSignature, dashBoardSignature }));
		}
	}, [contractData]);

	useEffect(() => {
		const accessToken = localStorage.getItem('usertoken');
		const decodedInfo = jwtDecode(accessToken);
		setInfo((prev) => ({ ...prev, dashboardUserInfo: decodedInfo }));
	}, []);

	useEffect(() => {
		if (contractSignedLocalState) {
			setInfo((prev) => ({ ...prev, dashBoardSignature: contractSignedLocalState }));
			updateStateValues({ contractSignedLocalState: null });
		}
	}, [contractSignedLocalState]);

	useEffect(() => {
		if (propsalData) {
			//need to show selected and also view only services

			const { tables = [], sections = [] } = propsalData || {};

			let serivesCollectiveData = [];
			let sectionMapper = {};
			for (let i = 0; i < sections?.length; i++) {
				if (sections?.[i]?.type === 'services') {
					const { style } = sections?.[i];
					if (style?.services_selection === 2) {
						sectionMapper[sections?.[i]?._id] = true;
					}
				}
			}

			for (let i = 0; i < tables.length; i++) {
				let requiredData = { values: [] };
				if (tables?.[i]?.type === 'services') {
					const tableValues = tables?.[i].values;
					for (let j = 0; j < tableValues?.length; j++) {
						if (
							(tableValues?.[j]?.isSelected || sectionMapper?.[tables?.[i]?._id]) &&
							tableValues?.[j]?.show
						) {
							requiredData?.values?.push(tableValues?.[j]);
						}
					}
				}
				serivesCollectiveData?.push(requiredData);
			}

			setInfo((prev) => ({ ...prev, proposalInfo: serivesCollectiveData }));
		}
	}, [propsalData]);

	return workflowStatus !== 'enquiry' && workflowStatus !== 'filesSent' ? (
		<div className="acceptedSmartFileBlocks">
			<div className="acceptedSmartFileBlocksRowContainer">
				<div className="acceptedBlocks">
					<div className="acceptedBlockHeader">
						<span className="acceptedBlockHeaderTextStyling">Proposal Summary</span>
					</div>
					<div className="proposalSummary">
						<div className="seperator"></div>
						{info?.proposalInfo?.map((ele, index) => (
							<div className="propsalServices" key={index}>
								{ele?.values?.map((item, ind) => (
									<div className="servicesValues" key={ind}>
										<span className="keyValuepairs" style={{ flex: 1 }}>
											{item?.quantity}{' '}
											{item?.title
												?.replace(/&nbsp;/g, ' ')
												.replace(/<\/?[^>]+(>|$)/g, '')
												.replace(/"/g, '') || ''}
										</span>
										<span className="keyValuepairs">
											{item?.currency === 'INR' ? '₹' : '$'}
											{+(
												(item?.amount + '')
													?.replace(/&nbsp;/g, ' ')
													.replace(/<\/?[^>]+(>|$)/g, '')
													.replace(/"/g, '') || ''
											) || 0}
										</span>
									</div>
								))}
							</div>
						))}
					</div>
				</div>

				{/* contact information */}
				{clientDetails ? (
					<div className="acceptedBlocks">
						<div className="acceptedBlockHeader">
							<span className="acceptedBlockHeaderTextStyling">
								Contact information
							</span>
						</div>
						<div className="contactInfoContainer">
							<div className="nameContainer">
								<div className="contactInfoBlocks">
									<span className="infoBlocksHeader">First name</span>
									<div className="infoBlocksvalueContainer">
										{clientDetails?.name
											? clientDetails?.name?.split(' ')?.[0]
											: ' '}
									</div>
								</div>
								<div className="contactInfoBlocks">
									<span className="infoBlocksHeader">Last name</span>
									<div className="infoBlocksvalueContainer">
										{clientDetails?.name
											? clientDetails?.name?.split(' ')?.[1]
											: ''}
									</div>
								</div>
							</div>
							<div className="contactInfoBlocks">
								<span className="infoBlocksHeader">Email address</span>
								<div className="infoBlocksvalueContainer">
									{clientDetails?.email ? clientDetails?.email : ''}
								</div>
							</div>
						</div>
					</div>
				) : (
					''
				)}
			</div>
			{contractData ? (
				<div className="acceptedSmartFileBlocksRowContainer">
					{/* contract Signed */}
					{info?.clientSignature ? (
						<div className="acceptedBlocks">
							<div className="acceptedBlockHeader">
								<span className="acceptedBlockHeaderTextStyling">
									Client signed
								</span>
							</div>
							<div className="signatureHolderContainer">
								<div className="clientDetailsContainer">
									<div className="shortNameContainer">
										{nameShortner(clientDetails?.name || '')}
									</div>
									<div className="clientInfo">
										<span className="clientNameStyling">
											{clientDetails?.name || ''}
										</span>
										<span className="clientEmailStyling">
											{clientDetails?.email || ''}
										</span>
									</div>
								</div>
								<div className="signatureWithDate">
									<div className="signatureContainer">
										{info?.clientSignature?.type === 'text' ? (
											<span
												style={{
													display: 'flex',
													alignSelf: 'stretch',
													textAlign: 'center',
													flex: 1,
													width: '100%',
													justifyContent: 'center',
													alignItems: 'center',
												}}
											>
												{info?.clientSignature?.value}
											</span>
										) : (
											<img
												src={info?.clientSignature?.s3_300w_key}
												alt="signature"
												style={{
													width: '100%',
													height: '100%',
													objectFit: 'contain',
													maxWidth: '100%',
													maxHeight: '100%',
												}}
											/>
										)}
									</div>
									<span className="dateData">
										{' '}
										{info?.clientSignature?.uploadedOn
											? `Signed on ` +
											  moment
													.unix(info?.clientSignature?.uploadedOn)
													.format('DD MMMM YYYY, h:mm a')
											: ''}
									</span>
								</div>
							</div>
						</div>
					) : (
						''
					)}

					{/* //your Signature */}
					{info?.dashBoardSignature ? (
						<div className="acceptedBlocks">
							<div className="acceptedBlockHeader">
								<span className="acceptedBlockHeaderTextStyling">
									Your Signature
								</span>
							</div>
							<div className="signatureHolderContainer">
								<div className="clientDetailsContainer">
									<div className="shortNameContainer">
										{nameShortner(info?.dashboardUserInfo?.userName || '')}
									</div>
									<div className="clientInfo">
										<span className="clientNameStyling">
											{info?.dashboardUserInfo?.userName || ''}
										</span>
										<span className="clientEmailStyling">
											{info?.dashboardUserInfo?.email || ''}
										</span>
									</div>
								</div>

								<div className="signatureWithDate">
									<div className="signatureContainer">
										{info?.dashBoardSignature?.type === 'text' ? (
											<span
												style={{
													display: 'flex',
													alignSelf: 'stretch',
													textAlign: 'center',
													flex: 1,
													width: '100%',
													justifyContent: 'center',
													alignItems: 'center',
												}}
											>
												{info?.dashBoardSignature?.value}
											</span>
										) : (
											<img
												src={info?.dashBoardSignature?.s3_300w_key}
												alt="signature"
												style={{
													width: '100%',
													height: '100%',
													objectFit: 'contain',
													maxWidth: '100%',
													maxHeight: '100%',
												}}
											/>
										)}
									</div>
									<span className="dateData">
										{' '}
										{info?.dashBoardSignature?.uploadedOn
											? `Signed on ` +
											  moment
													.unix(info?.dashBoardSignature?.uploadedOn)
													.format('DD MMMM YYYY, h:mm a')
											: ''}
									</span>
								</div>
							</div>
						</div>
					) : (
						''
					)}
				</div>
			) : (
				''
			)}
		</div>
	) : (
		''
	);
};

export default memo(AcceptedStageSmartFileBlocks);
