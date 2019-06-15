const deleteBranch = require('./lib/delete-branch')

module.exports = app => {
  app.on('pull_request.closed', deleteBranch)
}
