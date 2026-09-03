#!/usr/bin/env node
// One-click "Commit & Deploy": stage -> commit -> push.
// Vercel auto-deploys the `main` branch on every push.
// Usage:  npm run ship            (message defaults to "Site update")
//         npm run ship -- "My message"
import { execSync } from 'node:child_process'

function run(cmd) {
  console.log(`\n> ${cmd}`)
  return execSync(cmd, { stdio: 'inherit' })
}

function git(args) {
  return execSync(`git ${args}`, { encoding: 'utf8' }).toString().trim()
}

const msg = process.argv.slice(2).join(' ').trim() || 'Site update'

try {
  run('git add -A')

  const status = git('status --porcelain')
  if (status) {
    run(`git commit -m ${JSON.stringify(msg)}`)
    console.log(`\n✅ Committed: "${msg}"`)
  } else {
    console.log('\nNothing to commit — working tree is clean.')
  }

  run('git push')
  console.log('\n🚀 Pushed to GitHub. Vercel is auto-deploying the latest code.')
  console.log('   Live site: https://blackyardrepo.vercel.app')
} catch (e) {
  console.error('\n❌ Commit & deploy failed:', e.message)
  console.error('   Tip: check that git is set up and you are on the main branch.')
  process.exit(1)
}
