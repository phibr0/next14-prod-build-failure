import { parse } from 'json2csv';

const results = [];

let i = 1;
while (true) {
  const res = await fetch(
    `https://api.github.com/repos/vercel/next.js/releases?per_page=100&page=${i++}`
  );
  const releases = await res.json();

  for (const release of releases) {
    Bun.spawnSync(['pnpm', 'i', `next@${release.tag_name.slice(1)}`]);

    const { exitCode } = Bun.spawnSync(['pnpm', 'build']);
    if (exitCode === 0) {
      console.log(`\x1b[32mWorking in ${release.tag_name}\x1b[0m`);
      results.push({
        release: release.tag_name,
        status: 'success',
      });
    } else {
      console.log(`\x1b[31mFailing in ${release.tag_name}\x1b[0m`);
      results.push({
        release: release.tag_name,
        status: 'fail',
      });
    }

    const csv = parse(results, {});
    await Bun.write('results.csv', csv);
  }
}
