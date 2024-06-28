// @ts-nocheck
import React from 'react';
import { ATTACHMENT_TYPE_IMAGE } from '@src/Constants';
import '../../../../styles/ContextChatMessage.css';
import ChatMessageShortContent from './ChatMessageShortContent';

function ContextChatMessage(props) {
	return (
		<div
			className="chat__message__context"
			onClick={() =>
				props.goToMessageId(
					props.contextMessage.id,
					props.contextMessage.timestamp
				)
			}
		>
			<div className="chat__message__context__info">
				<span className="chat__message__context__info__sender">
					{props.contextMessage.senderName}
				</span>

				<span className="chat__message__context__info__message">
					<ChatMessageShortContent
						type={props.contextMessage.type}
						template={props.contextMessage.template}
						buttonText={props.contextMessage.buttonText}
						interactiveButtonText={props.contextMessage.interactiveButtonText}
						text={props.contextMessage.text}
						caption={props.contextMessage.caption}
						isLastMessageFromUs={props.contextMessage?.isFromUs}
					/>
				</span>
			</div>

			{props.contextMessage.type === ATTACHMENT_TYPE_IMAGE && (
				<div className="chat__message__context__preview">
					<img
						src={props.contextMessage.generateImageLink()}
						alt={props.contextMessage.caption}
					/>
				</div>
			)}
		</div>
	);
}

export default ContextChatMessage;
