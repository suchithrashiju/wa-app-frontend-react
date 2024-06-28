import { UserList } from '@src/api/responses/UsersResponse';
import { useAppSelector } from '@src/store/hooks';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import useGroupsAPI from '@src/hooks/api/useGroupsAPI';
import { AssigneeType } from '@src/components/AssigneeChip/AssigneeChip';
import { CancelTokenSource } from 'axios';
import { generateCancelToken } from '@src/helpers/ApiHelper';
import { getObjLength } from '@src/helpers/ObjectHelper';

interface Props {
	assigneeType: AssigneeType;
	isActionable: boolean;
}

const useAssigneeChip = ({ assigneeType, isActionable }: Props) => {
	const cancelTokenSourceRef = useRef<CancelTokenSource>();

	const { groups, initGroups } = useGroupsAPI();

	let users: UserList = {};

	if (isActionable) {
		users = useAppSelector((state) => state.users.value);
	}

	const [menuAnchorEl, setMenuAnchorEl] = useState<Element>();

	useEffect(() => {
		if (isActionable) {
			cancelTokenSourceRef.current = generateCancelToken();
		}

		return () => {
			cancelTokenSourceRef.current?.cancel();
		};
	}, [isActionable]);

	const displayMenu = (event: MouseEvent) => {
		if (getObjLength(groups) === 0) {
			initGroups(cancelTokenSourceRef.current?.token);
		}

		if (event.currentTarget instanceof Element) {
			setMenuAnchorEl(event.currentTarget);
		}
	};

	const hideMenu = () => {
		setMenuAnchorEl(undefined);
	};

	return {
		menuAnchorEl,
		displayMenu,
		hideMenu,
		users,
		groups,
	};
};

export default useAssigneeChip;
