import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/my_templates/sidePreview.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as ShareSvg } from '../../../assets/svg/docs/share.svg';
import { ReactComponent as DotsSvg } from '../../../assets/svg/docs/vertidot.svg';
import { DocsStatusButton, statusTextmapper } from '../../features/docs';
import Context from '../../../context/context';
import { Drawer } from 'antd';

const SideBarPreview = ({ open, onClose, data }) => {
	const {
		templates: { getSpecificTemplatesInfo, specificTemplatesInfo },
	} = useContext(Context);

	const [info, setInfo] = useState({
		previewData: null,
		loading: true,
	});

	useEffect(() => {
		setInfo((prev) => ({ ...prev, templateData: data }));
	}, [data]);

	useEffect(() => {
		fetchSpecificTemplateInfo();
	}, [data]);

	useEffect(() => {
		if (specificTemplatesInfo) {
			setInfo((prev) => ({
				...prev,
				previewData: specificTemplatesInfo,
				loading: false,
			}));
		}
	}, [specificTemplatesInfo]);

	const fetchSpecificTemplateInfo = useCallback(() => {
		if (data?.id) {
			getSpecificTemplatesInfo(data?.id);
		}
	}, [data]);

	const modifyClose = useCallback(() => {
		onClose();
	}, [onClose]);
	return (
		<Drawer
			open={open}
			onClose={modifyClose}
			style={{ padding: '10px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			width={480}
		>
			<div className="previewDrawer">
				<div className="headerContainer">
					<div className="headerLeftLabel">
						<CloseSvg onClick={modifyClose} />
					</div>
					<div className="headerRightLabel">
						{/* <div>Draft</div> */}
						<DocsStatusButton
							content={statusTextmapper?.[data?.status]?.text}
							style={statusTextmapper?.[data?.status]?.style}
							dotStyle={statusTextmapper?.[data?.status]?.dotStyle}
						/>
						<div className="editLabel">Edit</div>
						<ShareSvg
						// onClick={openSendSmartFileModal}
						/>
						<DotsSvg />
					</div>
				</div>

				<div className="title">{data?.title}</div>

				<div className="previewWrapper">
					<div className="previewHeader">Forms</div>
					<div className="previewHeaderLeft">
						<img src={data?.image} alt="preview" />
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(SideBarPreview);
