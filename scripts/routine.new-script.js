/** @param {NS} ns */
export async function main(ns) {
	ns.run('discovery.run-dfs.js');
	ns.run('discovery.enrich.js');
	ns.run('hack.rootkit.js');
	ns.run('discovery.enrich.js');
	ns.run('hack.infect.js', 1, 'hack.target.js');
	ns.kill('hack.orchestrator.service.js');
	ns.run('hack.orchestrator.service.js')
}