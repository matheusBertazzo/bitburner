var hosts = read("host-names.db.txt").split(',');
var ONE_MILLION = 1000000;
var TWO_DECIMAL_PLACES = 2;

result = [];

for (var i = 0; i < hosts.length; i++) {
  var target = hosts[i];
  print('=========' + target + ' (' + calculateProgress(i) + '% done)' + '=========')
  result.push(createServerInfoObject(target));
}

write('hosts-info.db', JSON.stringify(result), 'w');

function calculateProgress(currentIndex) {
  return (((currentIndex + 1) / hosts.length) * 100).toFixed(TWO_DECIMAL_PLACES);
}

function createServerInfoObject(target) {
  return {
    hostName: target,
    hasRootAccess: hasRootAccess(target),
    hackChancePercentage: Math.floor(hackChance(target) * 100),
    maxMoneyInMillions: parseFloat((getServerMaxMoney(target) / ONE_MILLION).toFixed(TWO_DECIMAL_PLACES)),
    availableMoneyInMillions: parseFloat((getServerMoneyAvailable(target) / ONE_MILLION).toFixed(TWO_DECIMAL_PLACES)),
    numberOfPortsRequired: getServerNumPortsRequired(target),
    hackTimeInSeconds: parseFloat(getHackTime(target).toFixed(TWO_DECIMAL_PLACES)),
    growTimeInSeconds: parseFloat(getGrowTime(target).toFixed(TWO_DECIMAL_PLACES)),
    weakenTimeInSeconds: parseFloat(getWeakenTime(target).toFixed(TWO_DECIMAL_PLACES))
  };

}