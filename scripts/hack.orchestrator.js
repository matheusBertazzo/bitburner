/** @param {NS} ns */
export async function main(ns) {
	var targetScript = ns.args[0] || "self-hack.js";
	var targetMachine = ns.args[1] || 'self';
	var possibleHosts = JSON.parse(ns.read('hosts-info.db.txt'));
	var scriptRAM = ns.getScriptRam(targetScript);

	for (var i = 0; i < possibleHosts.length; i++) {
		var target = possibleHosts[i];

		if (target.hasAdminRights) {

			if (target.maxRam == 0) { continue; }

			var maxPossibleThreads = Math.floor(target.maxRam / scriptRAM);

			ns.print('Executing ' + targetScript + ' targetting ' + targetMachine + ' on host ' + target.hostname + ' using ' + maxPossibleThreads + ' threads');

			ns.killall(target.hostname);
			ns.exec(targetScript, target.hostname, maxPossibleThreads, targetMachine);
		}
	}
}