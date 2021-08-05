var target = args[0] || 'n00dles';
var securityThreshold = getServerMinSecurityLevel(target) + 2;
var moneyThreshold = getServerMaxMoney(target) * 0.90;

while (true) {
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