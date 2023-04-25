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

	//Buy as many nodes as possible and equalize them
	while (ns.getPlayer().money > ns.hacknet.getPurchaseNodeCost()) {
		let newNodeIndex = ns.hacknet.purchaseNode();
		amountOfNodes++;
		let node = ns.hacknet.getNodeStats(newNodeIndex);
		equalizeLevels(ns, newNodeIndex, node.level, higherLevelNodeValue);
	}

	//Buy as many levels as possible with the remaining money
	while(ns.getPlayer().money > ns.hacknet.getLevelUpgradeCost(higherLevelNodeIndex, 1)) {
		for(let i = 0; i < amountOfNodes; i++) {
			ns.hacknet.upgradeLevel(i, 1);
		}
	}
}

function equalizeLevels(ns, targetNodeIndex, targetNodeLevel, levelToEqualize) {
	if (targetNodeLevel < levelToEqualize) {
		let levelsToUpgrade = levelToEqualize - targetNodeLevel;
		ns.hacknet.upgradeLevel(targetNodeIndex, levelsToUpgrade);
	}
}