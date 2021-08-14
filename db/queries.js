const { query } = require("./config");

const USER_TABLE = "user_table";
const BRANCH_TABLE = "branch_table";
const PINCODE_TABLE = "pincode_table";
const NOTIFICATION_TABLE = "notification_table";
const NOTIFICATION_COUNT_TABLE = "notification_count_table";

const createTables = async () => {
	let q = "";
	try {
		q = `CREATE TABLE IF NOT EXISTS ${USER_TABLE} (username VARCHAR(16) PRIMARY KEY, password TEXT NOT NULL, role VARCHAR(16) NOT NULL)`;
		await query(q);
		console.log("Created USER TABLE");

		q = `CREATE TABLE IF NOT EXISTS ${BRANCH_TABLE} (branchid SERIAL PRIMARY KEY, username VARCHAR(16) NOT NULL, institutionname TEXT, branchname TEXT, address TEXT, city TEXT, contact TEXT, inchargename TEXT)`;
		await query(q);
		console.log("Created BRANCH TABLE");
		q = `CREATE INDEX ON ${BRANCH_TABLE} (username)`;
		await query(q);
		console.log("Indexed BRANCH TABLE");

		q = `CREATE TABLE IF NOT EXISTS ${PINCODE_TABLE} (pincode INT NOT NULL, branchid INT NOT NULL, PRIMARY KEY(pincode, branchid))`;
		await query(q);
		console.log("Created PINCODE TABLE");

		q = `CREATE TABLE IF NOT EXISTS ${NOTIFICATION_TABLE} (id SERIAL PRIMARY KEY, username VARCHAR(16) NOT NULL, message TEXT NOT NULL, status SMALLINT DEFAULT 0, timestamp BIGINT)`;
		await query(q);
		console.log("Created NOTIFICATION TABLE");
		q = `CREATE INDEX ON ${NOTIFICATION_TABLE} (username)`;
		await query(q);
		console.log("Indexed NOTIFICATION TABLE");

		q = `CREATE TABLE IF NOT EXISTS ${NOTIFICATION_COUNT_TABLE} (username VARCHAR(16) PRIMARY KEY, count INT DEFAULT 0)`;
		await query(q);
		console.log("Created NOTIFICATION COUNT TABLE");
	} catch (error) {
		console.log(error);
	}
};

const createUser = async (username, password, role) => {
	try {
		const q = `INSERT INTO ${USER_TABLE}(username, password, role) VALUES($1, $2, $3)`;
		await query(q, [username, password, role]);
		console.log("User Created");
	} catch (error) {
		console.log(error);
	}
};

const prepareNotificationCountTable = async (username) => {
	try {
		const q = `INSERT INTO ${NOTIFICATION_COUNT_TABLE}(username, count) VALUES($1, $2)`;
		await query(q, [username, 0]);
		console.log("Prepared Notification Count");
	} catch (error) {
		console.log(error);
	}
};

const createBranch = async (
	username,
	institutionname,
	branchname,
	address,
	city,
	contact,
	inchargename
) => {
	try {
		const q = `INSERT INTO ${BRANCH_TABLE}(
			username,
			institutionname,
			branchname,
			address,
			city,
			contact,
			inchargename) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING branchid`;
		const result = await query(q, [
			username,
			institutionname,
			branchname,
			address,
			city,
			contact,
			inchargename,
		]);
		return result.rows[0].branchid;
	} catch (error) {
		console.log(error);
	}
};

const insertBranchPincodeMap = async (pincode, branchid) => {
	try {
		const q = `INSERT INTO ${PINCODE_TABLE}(pincode, branchid) VALUES($1, $2)`;
		await query(q, [pincode, branchid]);
		console.log("Branch Pincode Inserted");
	} catch (error) {
		console.log(error);
	}
};

const getUser = async (username) => {
	try {
		const q = `SELECT username, password, role FROM ${USER_TABLE} WHERE username = ($1)`;
		const result = await query(q, [username]);
		if (result?.rowCount) {
			return [result.rows[0], null];
		}
		return [null, "Invalid username"];
	} catch (error) {
		return [null, "Something went wrong"];
	}
};

const getBranchesByPincode = async (pincode) => {
	let q, result;
	try {
		q = `SELECT pincode, branchid FROM ${PINCODE_TABLE} WHERE pincode = ($1)`;
		result = await query(q, [pincode]);
		if (!result?.rowCount) return [null, "Pincode not found"];

		let popStr = "(";
		const branchIds = [];
		const rows = result.rows;
		for (let i = 1; i <= rows.length; i++) {
			branchIds.push(rows[i - 1].branchid);
			if (i === rows.length) {
				popStr += `$${i})`;
				break;
			}
			popStr += `$${i},`;
		}

		q = `SELECT * FROM ${BRANCH_TABLE} WHERE branchid IN ${popStr}`;
		result = await query(q, branchIds);
		if (!result?.rowCount) return [null, "Pincode not found"];
		return [result.rows, null];
	} catch (error) {
		console.log(error);
		return [null, "Something went wrong"];
	}
};

const getBranchByUsername = async (username) => {
	try {
		const q = `SELECT branchid, branchname, address, city, contact, inchargename, institutionname FROM ${BRANCH_TABLE} WHERE username = ($1)`;
		const result = await query(q, [username]);
		return [result.rows, null];
	} catch (error) {
		return [null, "Something went wrong"];
	}
};

const getAllBranches = async () => {
	try {
		const q = `SELECT branchid, branchname, address, city, contact, inchargename, institutionname FROM ${BRANCH_TABLE}`;
		const result = await query(q, []);
		return [result.rows, null];
	} catch (error) {
		return [null, "Something went wrong"];
	}
};

const insertNotification = async (usernames = [], message) => {
	let q, result;
	try {
		const timestamp = Date.now();
		let popStr = "";
		const payload = [];
		let idx = 1;
		for (let i = 0; i < usernames.length; i++) {
			payload.push(usernames[i], message, timestamp);
			popStr += "(";
			popStr += `$${idx++},`;
			popStr += `$${idx++},`;
			popStr += `$${idx++}`;
			popStr += ")";
			if (i < usernames.length - 1) popStr += ",";
		}
		q = `INSERT INTO ${NOTIFICATION_TABLE}(username, message, timestamp) VALUES ${popStr} RETURNING id, username`;
		result = await query(q, payload);
		popStr = "(";
		for (let i = 1; i <= usernames.length; i++) {
			if (i === usernames.length) {
				popStr += `$${i})`;
				break;
			}
			popStr += `$${i},`;
		}
		if (result.rowCount) {
			q = `UPDATE ${NOTIFICATION_COUNT_TABLE} SET count = count + 1 WHERE username IN ${popStr}`;
			await query(q, usernames);
			return [result.rows, null];
		}
		return [null, "Couldn't create notification"];
	} catch (error) {
		console.log(error);
		return [null, "Something went wrong"];
	}
};

const markNotificationAsRead = async (id, username) => {
	let q, result;
	try {
		q = `UPDATE ${NOTIFICATION_TABLE} SET status = ($1) WHERE id = ($2)`;
		result = await query(q, [1, id]);
		if (result.rowCount) {
			q = `UPDATE ${NOTIFICATION_COUNT_TABLE} SET count = count - 1 WHERE username = ($1)`;
			await query(q, [username]);
			return [true, null];
		}
		return [null, "Couldn't update notification status"];
	} catch (error) {
		return [null, "Something went wrong"];
	}
};

const getNotificationCount = async (username) => {
	try {
		const q = `SELECT count FROM ${NOTIFICATION_COUNT_TABLE} WHERE username = ($1)`;
		const result = await query(q, [username]);
		if (result?.rowCount) {
			return [result.rows[0].count, null];
		}
		return [null, "Invalid username"];
	} catch (error) {
		return [null, "Something went wrong"];
	}
};

const getNotificationsByUsername = async (username) => {
	try {
		const q = `SELECT id, message, status, timestamp FROM ${NOTIFICATION_TABLE} WHERE username = ($1) ORDER BY timestamp DESC`;
		const result = await query(q, [username]);
		if (result?.rowCount) {
			const data = result.rows;
			const unreads = [];
			const reads = [];
			for (let i = 0; i < data.length; i++) {
				if (data[i].status) {
					reads.push(data[i]);
				} else {
					unreads.push(data[i]);
				}
			}
			return [{ reads, unreads }, null];
		}
		return [null, "Invalid username"];
	} catch (error) {
		return [null, "Something went wrong"];
	}
};

module.exports = {
	createTables,
	createUser,
	prepareNotificationCountTable,
	createBranch,
	insertBranchPincodeMap,
	getUser,
	getBranchesByPincode,
	getAllBranches,
	getBranchByUsername,
	insertNotification,
	markNotificationAsRead,
	getNotificationCount,
	getNotificationsByUsername,
};
