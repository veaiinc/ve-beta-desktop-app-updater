import React, { memo, useCallback, useMemo, useState } from 'react';
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
import Preview from './Preview';
import { Drawer } from 'antd';
import { Tooltip } from 'antd';
import { DocsStatusButton, statusTextmapper } from '../../features/docs';
const Sidebar = ({ open, onClose, activeFileData }) => {
	const [info, setInfo] = useState({
		activeTab: 'reqActions',
		openMoreOptions: false,
	});
	const handleTabChange = useCallback((tabId) => {
		setInfo((prev) => ({ ...prev, activeTab: tabId }));
	}, []);

	const tabs = useMemo(
		() => [
			{
				id: 'reqActions',
				label: 'Req Actions',
				Component: () => <RequiredActions />,
			},
			{
				id: 'preview',
				label: 'Preview',
				Component: () => <Preview data={activeFileData} />,
			},
			{
				id: 'activity',
				label: 'Activity',
				Component: () => <div>Activity</div>,
			},
		],
		[activeFileData],
	);
	// console.log('activeFileData', JSON.stringify(activeFileData, null, 2));
	// console.log('activeFileData', activeFileData);

	const renderActiveComponent = useCallback(() => {
		const activeTabConfig = tabs?.find((tab) => tab?.id === info?.activeTab);
		if (!activeTabConfig) return null;

		const { Component } = activeTabConfig;
		return <Component />;
	}, [info?.activeTab, tabs]);

	const handleMoreVisibility = useCallback((visible) => {
		console.log('visible', visible);
		setInfo((prev) => ({ ...prev, openMoreOptions: visible }));
	}, []);
	return (
		<Drawer
			open={open}
			// open={true}
			onClose={onClose}
			style={{ padding: '10px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			width={480}
		>
			<div className="fileListViewDrawer">
				<div className="headerContainer">
					<div className="headerLeftLabel">
						<CloseSvg onClick={onClose} />
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
						<ShareSvg />
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
						{tabs?.map((tab) => (
							<div
								key={tab?.id}
								className={`tabViewLabel ${
									info?.activeTab === tab?.id ? 'active' : ''
								}`}
								onClick={() => handleTabChange(tab?.id)}
							>
								{tab?.label}
							</div>
						))}
					</div>

					<div className="respectiveView">{renderActiveComponent() || ''}</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(Sidebar);
