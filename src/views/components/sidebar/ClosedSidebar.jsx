import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import PlusSvg from '../../../assets/svg/sidebar/PlusSvg';
import AppartmentHomeSvg from '../../../assets/svg/sidebar/AppartmentHomeSvg';
import { ReactComponent as SvgGradient1 } from '../../../assets/svg/sidebar/svggradient1.svg';
import { ReactComponent as SvgGradient2 } from '../../../assets/svg/sidebar/svggradient2.svg';
import DropDrownMenu from './DropDrownMenu';
import { Tooltip } from 'antd';

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

	const openModuleFunction = () => {
		setsidebarStates({ ...sidebarStates, isOpen: true, navStyle: 'open' });
	};

	const openNewFeaturePlus = () => {
		setInfo((prev) => ({ ...prev, isNewFeaturePlusOpen: !prev.isNewFeaturePlusOpen }));
	};
	return (
		<div className="closedSideBarComponent">
			<div className="openWorkFlowContainer" onClick={openModuleFunction}>
				<div className="gradientCirlce">
					<p style={{ textTransform: 'capitalize' }}>{info?.activeRoute?.[1]}</p>

					<div className="svgDiv">
						<SvgGradient1 />
						<SvgGradient2 />
					</div>

					<h6>{info?.activeRoute?.replace('/', '')}</h6>
				</div>
			</div>

			<div className="TabOptions">
				<div>
					<Tooltip
						placement="rightTop"
						title={<DropDrownMenu info={info} setInfo={setInfo} />}
						color={'#151515'}
						arrow={false}
						trigger="click"
						overlayClassName="sideBartoolTipContainer toolTipContainer"
					>
						<div onClick={openNewFeaturePlus}>
							<ClosedSideBarHoverStateIcons
								Icon={PlusSvg}
								hoverClassName="plusIconHover"
							/>
						</div>
					</Tooltip>
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
	);
};

export default memo(ClosedSideBarItemsComponent);
