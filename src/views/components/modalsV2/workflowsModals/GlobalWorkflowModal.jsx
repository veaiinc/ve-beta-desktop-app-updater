import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import '../../../../assets/scss/sales/globalWorkflowModal.scss';
import { ReactComponent as EditSvg } from '../../../../assets/svg/worflow_builder/edit.svg';
import { useNavigate } from 'react-router-dom';
import ConnectorSvg from '../../../../assets/svg/worflow_builder/connector';
import { ReactComponent as EmailSvg } from '../../../../assets/svg/worflow_builder/email.svg';
import Context from '../../../../context/context';
import Spinner from '../../../components/loaders/Spinner';
import { Drawer } from 'antd';
import GlobalWorkflowDesignModalLoader from './GlobalWorkflowDesignModalLoader';
import GlobalWorkflowAutomationLoader from './GlobalWorkflowAutomationLoader';
import { fetchOriginSelection } from '../../../../helpers';
import { ReactComponent as DoubleBackArrow } from '../../../../assets/svg/sales/doubleBackArrow.svg';
import { ReactComponent as ArrowsOut } from '../../../../assets/svg/sales/arrowsOut.svg';
let origin = fetchOriginSelection();
const initialState = {
	activeTab: 'design', //design,automation
	duplicateApiLoading: false,
	templatesMapper: null,
	activeTemplateData: null,
	loading: true,
};

const EntryPointCard = ({ publicData }) => {
	const data = publicData?.moduleTemplates?.filter((e) => e?.isPublic);

	return (
		<div className="previewCard" style={{ pointerEvents: 'none', borderRadius: '32px' }}>
			<div className="htmlContentViewer">
				<div className="coverImage">
					<iframe
						src={
							window.location.hostname === 'localhost'
								? `http://localhost:3000/preview/${publicData?._id}?module=${data?.[0]?._id}&isPubic=${data?.[0]?.isPublic}&restrictClick=true`
								: `https://builder.ve.ai/preview/${publicData?._id}?module=${data?.[0]?._id}&isPubic=${data?.[0]?.isPublic}&restrictClick=true`
						}
						title="Builder Preview"
						width="100%"
						height="100%"
						style={{ zoom: 0.2 }}
					/>
				</div>
			</div>
			<div className="previewLabelContent">
				<span className="titleStyling">Workflow Start Point</span>
				<span className="startingPointTitle">Enquiry form</span>
			</div>
		</div>
	);
};
const EndPointViewCard = () => {
	return (
		<div className="endViewCard">
			<span className="subalabel">WorkFlow Ends Here </span>
		</div>
	);
};
const OtherViewCard = ({ data }) => {
	return (
		<div className="otherViewCard">
			<div className="sendEmailHeader">
				<EmailSvg />
				<span className="sendEmailText">Send Email</span>
			</div>
			<span className="emailSubjectText">{data?.emailTemplateSubject}</span>
			<span className="subalabel">Immediately after enquiry form is submitted </span>
		</div>
	);
};

const PreviewCard = ({ privateData }) => {
	const data = privateData?.moduleTemplates?.filter((e) => !e?.isPublic);
	return (
		<div className="previewCard" style={{ pointerEvents: 'none', borderRadius: '32px' }}>
			<div className="htmlContentViewer">
				<div className="coverImage">
					<iframe
						src={
							window.location.hostname === 'localhost'
								? `http://localhost:3000/preview/${privateData?._id}?module=${data?.[0]?._id}&isPubic=${data?.[0]?.isPublic}&restrictClick=true`
								: `https://builder.ve.ai/preview/${privateData?._id}?module=${data?.[0]?._id}&isPubic=${data?.[0]?.isPublic}&restrictClick=true`
						}
						title="Builder Preview"
						width="100%"
						height="100%"
						style={{ zoom: 0.2 }}
					/>
				</div>
			</div>
			<div className="previewLabelContent">
				<span className="topLabelStyle">Timeless Touch of Beige</span>
				<span className="labelTitle">All Files</span>
				<span className="labelSubtitle">
					Immediately after Form is submitted, wait for my approval
				</span>
			</div>
		</div>
	);
};

const AutomationComponent = ({ activeTemplateData, loading }) => {
	const [data, setData] = useState({
		stepsData: null,
		componentmapper: {
			theEnd: <EndPointViewCard />,
			preview: <PreviewCard privateData={activeTemplateData} />,
		},
	});

	useEffect(() => {
		if (activeTemplateData?.steps?.length) {
			const steps = [...(activeTemplateData?.steps || [])];

			let stepsData = [];
			stepsData?.push(steps?.[0]);
			stepsData?.push({
				module: 'preview',
				_id: steps?.[0]?._id,
				parsedHtmlContent: activeTemplateData?.templates?.[0]?.parsedHtmlContent,
			});
			steps.shift();
			stepsData = stepsData?.concat(steps);
			stepsData?.push({ module: 'theEnd' });
			setData((prev) => ({ ...prev, stepsData }));
		}
	}, [activeTemplateData]);

	return (
		<div className="autoMationDiv">
			{loading ? (
				<GlobalWorkflowAutomationLoader />
			) : (
				data?.stepsData?.map((ele, index) => (
					<div
						key={index}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: '24px',
						}}
					>
						{index === 0 ? (
							<EntryPointCard publicData={activeTemplateData} />
						) : data?.componentmapper?.[ele?.module] ? (
							data?.componentmapper?.[ele?.module]
						) : (
							<OtherViewCard data={ele} />
						)}
						{index < data?.stepsData?.length - 1 ? <ConnectorSvg /> : ''}
					</div>
				))
			)}
		</div>
	);
};

const GlobalWorkflowModal = ({
	modalIsOpen,
	closeModal,
	globalTemplateId,
	moduleName,
	templateTitle,
	isProposal,
	isExpanded,
	setIsExpanded,
}) => {
	const navigate = useNavigate();

	let {
		templates: {
			duplicateGlobalWorkflowTemplate,
			getSpecificTemplatesInfo,
			specificTemplatesInfo,
			updateStateValues,
		},
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);
	const [info, setInfo] = useState(initialState);
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);

	useEffect(() => {
		if (modalIsOpen && globalTemplateId && globalTemplateId !== 'undefined') {
			getSpecificTemplatesInfo({
				templateInfoId: globalTemplateId,
			});
		}

		return () => {
			if (!modalIsOpen) {
				updateStateValues({ specificTemplatesInfo: null });
				setInfo(initialState);
			}
		};
	}, [globalTemplateId, modalIsOpen]);

	useEffect(() => {
		if (specificTemplatesInfo && modalIsOpen) {
			setInfo((prev) => ({
				...prev,
				loading: false,
				activeTemplateData: specificTemplatesInfo,
			}));
		}
	}, [specificTemplatesInfo, modalIsOpen]);

	useEffect(() => {
		if (info?.activeTemplateData) {
			const { templates } = info?.activeTemplateData || {};
			let obj = {};
			for (let i = 0; i < templates?.length; i++) {
				obj[templates[i]?._id] = templates?.[i]?.parsedHtmlContent;
			}
			setInfo((prev) => ({ ...prev, templatesMapper: obj }));
		}
	}, [info?.activeTemplateData]);

	//function defination
	const changeActiveTab = useCallback(
		(item) => {
			if (item === info?.activeTab) {
				return;
			}
			setInfo((prev) => ({ ...prev, activeTab: item }));
		},
		[info?.activeTab],
	);
	const getExpandedWidth = useCallback(() => {
		return screenWidth < 1200 ? '650px' : '780px';
	}, [screenWidth]);

	const modifiedCloseModal = useCallback(() => {
		setInfo(initialState);
		closeModal();
	}, [closeModal]);

	const onCustomiseFunc = useCallback(async () => {
		if (!isProposal) {
			if (validateExpiryData?.isExpired) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			}
			if (info?.duplicateApiLoading) {
				return;
			}
			setInfo((prev) => ({ ...prev, duplicateApiLoading: true }));
			const payload = {
				templateId: info?.activeTemplateData?._id,
				title: info?.activeTemplateData?.title,
			};
			const response = await duplicateGlobalWorkflowTemplate(payload);
			setInfo((prev) => ({ ...prev, duplicateApiLoading: false }));
			if (response?.[0]) {
				if (info?.activeTab !== 'design') {
					return navigate(`/workflow_builder/${response?.[1]?._id}`);
				} else {
					window.location.href = `${origin}/${response?.[1]?._id}`;
					return;
				}
			}
		} else {
			if (info?.duplicateApiLoading) return;

			setInfo((prev) => ({ ...prev, duplicateApiLoading: true }));
			const payload = {
				templateId: info?.activeTemplateData?._id,
				title: info?.activeTemplateData?.title,
			};
			const response = await duplicateGlobalWorkflowTemplate(payload);
			setInfo((prev) => ({ ...prev, duplicateApiLoading: false }));

			if (response?.[0]) {
				window.location.href = `${origin}/${response?.[1]?._id}`;
			}
		}
	}, [info?.activeTemplateData, info?.activeTab, info?.duplicateApiLoading, isProposal]);

	const onGenerateAIFunc = () => {
		if (validateExpiryData?.isExpired) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		}
		window.location.href = `${origin}/generate/${info?.activeTemplateData?._id}`;
	};
	useEffect(() => {
		const handleResize = () => {
			setScreenWidth(window.innerWidth);
			// If screen becomes too small while expanded, collapse it
			if (window.innerWidth < 500 && isExpanded) {
				setIsExpanded(false);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [isExpanded, setIsExpanded]);

	const toggleExpand = () => {
		if (screenWidth >= 1200) {
			setIsExpanded(!isExpanded);
		}
	};

	return (
		<>
			<Drawer
				onClose={modifiedCloseModal}
				width={
					screenWidth < 1200 ? 420 : isExpanded ? (screenWidth < 1200 ? 650 : 760) : 420
				}
				style={{
					padding: '0px',
					backgroundColor: 'transparent',
					height: '100dvh',
					borderRadius: '32px',
				}}
				mask={true}
				open={modalIsOpen}
				headerStyle={{ display: 'none' }}
				bodyStyle={{ padding: '0px' }}
				maskClassName="globalContainerMaskclassName"
			>
				<div
					className="GlobalWorkflowModalParentContainer"
					style={{
						width: isExpanded ? getExpandedWidth() : '420px',
						transition: 'width 0.7s ease',
						position: 'fixed',
						right: '10px',
					}}
				>
					<div
						className="innerContainer"
						style={{
							width: isExpanded ? getExpandedWidth() : '420px',
							transition: 'width 0.7s ease',
							background: 'transparent',
						}}
					>
						{!isProposal ? (
							<>
								<div className="innerContainerHeader">
									<div className="headerBtnContainer">
										<div className="tabBtnContainer">
											<div className="tabBtns">
												<span
													onClick={() => changeActiveTab('design')}
													style={{
														color:
															info?.activeTab === 'design'
																? ' #e0e0e0'
																: '',
													}}
												>
													Design
												</span>
												<span
													onClick={() => changeActiveTab('automation')}
													style={{
														color:
															info?.activeTab === 'automation'
																? ' #e0e0e0'
																: '',
													}}
												>
													Automation
												</span>
											</div>

											{/* <div onClick={onCustomiseFunc} className="svgContainer">
											<EditSvg />
											Customise
											{info?.duplicateApiLoading ? (
												<Spinner
													width={'16px'}
													height="16px"
													color={'#6055ec'}
													borderTopColor="#111"
												/>
											) : (
												''
											)}
										</div>
										<div onClick={onGenerateAIFunc} className="svgContainer">
											GenAI
										</div> */}
											{/* )} */}
										</div>
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												gap: '24px',
											}}
										>
											{!isExpanded && (
												<span
													className="svgContainer"
													onClick={toggleExpand}
													style={{
														display:
															screenWidth < 1200
																? 'none'
																: 'inline-flex',
														cursor: 'pointer',
														alignSelf: 'center',
													}}
												>
													<ArrowsOut />
												</span>
											)}
											<span
												className="svgContainer"
												onClick={
													isExpanded ? toggleExpand : modifiedCloseModal
												}
												style={{ alignSelf: 'center', cursor: 'pointer' }}
											>
												<DoubleBackArrow />
											</span>
										</div>
									</div>
									<span className="customiseText">
										Customise your design as per your business
									</span>
								</div>
								{info?.activeTab === 'design' ? (
									<div className="innerMainContent">
										{info?.loading ? (
											<GlobalWorkflowDesignModalLoader />
										) : (
											info?.activeTemplateData?.moduleTemplates?.map(
												(e, index) => (
													<div
														className="modulesViewer"
														key={index}
														style={{
															alignSelf: 'center',
															width: isExpanded
																? screenWidth < 1200
																	? '520px'
																	: '640px'
																: '368px',
															transition: 'width 0.7s ease',
														}}
													>
														<span>{e?.module}</span>
														<div className="imageContainer">
															<div
																style={{
																	width: '100%',
																	height: '100%',
																}}
															>
																<iframe
																	src={`${origin}/preview/${globalTemplateId}?module=${e?._id}&isPubic=${e?.isPublic}&restrictClick=true`}
																	title="Builder Preview"
																	width="100%"
																	height="100%"
																/>
															</div>
														</div>
													</div>
												),
											)
										)}
									</div>
								) : (
									<AutomationComponent
										activeTemplateData={info?.activeTemplateData}
										loading={info?.loading}
									/>
								)}
								<div
									className="innerContainerHeader"
									style={{
										borderBottom: 'none',
										marginTop: 'auto',
										paddingTop: '0px',
									}}
								>
									<div
										className="headerBtnContainer"
										style={{ justifyContent: 'center', alignItems: 'center' }}
									>
										<div className="tabBtnContainer">
											<div
												onClick={onCustomiseFunc}
												className="svgContainer"
												style={{
													display: 'flex',
													width: '368px',
													padding: '16px 32px',
													justifyContent: 'center',
													alignItems: 'center',
													gap: '16px',
													borderRadius: '23px',
													background: '#FAFAFA',
													cursor: 'pointer',
												}}
											>
												<span
													style={{
														color: '#3F3F3F',
														fontFamily: 'Inter',
														fontSize: '12px',
														fontStyle: 'normal',
														fontWeight: '500',
														lineHeight: 'normal',
													}}
												>
													Add to workspace
												</span>
												{info?.duplicateApiLoading && (
													<Spinner
														width={'16px'}
														height="16px"
														color={'#6055ec'}
														borderTopColor="#111"
													/>
												)}
											</div>
										</div>
									</div>
								</div>
							</>
						) : (
							<>
								<div
									className="innerMainContent"
									style={{
										height: '100%',
										// width: isExpanded ? '780px' : '420px',
										transition: 'width 0.8s ease',
										gap: '24px',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<div
										className="headerTitle"
										style={{
											fontSize: '18px',
											textTransform: 'capitalize',
											color: '#fff',
											// marginTop: '20px',
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-between',
											padding: '0px 24px',
											width: '100%',
										}}
									>
										<div
											style={{
												display: 'flex',
												width: '200px',
												height: '48px',
												transform: 'rotate(-0.037deg)',
												padding: '16px 24px',
												justifyContent: 'center ',
												textAlign: 'center',
												alignItems: 'center',
												borderRadius: '100px',
												border: '1px solid rgba(255, 255, 255, 0.20)',
												background: 'rgba(255, 255, 255, 0.05)',
											}}
										>
											{moduleName}
										</div>
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												gap: '24px',
											}}
										>
											{!isExpanded && (
												<span
													className="svgContainer"
													onClick={toggleExpand}
													style={{
														display:
															screenWidth < 1200
																? 'none'
																: 'inline-flex',
														cursor: 'pointer',
														alignSelf: 'center',
													}}
												>
													<ArrowsOut />
												</span>
											)}
											<span
												className="svgContainer"
												onClick={
													isExpanded ? toggleExpand : modifiedCloseModal
												}
												style={{ alignSelf: 'center', cursor: 'pointer' }}
											>
												<DoubleBackArrow />
											</span>
										</div>
									</div>
									<hr
										style={{
											width: '100%',
											padding: '0px !important',
											border: '0.1px solid rgba(255, 255, 255, 0.20)',
										}}
									/>
									<div
										style={{
											color: '#FFF',
											fontFamily: 'Inter',
											fontSize: '14px',
											fontStyle: 'normal',
											fontWeight: '500',
											lineHeight: 'normal',
											display: 'flex',
											flexDirection: 'row',
											alignSelf: 'flex-start',
											padding: '0px 20px',
										}}
									>
										{templateTitle}
									</div>
									<div
										className="modulesViewer"
										style={{
											backgroundColor: 'white',
											height: '97vh',
											overflow: 'hidden',
											alignSelf: 'center',
											width: isExpanded
												? screenWidth < 1200
													? '520px'
													: '640px'
												: '368px',
											transition: 'width 0.8s ease',
										}}
									>
										<div
											className="imageContainer"
											style={{
												height: '95vh',
												width: '100%',
												backgroundColor: 'white !important',
												position: 'relative',
												display: 'block',
											}}
										>
											<div
												style={{
													height: '100%',
													width: '100%',
													backgroundColor: 'white',
												}}
											>
												<iframe
													height="100%"
													src={`${origin}/preview/${globalTemplateId}?module=true&moduleType=${info?.activeTemplateData?.module}`}
													title="Builder Preview"
													width="100%"
												/>
											</div>
										</div>
									</div>
									{/* )} */}
									<div
										className="innerContainerHeader"
										style={{
											borderBottom: 'none',
											marginTop: 'auto',
											paddingTop: '0px',
										}}
									>
										<div
											className="headerBtnContainer"
											style={{
												justifyContent: 'center',
												alignItems: 'center',
											}}
										>
											<div className="tabBtnContainer">
												<div
													onClick={onCustomiseFunc}
													className="svgContainer"
													style={{
														display: 'flex',
														width: '368px',
														padding: '16px 32px',
														justifyContent: 'center',
														alignItems: 'center',
														gap: '16px',
														borderRadius: '23px',
														background: '#FAFAFA',
														cursor: 'pointer',
													}}
												>
													<span
														style={{
															color: '#3F3F3F',
															fontFamily: 'Inter',
															fontSize: '12px',
															fontStyle: 'normal',
															fontWeight: '500',
															lineHeight: 'normal',
														}}
													>
														Add to workspace
													</span>
													{info?.duplicateApiLoading && (
														<Spinner
															width={'16px'}
															height="16px"
															color={'#6055ec'}
															borderTopColor="#111"
														/>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</Drawer>
		</>
	);
};

export default memo(GlobalWorkflowModal);
