const { Probot } = require('probot')
const brancheater = require('../index')
const deleteBranch = require('../lib/delete-branch')
const prOpenedWebhookPayload = require('./fixtures/pull-request.opened')
const prClosedWebhookPayload = require('./fixtures/pull-request.closed')

jest.mock('../lib/delete-branch', () => jest.fn())

describe('brancheater', () => {
  let app
  let github
  let probot

  beforeEach(async () => {
    probot = new Probot({})
    app = probot.load(brancheater)
    app.auth = () => Promise.resolve(github)
  })

  describe('opened', () => {
    beforeEach(async () => {
      const name = 'pull_request.opened'
      const payload = prOpenedWebhookPayload
      await app.receive({ name, payload })
    })

    it('should not call deleteBranch module', async () => {
      expect(deleteBranch).not.toHaveBeenCalled()
    })
  })

  describe('closed', () => {
    beforeEach(async () => {
      const name = 'pull_request.closed'
      const payload = prClosedWebhookPayload
      await app.receive({ name, payload })
    })

    it('should call deleteBranch module', async () => {
      expect(deleteBranch).toHaveBeenCalled()
    })
  })
})
