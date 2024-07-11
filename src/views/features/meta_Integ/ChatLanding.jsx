import React, { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/chat/chatStyling.scss';
import Context from '../../../context/context';
import { useNavigate, useParams } from 'react-router-dom';
const ChatLanding = (props) => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    let {
        chatInfo: { getPageInfo, pageInfoData },
    } = useContext(Context);

    const [info, setInfo] = useState({
        data: null,
    });

    useEffect(() => {
        const payload = {
            filters: {
                limit: 100,
                page: 1,
            },
        };
        getPageInfo(workspaceId, payload);
    }, []);

    useEffect(() => {
        if (pageInfoData) {
            const { data } = pageInfoData;
            setInfo((prev) => ({ ...prev, data }));
        }
    }, [pageInfoData]);

    return (
        <div
            className="parentContainer"
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                color: '#fff',
            }}
        >
            <span>Please Select a Page</span>
            {info?.data?.map((ele, index) => (
                <div
                    key={index}
                    className="pageList"
                    onClick={() => navigate(`${ele?.pageName}`, { state: { pageInfoData: ele } })}
                >
                    <div
                        className="imageContainer"
                        style={{
                            backgroundImage: `url(${ele?.displayPicture})`,
                        }}
                    ></div>
                    <span className="channelName">{ele?.pageName}</span>
                </div>
            ))}
        </div>
    );
};

export default memo(ChatLanding);
