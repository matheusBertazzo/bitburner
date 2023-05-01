/** @param {NS} ns */
export async function main(ns) {
	var ram = ns.args[0] || 8;	
	var serverCount = 0;
	
	while (serverCount < ns.getPurchasedServerLimit()) {    
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {        
			ns.purchaseServer("pserv" , ram);			
			serverCount++;
		}

		await ns.sleep(1000);
	}
}