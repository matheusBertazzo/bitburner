var availableHosts = scan('home');
var discoveredHosts = ['home'];

for (var i = 0; i < availableHosts.length; i++) {
  var current = availableHosts[i];
  discoveredHosts.push(current);

  depthFirstSearch(current);

  print("Discovered hosts so far (" + (i + 1) + "/" + availableHosts.length + " root nodes done): " + discoveredHosts);
}

discoveredHosts.splice(0, 1); //Need to remove home from the discovery results
write('host-names.db', discoveredHosts, 'w');

function depthFirstSearch(rootNode) {
  var hostsToExplore = [rootNode];

  while (hostsToExplore.length > 0) {
    var host = hostsToExplore.pop();
    var scanResults = scan(host);

    scanResults = removeAlreadyDiscovered(scanResults);

    print("Scan results (unexplored only) for " + host + ": " + scanResults);

    hostsToExplore = hostsToExplore.concat(scanResults);
    discoveredHosts = discoveredHosts.concat(scanResults);

    print("Hosts to explore: " + hostsToExplore);
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
