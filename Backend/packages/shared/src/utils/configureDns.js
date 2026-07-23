// Node's bundled c-ares resolver sometimes fails SRV/TXT lookups on Windows
// (querySrv ECONNREFUSED) even when the OS resolver works fine, because it
// doesn't reliably pick up nameservers behind certain VPN/virtual adapters.
// Pointing it at public resolvers directly sidesteps that. Must run before
// any mongodb+srv:// connection is attempted.
const dns = require("dns");

const configureDns = () => {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
};

module.exports = { configureDns };
