/** @param {NS} ns */
export async function main(ns) {
	var ram = ns.args[0] || 8;
	var scriptName = ns.args[1] || 'hack-target.js';
	var scriptTarget = ns.args[2] || 'n00dles';
	var scriptRAM =  ns.getScriptRam(scriptName);

	var serverCount = 0;

	// Continuously try to purchase servers until we've reached the maximum amount of servers
	while (serverCount < ns.getPurchasedServerLimit()) {    
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {        
			var hostname = ns.purchaseServer("pserv-" + serverCount, ram);
			var maxPossibleThreads = Math.floor(ram/scriptRAM);

			ns.scp(scriptName, hostname);
			ns.exec(scriptName, hostname, maxPossibleThreads, scriptTarget);
			serverCount++;
		}
	}
}