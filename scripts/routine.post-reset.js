/** @param {NS} ns */
export async function main(ns) {
	ns.killall();
	ns.run('hacknet.purchase-nodes.js');
	ns.run('hacknet.service.js');
	ns.rm('ramped-up-hosts.db.txt');	
	ns.run('discovery.run-dfs.js');	
	ns.run('discovery.enrich.js');	
	ns.run('hack.rootkit.js');	
	ns.run('discovery.enrich.js');	
	ns.run('hack.infect.js', 1, 'hack.target.js');
	ns.run('hack.infect.js', 1, 'hack.ramp-up.target.js');
	
	var earlyGameHosts = ['n00dles','foodnstuff','sigma-cosmetics','joesguns','hong-fang-tea']

	earlyGameHosts.forEach(host => {
		ns.run('hack.ramp-up.target.js', 2000, host);
		ns.run('hack.target.js', 10, host);
	});

	ns.run('hack.ramp-up.service.js', 20000);
}