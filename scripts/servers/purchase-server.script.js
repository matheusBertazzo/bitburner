var ram = args[0] || 8;
var scriptTarget = args[1] || 'n00dles';
var scriptName = 'hack-target.script';
var scriptRAM =  getScriptRam(scriptName);

var serverCount = 0;

// Continuously try to purchase servers until we've reached the maximum amount of servers
while (serverCount < getPurchasedServerLimit()) {    
    if (getServerMoneyAvailable("home") > getPurchasedServerCost(ram)) {        
        var hostname = purchaseServer("pserv-" + serverCount, ram);
        var maxPossibleThreads = Math.floor(ram/scriptRAM);

        scp(script, hostname);
        exec(script, hostname, maxPossibleThreads, scriptTarget);
        serverCount++;
    }
}