import React from 'react';
import ProposalsController from '../../controllers/proposals';
import useChatStreamImport from '../../hooks/useChatStream';

const IconIndexBaseClass =
	typeof window !== 'undefined' && !window.__NEXT_DATA__ ? ProposalsController : React.Component;

const ImageIndexBaseClass =
	typeof window !== 'undefined' && !window.__NEXT_DATA__ ? ProposalsController : React.Component;

const TextIndexBaseClass =
	typeof window !== 'undefined' && !window.__NEXT_DATA__ ? ProposalsController : React.Component;

const useChatStream =
	typeof window !== 'undefined' && !window.__NEXT_DATA__
		? (() => {
				try {
					return useChatStreamImport;
				} catch {
					return () => ({
						socketRef: null,
						createWebSocketConnection: () => {},
						sendMessage: () => {},
					});
				}
		  })()
		: () => ({
				socketRef: null,
				createWebSocketConnection: () => {},
				sendMessage: () => {},
		  });

import { ReactComponent as SelectDownSVG } from './library/svgs/formQuestionTypes/selectDown.svg';
import { ReactComponent as StarSVG } from './library/svgs/formQuestionTypes/star.svg';
import { ReactComponent as UploadFileSVG } from './library/svgs/formQuestionTypes/uploadFile.svg';
import { ReactComponent as RadioSVG } from './library/svgs/formQuestionTypes/RadioSVG.svg';
import { ReactComponent as Embed } from './library/addBlock/icons/embed.svg';
import { ReactComponent as DeleteRole } from './library/svgs/deleteRed.svg';
import { ReactComponent as Edit } from './library/svgs/edit.svg';

// Logical Form
import { ReactComponent as ShortAnswer } from './library/svgs/logicform/shortanswer.svg';
import { ReactComponent as LongAnswer } from './library/svgs/logicform/longanswer.svg';
import { ReactComponent as SingleChoice } from './library/svgs/logicform/singlechoice.svg';
import { ReactComponent as MultipleChoice } from './library/svgs/logicform/multichoice.svg';
import { ReactComponent as Dropdown } from './library/svgs/logicform/dropdown.svg';
import { ReactComponent as NumberIcon } from './library/svgs/logicform/number.svg';
import { ReactComponent as Email } from './library/svgs/logicform/email.svg';
import { ReactComponent as Phone } from './library/svgs/logicform/phonenumber.svg';
import { ReactComponent as Link } from './library/svgs/logicform/link.svg';
import { ReactComponent as FileUpload } from './library/svgs/logicform/fileupload.svg';
import { ReactComponent as Events } from './library/svgs/logicform/events.svg';
import { ReactComponent as Time } from './library/svgs/logicform/time.svg';
import { ReactComponent as Rating } from './library/svgs/logicform/rating.svg';
import { ReactComponent as Signature } from './library/svgs/logicform/signature.svg';
import { ReactComponent as Images } from './library/svgs/logicform/image.svg';
import { ReactComponent as Video } from './library/svgs/logicform/video.svg';
import { ReactComponent as Audio } from './library/svgs/logicform/audio.svg';
import { ReactComponent as LogicalEmbed } from './library/svgs/logicform/embed.svg';
import { ReactComponent as Delete } from './library/svgs/logicform/delete.svg';
import { ReactComponent as Duplicate } from './library/svgs/logicform/duplicate.svg';
import { ReactComponent as DragandDrop } from './library/svgs/logicform/draganddrop.svg';
import { ReactComponent as ConditionalIcon } from './library/svgs/logicform/condition.svg';
import { ReactComponent as Add } from './library/svgs/logicform/addquestion.svg';
import { ReactComponent as When } from './library/svgs/logicform/when.svg';
import { ReactComponent as Then } from './library/svgs/logicform/then.svg';
import { ReactComponent as BackArrow } from './library/svgs/logicform/backarrow.svg';
import { ReactComponent as Play } from './library/svgs/play.svg';

import { ReactComponent as EditNavbar } from './library/svgs/Navbar/Edit.svg';
import { ReactComponent as HandBurger } from './library/svgs/Navbar/HandBurger.svg';
import { ReactComponent as Divider } from './library/svgs/Navbar/Divider.svg';
import { ReactComponent as AddBlock } from './library/svgs/LeftBar/Addblock.svg';
import { ReactComponent as Exit } from './library/svgs/Close.svg';
import { ReactComponent as DeleteIcon } from './library/svgs/smartFieldsvg/delete.svg';
import { ReactComponent as UpDown } from './library/svgs/dropDown.svg';

import DownloadIcon from './library/svgs/Navbar/HandBurger.svg';
import DownloadPDF from './library/svgs/Navbar/DownloadPDF.jsx';
// files
import ElementSidebar from './sidebar/elementSidebar.jsx';
import BlockSidebar from './sidebar/BlockSidebar.jsx';
import ColorPicker from './properties/colorpicker/index';
import { ReactComponent as Threedots } from './library/svgs/Threedots.svg';
import { ReactComponent as DeleteSVG } from './library/svgs/vDelete.svg';

//event popup
import { ReactComponent as ActionDropDown } from './library/svgs/dropDown.svg';
import { ReactComponent as Warn } from '../../assets/svg/document/warn.svg';
import { DropDownSvg } from './library/svgs/DropDown/DropDownSvg.jsx';

export {
	IconIndexBaseClass,
	ImageIndexBaseClass,
	TextIndexBaseClass,
	SelectDownSVG,
	StarSVG,
	UploadFileSVG,
	RadioSVG,
	Embed,
	DeleteRole,
	Edit,
	ShortAnswer,
	LongAnswer,
	SingleChoice,
	MultipleChoice,
	Dropdown,
	NumberIcon,
	Email,
	Phone,
	Link,
	FileUpload,
	Events,
	Time,
	Rating,
	Signature,
	Images,
	Video,
	Audio,
	Delete,
	Duplicate,
	DragandDrop,
	ConditionalIcon,
	Add,
	When,
	Then,
	BackArrow,
	LogicalEmbed,

	// Navbar
	Play,
	EditNavbar,
	HandBurger,
	Divider,

	// files
	ElementSidebar,
	ColorPicker,
	AddBlock,
	BlockSidebar,
	DownloadIcon,
	DownloadPDF,
	Exit,
	useChatStream,
	DeleteIcon,
	UpDown,
	DeleteSVG,
	Threedots,
	ActionDropDown,
	Warn,
	DropDownSvg,
};
