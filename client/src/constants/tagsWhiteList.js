import { getTransitionProps } from "@mantine/core";
import { get } from "react-hook-form";

/**
 * A whitelist of tags that are allowed to be used in the application.
 * These tags represent various categories or types of content that can be associated with items in the application.
 */
export const TAGS_WHITE_LIST = [
	"mac",
	"win",
	"linux",
	"work",
	"home",
	"cli",
	"desktop",
	"dev",
];

export const getTagsWhiteList = () => {
	let i = 0;
	return TAGS_WHITE_LIST.map(item => {
		return {
			value: ++i,
			label: item,
		};
	})
};
