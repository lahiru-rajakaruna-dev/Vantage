import {seed}      from 'drizzle-seed'
import * as schema from '../src/orm/drizzle/drizzle-sqlite/schema'
import {drizzle}   from 'drizzle-orm/libsql/node'

import 'dotenv/config';





async function main() {
  const result = await seed(drizzle(process.env.DB_URL!), schema).refine((fns) => {
    return {}
  })
  console.log(result)
}

main().then().catch()
