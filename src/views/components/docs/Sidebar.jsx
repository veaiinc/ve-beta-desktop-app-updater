import React, { memo, useCallback, useMemo, useState, useContext } from 'react';
import '../../../assets/scss/docs/fileListView.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as ExpandSvg } from '../../../assets/svg/docs/expand.svg';
import { ReactComponent as ShareSvg } from '../../../assets/svg/docs/share.svg';
import { ReactComponent as DotsSvg } from '../../../assets/svg/docs/vertidot.svg';
import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
import { ReactComponent as PieSvg } from '../../../assets/svg/tasks/pieHollow.svg';
import { ReactComponent as ActivitySvg } from '../../../assets/svg/docs/activity.svg';
import { ReactComponent as DuplicateSvg } from '../../../assets/svg/shareAndEarn/copy.svg';
import { ReactComponent as DeleteSvg } from '../../../assets/svg/tasks/dustBin.svg';
import CustomTextArea from '../globalComponents/CusomTextArea';
import RequiredActions from './RequiredActions';
import DocsActivity from './DocsActivity';
import Preview from './Preview';
import { Drawer } from 'antd';
import { Tooltip } from 'antd';
import { DocsStatusButton, statusTextmapper } from '../../features/docs';
import Context from '../../../context/context.js';

const Sidebar = ({ open, onClose, activeFileData, openSendSmartFileModal }) => {
	const {
		activityInfo: { resetActivityState },
	} = useContext(Context);

	const [info, setInfo] = useState({
		activeTab: 'reqActions',
		openMoreOptions: false,
	});

	const handleTabChange = useCallback((tab) => {
		setInfo((prev) => ({ ...prev, activeTab: tab }));
	}, []);

	const tabs = useMemo(() => {
		return {
			reqActions: {
				label: 'Req Actions',
				Component: <RequiredActions />,
			},
			preview: {
				label: 'Preview',
				Component: <Preview data={activeFileData} />,
			},
			activity: {
				label: 'Activity',
				Component: <DocsActivity data={activeFileData} />,
			},
		};
	}, [activeFileData]);

	const handleMoreVisibility = useCallback((visible) => {
		setInfo((prev) => ({ ...prev, openMoreOptions: visible }));
	}, []);

	const modifyClose = useCallback(() => {
		setInfo((prev) => ({ ...prev, activeTab: 'reqActions' }));
		resetActivityState();
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
			<div className="fileListViewDrawer">
				<div className="headerContainer">
					<div className="headerLeftLabel">
						<CloseSvg onClick={modifyClose} />
						<ExpandSvg />
					</div>
					<div className="headerRightLabel">
						{/* <div>Draft</div> */}
						<DocsStatusButton
							content={statusTextmapper?.[activeFileData?.status]?.text}
							style={statusTextmapper?.[activeFileData?.status]?.style}
							dotStyle={statusTextmapper?.[activeFileData?.status]?.dotStyle}
						/>
						<div className="editLabel">Edit</div>
						<ShareSvg onClick={openSendSmartFileModal} />
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
										<ActivitySvg />
										<span>Activity</span>
									</div>
									<div className="items">
										<DuplicateSvg />
										<span>Duplicate</span>
									</div>
									<div className="items">
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

				<div className="listViewContainer">
					<CustomTextArea
						value={activeFileData?.title}
						onChange={(e) => {}}
						autoResize={true}
						style={{ padding: '0px' }}
						// className="titleInput"
					/>

					<div className="listDataMapper">
						<div className="listDataMapperRow">
							<div className="listDataMapperRowLabel">
								<PersonSvg />
								<span>Client Name</span>
							</div>
							<div className="listDataMapperRowValue">
								{activeFileData?.clientDetails?.name}
							</div>
						</div>
						{/* <div className="listDataMapperRow">
							<div className="listDataMapperRowLabel">
								svg
								<span>Cost</span>
							</div>
							<div className="listDataMapperRowValue">$123,456.00</div>
						</div> */}
						{/* <div className="listDataMapperRow">
							<div className="listDataMapperRowLabel">
								svg
								<span>Project Date</span>
							</div>
							<div className="listDataMapperRowValue">Jan 8 2025</div>
						</div> */}
						<div className="listDataMapperRow">
							<div className="listDataMapperRowLabel">
								<PieSvg />
								<span>Stage</span>
							</div>
							<div className="listDataMapperRowValue">
								<DocsStatusButton
									content={statusTextmapper?.[activeFileData?.status]?.text}
									style={statusTextmapper?.[activeFileData?.status]?.style}
									dotStyle={statusTextmapper?.[activeFileData?.status]?.dotStyle}
								/>
							</div>
						</div>
					</div>

					<CustomTextArea
						value={`${info?.selectedRow?.title || ''}`}
						onChange={(e) => {}}
						autoResize={true}
						placeholder="Add Description.... "
						style={{ padding: '0px' }}
						// className="titleInput"
					/>
				</div>

				<div className="tabsViewWrapper">
					<div className="tabsView">
						{Object?.keys(tabs)?.map((tab) => (
							<div
								key={tab}
								className={`tabViewLabel ${
									info?.activeTab === tab ? 'active' : ''
								}`}
								onClick={() => handleTabChange(tab)}
							>
								{tabs?.[tab]?.label}
							</div>
						))}
					</div>

					<div className="respectiveView">{tabs?.[info?.activeTab]?.Component || ''}</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(Sidebar);
