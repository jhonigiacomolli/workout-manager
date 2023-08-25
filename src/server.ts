import 'dotenv/config'
import './configurations/module-alias'

import { setupApp } from './configurations/setup-app'

const app = setupApp()

app.listen(3008, () => { console.log('Server is running on https://localhost:3008') })
