import { Fieldset, TagsInput } from "@mantine/core";
import { useSelector } from "store/store";
import { useState } from "react";
import { useEffect } from "react";
import { log } from "utils/logger";

const GroupSection = (props) => {
	const { hoistAppGroups } = props;
	const [appGroups, setAppGroups] = useState([]);

	const allGroups = useSelector((state) => state.root.appGroups);
	const whiteList = allGroups.map((group) => group.name);
	const selectedApp = useSelector((state) => state.root.selectedApp);
	const isNewApp = useSelector((state) => state.root.isNewApp);

	useEffect(() => {
		if (isNewApp) {
			setAppGroups([]);
			return;
		}
		setAppGroups(selectedApp?.appGroups?.map((group) => group.name) || []);
	}, []);

	useEffect(() => {
		if (isNewApp) return;
		setAppGroups(selectedApp?.appGroups?.map((group) => group.name) || []);
	}, [selectedApp]);

	const onChange = (value) => {
		setAppGroups(value);
		hoistAppGroups(value);
	};

	return (
		<Fieldset legend="Group memberships">
			<div style={{ width: "100%" }}>
				<TagsInput
					placeholder="Pick tag from list"
					value={appGroups || []}
					data={whiteList}
					onChange={onChange}
					pointer
				/>
			</div>
		</Fieldset>
	);
};

export default GroupSection;
