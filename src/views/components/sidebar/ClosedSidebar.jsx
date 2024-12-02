import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import PlusSvg from '../../../assets/svg/sidebar/PlusSvg';
import AppartmentHomeSvg from '../../../assets/svg/sidebar/AppartmentHomeSvg';
import { ReactComponent as SvgGradient1 } from '../../../assets/svg/sidebar/svggradient1.svg';
import { ReactComponent as SvgGradient2 } from '../../../assets/svg/sidebar/svggradient2.svg';
import DropDrownMenu from './DropDrownMenu';
import AddCalenderSvg from '../../../assets/svg/sidebar/AddCalenderSvg';
import CalendarSvg from '../../../assets/svg/sidebar/CalendarSvg';
import TranscriptSvg from '../../../assets/svg/sidebar/TranscriptSvg';
import SettingsSvg from '../../../assets/svg/sidebar/SettingsSvg';
import { closedSidebarIcons } from './sidebarindex';
const ClosedSideBarHoverStateIcons = ({ Icon, initialColor = null, hoverClassName = '' }) => {
	const [isHover, setisHover] = useState(false);
	return (
		<div
			onMouseEnter={() => setisHover(true)}
			onMouseLeave={() => setisHover(false)}
			className={`hoverStateIconsClosed ${isHover ? hoverClassName : ''}`}
		>
			{Icon && <Icon fill={isHover ? '#FFF' : initialColor} />}
		</div>
	);
};

const ClosedSideBarItemsComponent = ({ sidebarStates, setsidebarStates, info, setInfo }) => {
	const navigate = useNavigate();
	const [showRaindrop, setShowRaindrop] = useState(false);
	const [selectedIcon, setSelectedIcon] = useState(null);
	const openModuleFunction = () => {
		setsidebarStates({ ...sidebarStates, isOpen: true, navStyle: 'open' });
	};

	const openNewFeaturePlus = () => {
		setInfo((prev) => ({ ...prev, isNewFeaturePlusOpen: !prev.isNewFeaturePlusOpen }));
	};
	const handleIconClick = (index) => {
		setSelectedIcon(index);
	};
	return (
		<>
			<div className="closedSideBarComponent">
				<div
					className="openWorkFlowContainer"
					onClick={openModuleFunction}
					onMouseEnter={() => setShowRaindrop(true)}
					onMouseLeave={() => setShowRaindrop(false)}
				>
					<div className="gradientCirlce">
						<p
							style={{
								textTransform: 'capitalize',
								fontSize: '20px',
								fontFamily: 'Inter',
								fontWeight: '500',
								color: 'white',
							}}
						>
							C
						</p>
					</div>
				</div>
				<div className="ClosedIconsContainer">
					{closedSidebarIcons?.map((singleItem, index) => (
						<div
							className={`iconContainer ${selectedIcon === index ? 'selected' : ''}`}
							onClick={() => {
								handleIconClick(index);
								navigate(singleItem?.route);
							}}
						>
							<ClosedSideBarHoverStateIcons
								Icon={singleItem?.icon}
								initialColor={singleItem?.initialColor}
							/>
						</div>
					))}
				</div>
				<div className="TabOptions">
					<div>
						<div className="dropDownMenuContainer" onClick={openNewFeaturePlus}>
							<ClosedSideBarHoverStateIcons
								Icon={PlusSvg}
								hoverClassName="plusIconHover"
							/>
							<DropDrownMenu info={info} setInfo={setInfo} />
						</div>
					</div>

					<div onClick={() => navigate('/home')}>
						<ClosedSideBarHoverStateIcons Icon={AppartmentHomeSvg} />
					</div>
					<div className="activeWorkspaceDiv" onClick={openModuleFunction}>
						<img
							src={info?.activeBusniessName?.logo_s3_500w_key}
							alt={info?.activeBusniessName?.activeWorkspaceId}
						/>
					</div>
				</div>
			</div>
			{showRaindrop && <div className="raindropEffect"></div>}
		</>
	);
};

export default memo(ClosedSideBarItemsComponent);
