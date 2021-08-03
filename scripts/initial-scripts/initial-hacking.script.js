while(true){
    var hackChanceThreshold = 0.30;
    var possibleHosts = scan("home");
    var targetHosts = [];
    
    for(var i = 0; i < possibleHosts.length; i++){
        var target = possibleHosts[i];
        var targetHackChance = hackChance(target);
        
        if(targetHackChance > hackChanceThreshold){
            targetHosts.push(target);
        }
    }
    
    //print("Eligible for hacking:");
    
    for(var i = 0; i < targetHosts.length; i++){
        var target = targetHosts[i];
        print('Conecting to target: ' + target);
        
        if(!hasRootAccess(target)){
            nuke(target);
        }
        
        var securityThreshold = getServerMinSecurityLevel(target) + 5;
        var moneyThreshold = getServerMaxMoney(target) * 0.75;
        
        if (getServerSecurityLevel(target) > securityThreshold) {
            // If the server's security level is above our threshold, weaken it
            weaken(target);
        } else if (getServerMoneyAvailable(target) < moneyThreshold) {
            // If the server's money is less than our threshold, grow it
            grow(target);
        } else {
            // Otherwise, hack it
            hack(target);
        }
    }
}