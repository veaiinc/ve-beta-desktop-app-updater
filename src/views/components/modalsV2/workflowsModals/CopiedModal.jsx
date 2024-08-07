import React, { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/sales/copyModal.scss';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Circled } from '../../../../assets/svg/workflow/circled.svg';
import { ReactComponent as RightArrow } from '../../../../assets/svg/workflow/rightArrow.svg';

const CopiedModal = ({ open, closeModal, workflowSlug, workflowData }) => {
	const [info, setInfo] = useState({
		copyLink: '',
	});

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			copyLink: `https://${localStorage.getItem('workspaceId')}.ve.co/portal/${workflowSlug}`,
		}));
	}, []);

	console.log(workflowData);

	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="copyParentModal">
				<span className="copyText">Copied !</span>
				<span className="copylink">{info?.copyLink}</span>
				<div className="workflowData">
					<span className="linkData">This link contains of </span>
					<div className="actionBTnContainer">
						{workflowData?.modules?.map((ele, index) => (
							<div className="actionBtnWrapper" key={index}>
								<div className="actionBtn">
									<Circled />
									<span className="actionBtnTitlestyling">{ele?.type}</span>
								</div>
								{index < workflowData?.modules?.length - 1 ? <RightArrow /> : ''}
							</div>
						))}
					</div>
				</div>
				<span className="subText">
					You can now share this link to your client to view your file.
				</span>
				<div className="copyCloseBtn" onClick={closeModal}>
					Ok ,Got it
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CopiedModal);
