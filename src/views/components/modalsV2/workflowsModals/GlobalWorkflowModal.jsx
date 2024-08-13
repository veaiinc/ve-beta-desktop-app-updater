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
const initialState = {
	activeTab: 'design', //design,automation
	duplicateApiLoading: false,
	templatesMapper: null,
};

const EntryPointCard = () => {
	return (
		<div className="startingPoint">
			<span className="titleStyling">Workflow Start Point</span>
			<span className="startingPointTitle">Enquiry form</span>
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

const PreviewCard = ({ activeTemplateData }) => {
	return (
		<div className="previewCard">
			<div className="htmlContentViewer">
				<div className="coverImage">
					<div
						dangerouslySetInnerHTML={{
							__html: activeTemplateData?.templates?.[0]?.parsedHtmlContent,
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

const AutomationComponent = ({ activeTemplateData }) => {
	const [data, setData] = useState({
		stepsData: null,
		componentmapper: {
			theEnd: <EndPointViewCard />,
			preview: <PreviewCard activeTemplateData={activeTemplateData} />,
		},
	});

	useEffect(() => {
		if (activeTemplateData?.steps?.length) {
			const steps = [...(activeTemplateData?.steps || [])];
			const stepsData = [];
			stepsData?.push(steps?.[0]);
			stepsData?.push({
				module: 'preview',
				_id: steps?.[0]?._id,
				parsedHtmlContent: activeTemplateData?.templates?.[0]?.parsedHtmlContent,
			});
			steps.shift();
			stepsData?.concat(steps);
			stepsData?.push({ module: 'theEnd' });
			setData((prev) => ({ ...prev, stepsData }));
		}
	}, [activeTemplateData]);

	return (
		<div className="autoMationDiv">
			{data?.stepsData?.map((ele, index) => (
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
						<EntryPointCard />
					) : data?.componentmapper?.[ele?.module] ? (
						data?.componentmapper?.[ele?.module]
					) : (
						<OtherViewCard />
					)}
					{index < data?.stepsData?.length - 1 ? <ConnectorSvg /> : ''}
				</div>
			))}
		</div>
	);
};

const GlobalWorkflowModal = ({ modalIsOpen, closeModal, activeTemplateData }) => {
	const navigate = useNavigate();
	let {
		templates: { duplicateGlobalWorkflowTemplate },
	} = useContext(Context);
	const [info, setInfo] = useState(initialState);

	useEffect(() => {
		if (activeTemplateData) {
			const { templates } = activeTemplateData || {};
			let obj = {};
			for (let i = 0; i < templates?.length; i++) {
				obj[templates[i]?._id] = templates?.[i]?.parsedHtmlContent;
			}
			setInfo((prev) => ({ ...prev, templatesMapper: obj }));
		}
	}, [activeTemplateData]);

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
	}, [closeModal]);

	const onCustomiseFunc = useCallback(async () => {
		if (info?.duplicateApiLoading) {
			return;
		}
		setInfo((prev) => ({ ...prev, duplicateApiLoading: true }));
		const payload = {
			templateId: activeTemplateData?._id,
			title: activeTemplateData?.title,
		};
		const response = await duplicateGlobalWorkflowTemplate(payload);
		setInfo((prev) => ({ ...prev, duplicateApiLoading: false }));
		if (response?.[0]) {
			if (info?.activeTab !== 'design') {
				return navigate('/workflow_builder', {
					state: { data: response?.[1] },
				});
			} else {
				window.location.href = `https://builder.ve.co/${response?.[1]?._id}`;
				return;
			}
		}
	}, [activeTemplateData, info?.activeTab, info?.duplicateApiLoading]);

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
							{activeTemplateData?.moduleTemplates?.map((e, index) => (
								<div className="modulesViewer" key={index}>
									<span>{e?.module}</span>
									<div className="imageContainer">
										<div className="coverImage">
											<div
												dangerouslySetInnerHTML={{
													__html: info?.templatesMapper?.[e?._id],
												}}
												style={{ width: '100%' }}
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<AutomationComponent activeTemplateData={activeTemplateData} />
					)}
				</div>
			</div>
			;
		</Drawer>
	);
};

export default memo(GlobalWorkflowModal);
