import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import Preview from './Preview';
import RequiredActions from './RequiredActions';
import DocsActivity from './DocsActivity';
import { ReactComponent as CloseSvg } from '../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
import { ReactComponent as PieSvg } from '../../../assets/svg/tasks/pieHollow.svg';
import { ReactComponent as ShareSvg } from '../../../assets/svg/docs/share.svg';
import { ReactComponent as DotsSvg } from '../../../assets/svg/docs/vertidot.svg';
import { ReactComponent as DuplicateSvg } from '../../../assets/svg/tasks/duplicate.svg';
import { ReactComponent as DeleteSvg } from '../../../assets/svg/tasks/dustBin.svg';
import CustomTextArea from '../globalComponents/CusomTextArea';
import { Tooltip } from 'antd';
import '../../../assets/scss/docs/docsFullView.scss';
import { fetchOriginSelection } from '../../../helpers';

// Import the status mapper directly
export const statusTextmapper = {
	filesViewed: {
		id: 'filesViewed',
		text: 'Files Viewed',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
		label: 'Files Viewed',
	},
	enquiry: {
		id: 'enquiry',
		text: 'Enquiry',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
		label: 'Enquiry',
	},
	filesSent: {
		id: 'filesSent',
		text: 'Sent',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
		label: 'Sent',
	},
	confirmed: {
		id: 'confirmed',
		text: 'Confirmed',
		dotStyle: {
			backgroundColor: '#00A051',
		},
		style: {
			backgroundColor: '#2C593F',
		},
		label: 'Confirmed',
	},
	expired: {
		id: 'expired',
		text: 'Expired',
		dotStyle: {
			backgroundColor: '#E27B1C',
		},
		style: {
			backgroundColor: 'rgba(125, 79, 39, 1)',
		},
		label: 'Expired',
	},
	proposalAccepted: {
		id: 'proposalAccepted',
		text: 'Accepted',
		dotStyle: {
			backgroundColor: '#00A051',
		},
		style: {
			backgroundColor: '#2C593F',
		},
		label: 'Proposal Accepted',
	},
};

// Add the DocsStatusButton component
export const DocsStatusButton = ({ content = '', style = {}, textStyle = {}, dotStyle = {} }) => {
	return (
		<div className="DocsStatusButtonOuterContainer" style={{ ...style }}>
			<div className="DocsStatusCircle" style={{ ...dotStyle }}></div>
			<span className="DocsButtontext" style={{ ...textStyle }}>
				{content}
			</span>
		</div>
	);
};

const initialState = {
	openMoreOptions: false,
	fileActivityData: null,
	fileViewerList: null,
	activityDataLoading: true,
	sendSmartFileModal: false,
};

const origin = fetchOriginSelection();

const DocsFullView = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('preview');
	const [fileData, setFileData] = useState(null);
	const [info, setInfo] = useState(initialState);

	const {
		templates: { getSmartFileData, smartFileInfo },
		activityInfo: {
			resetActivityState,
			activityData,
			getSmartFileActivity,
			getSmartFileViewers,
			viewersList,
		},
	} = useContext(Context);

	useEffect(() => {
		if (id) {
			getSmartFileData({ getWorkflowWithModulesId: id });
			getSmartFileActivity({ workflowId: id });
			getSmartFileViewers({ workflowId: id });
		}
		return () => {
			resetActivityState();
		};
	}, [id]);

	useEffect(() => {
		if (smartFileInfo) {
			setFileData((prev) => ({
				...prev,
				...smartFileInfo,
				requiredAction: smartFileInfo.requiredAction || prev?.requiredAction,
				_id: id,
				status: smartFileInfo.status || prev?.status,
				clientDetails: smartFileInfo.clientDetails || prev?.clientDetails,
				title: smartFileInfo.title || prev?.title,
			}));

			if (smartFileInfo.requiredAction?.action && activeTab === 'preview') {
				setActiveTab('reqActions');
			}
		}
	}, [smartFileInfo, id]);

	useEffect(() => {
		if (activityData) {
			setInfo((prev) => ({
				...prev,
				fileActivityData: activityData,
				activityDataLoading: false,
			}));
		}
	}, [activityData]);

	useEffect(() => {
		if (viewersList) {
			setInfo((prev) => ({
				...prev,
				fileViewerList: viewersList,
				activityDataLoading: false,
			}));
		}
	}, [viewersList]);

	const handleClose = () => {
		navigate('/docs');
	};

	const handleMoreVisibility = (visible) => {
		setInfo((prev) => ({ ...prev, openMoreOptions: visible }));
	};

	const openSendSmartFileModal = () => {
		setInfo((prev) => ({ ...prev, sendSmartFileModal: true }));
	};

	const openDeleteModal = () => {
		// Implement delete modal functionality
	};

	const workflowRedirectionsToBuilder = () => {
		if (fileData) {
			const version = fileData?.version;
			version === 0 || version === null
				? navigate(`/smart-file/${fileData?.templateId}/${fileData?._id}`)
				: (window.location.href = `${origin}/workflow/${fileData?._id}?workflow=true&templateId=${fileData?.templateId}`);
		}
	};

	const tabs = useMemo(
		() => ({
			...(fileData?.requiredAction?.action && {
				reqActions: {
					label: 'Req Actions',
					Component: <RequiredActions data={fileData} />,
				},
			}),
			preview: {
				label: 'Preview',
				Component: <Preview data={fileData} />,
			},
			...(info?.fileActivityData &&
				info?.fileViewerList && {
					activity: {
						label: 'Activity',
						Component: (
							<DocsActivity
								data={fileData}
								fileActivityData={info?.fileActivityData}
								fileViewerList={info?.fileViewerList}
								loading={info?.activityDataLoading}
							/>
						),
					},
				}),
		}),
		[fileData, info?.fileActivityData, info?.fileViewerList, info?.activityDataLoading],
	);

	return (
		<div className="docsFullView">
			<div className="docsFullViewContent">
				<div className="headerContainer">
					<div className="headerLeft">
						<CloseSvg onClick={handleClose} />
						<CustomTextArea
							value={fileData?.title}
							onChange={() => {}}
							autoResize={true}
							style={{ padding: '0px' }}
						/>
					</div>
					<div className="headerRight">
						<DocsStatusButton
							content={statusTextmapper?.[fileData?.status]?.text}
							style={statusTextmapper?.[fileData?.status]?.style}
							dotStyle={statusTextmapper?.[fileData?.status]?.dotStyle}
						/>
						<div className="editLabel" onClick={workflowRedirectionsToBuilder}>
							Edit
						</div>
						<Tooltip
							placement="bottomRight"
							open={info?.openMoreOptions}
							onOpenChange={handleMoreVisibility}
							arrow={false}
							trigger={'click'}
							color={'transparent'}
							overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
							overlayClassName="dot-svg-tooltip"
							title={
								<div className="dot-svg-tooltip-content">
									<div className="items">
										<DuplicateSvg />
										<span>Duplicate</span>
									</div>
									<div className="items" onClick={openSendSmartFileModal}>
										<ShareSvg />
										<span>Share</span>
									</div>
									<hr style={{ width: '100%', opacity: 0.1 }} />
									<div className="deleteItem" onClick={openDeleteModal}>
										<DeleteSvg />
										<span>Delete</span>
									</div>
								</div>
							}
						>
							<DotsSvg />
						</Tooltip>
					</div>
				</div>

				<div className="listviewContainer">
					<div className="listDataMapper">
						<div className="listDataMapperRow">
							<div className="listDataMapperRowLabel">
								<PersonSvg />
								<span>Client Name</span>
							</div>
							<div className="listDataMapperRowValue">
								{fileData?.clientDetails?.name}
							</div>
						</div>
						<div className="listDataMapperRow">
							<div className="listDataMapperRowLabel">
								<PieSvg />
								<span>Stage</span>
							</div>
							<div className="listDataMapperRowValue">
								<DocsStatusButton
									content={statusTextmapper?.[fileData?.status]?.text}
									style={statusTextmapper?.[fileData?.status]?.style}
									dotStyle={statusTextmapper?.[fileData?.status]?.dotStyle}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="tabsViewWrapper">
					<div className="tabsView">
						{Object.entries(tabs).map(([key, { label }]) => (
							<div
								key={key}
								className={`tabViewLabel ${activeTab === key ? 'active' : ''}`}
								onClick={() => setActiveTab(key)}
							>
								{label}
							</div>
						))}
					</div>
					<div className="respectiveView">{tabs[activeTab]?.Component}</div>
				</div>
			</div>
		</div>
	);
};

export default DocsFullView;
