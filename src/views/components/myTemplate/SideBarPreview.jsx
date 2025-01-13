import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/my_templates/sidePreview.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as ShareSvg } from '../../../assets/svg/docs/share.svg';
import { ReactComponent as DotsSvg } from '../../../assets/svg/docs/vertidot.svg';
import { DocsStatusButton, statusTextmapper } from '../../features/docs';
import GlobalWorkflowDesignModalLoader from '../modalsV2/workflowsModals/GlobalWorkflowDesignModalLoader';
import Context from '../../../context/context';
import { Drawer } from 'antd';
import { fetchOriginSelection } from '../../../helpers';

let origin = fetchOriginSelection();

const SideBarPreview = ({ open, onClose, activeTemplateId }) => {
	const {
		templates: { getSpecificTemplatesInfo, specificTemplatesInfo },
	} = useContext(Context);

	const [info, setInfo] = useState({
		activeTemplateData: null,
		loading: true,
	});

	useEffect(() => {
		setInfo((prev) => ({ ...prev, activeTemplateData: activeTemplateId }));
	}, [activeTemplateId]);

	useEffect(() => {
		fetchSpecificTemplateInfo();
	}, [activeTemplateId]);

	useEffect(() => {
		if (specificTemplatesInfo) {
			setInfo((prev) => ({
				...prev,
				activeTemplateData: specificTemplatesInfo,
				loading: false,
			}));
		}
	}, [specificTemplatesInfo]);

	const fetchSpecificTemplateInfo = useCallback(() => {
		if (activeTemplateId) {
			getSpecificTemplatesInfo({
				templateInfoId: activeTemplateId,
			});
		}
	}, [activeTemplateId]);

	const modifyClose = useCallback(() => {
		setInfo((prev) => ({ ...prev, activeTemplateData: null, loading: true }));
		onClose();
	}, [onClose]);

	return (
		<Drawer
			open={open}
			onClose={modifyClose}
			style={{ padding: '10px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			width={480}
		>
			<div className="previewDrawer">
				<div className="headerContainer">
					<div className="headerLeftLabel">
						<CloseSvg onClick={modifyClose} />
					</div>
					<div className="headerRightLabel">
						<DocsStatusButton
							content={statusTextmapper?.[info?.activeTemplateData?.status]?.text}
							style={statusTextmapper?.[info?.activeTemplateData?.status]?.style}
							dotStyle={
								statusTextmapper?.[info?.activeTemplateData?.status]?.dotStyle
							}
						/>
						<div className="editLabel">Edit</div>
						<ShareSvg
						// onClick={openSendSmartFileModal}
						/>
						<DotsSvg />
					</div>
				</div>

				<div className="previewLoader">
					{info?.loading ? (
						<GlobalWorkflowDesignModalLoader />
					) : (
						info?.activeTemplateData?.moduleTemplates?.map((e, index) => (
							<div className="modulesViewer" key={index}>
								<span>{e?.module}</span>
								<div className="imageContainer">
									<div style={{ width: '100%', height: '100%' }}>
										<iframe
											src={`${origin}/preview/${activeTemplateId}?module=${e?._id}&isPubic=${e?.isPublic}&restrictClick=true`}
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
				{!info?.loading && (
					<div className="buttonContainer">
						<div className="button">Create File</div>
					</div>
				)}
			</div>
		</Drawer>
	);
};

export default memo(SideBarPreview);
