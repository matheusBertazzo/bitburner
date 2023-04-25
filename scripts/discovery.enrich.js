var TWO_DECIMAL_PLACES = 2;

/** @param {NS} ns */
export async function main(ns) {
	var hosts = JSON.parse(ns.read("host-names.db.txt"));	

	var result = [];

	for (var serverCount = 0; serverCount < hosts.length; serverCount++) {
		var target = hosts[serverCount];
		ns.print('=========' + target + ' (' + calculateProgress(serverCount, hosts) + '% done)' + '=========')
		result.push(ns.getServer(target));
	}
	
	ns.write('hosts-info.db.txt', JSON.stringify(result), 'w');

}

function calculateProgress(currentIndex, hosts) {
	return (((currentIndex + 1) / hosts.length) * 100).toFixed(TWO_DECIMAL_PLACES);
}