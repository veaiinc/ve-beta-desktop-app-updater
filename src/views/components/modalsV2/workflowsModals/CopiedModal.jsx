import React, { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/sales/copyModal.scss';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Circled } from '../../../../assets/svg/workflow/circled.svg';
import { ReactComponent as RightArrow } from '../../../../assets/svg/workflow/rightArrow.svg';

const CopiedModal = ({ open, closeModal, modules, copyLink, pin }) => {
	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="copyParentModal">
				<span className="copyText">Copied !</span>
				<span className="copylink">{copyLink}</span>
				{pin ? <span className="copylink">Use this pin to unlock {pin}</span> : ''}

				<div className="workflowData">
					<span className="linkData">This link contains of </span>
					<div className="actionBTnContainer">
						{modules?.map((ele, index) => (
							<div className="actionBtnWrapper" key={index}>
								<div className="actionBtn">
									<Circled />
									<span className="actionBtnTitlestyling">
										{ele?.type || ele?.module}
									</span>
								</div>
								{index < modules?.length - 1 ? <RightArrow /> : ''}
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
