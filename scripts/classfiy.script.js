var HACK_CHANCE_WEIGHT = 9;
var MAX_MONEY_WEIGHT = 5;
var AVAILABLE_MONEY_WEIGHT = 10;
var hosts = JSON.parse(read('hosts-info.db.txt'));
var ellegibleToHack = [];
var result = [];

var maxMaximumMoney = 0;
var maxAvailableMoney = 0;

print('Finding ellegible hosts...')
for (var i = 0; i < hosts.length; i++) {
  printProgress(i, hosts.length);
  var host = hosts[i];

  if (host.hasRootAccess) {
    ellegibleToHack.push(host);
    maxMaximumMoney = Math.max(maxMaximumMoney, host.maxMoneyInMillions); 
    maxAvailableMoney = Math.max(maxAvailableMoney, host.availableMoneyInMillions);
  }
}

print('maxMoney: ' + maxMaximumMoney);
print('maxAvailableMoney: ' + maxAvailableMoney);

print('Classifying hosts...')
for (var i = 0; i < ellegibleToHack.length; i++) { 
  printProgress(i, ellegibleToHack.length);  
  var host = ellegibleToHack[i];
  
  var normalizedHackPercentage = (host.hackChancePercentage / 100);
  var normalizedMaxMoney = (host.maxMoneyInMillions / maxMaximumMoney);
  var normalizedAvailableMoney = (host.availableMoneyInMillions / maxAvailableMoney);

  host['score'] = 
    (
      normalizedHackPercentage * HACK_CHANCE_WEIGHT 
      + normalizedMaxMoney * MAX_MONEY_WEIGHT 
      + normalizedAvailableMoney * AVAILABLE_MONEY_WEIGHT
    )
    / (HACK_CHANCE_WEIGHT + MAX_MONEY_WEIGHT + AVAILABLE_MONEY_WEIGHT);

  print('Host: ' + host.hostName + ' - Score: ' + host.score);
  result.push(host);
}

write('hosts-info-classified.db', JSON.stringify(result), 'w');

function printProgress(current, total){
  var progress = (current/total * 100).toFixed(2);
  print('Progress: ' + progress + '%');
}