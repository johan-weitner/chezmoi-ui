import dotenv from "dotenv";
dotenv.config();
import fs from "node:fs";
import cors from "cors";
import express from "express";
import YAML from "yaml";
import { isEmpty } from "./src/core/api.js";
import { boot } from "./src/core/boot.js";
import { tags } from "./src/db/fixtures/tags.js";
import {
	addApp,
	deleteApp,
	getAllApps,
	getAppByKey,
	getCount,
	getPage,
	updateApp,
	getAppsWithoutInstaller,
	getAppsWithoutUrls,
	getAppsWithoutDesc,
	getAppsWithoutName
} from "./src/db/prisma.js";
import { log } from "./src/util/winston.js";

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
	attachHeaders(res).redirect("/software");
});

app.get("/software", (req, res) => {
	getAllApps().then((apps) => {
		attachHeaders(res).json(apps);
	});
});

app.get("/getCount", (req, res) => {
	getCount().then((count) => {
		attachHeaders(res).json({ count: count });
	});
});

app.post("/page", (req, res) => {
	const {
		body: { skip, take },
	} = req;
	getPage(Number.parseInt(skip, 10), Number.parseInt(take, 10)).then((apps) => {
		attachHeaders(res).json(apps);
	});
});

app.get("/rawlist", (req, res) => {
	attachHeaders(res).set("Content-Type", "text/plain");

	softwareArray = fs.readFileSync(targetFilePath, "utf8");
	const yamlData = YAML.stringify(softwareArray);

	res.send(yamlData);
});

app.get("/getApp", (req, res) => {
	const { key } = req.query;
	getAppByKey(key).then((app) => {
		attachHeaders(res).json(app);
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
			attachHeaders(res).status(200).json(app);
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
			attachHeaders(res).status(200).json(app);
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
			attachHeaders(res).status(200).json(result);
		})
		.catch((e) => {
			res.status(500).json({
				error: e.message,
			});
		});
});

app.get("/getAppsWithoutInstaller", (req, res) => {
	getAppsWithoutInstaller().then((apps) => {
		attachHeaders(res).json(apps);
	});
});

app.get("/getAppsWithoutUrls", (req, res) => {
	getAppsWithoutUrls().then((apps) => {
		attachHeaders(res).json(apps);
	});
});

app.get("/getAppsWithoutDesc", (req, res) => {
	getAppsWithoutDesc().then((apps) => {
		attachHeaders(res).json(apps);
	});
});

app.get("/getAppsWithoutName", (req, res) => {
	getAppsWithoutName().then((apps) => {
		attachHeaders(res).json(apps);
	});
});

// app.post("/save", (req, res) => {
// 	if (isEmpty(req.body)) {
// 		attachHeaders(res).status(500).json({
// 			error: "No data provided",
// 		});
// 		return;
// 	}
// 	try {
// 		const jsonStr = JSON.stringify(req.body, null, 2);
// 		// fs.writeFileSync(targetFilePath, jsonStr, "utf8");
// 		// attachHeaders(res).status(200).json(jsonStr);
// 	} catch (err) {
// 		attachHeaders(res).status(500).json({
// 			error: err,
// 		});
// 		return;
// 	}
// });

app.listen(port, () => {
	log.info(`\nServer is listening at port ${port} `);
});
