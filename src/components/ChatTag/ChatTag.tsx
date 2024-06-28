// @ts-nocheck
import React, { useMemo } from 'react';
import { useAppSelector } from '@src/store/hooks';
import SellIcon from '@mui/icons-material/Sell';

const ChatTag = ({ id }) => {
	const tags = useAppSelector((state) => state.tags.value);

	const tag = useMemo(() => {
		if (tags && id) {
			return tags.find((tag) => tag.id === id);
		}
	}, [tags, id]);

	return (
		<SellIcon
			style={{
				fill: tag?.web_inbox_color ?? 'white',
			}}
		/>
	);
};

export default ChatTag;
