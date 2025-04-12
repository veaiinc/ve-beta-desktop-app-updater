import React, { useContext, useState, useCallback, useRef } from 'react';
import ChatBox from '../homePage/ChatBox';
import Context from '../../../context/context';
import { TypingEffect } from '../../../helpers/markdownHelper';
import '../../../assets/scss/chat/formModelChat.scss';
import Markdown from 'react-markdown';
import { ReactComponent as LinkLightSvg } from '../../../assets/svg/notes/loop-light.svg';
import { ReactComponent as LinkDarkSvg } from '../../../assets/svg/notes/loop-dark.svg';
import useChatStream from '../../hooks/useChatStream';
import { useParams, useSearchParams } from 'react-router-dom';
const FromModelChatBox = () => {};

export default FromModelChatBox;
