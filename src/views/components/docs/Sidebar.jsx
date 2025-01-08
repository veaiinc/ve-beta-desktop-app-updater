import { Drawer } from 'antd';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { ReactComponent as CloseSvg } from '../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as ExpandSvg } from '../../../assets/svg/docs/expand.svg';
import { ReactComponent as ShareSvg } from '../../../assets/svg/docs/share.svg';
import { ReactComponent as DotsSvg } from '../../../assets/svg/docs/vertidot.svg';
import CustomTextArea from '../globalComponents/CusomTextArea';
import RequiredActions from './RequiredActions';
import Preview from './Preview';
import '../../../assets/scss/docs/fileListView.scss';
const Sidebar = ({ open, onClose, activeFileData }) => {
	const [info, setInfo] = useState({
		activeTab: 'reqActions',
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
				Component: () => <Preview />,
			},
			{
				id: 'activity',
				label: 'Activity',
				Component: () => <div>Activity</div>,
			},
		],
		[],
	);

	const renderActiveComponent = useCallback(() => {
		const activeTabConfig = tabs?.find((tab) => tab?.id === info?.activeTab);
		if (!activeTabConfig) return null;

		const { Component } = activeTabConfig;
		return <Component />;
	}, [info?.activeTab, tabs]);
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
						<div>Draft</div>
						<div className="editLabel">Edit</div>
						<ShareSvg />
						<DotsSvg />
					</div>
				</div>

				<div className="listViewContainer">
					<CustomTextArea
						value={`${info?.selectedRow?.title || 'Abhilash Wedding'}`}
						onChange={(e) => {}}
						autoResize={true}
						// className="titleInput"
					/>
					ListView
					<CustomTextArea
						value={`${info?.selectedRow?.title || ''}`}
						onChange={(e) => {}}
						autoResize={true}
						placeholder="| Add Description.... "
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
