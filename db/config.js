const { Pool } = require("pg");
const db_config = {
	host: process.env.PG_HOST,
	port: process.env.PG_PORT,
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	max: 5,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 5000,
};

const pool = new Pool(db_config);
pool.on("error", (err, client) => {
	if (err) console.error(err);
});

module.exports = {
	getPool: () => {
		return pool;
	},
	query: (text, params, callback) => {
		return pool.query(text, params, callback);
	},
};
