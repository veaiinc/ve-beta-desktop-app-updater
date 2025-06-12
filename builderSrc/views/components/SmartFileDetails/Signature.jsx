import React, { memo, useState, useContext, useEffect, useCallback } from 'react';
import '../../../assets/scss/smart-file-components/signature.scss';
import { nameShortner } from '../../../helper';
import Context from '../../../context/context';
import { jwtDecode } from 'jwt-decode';

import UploadSignatureModal from './UploadSignatureModal';

const Signature = ({
	clientDetails = {},
	contractSignatureData,
	filedata = {},
	handleContractDataChanges,
	showSignatureModal,
	onCloseSignatureModal,
}) => {
	const {
		templates: {
			smartFileInfo,
			getSignedUrlForContracts,
			contractSignedLocalState,
			updateStateValues,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		contractData: [],
		userData: {},
		signatureModal: false,
		activeSignatureState: null,
		showSignedSignature: null,
	});

	useEffect(() => {
		const usertoken = localStorage.getItem('usertoken');
		if (usertoken) {
			const userData = jwtDecode(usertoken);

			setInfo((prev) => ({ ...prev, userData: userData }));
		}
	}, []);

	useEffect(() => {
		if (contractSignedLocalState) {
			setInfo((prev) => ({ ...prev, showSignedSignature: contractSignedLocalState }));
			updateStateValues({ contractSignedLocalState: null });
		}
	}, [contractSignedLocalState]);

	useEffect(() => {
		if (contractSignatureData) {
			setInfo((prev) => ({ ...prev, contractData: contractSignatureData }));
		}
	}, [contractSignatureData]);

	useEffect(() => {
		if (showSignatureModal) {
			setInfo((prev) => ({
				...prev,
				signatureModal: true,
				activeSignatureState: 0, // Set to first signature by default
			}));
			if (onCloseSignatureModal) {
				onCloseSignatureModal();
			}
		}
	}, [showSignatureModal, onCloseSignatureModal]);

	const uploadSignatureFunc = useCallback(
		async (data) => {
			if (!smartFileInfo?._id) {
				return;
			}

			let response;
			if (data?.type === 'text') {
				let contractData = [...(info?.contractData || [])];
				let requiredData = contractData?.[info?.activeSignatureState];
				requiredData.values[1] = {
					...(requiredData?.values[1] || {}),
					value: data?.signatureText || '',
					isImage: false,
				};

				contractData?.splice(info?.activeSignatureState, 1, requiredData);
				handleContractDataChanges(requiredData);
				setInfo((prev) => ({ ...prev, contractData: contractData }));
				return [true];
			} else {
				const payload = {
					uploadContractSignedUrlId: filedata?._id,
				};
				response = await getSignedUrlForContracts(payload);
			}

			if (response?.[0]) {
				const { imageURL = '' } = response?.[1] || {};
				let contractData = [...(info?.contractData || [])];
				let requiredData = contractData?.[info?.activeSignatureState];
				requiredData.values[1] = {
					...(requiredData?.values[1] || {}),
					value: imageURL || '',
					isImage: true,
				};

				contractData?.splice(info?.activeSignatureState, 1, requiredData);
				handleContractDataChanges(requiredData);
				setInfo((prev) => ({ ...prev, contractData: contractData }));
				return [true, response?.[1]];
			} else {
				return [false];
			}
		},
		[filedata, smartFileInfo, info],
	);

	return info?.contractData?.length &&
		info.contractData.some((ele) => ele?.values?.length > 0) ? (
		<div className="signatureSuperParentContainerModal">
			<span className="contractSignatureTitle">Contract Signature</span>
			{info?.contractData?.map((ele, index) => (
				<div className="signatureParentContainerModal" key={index}>
					<div className="acceptedBlocks">
						<div className="acceptedBlockHeader">
							<span className="acceptedBlockHeaderTextStyling">Client Signature</span>
						</div>
						<div className="signatureHolderContainer">
							<div className="clientDetailsContainer">
								<div className="shortNameContainer">
									{nameShortner(
										smartFileInfo?.clientDetails
											? smartFileInfo?.clientDetails?.name || ''
											: '',
									)}
								</div>
								<div className="clientInfo">
									<span className="clientNameStyling">
										{smartFileInfo?.clientDetails?.name || ''}
									</span>
									<span className="clientEmailStyling">
										{smartFileInfo?.clientDetails?.email || ''}
									</span>
								</div>
							</div>
							<div className="signatureWithDate">
								<div className="signatureContainer">
									{!ele?.values?.[0]?.value?.length ? (
										<span
											style={{
												display: 'flex',
												alignSelf: 'stretch',
												textAlign: 'center',
												flex: 1,
												width: '100%',
												justifyContent: 'center',
												alignItems: 'center',
												color: '#787E87',
											}}
										>
											Not Signed Yet
										</span>
									) : !ele?.values?.[0]?.isImage ? (
										<span
											style={{
												display: 'flex',
												alignSelf: 'stretch',
												textAlign: 'center',
												flex: 1,
												width: '100%',
												justifyContent: 'center',
												alignItems: 'center',
												color: '#787E87',
											}}
										>
											{ele?.values?.[0]?.value}
										</span>
									) : (
										<img
											src={ele?.values?.[0]?.value}
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
									{/* {' '}
									{info?.clientSignature?.uploadedOn
										? `Signed on ` +
										  moment
												.unix(info?.clientSignature?.uploadedOn)
												.format('DD MMMM YYYY, h:mm a')
										: ''} */}
								</span>
							</div>
						</div>
					</div>
					<div className="acceptedBlocks">
						<div className="acceptedBlockHeader">
							<span className="acceptedBlockHeaderTextStyling">Your Signature</span>
						</div>
						<div className="signatureHolderContainer">
							<div className="clientDetailsContainer">
								<div className="shortNameContainer">
									{nameShortner(info?.userData?.userName || '')}
								</div>
								<div className="clientInfo">
									<span className="clientNameStyling">
										{info?.userData?.userName || ''}
									</span>
									<span className="clientEmailStyling">
										{info?.userData?.email || ''}
									</span>
								</div>
							</div>
							<div className="signatureWithDate">
								{info?.showSignedSignature ? (
									<div className="signatureContainer">
										{info?.showSignedSignature?.type === 'sign' ? (
											<img
												src={info?.showSignedSignature?.s3_300w_key}
												alt="signature"
												style={{
													width: '100%',
													height: '100%',
													objectFit: 'contain',
													maxWidth: '100%',
													maxHeight: '100%',
												}}
											/>
										) : (
											<span
												style={{
													display: 'flex',
													alignSelf: 'stretch',
													textAlign: 'center',
													flex: 1,
													width: '100%',
													justifyContent: 'center',
													alignItems: 'center',
													color: '#787E87',
												}}
											>
												{info?.showSignedSignature?.value || ''}
											</span>
										)}
									</div>
								) : (
									<div className="signatureContainer">
										{!ele?.values?.[1]?.value?.length ? (
											<span
												style={{
													display: 'flex',
													alignSelf: 'stretch',
													textAlign: 'center',
													flex: 1,
													width: '100%',
													justifyContent: 'center',
													alignItems: 'center',
													color: '#787E87',
													cursor: 'pointer',
												}}
												onClick={() =>
													setInfo((prev) => ({
														...prev,
														signatureModal: true,
														activeSignatureState: index,
													}))
												}
											>
												Not Signed Yet
											</span>
										) : !ele?.values?.[1]?.isImage ? (
											<span
												style={{
													display: 'flex',
													alignSelf: 'stretch',
													textAlign: 'center',
													flex: 1,
													width: '100%',
													justifyContent: 'center',
													alignItems: 'center',
													color: '#787E87',
												}}
											>
												{ele?.values?.[1]?.value}
											</span>
										) : (
											<img
												src={ele?.values?.[1]?.value}
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
								)}
								<span className="dateData">
									{/* {' '}
									{info?.clientSignature?.uploadedOn
										? `Signed on ` +
										  moment
												.unix(info?.clientSignature?.uploadedOn)
												.format('DD MMMM YYYY, h:mm a')
										: ''} */}
								</span>
							</div>
						</div>
					</div>
				</div>
			))}
			<UploadSignatureModal
				open={info?.signatureModal}
				closeModal={() =>
					setInfo((prev) => ({
						...prev,
						signatureModal: false,
						activeSignatureState: null,
					}))
				}
				uploadSignatureFunc={uploadSignatureFunc}
				changelocalWorflowStatus={() => {}}
			/>
		</div>
	) : (
		''
	);
};

export default memo(Signature);
