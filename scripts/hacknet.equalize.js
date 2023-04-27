/** @param {NS} ns */
export async function main(ns) {
	let targetProperty = ns.args[0] || "level";
	let amountOfNodes = ns.hacknet.numNodes();
	let highestNodeLevels = {
		level: 0,
		ram: 0,
		cores: 0
	};
	let nodes = [];

	//Get the stats for each node
	for (let i = 0; i < amountOfNodes; i++) {
		nodes.push(ns.hacknet.getNodeStats(i));
	}

	highestNodeLevels = getHighestNodeLevels(nodes);

	//Equalize levels
	for (let i = 0; i < amountOfNodes; i++) {
		let target = nodes[i];

		while(isNotEqualized(ns, target, highestNodeLevels, targetProperty)){
			if(ns.getPlayer().money > getUpgradeCost(ns, targetProperty, i)){
				upgradeNode(ns, targetProperty, i);
				target = ns.hacknet.getNodeStats(i);
			} else {
				await ns.sleep(5000);
			}
		}
	}
}

function isNotEqualized(ns, target, highestNodeLevels, targetProperty) {
	if(targetProperty == "level"){
		return target.level < highestNodeLevels.level; 
	} else if (targetProperty == "ram") {
		return target.ram < highestNodeLevels.ram;
	} else {
		return target.cores < highestNodeLevels.cores;
	}
}

function getUpgradeCost(ns, targetProperty, nodeIndex){
	if(targetProperty == "level"){
		return ns.hacknet.getLevelUpgradeCost(nodeIndex, 1);
	} else if (targetProperty == "ram") {
		return ns.hacknet.getRamUpgradeCost(nodeIndex, 1);
	} else {
		return ns.hacknet.getCoreUpgradeCost(nodeIndex, 1);
	}
}

/** @param {NS} ns */
function upgradeNode(ns, targetProperty, nodeIndex) {
	if(targetProperty == "level"){
		ns.hacknet.upgradeLevel(nodeIndex, 1);
	} else if (targetProperty == "ram") {
		ns.hacknet.upgradeRam(nodeIndex, 1);
	} else {
		ns.hacknet.upgradeCore(nodeIndex, 1);
	}
}

function getHighestNodeLevels(nodes){
	let highestNodeLevels = {
		level: 0,
		ram: 0,
		cores: 0
	};

	for (let i = 0; i < nodes.length; i++) {
		let target = nodes[i];
		if (target.level > highestNodeLevels.level) {
			highestNodeLevels.level = target.level;
		}

		if (target.ram > highestNodeLevels.ram) {
			highestNodeLevels.ram = target.ram;
		}
		
		if (target.cores > highestNodeLevels.cores) {
			highestNodeLevels.cores = target.cores;
		}
	}

	return highestNodeLevels;
}