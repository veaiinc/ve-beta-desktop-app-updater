// Replace with your actual imports
import { ReactComponent as Pdf } from '../../../assets/svg/files/pdfSvg.svg';
import { ReactComponent as Mp3 } from '../../../assets/svg/files/mp3Svg.svg';
import { ReactComponent as Mp4 } from '../../../assets/svg/files/mp4Svg.svg';
import { ReactComponent as Document } from '../../../assets/svg/files/docSvg.svg';
import { ReactComponent as Psd } from '../../../assets/svg/files/psdSvg.svg';
import { ReactComponent as Zip } from '../../../assets/svg/files/zipSvg.svg';
import { ReactComponent as File } from '../../../assets/svg/files/file.svg';

const fileTypeMap = {
	pdf: { icon: <Pdf />, color: '#FF4D4D' },
	epub: { icon: <Pdf />, color: '#FF4D4D' },
	mobi: { icon: <Pdf />, color: '#FF4D4D' },
	azw: { icon: <Pdf />, color: '#FF4D4D' },

	mp3: { icon: <Mp3 />, color: '#9747FF' },
	wav: { icon: <Mp3 />, color: '#9747FF' },
	aac: { icon: <Mp3 />, color: '#9747FF' },
	flac: { icon: <Mp3 />, color: '#9747FF' },
	ogg: { icon: <Mp3 />, color: '#9747FF' },

	mp4: { icon: <Mp4 />, color: '#9747FF' },
	mkv: { icon: <Mp4 />, color: '#9747FF' },
	avi: { icon: <Mp4 />, color: '#9747FF' },
	mov: { icon: <Mp4 />, color: '#9747FF' },
	webm: { icon: <Mp4 />, color: '#9747FF' },

	doc: { icon: <Document />, color: '#2D7FF9' },
	docx: { icon: <Document />, color: '#2D7FF9' },
	xls: { icon: <Document />, color: '#2D7FF9' },
	xlsx: { icon: <Document />, color: '#2D7FF9' },
	csv: { icon: <Document />, color: '#2D7FF9' },
	ods: { icon: <Document />, color: '#2D7FF9' },
	ppt: { icon: <Document />, color: '#2D7FF9' },
	pptx: { icon: <Document />, color: '#2D7FF9' },
	key: { icon: <Document />, color: '#2D7FF9' },

	psd: { icon: <Psd />, color: '#2D7FF9' },
	ai: { icon: <Psd />, color: '#2D7FF9' },
	figma: { icon: <Psd />, color: '#2D7FF9' },
	xd: { icon: <Psd />, color: '#2D7FF9' },
	sketch: { icon: <Psd />, color: '#2D7FF9' },

	zip: { icon: <Zip />, color: '#71717A' },
	rar: { icon: <Zip />, color: '#71717A' },
	'7z': { icon: <Zip />, color: '#71717A' },
	'tar.gz': { icon: <Zip />, color: '#71717A' },

	json: { icon: <File />, color: '#71717A' },
	xml: { icon: <File />, color: '#71717A' },
	yaml: { icon: <File />, color: '#71717A' },
	txt: { icon: <File />, color: '#71717A' },
	md: { icon: <File />, color: '#71717A' },
	log: { icon: <File />, color: '#71717A' },
	ini: { icon: <File />, color: '#71717A' },
	cfg: { icon: <File />, color: '#71717A' },
};

const sourceTypeMap = {
	pdf: fileTypeMap.pdf,
	image: { icon: <File />, color: '#2D7FF9' },
	png: { icon: <File />, color: '#2D7FF9' },
	jpg: { icon: <File />, color: '#2D7FF9' },
	jpeg: { icon: <File />, color: '#2D7FF9' },
	workflow: { icon: <Document />, color: '#2D7FF9' },
	url: { icon: <File />, color: '#71717A' },
};

const defaultType = { icon: <File />, color: '#71717A' };

const getExtensionFromUrl = (url = '') => {
	try {
		const cleanUrl = url?.split('?')[0]?.split('#')[0];
		const parts = cleanUrl?.toLowerCase()?.split('.');
		return parts?.length > 1 ? parts?.pop() : null;
	} catch {
		return null;
	}
};

const getFileTypeInfo = (item) => {
	const getInfo = (ext) => fileTypeMap?.[ext] || sourceTypeMap?.[ext] || defaultType;

	if (item?.fileType) {
		const ext = item?.fileType?.toLowerCase()?.replace(/^\./, '');
		return getInfo(ext);
	}

	if (item?.sourceType) {
		const ext = item?.sourceType?.toLowerCase();
		return getInfo(ext);
	}

	const extFromUrl = getExtensionFromUrl(item?.url || item?.fileUrl);
	if (extFromUrl) {
		return getInfo(extFromUrl);
	}

	return defaultType;
};

export default getFileTypeInfo;
