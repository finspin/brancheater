module.exports = async (context) => {
  const config = await context.config('brancheater-config.yml', { exclude: [], deleteUnmerged: false })
  const owner = context.payload.repository.owner.login
  const repo = context.payload.repository.name
  const branch = context.payload.pull_request.head.ref
  const merged = context.payload.pull_request.merged

  if (!config) {
    context.log.info(`Branch ${branch} in ${owner}/${repo} repo would have been deleted (dry-run)`)
    return
  }

  if (!config.deleteUnmerged && !merged) {
    context.log.info(`Not deleting branch ${branch} in ${owner}/${repo} because it hasn't been merged`)
    return
  }

  if (config.exclude.includes(branch)) {
    context.log.info(`Not deleting branch ${branch} in ${owner}/${repo} because it's been excluded`)
    return
  }

  deleteBranch(context, owner, repo, branch)

  async function deleteBranch (context, owner, repo, branch) {
    const ref = `heads/${branch}`

    try {
      await context.github.git.deleteRef({
        owner,
        repo,
        ref
      })
      context.log.info(`Successfully deleted branch ${branch} in ${owner}/${repo}`)
    } catch (e) {
      context.log.warn(e, `Failed to delete branch ${branch} in ${owner}/${repo}`)
    }
  }
}
