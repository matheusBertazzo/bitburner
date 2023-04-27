/** @param {NS} ns */
export async function main(ns) {
	var reservedServers = ns.getPurchasedServers().slice(0, 14);
	ns.run('discovery.run-dfs.js');
	ns.run('discovery.enrich.js');

	for(let server of reservedServers) {
		ns.scp('hosts-info.db.txt', server);
		ns.scp('hack.ramp-up.service.js', server);
		ns.killall(server);

		ns.exec('hack.ramp-up.service.js', server, getMaxThreads(ns, server, 'hack.ramp-up.service.js'));
	}
}

function getMaxThreads(ns, server, script) {
	var serverMaxRam = ns.getServerMaxRam(server);
	var scriptRam = ns.getScriptRam(script);
	return Math.trunc(serverMaxRam / scriptRam);
}