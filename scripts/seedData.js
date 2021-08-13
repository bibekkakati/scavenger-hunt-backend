const { customAlphabet } = require("nanoid");
const XLSX = require("xlsx");
const Admin = require("../constants/Admin");
const Roles = require("../constants/Roles");
const {
	createUser,
	prepareNotificationCountTable,
	createBranch,
	insertBranchPincodeMap,
	createTables,
} = require("../db/queries");
const DataSheet = XLSX.readFile("./scripts/Data.xlsx");
const sheets = DataSheet.SheetNames;
const data = XLSX.utils.sheet_to_json(DataSheet.Sheets[sheets[0]]);
const password = "$2a$10$481wmZr56QLk4F..H.1vUukFXIU5HpLXz72t/rxhcOzx8rJ/v6XG2";
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(chars, 10);

const seedData = async () => {
	await createTables();
	await createUser(Admin.adminUsername, password, Roles.admin);
	await prepareNotificationCountTable(Admin.adminUsername);
	for (let i = 0; i < data.length; i++) {
		const branchDetails = data[i];
		const institutionname = branchDetails["Insitution Name"];
		const branchname = branchDetails["Branch Name"];
		const address = branchDetails["Address"];
		const city = branchDetails["City"];
		const contact = branchDetails["Contact Number"].toString();
		const inchargename = branchDetails["Branch Incharge"];
		const pincode = branchDetails["Pincode covered"].toString();
		const pincodeList = pincode.split(",");
		const username = nanoid();
		await createUser(username, password, Roles.branch);
		await prepareNotificationCountTable(username);
		const branchid = await createBranch(
			username,
			institutionname,
			branchname,
			address,
			city,
			contact,
			inchargename
		);
		for (let j = 0; j < pincodeList.length; j++) {
			const pin = parseInt(pincodeList[j].trim());
			if (!isNaN(pin)) await insertBranchPincodeMap(pin, branchid);
		}
	}
};

module.exports = seedData;
