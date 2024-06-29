import { Card, Text, rem } from "@mantine/core";
import { nanoid } from "nanoid";
import { ICON } from "../constants/icons";
import classes from "./FeatureCards.module.css";

const InstallDoctorListView = (props) => {
	const { software, theme } = props;

	// Strip metadata nodes from Install.Doctor array
	const unwanted = [
		"_envchain:deps",
		"_kde",
		"_misc-flatpaks",
		"_nautilus-extensions",
	];

	const { softwarePackages } = software || [];
	const softwareKeys = softwarePackages
		? Object.keys(softwarePackages)
				.filter((item) => !unwanted.includes(item))
				.sort()
		: [];
	const softwareNames = [];
	for (const key of softwareKeys) {
		softwareNames.push(softwarePackages[key]?.name?.toLowerCase());
	}

	// List of software from Install.Doctor
	return (
		<Card shadow="md" radius="md" className={classes.card} padding="xl">
			<ICON.allApps
				style={{ width: rem(50), height: rem(50) }}
				stroke={2}
				color={theme.colors.blue[6]}
			/>
			<Text
				fz="lg"
				fw={500}
				className={classes.cardTitle}
				mt="md"
				style={{ textAlign: "left" }}
			>
				Install.Doctor Software List
			</Text>
			<Card
				shadow="md"
				fz="sm"
				c="dimmed"
				mt="sm"
				style={{ textAlign: "left" }}
			>
				{softwareKeys?.length > 0 &&
					softwareKeys.map((item) => {
						return (
							<div key={nanoid()} className={classes.itemBox}>
								<a
									href={
										softwarePackages[item]._home ||
										softwarePackages[item]._github ||
										"#"
									}
									target="_blank"
									rel="noreferrer"
								>
									{softwarePackages[item]._name || softwarePackages[item]._bin}
								</a>
							</div>
						);
					})}
			</Card>
		</Card>
	);
};

export default InstallDoctorListView;
