/** @param {NS} ns */
export async function main(ns) {
	let amountOfNodes = ns.hacknet.numNodes();
	let higherLevelNodeValue = 0;
	let higherLevelNodeIndex = 0;
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
			higherLevelNodeIndex = i;
		}
	}

	//Equalize levels
	for (let i = 0; i < amountOfNodes; i++) {
		let target = nodes[i];
		equalizeLevels(ns, i, target.level, higherLevelNodeValue);
	}

	let lastUpgradedNodeIndex = 0;

	while (true) {
		while (ns.getPlayer().money > ns.hacknet.getLevelUpgradeCost(lastUpgradedNodeIndex, 1)) {
			ns.hacknet.upgradeLevel(lastUpgradedNodeIndex, 1);
			lastUpgradedNodeIndex++;

			if (lastUpgradedNodeIndex >= amountOfNodes) {
				lastUpgradedNodeIndex = 0;
			}
		}
		
		await ns.sleep(5000);
	}
}

function equalizeLevels(ns, targetNodeIndex, targetNodeLevel, levelToEqualize) {
	if (targetNodeLevel < levelToEqualize) {
		let levelsToUpgrade = levelToEqualize - targetNodeLevel;
		ns.hacknet.upgradeLevel(targetNodeIndex, levelsToUpgrade);
	}
}