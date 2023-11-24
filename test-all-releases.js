let i = 1;
while (true) {
  const res = await fetch(
    `https://api.github.com/repos/vercel/next.js/releases?per_page=100&page=${i++}`
  );
  const releases = await res.json();

  for (const release of releases) {
    const install = Bun.spawnSync([
      'pnpm',
      'i',
      `next@${release.tag_name.slice(1)}`,
    ]);
    await install.exited;

    const build = Bun.spawnSync(['pnpm', 'build']);
    await build.exited;
    if (build.exitCode === 0) {
      console.log(`\x1b[32mWorking in ${release.tag_name}\x1b[0m`);
    } else {
      console.log(`\x1b[31mFailing in ${release.tag_name}\x1b[0m`);
    }
  }
}
