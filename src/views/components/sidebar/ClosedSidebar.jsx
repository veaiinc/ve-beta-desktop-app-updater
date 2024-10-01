import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import PlusSvg from '../../../assets/svg/sidebar/PlusSvg';
import AppartmentHomeSvg from '../../../assets/svg/sidebar/AppartmentHomeSvg';
import DropDrownMenu from './DropDrownMenu';

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

const ClosedSideBarItemsComponent = ({ sidebarStates, setsidebarStates, info }) => {
	const navigate = useNavigate();

	const openModuleFunction = () => {
		setsidebarStates({ ...sidebarStates, isOpen: true, navStyle: 'open' });
	};
	return (
		<div className="closedSideBarComponent">
			<div className="openWorkFlowContainer" onClick={openModuleFunction}>
				<div className="gradientCirlce">
					<p>W</p>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="39"
						height="39"
						viewBox="0 0 39 39"
						fill="none"
					>
						<circle
							cx="19.9849"
							cy="19.4815"
							r="18.5"
							transform="rotate(-135 19.9849 19.4815)"
							stroke="url(#paint0_linear_6906_14714)"
						/>
						<defs>
							<linearGradient
								id="paint0_linear_6906_14714"
								x1="1.25732"
								y1="0.753965"
								x2="39.2573"
								y2="38.754"
								gradientUnits="userSpaceOnUse"
							>
								<stop stopColor="#5D43FB" />
								<stop offset="0.535" stopColor="#5D43FB" stopOpacity="0.13" />
								<stop offset="1" stopColor="#5D43FB" stopOpacity="0" />
							</linearGradient>
						</defs>
					</svg>

					<h6>Workflow</h6>
				</div>
			</div>

			<div className="TabOptions">
				<div>
					<div className="dropDownMenuContainer">
						<ClosedSideBarHoverStateIcons
							Icon={PlusSvg}
							hoverClassName="plusIconHover"
						/>
						{/* <DropDrownMenu /> */}
					</div>
				</div>

				<div onClick={() => navigate('/sales')}>
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
