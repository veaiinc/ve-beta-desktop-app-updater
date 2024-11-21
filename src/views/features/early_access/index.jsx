/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/earlyAccess/earlyAccess.scss';
import { ReactComponent as VE } from '../../../assets/svg/ve.svg';
import { ReactComponent as Facebook } from '../../../assets/svg/earlyAccess/facebook.svg';
import { ReactComponent as LinkedIn } from '../../../assets/svg/earlyAccess/linkedIn.svg';
import { ReactComponent as Instagram } from '../../../assets/svg/earlyAccess/instagram.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';

const EarlyAccess = () => {
	const usertoken = localStorage.getItem('usertoken') ?? '';
	const workspaceId = localStorage.getItem('workspaceId') ?? '';
	const navigate = useNavigate();

	const {
		profileInfo: { userWorkSpaceList, getUserWorkSpaceList },
	} = useContext(Context);

	useEffect(() => {
		getUserWorkSpaceList();
	}, []);

	useEffect(() => {
		if (usertoken?.length === 0) {
			navigate('/');
		}
		if (userWorkSpaceList) {
			checkIsOnBoardUser();
		}
	}, [userWorkSpaceList]);

	const checkIsOnBoardUser = useCallback(() => {
		let isOnboard = JSON.parse(localStorage.getItem('isOnboard'));

		const currentWorkspaceData = (userWorkSpaceList || [])?.filter(
			(ele) => ele?.activeWorkspaceId === workspaceId,
		);

		if (currentWorkspaceData) {
			isOnboard = currentWorkspaceData[0]?.isOnboard;
		}
		if (isOnboard) {
			localStorage.setItem('isOnboard', true);
			navigate('/home');
		}
	}, [userWorkSpaceList]);

	return (
		<div className="earlyAccessParentContainer">
			<VE />
			<div className="backdropStuff"></div>
			<div className="earlyAccessScreenTextContainer">
				<span className="earlyAccessMainText">
					Your request for <br></br>
					<span className="earlyAccessText">Early access</span> is submitted!
				</span>
				<span className="earlyAccessSubText">
					You will receive an email once your request is approved!
				</span>
			</div>
			<div className="earlyAccessFooter">
				<span className="earlyAccessFooterText">Follow us for more updates</span>
				<div className="earlyAccessFooterIconHolder">
					<Facebook />
					<LinkedIn />
					<Instagram />
				</div>
			</div>
		</div>
	);
};

export default memo(EarlyAccess);
