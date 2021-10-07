const { Worker } = require('bullmq')
const { startTest, deleteTest } = require('../../lib/kubernetes')

module.exports = (connection) => new Worker('tls', async (job) => {
  const {id, data: { url }} = job
  try {
    const pod = await startTest('netnod/check-tls', `tls-${id}`, id, { url })
    await pod.done()
    const logs = await pod.log()
    job.log(logs)
    // TODO: parse log to json
    return logs
  } finally {
    deleteTest(`tls-${id}`)
  }
}, {connection})