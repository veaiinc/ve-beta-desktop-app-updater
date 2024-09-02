import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../../assets/scss/sales/copyModal.scss';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Circled } from '../../../../assets/svg/workflow/circled.svg';
import { ReactComponent as RightArrow } from '../../../../assets/svg/workflow/rightArrow.svg';

const PublicLinkGeneratedModal = ({ open, closeModal, modules, copyLink = '' }) => {
	const handleCopy = useCallback(async () => {
		await navigator?.clipboard?.writeText(copyLink);
		closeModal();
	}, [copyLink]);

	const [info, setInfo] = useState({
		updatedModule: [],
	});

	useEffect(() => {
		if (modules) {
			let updatedModule = modules?.filter((e) => e?.isPublic);
			setInfo((prev) => ({ ...prev, updatedModule: updatedModule }));
		}
	}, [modules]);

	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="linkGeneratedParentModal">
				<iframe
					src="https://lottie.host/embed/18c5b491-9423-49b6-ba54-42842ec7116c/nGISWGIGC1.json"
					style={{
						border: 'none', // Removes the border
						width: '50px', // Set the width as desired
						height: '50px', // Set the height as desired
					}}
				></iframe>
				<div className="linkContianerDiv">
					<span className="linkGeneratedTitleText">
						Your Workflow is ready to share to your audience to collect leads.
					</span>
					<span className="linkGeneratedTitleText">This Public link contains of </span>
					<div className="actionBTnContainer">
						{info?.updatedModule?.map((ele, index) => (
							<div className="actionBtnWrapper" key={index}>
								<div className="actionBtn">
									<Circled />
									<span className="actionBtnTitlestyling">
										{ele?.type || ele?.module}
									</span>
								</div>
								{index < info?.updatedModule?.length - 1 ? <RightArrow /> : ''}
							</div>
						))}
					</div>
				</div>
				<div className="generatedLinkFooter">
					<span className="generatedLinkHolder">{copyLink}</span>
					<span className="copyBtn" onClick={handleCopy}>
						Copy
					</span>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(PublicLinkGeneratedModal);
