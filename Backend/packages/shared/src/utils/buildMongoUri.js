// Builds an Atlas SRV connection string from separate credential/host/db
// env vars instead of a single MDB_URI, so raw credentials never need to be
// pasted into a full connection string in any .env file.
const buildMongoUri = ({ username, password, host, dbName, options = "retryWrites=true&w=majority" }) => {
  return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}/${dbName}?${options}`;
};

module.exports = { buildMongoUri };
