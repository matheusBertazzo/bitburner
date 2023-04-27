var discoveredHosts = ['home'];

/** @param {NS} ns */
export async function main(ns) {
	var availableHosts = ns.scan('home');
	
	for (var i = 0; i < availableHosts.length; i++) {
		var current = availableHosts[i];
		discoveredHosts.push(current);

		depthFirstSearch(ns, current);

		ns.print("Discovered hosts so far (" + (i + 1) + "/" + availableHosts.length + " root nodes done): " + discoveredHosts);
	}

	discoveredHosts.splice(0, 1); //Need to remove home from the discovery results
	discoveredHosts = [...new Set(discoveredHosts)]
	ns.write('host-names.db.txt', JSON.stringify(discoveredHosts), 'w');
}

function depthFirstSearch(ns, rootNode) {
	var hostsToExplore = [rootNode];

	while (hostsToExplore.length > 0) {
		var host = hostsToExplore.pop();
		var scanResults = ns.scan(host);

		

		scanResults = removeAlreadyDiscovered(scanResults);

		ns.print("Scan results (unexplored only) for " + host + ": " + scanResults);

		hostsToExplore = hostsToExplore.concat(scanResults);
		discoveredHosts = discoveredHosts.concat(scanResults);

		ns.print("Hosts to explore: " + hostsToExplore);
	}
}

function removeAlreadyDiscovered(scanResults) {
	for (var i = 0; i < scanResults.length; i++) {
		var result = scanResults[i];
		if (discoveredHosts.indexOf(result) > -1) {
			scanResults.splice(i, 1);
		}
	}

	return scanResults;
}