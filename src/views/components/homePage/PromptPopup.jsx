import React, { useState, memo, useEffect } from 'react';
import ReactModal from '../modalsV2';
import { ReactComponent as CrossSvg } from '../../../assets/svg/gallery/cross.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as EmailPromptSvg } from '../../../assets/svg/home_page/emailPrompt.svg';
import { ReactComponent as DropdownArrow } from '../../../assets/svg/chat/downArrow.svg';
import '../../../assets/scss/home_page/promptPopup.scss';
import { Tooltip } from 'antd';
import FilterPopUp from '../globalComponents/FilterPopUp';
import BottomToolbar from '../ai_agents/BottomToolbar';
import ToolBarChatContainerModal from '../modalsV2/ToolBarChatContainerModal';
const files = [
	'My Templates',
	'Wedding Proposals',
	'Ismail Wedding',
	'Proposal planner.dox',
	'Resume.pdf',
];

const clientOptions = [
	{ id: 0, title: 'Ankit', value: 'Ankit' },
	{ id: 1, title: 'Ismail', value: 'Ismail' },
	{ id: 2, title: 'Avinash', value: 'Avinash' },
];

const Prompt =
	'Gather the wedding schedule details from the option questionnaire and generate a detailed photography timeline. Include location travel times, setup durations, and buffer for unexpected delays';

const PromptPopup = ({ open, closeModal, selectedCard }) => {
	const [searchText, setSearchText] = useState('');
	const [selectedOptions, setSelectedOptions] = useState({});
	const [isOpen, setIsOpen] = useState(false);
	const [clientSearch, setClientSearch] = useState('');
	const [dynamicPrompt, setDynamicPrompt] = useState('');
	const [expandedChat, setExpandedChat] = useState(false);

	const handlePromptData = (clientSearch) => {
		const prompt = Prompt.replace('{option}', clientSearch);
		setDynamicPrompt(prompt);
	};

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

	const handleClientSearch = (value) => {
		setClientSearch(value?.title);
		console.log(clientSearch, 'clientSearch');
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

	const handleRunPrompt = () => {
		setIsOpen(false);
		setExpandedChat(true);
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
								<FilterPopUp
									options={clientOptions}
									searchInput={true}
									searchInputPlaceholder="Search Client"
									searchValue={clientSearch}
									onOptionClick={(option) => handleClientSearch(option)}
									setSearchValue={handleClientSearch}
								/>
							}
							open={isOpen}
							color="transparent"
							trigger="click"
							arrow={false}
						>
							<span
								onClick={() => setIsOpen(!isOpen)}
								className="promptPopupContainerBodyTextTooltip"
							>
								client <DropdownArrow />
							</span>
						</Tooltip>
						{''}questionnaire and generate a detailed photography timeline. Include
						location travel times, setup durations, and buffer for unexpected delays.
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
				<button className="promptPopupContainerRunButton" onClick={() => handleRunPrompt()}>
					Run
				</button>
			</div>
		</ReactModal>
	);
};

export default memo(PromptPopup);
