/** @param {NS} ns */
export async function main(ns) {
	let amountOfNodes = ns.hacknet.numNodes();
	let higherLevelNodeValue = 0;
	let nodes = [];

	//Get the stats for each node
	for (let i = 0; i < amountOfNodes; i++) {
		nodes.push(ns.hacknet.getNodeStats(i));
	}

	//Get the highest level node information
	for (let i = 0; i < amountOfNodes; i++) {
		let target = nodes[i];
		if (target.level > higherLevelNodeValue) {
			higherLevelNodeValue = target.level;
		}
	}

	//Equalize levels
	for (let i = 0; i < amountOfNodes; i++) {
		let target = nodes[i];

		while(target.level < higherLevelNodeValue){
			if(ns.getPlayer().money > ns.hacknet.getLevelUpgradeCost(i, 1)){
				ns.hacknet.upgradeLevel(i, 1);
				target.level++;
			} else {
				await ns.sleep(5000);
			}
		}
	}
}