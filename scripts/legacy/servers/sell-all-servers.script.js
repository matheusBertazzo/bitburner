var purchasedServers = getPurchasedServers();

for(var i = 0; i < purchasedServers.length; i++){
    var host = purchasedServers[i];
    
    print("Deleting server: " + host);
    killall(host);
    deleteServer(host);
}