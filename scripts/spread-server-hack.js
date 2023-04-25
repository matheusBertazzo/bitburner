/** @param {NS} ns */
export async function main(ns) {
	let servers = ns.read("server-info.db.txt");
	let script = "early-hack-template.js";
	servers = JSON.parse(servers);

	ns.print("Servers catalogados: " + servers.length);

	let hackableServerList = getHackableServerNameList(ns, servers);

	ns.print("Servers available to hack: " + hackableServerList);

	let myServers = ns.getPurchasedServers();

	let i = 0;
	for (let myServer of myServers) {
		ns.print("The Server: " + myServer + " | Will hack: " + hackableServerList[i]);
		let target = hackableServerList[i];
		
		ns.killall(myServer);
		ns.scp(script, myServer);
		ns.exec(script, myServer, getMaxThreads(ns, myServer, script), target);

		i++;
		if (hackableServerList.length == i) {
			i = 0;
		}
	}
}

function getHackableServerNameList(ns, allServers) {
	let hackableServers = [];
	let myHackLevel = ns.getHackingLevel;

	for (let server of allServers) {
		if (myHackLevel <= server.requiredHackingSkill) {
			continue;
		}
		if (server.moneyMax == 0) {
			continue;
		}
		if (server.hasAdminRights == false) {
			continue;
		}

		hackableServers.push(server.hostname);
	}

	return hackableServers;
}

function getMaxThreads(ns, server, script) {
	var serverMaxRam = ns.getServerMaxRam(server);
	var scriptRam = ns.getScriptRam(script);
	return Math.trunc(serverMaxRam / scriptRam);
}