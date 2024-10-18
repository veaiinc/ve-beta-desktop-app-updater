import React, { memo, useState, useCallback } from 'react';
import '../../../assets/scss/sales/activity/activitySessionModal.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/activity/close.svg';
import { ReactComponent as ActivitySvg } from '../../../assets/svg/activity/activity.svg';
import { ReactComponent as LinkedinSvg } from '../../../assets/svg/activity/linkedin.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';
import { ReactComponent as RightSvg } from '../../../assets/svg/activity/right.svg';
import { Drawer } from 'antd';

const SessionActivityModal = ({ modalIsOpen, showDrawer }) => {
	const [info, setInfo] = useState({
		viewMore: false,
	});

	const handleViewMore = useCallback(() => {
		console.log(`ViewMore Clicked: ${info.viewMore}`);
		setInfo((prevInfo) => ({
			...prevInfo,
			viewMore: !prevInfo.viewMore,
		}));
	}, [info?.viewMore]);

	return (
		<Drawer
			onClose={showDrawer}
			open={modalIsOpen}
			width={480}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="activitySidePanel">
				<div className="innerContainer">
					<div className="headParentContianer">
						<div className="headContainer">
							<div className="headerInfo">
								<div className="logoContainer">
									<ActivitySvg />
									<span className="logoText">Session Activity</span>
								</div>
								<span className="headerTitle">James Stark - Smart File</span>
							</div>
							<div className="closeBtn" onClick={showDrawer}>
								<CloseSvg />
							</div>
						</div>
					</div>

					<div class="profileCardContainer">
						{/* <!-- User Information Section --> */}
						<div class="profileInfoContainer">
							<div class="profileAvatar">JS</div>
							<div class="profileDetailsWrapper">
								<div className="profileTitle">
									<span className="titleName">Jhon Michael</span>
									<span className="titleIcon">
										<LinkedinSvg />
									</span>
								</div>
								<div className="profileDescription">
									<p>
										Digital Marketing Strategist | Growth Hacker | Storyteller
									</p>
									<p>johnmichael@gmail.com</p>
								</div>
							</div>
						</div>

						{/* <!-- Session Navigation Section --> */}
						<div class="sessionNavigationContainer">
							<div className="sessionNavWrapper">Session 2/5</div>
							<div className="viewMoreButton" onClick={handleViewMore}>
								<span>View More</span>
								<span className="viewMoreSvg">
									{info?.viewMore ? <DownSvg /> : <RightSvg />}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(SessionActivityModal);
