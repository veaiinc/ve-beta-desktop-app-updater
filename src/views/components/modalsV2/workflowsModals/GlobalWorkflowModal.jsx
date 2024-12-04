import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import '../../../../assets/scss/sales/globalWorkflowModal.scss';
import { ReactComponent as EditSvg } from '../../../../assets/svg/worflow_builder/edit.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
import Spinner from '../../../components/loaders/Spinner';
import { Drawer } from 'antd';
import GlobalWorkflowDesignModalLoader from './GlobalWorkflowDesignModalLoader';

const initialState = {
	activeTab: 'design', //design,automation
	duplicateApiLoading: false,
	templatesMapper: null,
	activeTemplateData: null,
	loading: true,
};

const AutomationComponent = ({ globalTemplateId }) => {
	return (
		<div className="autoMationDiv">
			<div
				style={{
					width: '100%',
					height: '100%',
				}}
			>
				<iframe
					src={`http://localhost:8000/workflow_builder/${globalTemplateId}?hideHeader=true&hideZoomPannel=true`}
					title="Builder Preview"
					width="100%"
					height="100%"
					style={{
						pointerEvents: 'none', // Disables all pointer events on iframe
					}}
				/>
			</div>
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
	const onGenerateAIFunc = () => {
		window.location.href = `https://builder.ve.ai/generate/${info?.activeTemplateData?._id}`;
	};
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
								<div
									onClick={onGenerateAIFunc}
									className="svgContainer"
									style={{ marginLeft: '12px' }}
								>
									GenAI
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
										// style={{ pointerEvents: 'none' }}
									>
										<span>{e?.module}</span>
										<div className="imageContainer">
											<div style={{ width: '100%', height: '100%' }}>
												<iframe
													src={
														window.location.hostname === 'localhost'
															? `http://localhost:3000/preview/${globalTemplateId}?module=${e?._id}&isPubic=${e?.isPublic}&restrictClick=true`
															: `https://builder.ve.ai/preview/${globalTemplateId}?module=${e?._id}&isPubic=${e?.isPublic}&restrictClick=true`
													}
													title="Builder Preview"
													width="100%"
													height="100%"
												/>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					) : (
						<AutomationComponent globalTemplateId={globalTemplateId} />
					)}
				</div>
			</div>
			;
		</Drawer>
	);
};

export default memo(GlobalWorkflowModal);
