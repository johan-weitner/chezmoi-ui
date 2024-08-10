import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import YAML from "yaml";
import { ROUTES } from "./src/core/routes.js";
import { initialize, setupGroupData } from "./src/core/boot.js";
import {
	addApp,
	deleteApp,
	getAllApps,
	getAllUnfinishedApps,
	getAppByKey,
	updateApp,
	deleteAppTag,
	getTagsByAppId,
	getAllTags,
	updateArticleTags,
	getAllGroups,
	addAppToGroup,
	removeAppFromGroup,
	getAppsByGroup,
	getGroupsByApp,
	getGroupById,
	updateAllowedTags,
	filterAppsByNoInstallers,
	filterAppsByNoUrls,
	filterAppsByNoName,
	filterAppsByNoDesc
} from "./src/db/dbService.js";
import { log } from "./src/util/logger.js";
import { getYamlExport, getFilteredYamlExport, getInstallDoctorExport } from "./src/util/export.js";

const app = express();
const port = process.env.BACKEND_SRV_PORT || 3000;

log.setLevel(process.env.LOG_LEVEL || "INFO");
initialize(); // Set up auxillary infrastructure

app.set("json spaces", 2);
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const attachHeaders = (res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	return res;
};

app.get("/", (req, res) => {
	res.redirect(ROUTES.software);
});

app.get(ROUTES.software, (req, res) => {
	getAllApps().then((apps) => {
		res.json(apps);
	});
});

app.get(ROUTES.softwareNotDone, (req, res) => {
	getAllUnfinishedApps().then((apps) => {
		res.json(apps);
	});
});

app.get(ROUTES.filterBy, (req, res) => {
	const { filter } = req.query;
	switch (filter) {
		case "installers":
			filterAppsByNoInstallers().then(apps => {
				res.json(apps);
			});
			break;

		case "urls":
			filterAppsByNoUrls().then(apps => {
				res.json(apps);
			});
			break;

		case "name":
			filterAppsByNoName().then(apps => {
				res.json(apps);
			});
			break;

		case "desc":
			filterAppsByNoDesc().then(apps => {
				res.json(apps);
			});
			break;
	}
});

app.get(ROUTES.getApp, (req, res) => {
	const { key } = req.query;
	getAppByKey(key).then((app) => {
		res.json(app);
	});
});

app.post(ROUTES.updateNode, (req, res) => {
	const { body } = req;

	if (Object.keys(data).length === 0) {
		res.status(500).json({
			error: "No data provided",
		});
		return;
	}
	updateApp(body)
		.then((app) => {
			res.status(200).json(app);
		})
		.catch((e) => {
			res.status(500).json({
				error: e.message,
			});
		});
});

app.post(ROUTES.addNode, (req, res) => {
	log.debug("Req.body: ", req.body);
	const { data } = req.body;
	log.debug("Req params: ", data);
	addApp(data)
		.then((app) => {
			res.status(200).json(app);
		})
		.catch((e) => {
			res.status(500).json({
				error: e.message,
			});
		});
});

app.delete(ROUTES.deleteNode, (req, res) => {
	deleteApp(req.query.id)
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((e) => {
			res.status(500).json({
				error: e.message,
			});
		});
});

app.get(ROUTES.getAllTags, (req, res) => {
	getAllTags().then((tags) => {
		res.json(tags);
	});
});

app.get(ROUTES.getTagsByAppId, (req, res) => {
	const { appId } = req.query;
	getTagsByAppId(Number.parseInt(appId, 10)).then((tags) => {
		res.json(tags);
	});
});

app.post(ROUTES.addAppTags, (req, res) => {
	log.debug("Req.body: ", req.body);
	const { tagId, appId } = req.body.data;
	log.debug("Req params: ", req.body.data);
	updateArticleTags(appId, tagId)
		.then(() => {
			res.status(200).json();
		})
		.catch((e) => {
			res.status(500).json({
				error: e.message,
			});
		});
});

app.delete(ROUTES.deleteAppTag, (req, res) => {
	const { appId, tagId } = req.body.data;
	log.debug("Req params: ", req.body.data);
	deleteAppTag(tagId, appId)
		.then((res) => {
			res.status(200).json(res);
		})
		.catch((e) => {
			res.status(500).json({
				error: e.message,
			});
		});
});

app.get(ROUTES.download, (req, res) => {
	getYamlExport().then(apps => {
		const yamlFile = YAML.stringify(apps);

		const filename = `software-custom-${new Date().getTime()}.yaml`;
		const mimetype = "text/x-yaml";

		res.setHeader('Content-disposition', `attachment; filename=${filename}`);
		res.setHeader('Content-type', mimetype);

		res.write(yamlFile);
		res.end();

	}).catch(e => {
		log.error("Error: ", e);
		res.status(500).json({
			error: e.message,
		});
	});
});

app.get(ROUTES.filteredDownload, (req, res) => {
	const { tags } = req.query;
	const tagsArray = tags.split(",");
	log.debug(`Tags: - ${tagsArray} - isArray: ${Array.isArray(tagsArray)}`);
	const tagIntArray = tagsArray.map(tag => {
		return Number.parseInt(tag, 10);
	});
	log.debug(`TagIntArray: - ${tagIntArray} - isArray: ${Array.isArray(tagsArray)}`);

	getFilteredYamlExport(tagIntArray).then(apps => {
		const yamlFile = YAML.stringify(apps);

		const filename = `software-custom-(${tagsArray.join("-")})-${new Date().getTime()}.yaml`;
		log.debug(`Filename: - ${filename}`);
		// const filename = `software-custom-${new Date().getTime()}.yaml`;
		const mimetype = "text/x-yaml";

		res.setHeader('Content-disposition', `attachment; filename=${filename}`);
		res.setHeader('Content-type', mimetype);

		res.write(yamlFile);
		res.end();

	}).catch(e => {
		log.error("Error: ", e.message);
		res.status(500).json({
			error: e.message,
		});
	});
});

app.get(ROUTES.softwareGroups, (req, res) => {
	const { groups, groupKeys } = setupGroupData();
	res.json({
		groups: groups,
		groupKeys: groupKeys
	});
});

app.get(ROUTES.groups, (req, res) => {
	getAllGroups().then(groups => {
		log.debug("SERVER: Got groups: ", groups?.length);
		res.json({
			groups: groups,
		});
	}).catch(e => {
		res.status(500).json({
			error: e.message,
		});
	});;
});

// getAppsByGroup
app.get(ROUTES.groupApps, (req, res) => {
	const { groupId } = req.query;
	getAppsByGroup(groupId).then(apps => {
		res.json({
			apps: apps,
		});
	}).catch(e => {
		log.error(e.message);
		res.status(500).json({
			error: e.message,
		});
	});;
});

app.get(ROUTES.appGroups, (req, res) => {
	const { appId } = req.query;
	getGroupsByApp(appId).then(groups => {
		res.json({
			groups: groups,
		});
	}).catch(e => {
		log.error(e.message);
		res.status(500).json({
			error: e.message,
		});
	});;
});

app.get(ROUTES.getGroupById, (req, res) => {
	const { groupId } = req.query;
	getGroupById(groupId).then(group => {
		res.json({
			group: group,
		});
	}).catch(e => {
		res.status(500).json({
			error: e.message,
		});
	});;
});

app.post(ROUTES.addAppToGroup, (req, res) => {
	const { groupId, appId } = req.body.data;
	addAppToGroup(groupId, appId)
		.then((appGroup) => {
			res.status(200).json(appGroup);
		})
		.catch((e) => {
			res.status(500).json({
				error: e.message,
			});
		});
});

app.delete(ROUTES.removeAppFromGroup, (req, res) => {
	const { groupId, appId } = req.body;
	removeAppFromGroup(groupId, appId)
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((e) => {
			log.error(e.message);
			res.status(500).json({
				error: e.message,
			});
		});
});

app.get(ROUTES.groupedApps, (req, res) => {
	getInstallDoctorExport().then((groups) => {
		const yamlFile = YAML.stringify(groups);

		const filename = `software-groups-${new Date().getTime()}.yaml`;
		const mimetype = "text/x-yaml";

		res.setHeader('Content-disposition', `attachment; filename=${filename}`);
		res.setHeader('Content-type', mimetype);

		res.write(yamlFile);
		res.end();
	}).catch(e => {
		res.status(500).json({
			error: e.message,
		});
	});
});

app.post(ROUTES.updateAllowedTags, (req, res) => {
	const { data } = req.body;
	updateAllowedTags(data)
		.then((allowedTags) => {
			res.status(200).json(allowedTags);
		})
		.catch((e) => {
			log.error(e.message);
			res.status(500).json({
				error: e.message,
			});
		});
});

app.listen(port, () => {
	log.info(`\nServer is listening at port ${port} `);
});
