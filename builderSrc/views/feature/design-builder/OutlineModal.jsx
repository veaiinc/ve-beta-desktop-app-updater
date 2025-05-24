import React, { memo, useState, useCallback, useEffect } from 'react';
import '../../../assets/scss/design-builder/outlineModal.scss';
import { ReactComponent as SidebarIcon } from '../../../assets/svg/designBuilder/sidebar.svg';
import { Drawer } from 'antd';
import { ReactComponent as EqualIcon } from '../../../assets/svg/designBuilder/equal.svg';
import { ReactComponent as AI } from '../../../assets/svg/designBuilder/ai.svg';
import { useMemo } from 'react';
const OutlineModal = ({ open, onClose, data, handleAddNewPage, handleUpdateModuleTitle }) => {
	const [info, setInfo] = useState({
		activeTab: 'pages', //pages,styles
	});

	const toggleStage = useCallback(
		(data) => {
			if (info?.activeTab === data) {
				return;
			}
			setInfo((prev) => ({
				...prev,
				activeTab: data,
			}));
		},
		[info],
	);

	const compMapper = useMemo(() => {
		return {
			pages: (
				<Pages
					data={data}
					handleAddNewPage={handleAddNewPage}
					handleUpdateModuleTitle={handleUpdateModuleTitle}
				/>
			),
			styles: <Style />,
		};
	}, [data, handleAddNewPage]);

	return (
		<Drawer
			onClose={onClose}
			open={open}
			width={400}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			mask={false}
		>
			<div className="outlineModalParentContainer">
				{/* //header */}
				<div className="outlineModalHeaderContainer">
					Sources
					<span onClick={onClose}>
						<SidebarIcon />
					</span>
				</div>
				<div className="outlineTabs">
					<span
						className="tabs"
						onClick={() => toggleStage('pages')}
						style={{ backgroundColor: info?.activeTab === 'pages' ? '#202123' : '' }}
					>
						Pages
					</span>
					<span
						className="tabs"
						onClick={() => toggleStage('styles')}
						style={{ backgroundColor: info?.activeTab === 'styles' ? '#202123' : '' }}
					>
						Styles
					</span>
				</div>

				{compMapper[info.activeTab]}
			</div>
		</Drawer>
	);
};

export default memo(OutlineModal);

const Pages = ({ data, handleAddNewPage, handleUpdateModuleTitle }) => {
	const [info, setInfo] = useState({
		modules: data?.modules,
	});

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			modules: data?.modules,
		}));
	}, [data]);

	const handleModuleTitleChange = (e, index) => {
		const modules = [...info?.modules];
		modules[index] = {
			...modules[index],
			title: e.target?.value,
		};
		setInfo((prev) => ({
			...prev,
			modules: modules,
		}));
	};

	return (
		<>
			<div className="modulesContainer">
				{info?.modules?.map((ele, index) => (
					<div className="parentRowContainer" key={index}>
						<EqualIcon />
						<div className="parentInnerMainContainer">
							<input
								className="moduleTitleInput"
								type="text"
								placeholder="Enter page title"
								value={ele?.title}
								onChange={(e) => handleModuleTitleChange(e, index)}
								onBlur={() => handleUpdateModuleTitle(info?.modules)}
							/>
						</div>
					</div>
				))}
			</div>
			<div className="bottomButtonGroup">
				<div className="quickActionDesignButtons" onClick={handleAddNewPage}>
					Add blank page
				</div>
				<div className="quickActionDesignButtons">Add pages from Template</div>
				<div className="quickActionDesignButtons">
					<AI />
					Create page with AI
				</div>
			</div>
		</>
	);
};
const Style = () => {
	return <div></div>;
};
