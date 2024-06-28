import { useState } from 'react';
import ChatMessageList from '@src/interfaces/ChatMessageList';
import { useAppSelector } from '@src/store/hooks';

interface Props {
	MESSAGES_PER_PAGE: Number;
}

const useChat = ({ MESSAGES_PER_PAGE }: Props) => {
	const currentUser = useAppSelector((state) => state.currentUser.value);
	const users = useAppSelector((state) => state.users.value);
	const templates = useAppSelector((state) => state.templates.value);
	const savedResponses = useAppSelector((state) => state.savedResponses.value);

	const [messages, setMessages] = useState<ChatMessageList>({});

	const isTimestampsSame = (checkInReverse: boolean = false): boolean => {
		const messagesArray = Object.values(messages);
		if (checkInReverse) messagesArray.reverse();
		let previousTimestamp = -1;
		let isSame = true;
		for (let i = 0; i < MESSAGES_PER_PAGE; i++) {
			const message = messagesArray[i];
			if (!message) {
				isSame = false;
				break;
			}

			if (i === 0) {
				previousTimestamp = message.timestamp;
			} else {
				if (message.timestamp !== previousTimestamp) {
					isSame = false;
					break;
				}

				previousTimestamp = message.timestamp;
			}
		}

		return isSame;
	};

	return {
		currentUser,
		users,
		templates,
		savedResponses,
		messages,
		setMessages,
		isTimestampsSame,
	};
};

export default useChat;
