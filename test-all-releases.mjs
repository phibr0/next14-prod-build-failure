import { parse } from 'json2csv';
import { writeFileSync } from 'fs';
import { spawnSync } from 'child_process';
import axios from 'axios';

const results = [];

const fetchReleases = async (page = 1) => {
  const res = await axios.get(
    `https://api.github.com/repos/vercel/next.js/releases?per_page=100&page=${page}`
  );
  return res.data;
};

let i = 1;
while (true) {
  const releases = await fetchReleases(i++);

  for (const release of releases) {
    spawnSync('pnpm', ['i', `next@${release.tag_name.slice(1)}`]);

    spawnSync('rm', ['-rdf', '.next/']);
    const webpack = spawnSync('pnpm', ['build']);
    console.log(
      `${release.tag_name} Webpack - ${
        webpack.status === 0 ? '\x1b[32msuccess\x1b[0m' : '\x1b[31mfail\x1b[0m'
      }`
    );

    spawnSync('rm', ['-rdf', '.next/']);
    const webpackNoMinify = spawnSync('pnpm', ['build-nm']);
    console.log(
      `${release.tag_name} Webpack (not minified) - ${
        webpackNoMinify.status === 0
          ? '\x1b[32msuccess\x1b[0m'
          : '\x1b[31mfail\x1b[0m'
      }`
    );

    spawnSync('rm', ['-rdf', '.next/']);
    writeFileSync('.babelrc', '{ "presets": ["next/babel"] }');
    const babel = spawnSync('pnpm', ['build-nm']);
    spawnSync('rm', ['.babelrc']);
    console.log(
      `${release.tag_name} Webpack (Babel) - ${
        webpackNoMinify.status === 0
          ? '\x1b[32msuccess\x1b[0m'
          : '\x1b[31mfail\x1b[0m'
      }`
    );

    spawnSync('rm', ['-rdf', '.next/']);
    const turbopack = spawnSync('pnpm', ['build-tp']);
    console.log(
      `${release.tag_name} Turbopack - ${
        turbopack.status === 0
          ? '\x1b[32msuccess\x1b[0m'
          : '\x1b[31mfail\x1b[0m'
      }`
    );

    results.push({
      release: release.tag_name,

      Webpack: webpack.status === 0 ? 'success' : 'fail',
      'Webpack (not minified)':
        webpackNoMinify.status === 0 ? 'success' : 'fail',
      'Webpack (Babel)': babel.status === 0 ? 'success' : 'fail',
      Turbopack:
        turbopack.status === 0 ? 'success' : 'fail (or not implemented)',
    });

    writeFileSync('results.csv', parse(results, {}));
  }

  if (i === 5) break;
}
