// import React from 'react';
import { Helmet } from 'react-helmet';

const AnimeLoader = () => {
	return (
		<>
			<Helmet>
				<style>
					{`
                        .spinner {
                        width: 20px;
                        height: 20px;
                        display: grid;
                        border-radius: 50%;
                        -webkit-mask: radial-gradient(farthest-side,#0000 40%,#525257 41%);
                        background: linear-gradient(0deg ,rgba(241, 241, 241, 0.6) 50%,rgba(124, 124, 132, 0.6) 0) center/1.9px 100%,
                                linear-gradient(90deg,rgba(241, 241, 241, 0.6) 50%,rgba(124, 124, 132, 0.6) 0) center/100% 1.9px;
                        background-repeat: no-repeat;
                        animation: spinner-d3o0rx 1s infinite steps(6);
                        }

                        .spinner::before,
                        .spinner::after {
                        content: "";
                        grid-area: 1/1;
                        border-radius: 50%;
                        background: inherit;
                        opacity: 0.915;
                        transform: rotate(30deg);
                        }

                        .spinner::after {
                        opacity: 0.83;
                        transform: rotate(60deg);
                        }

                        @keyframes spinner-d3o0rx {
                        100% {
                            transform: rotate(1turn);
                        }
                    }
        `}
				</style>
			</Helmet>
			<div className="spinner"></div>
		</>
	);
};

export default AnimeLoader;
