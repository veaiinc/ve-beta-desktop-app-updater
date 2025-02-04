import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/my_templates/sidePreview.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as ShareSvg } from '../../../assets/svg/docs/share.svg';
import { ReactComponent as DotsSvg } from '../../../assets/svg/docs/vertidot.svg';
import { DocsStatusButton, statusTextmapper } from '../../features/docs';
import Context from '../../../context/context';
import { Drawer } from 'antd';
import { fetchOriginSelection, getCurrentWorkspaceId } from '../../../helpers';
import CopiedModal from '../modalsV2/workflowsModals/CopiedModal';
import { Spin } from 'antd';
import Spinner from '../../components/loaders/Spinner';

let origin = fetchOriginSelection();

const SideBarPreview = ({ open, onClose, activeTemplate, openFileLeadModal }) => {
	const {
		templates: { getSpecificTemplatesInfo, specificTemplatesInfo },
		profileInfo: { userWorkSpaceList, getTenantSettings, tennantSettingsData },
		activityInfo: { createSmartfile, smartfile },
	} = useContext(Context);

	const [info, setInfo] = useState({
		activeTemplateData: null,
		loading: false,
		copyModal: false,
		currentWorkspaceId: null,
		pendingCopyAction: null,
		copyLink: null,
	});

	useEffect(() => {
		if (smartfile?._id) {
			window.location.href = `${origin}/${smartfile?._id}?workflow=true&templateId=${info?.activeTemplateData?._id}`;
		}
	}, [smartfile]);

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			activeTemplateData: activeTemplate,
		}));
	}, [activeTemplate]);

	useEffect(() => {
		if (userWorkSpaceList) {
			const currentWorkspaceId = getCurrentWorkspaceId(userWorkSpaceList);
			performExtraCheck(currentWorkspaceId);
		}
	}, [userWorkSpaceList, info?.pendingCopyAction]);

	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, [tennantSettingsData]);

	const performExtraCheck = useCallback(
		async (currentWorkspaceId) => {
			setInfo((prev) => ({ ...prev, currentWorkspaceId }));
			if (info?.pendingCopyAction) {
				let link = `https://${currentWorkspaceId}.ve.ai/${info?.pendingCopyAction}`;
				await navigator.clipboard.writeText(link);
				setInfo((prev) => ({ ...prev, pendingCopyAction: null, copyLink: link }));
			}
		},
		[info?.pendingCopyAction],
	);

	const openCopyLinkModal = useCallback(
		async (data) => {
			try {
				setInfo((prev) => ({ ...prev, copyModal: true }));
				if (!tennantSettingsData) {
					await getTenantSettings();
				}

				let link;
				if (tennantSettingsData?.customDomain?.length) {
					link = `https://${tennantSettingsData?.customDomain}/${data?.slug}`;
					setInfo((prev) => ({ ...prev, copyLink: link }));
					await navigator.clipboard.writeText(link);
					return;
				} else {
					if (!info?.currentWorkspaceId) {
						setInfo((prev) => ({ ...prev, pendingCopyAction: data?.slug }));
						return;
					}
					link = `https://${info?.currentWorkspaceId}.ve.ai/${data?.slug}`;
					setInfo((prev) => ({ ...prev, copyLink: link }));
					await navigator.clipboard.writeText(link);
					return;
				}
			} catch (err) {
				console.log('Failed to copy text');
			}
		},
		[info?.currentWorkspaceId, tennantSettingsData],
	);

	const closeCopyLinkModal = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			copyModal: false,
			copyLink: null,
		}));
	}, []);

	const handleTemplateClick = async () => {
		setInfo((prev) => ({ ...prev, loading: true }));
		const payload = {
			smartFileInput: {
				templateId: activeTemplate?._id,
				title: activeTemplate?.title,
			},
		};
		await createSmartfile(payload);
		setInfo((prev) => ({ ...prev, loading: false }));
	};

	return (
		<Drawer
			open={open}
			onClose={onClose}
			style={{ padding: '10px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			width={480}
		>
			<div className="previewDrawer">
				<div className="headerContainer">
					<div className="headerLeftLabel">
						<CloseSvg onClick={onClose} />
					</div>
					<div className="headerRightLabel">
						<DocsStatusButton
							content={statusTextmapper?.[info?.activeTemplateData?.status]?.text}
							style={statusTextmapper?.[info?.activeTemplateData?.status]?.style}
							dotStyle={
								statusTextmapper?.[info?.activeTemplateData?.status]?.dotStyle
							}
						/>
						<div
							className="editLabel"
							onClick={() =>
								(window.location.href = `${origin}/${activeTemplate?._id} `)
							}
						>
							Edit
						</div>
						<ShareSvg onClick={() => openCopyLinkModal(activeTemplate)} />
						<DotsSvg />
					</div>
				</div>

				<div className="previewLoader">
					{info?.activeTemplateData?.moduleTemplates?.map((e, index) => (
						<div className="modulesViewer" key={index}>
							<span>{e?.module}</span>
							<div className="imageContainer">
								<div style={{ width: '100%', height: '100%' }}>
									<iframe
										src={`${origin}/preview/${activeTemplate?._id}?module=${e?._id}&isPubic=${e?.isPublic}&restrictClick=true`}
										title="Builder Preview"
										width="100%"
										height="100%"
									/>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="buttonContainer">
					<div
						className="button"
						onClick={
							info?.activeTemplateData?.version
								? handleTemplateClick
								: openFileLeadModal
						}
					>
						{info?.loading ? (
							<Spinner height={'10px'} width={'10px'} color={'black'} />
						) : (
							'Create File'
						)}
					</div>
				</div>
			</div>

			<CopiedModal
				open={info?.copyModal}
				closeModal={closeCopyLinkModal}
				slug={activeTemplate?.slug}
				modules={activeTemplate?.moduleTemplates?.filter((ele) => ele?.isPublic)}
				copyLink={
					info?.currentWorkspaceId || info?.copyLink ? (
						info?.copyLink
					) : (
						<span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
							Generating Link ...
							<Spin />
						</span>
					)
				}
			/>
		</Drawer>
	);
};

export default memo(SideBarPreview);
