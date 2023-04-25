/** @param {NS} ns */
export async function main(ns) {
	var targetScript = ns.args[0] || "self-hack.js";
	var possibleHosts = JSON.parse(ns.read('hosts-info.db.txt'));

	for (var i = 0; i < possibleHosts.length; i++) {
		var target = possibleHosts[i];

		if (target.hasAdminRights) {
			ns.print('Infecting ' + target.hostname + ' with ' + targetScript);
			ns.scp(targetScript, target.hostname);
		}
	}
}