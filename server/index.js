import dotenv from "dotenv";
dotenv.config();
import fs from "node:fs";
import cors from "cors";
import express from "express";
import YAML from "yaml";
import { isEmpty } from "./src/core/api.js";
import { boot, setupGroupData } from "./src/core/boot.js";
import { tags } from "./src/db/fixtures/tags.js";
import {
	addApp,
	deleteApp,
	getAllApps,
	getAppByKey,
	updateApp,
	addAppTags,
	deleteAppTag,
	getTagsByAppId,
	getAllTags,
	updateArticleTags,
	getAllGroups,
	getGroupByName,
	addAppToGroup,
	removeAppFromGroup,
	getAppsByGroup,
	getGroupById
} from "./src/db/prisma.js";
import { log } from "./src/util/winston.js";
import { getYamlExport, getFilteredYamlExport } from "./src/util/export.js";

const app = express();
const port = process.env.BACKEND_SRV_PORT || 3000;
boot(); // Set up auxillary infrastructure

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
	res.redirect("/software");
});

app.get("/software", (req, res) => {
	getAllApps().then((apps) => {
		res.json(apps);
	});
});

app.get("/getApp", (req, res) => {
	const { key } = req.query;
	getAppByKey(key).then((app) => {
		res.json(app);
	});
});

app.post("/updateNode", (req, res) => {
	const { body } = req;

	if (isEmpty(body)) {
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

app.post("/addNode", (req, res) => {
	console.log("Req.body: ", req.body);
	const { data } = req.body;
	console.log("Req params: ", data);
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

app.delete("/deleteNode", (req, res) => {
	deleteApp(req.query.key)
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((e) => {
			res.status(500).json({
				error: e.message,
			});
		});
});

app.get("/getAllTags", (req, res) => {
	getAllTags().then((tags) => {
		res.json(tags);
	});
});

app.get("/getTagsByAppId", (req, res) => {
	const { appId } = req.query;
	getTagsByAppId(Number.parseInt(appId, 10)).then((tags) => {
		res.json(tags);
	});
});

app.post("/addAppTags", (req, res) => {
	console.log("Req.body: ", req.body);
	const { tagId, appId } = req.body.data;
	console.log("Req params: ", req.body.data);
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

app.delete("/deleteAppTag", (req, res) => {
	const { appId, tagId } = req.body.data;
	console.log("Req params: ", req.body.data);
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

// TODO: Read req param and decide file based on it
app.get('/download', (req, res) => {
	getYamlExport().then(apps => {
		const yamlFile = YAML.stringify(apps);

		const filename = `software-custom-${new Date().getTime()}.yaml`;
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

app.get('/filtered-download', (req, res) => {
	const { tags } = req.query;
	const tagsArray = tags.split(",");
	log.info(`Tags: - ${tagsArray}, - ${typeof tagsArray} - ${Array.isArray(tagsArray)}`);
	const tagIntArray = tagsArray.map(tag => {
		return Number.parseInt(tag, 10);
	})
	getFilteredYamlExport(tagIntArray).then(apps => {
		const yamlFile = YAML.stringify(apps);

		const filename = `software-custom-(${tagsArray.join("-")})-${new Date().getTime()}.yaml`;
		log.info(`Filename: - ${filename}`);
		// const filename = `software-custom-${new Date().getTime()}.yaml`;
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

app.get("/software-groups", (req, res) => {
	const { groups, groupKeys } = setupGroupData();
	res.json({
		groups: groups,
		groupKeys: groupKeys
	});
});

app.get("/groups", (req, res) => {
	getAllGroups().then(groups => {
		console.log("SERVER: Got groups: ", groups?.length);
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
app.get("/group-apps", (req, res) => {
	const { groupId } = req.query;
	getAppsByGroup(groupId).then(apps => {
		res.json({
			apps: apps,
		});
	}).catch(e => {
		res.status(500).json({
			error: e.message,
		});
	});;
});

app.get("/getGroupById", (req, res) => {
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

app.post("/addAppToGroup", (req, res) => {
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

app.delete("/removeAppFromGroup", (req, res) => {
	console.log("Req.body: ", req.body);
	const { groupId, appId } = req.body;
	removeAppFromGroup(groupId, appId)
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((e) => {
			res.status(500).json({
				error: e.message,
			});
		});
});

app.listen(port, () => {
	log.info(`\nServer is listening at port ${port} `);
});


// getAllGroups,
// 	getGroupByName,
// 	addAppToGroup,
// 	removeAppFromGroup