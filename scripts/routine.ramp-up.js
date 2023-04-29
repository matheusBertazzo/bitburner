/** @param {NS} ns */
export async function main(ns) {
	const RAMP_UP_SERVICE_SCRIPT = 'hack.ramp-up.service.js';
	var reservedServers = ns.getPurchasedServers().slice(0, 14);
	ns.run('discovery.run-dfs.js');
	ns.run('discovery.enrich.js');

	for(let server of reservedServers) {
		ns.scp('hosts-info.db.txt', server);
		ns.scp(RAMP_UP_SERVICE_SCRIPT, server);
		ns.killall(server);

		ns.exec(RAMP_UP_SERVICE_SCRIPT, server, getMaxThreads(ns, server, RAMP_UP_SERVICE_SCRIPT));
	}
}

function getMaxThreads(ns, server, script) {
	var serverMaxRam = ns.getServerMaxRam(server);
	var scriptRam = ns.getScriptRam(script);
	return Math.trunc(serverMaxRam / scriptRam);
}