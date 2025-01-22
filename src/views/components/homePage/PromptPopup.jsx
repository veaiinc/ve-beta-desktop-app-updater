import React, { useState, memo, useEffect } from 'react';
import ReactModal from '../modalsV2';
import { ReactComponent as CrossSvg } from '../../../assets/svg/gallery/cross.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as EmailPromptSvg } from '../../../assets/svg/home_page/emailPrompt.svg';
import { ReactComponent as DropdownArrow } from '../../../assets/svg/chat/downArrow.svg';
import '../../../assets/scss/home_page/promptPopup.scss';
import { Tooltip } from 'antd';

const files = [
	'My Templates',
	'Wedding Proposals',
	'Ismail Wedding',
	'Proposal planner.dox',
	'Resume.pdf',
];

const PromptPopup = ({ open, closeModal, selectedCard }) => {
	const [searchText, setSearchText] = useState('');
	const [selectedOptions, setSelectedOptions] = useState({});
	const [isOpen, setIsOpen] = useState(false);

	const handleSelectedFile = (file) => {
		if (!selectedOptions?.[selectedCard?.id]?.some((f) => f === file)) {
			setSelectedOptions((prev) => {
				const cardId = selectedCard?.id;
				if (!cardId) return prev;
				return {
					...prev,
					[cardId]: [...(prev[cardId] || []), file],
				};
			});
		}
	};

	const handleRemoveSelectedFile = (file) => {
		setSelectedOptions((prev) => {
			const cardId = selectedCard?.id;

			if (!cardId) return prev;
			const updatedOptions = {
				...prev,
				[cardId]: (prev[cardId] || [])?.filter((f) => f !== file),
			};

			if (updatedOptions?.[cardId]?.length === 0) {
				delete updatedOptions?.[cardId];
			}

			return updatedOptions;
		});
	};

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
						Gather the wedding schedule details from the{' '}
						{/* <span onClick={() => setIsOpen(!isOpen)}>
							client <DropdownArrow />
						</span>{' '} */}
						<Tooltip
							placement="bottom"
							title={
								<div className="promptPopupContainerBodyTextTooltip">Client</div>
							}
							open={isOpen}
							trigger="click"
							color="transparent"
							arrow={false}
						>
							<span onClick={() => setIsOpen(!isOpen)}>
								client <DropdownArrow />
							</span>
						</Tooltip>
						questionnaire and generate a detailed photography timeline. Include location
						travel times, setup durations, and buffer for unexpected delays.
					</div>
					<div className="promptPopupContainerEmailPromptContainer">
						<div className="promptPopupContainerEmailPrompt">Edit Prompt</div>
						<EmailPromptSvg />
					</div>
				</div>

				{selectedOptions?.[selectedCard?.id]?.length && (
					<div className="promptPopupContainerSelectedFilesDiv">
						{selectedOptions?.[selectedCard?.id]?.map((file, index) => {
							return (
								<div className="promptPopupContainerEachSelectedFile">
									<div className="promptPopupContainerEachSelectedFileText">
										{file}
									</div>
									<CrossSvg
										onClick={() => handleRemoveSelectedFile(file)}
										style={{ cursor: 'pointer' }}
									/>
								</div>
							);
						})}
					</div>
				)}

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
						{files?.map((file, index) => {
							return (
								<div
									key={index}
									className="promptPopupOptionsContainerFiles"
									onClick={() => handleSelectedFile(file)}
									style={{ cursor: 'pointer' }}
								>
									<div className="promptPopupContainerFilesListFileIcon"></div>
									<div className="promptPopupContainerFilesListFile">{file}</div>
								</div>
							);
						})}
					</div>
				</div>
				<button className="promptPopupContainerRunButton">Run</button>
			</div>
		</ReactModal>
	);
};

export default memo(PromptPopup);
