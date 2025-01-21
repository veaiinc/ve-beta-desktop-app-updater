import React, { useState, memo } from 'react';
import ReactModal from '../modalsV2';
import { ReactComponent as CrossSvg } from '../../../assets/svg/gallery/cross.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
import '../../../assets/scss/home_page/promptPopup.scss';

const files = [
	'My Templates',
	'Wedding Proposals',
	'Ismail Wedding',
	'Proposal planner.dox',
	'Resume.pdf',
];

const PromptPopup = ({ open, closeModal }) => {
	const [searchText, setSearchText] = useState('');
	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="promptPopupContainer">
				<div className="promptPopupContainerHeader">
					<div className="promptPopupContainerHeaderLeft">
						<div className="promptPopupContainerHeaderLeftTitle">
							Wedding Day Timeline Generator
						</div>
						<div className="promptPopupContainerHeaderLeftSubtitle">20 Credits</div>
					</div>
					<div className="promptPopupContainerHeaderRight" onClick={closeModal}>
						<CrossSvg />
					</div>
				</div>

				<div className="promptPopupContainerBody">
					<div className="promptPopupContainerBodyText">
						Gather the wedding schedule details from the client questionnaire and
						generate a detailed photography timeline. Include location travel times,
						setup durations, and buffer for unexpected delays.
					</div>
					<div className="promptPopupContainerEmailPrompt">Email Prompt</div>
				</div>

				<div>Hello</div>

				<div className="promptPopupContainerFilesDiv">
					<div className="promptPopupContainerSelectionFiles">
						<div className="promptPopupContainerSelectionFilesTitle">Select file</div>
						<div className="promptPopupContainerSelectionFilesSearch">
							<SearchIcon />
							<input
								type="text"
								placeholder="Search Files"
								className="inputSearchText"
								value={searchText}
								onChange={(e) => setSearchText(e?.target?.value)}
							/>
						</div>
					</div>
					<div className="promptPopupOptionsContainer">
						{files.map((file, index) => {
							return (
								<div className="promptPopupOptionsContainerFiles">
									<div className="promptPopupContainerFilesListFileIcon"></div>
									<div className="promptPopupContainerFilesListFile">{file}</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(PromptPopup);
