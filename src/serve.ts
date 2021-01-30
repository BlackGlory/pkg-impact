import handler = require('serve-handler')
import micro, { send } from 'micro'
import * as path from 'path'
import * as Serialization from './serialization'

export function serve(data: PackageInfo[]) {
  const server = micro((req, res) => {
    if (req.url === '/data') return send(res, 200, Serialization.stringify(data))

    return handler(req, res, { public: path.join(__dirname, '../dist') })
  })

  server.listen(8080, () => {
    console.log('http://localhost:8080')
  })
}
