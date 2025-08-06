import { memo } from 'react';
import Skeleton from 'react-loading-skeleton';

const NameInput = ({ userDetailsLoading, username, handleSetUsername, disabled }) => {
	return (
		<div className={`nameInputContainer ${disabled ? 'disabled' : ''}`}>
			<p className="question">What is your name?</p>
			{userDetailsLoading ? (
				<Skeleton
					width="100%"
					height="41px"
					style={{
						'--highlight-color': 'gray',
						'--base-color': 'transparent',
						borderRadius: '8px',
					}}
				/>
			) : (
				<div className="nameInputAndProfilePictureContainer">
					<input
						disabled={disabled}
						className="nameInput"
						value={username}
						onChange={handleSetUsername}
						type="text"
						placeholder="Full Name"
						autoFocus
					/>
					{/* <Tooltip
                title={
                    <ToolTipContainer
                        customContainerStyle={customContainerStyle}
                        contentStyling={contentStyling}
                        title={''}
                        content={'Upload your profile picture'}
                        removeClassName={true}
                    />
                }
                arrow={true}
                color={'var(--card)'}
            >
                <div className="profilePictureContainer">
                    <label htmlFor="profilePictureInput">
                        <input
                            id="profilePictureInput"
                            type="file"
                            accept="image/*"
                            onChange={handleSetProfilePicture}
                            className="profilePictureInput"
                        />
                        {info?.profilePicture ? (
                            <img
                                src={info?.profilePicture}
                                alt={info?.username}
                                className="profilePicture"
                            />
                        ) : (
                            <UploadIcon />
                        )}
                    </label>
                </div>
            </Tooltip> */}
				</div>
			)}
		</div>
	);
};

export default memo(NameInput);
