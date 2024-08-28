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
const initialState = {
	activeTab: 'design', //design,automation
	duplicateApiLoading: false,
	templatesMapper: null,
	publicData: null,
	privateData: null,
	activeTemplateData: null,
	loading: true,
};

const EntryPointCard = ({ publicData }) => {
	return (
		<div className="previewCard" style={{ pointerEvents: 'none' }}>
			<div className="htmlContentViewer">
				<div className="coverImage">
					<div
						dangerouslySetInnerHTML={{
							__html: Object?.values(publicData || {})?.[0]?.parsedHtmlContent,
						}}
						style={{ width: '100%' }}
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
const OtherViewCard = () => {
	return (
		<div className="otherViewCard">
			<div className="sendEmailHeader">
				<EmailSvg />
				<span className="sendEmailText">Send Email</span>
			</div>
			<span className="emailSubjectText">Thank You for Your Enquiry</span>
			<span className="subalabel">Immediately after enquiry form is submitted </span>
		</div>
	);
};

const PreviewCard = ({ privateData }) => {
	return (
		<div className="previewCard" style={{ pointerEvents: 'none' }}>
			<div className="htmlContentViewer">
				<div className="coverImage">
					<div
						dangerouslySetInnerHTML={{
							__html: Object?.values(privateData || {})?.[0]?.parsedHtmlContent,
						}}
						style={{ width: '100%' }}
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

const AutomationComponent = ({ activeTemplateData, publicData, privateData, loading }) => {
	const [data, setData] = useState({
		stepsData: null,
		componentmapper: {
			theEnd: <EndPointViewCard />,
			preview: <PreviewCard privateData={privateData} />,
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
						}}
					>
						{index === 0 ? (
							<EntryPointCard publicData={publicData} />
						) : data?.componentmapper?.[ele?.module] ? (
							data?.componentmapper?.[ele?.module]
						) : (
							<OtherViewCard />
						)}
						{index < data?.stepsData?.length - 1 ? <ConnectorSvg /> : ''}
					</div>
				))
			)}
		</div>
	);
};

const GlobalWorkflowModal = ({ modalIsOpen, closeModal, globalTemplateId }) => {
	const navigate = useNavigate();
	let {
		templates: {
			duplicateGlobalWorkflowTemplate,
			getSpecificTemplatesInfo,
			specificTemplatesInfo,
			updateStateValues,
		},
	} = useContext(Context);
	const [info, setInfo] = useState(initialState);

	useEffect(() => {
		if (globalTemplateId) {
			getSpecificTemplatesInfo({
				templateInfoId: globalTemplateId,
			});
		}
		return () => {
			updateStateValues({ specificTemplatesInfo: null });
		};
	}, [globalTemplateId]);

	useEffect(() => {
		if (specificTemplatesInfo) {
			setInfo((prev) => ({
				...prev,
				loading: false,
				activeTemplateData: specificTemplatesInfo,
			}));
		}
	}, [specificTemplatesInfo]);

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

	useEffect(() => {
		if (info?.activeTemplateData) {
			const { moduleTemplates, templates } = info?.activeTemplateData;
			let publicData = {};
			let privateData = {};

			for (let i = 0; i < moduleTemplates?.length; i++) {
				if (moduleTemplates?.[i]?.isPublic) {
					publicData[moduleTemplates?.[i]?._id] = {};
				} else {
					privateData[moduleTemplates?.[i]?._id] = {};
				}
			}

			for (let i = 0; i < templates?.length; i++) {
				if (publicData?.[templates?.[i]?._id]) {
					publicData[templates?.[i]?._id] = {
						parsedHtmlContent: templates?.[i]?.parsedHtmlContent,
					};
				}
				if (privateData?.[templates?.[i]?._id]) {
					privateData[templates?.[i]?._id] = {
						parsedHtmlContent: templates?.[i]?.parsedHtmlContent,
					};
				}
			}
			setInfo((prev) => ({ ...prev, publicData, privateData }));
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

	const modifiedCloseModal = useCallback(async () => {
		setInfo(initialState);
		closeModal();
		updateStateValues({ specificTemplatesInfo: null });
	}, [closeModal]);

	const onCustomiseFunc = useCallback(async () => {
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
				window.location.href = `https://builder.ve.ai/${response?.[1]?._id}`;
				return;
			}
		}
	}, [info?.activeTemplateData, info?.activeTab, info?.duplicateApiLoading]);

	return (
		<Drawer
			onClose={modifiedCloseModal}
			width={420}
			open={modalIsOpen}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="GlobalWorkflowModalParentContainer">
				<div className="innerContainer">
					<div className="innerContainerHeader">
						<div className="headerBtnContainer">
							<div className="tabBtnContainer">
								<div className="tabBtns">
									<span
										onClick={() => changeActiveTab('design')}
										style={{
											color: info?.activeTab === 'design' ? ' #e0e0e0' : '',
										}}
									>
										Design
									</span>
									<span
										onClick={() => changeActiveTab('automation')}
										style={{
											color:
												info?.activeTab === 'automation' ? ' #e0e0e0' : '',
										}}
									>
										Automation
									</span>
								</div>

								<div onClick={onCustomiseFunc} className="svgContainer">
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
								{/* )} */}
							</div>
							<span className="svgContainer" onClick={modifiedCloseModal}>
								<Close />
							</span>
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
								info?.activeTemplateData?.moduleTemplates?.map((e, index) => (
									<div
										className="modulesViewer"
										key={index}
										style={{ pointerEvents: 'none' }}
									>
										<span>{e?.module}</span>
										<div className="imageContainer">
											<div className="coverImage">
												<div
													dangerouslySetInnerHTML={{
														__html: info?.templatesMapper?.[e?._id],
													}}
													style={{
														width: '100%',
														zoom: e?.module === 'thankyou' ? 5 : 3,
													}}
												/>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					) : (
						<AutomationComponent
							activeTemplateData={info?.activeTemplateData}
							publicData={info?.publicData}
							privateData={info?.privateData}
							loading={info?.loading}
						/>
					)}
				</div>
			</div>
			;
		</Drawer>
	);
};

export default memo(GlobalWorkflowModal);
