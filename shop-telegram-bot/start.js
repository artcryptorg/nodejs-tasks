import 'dotenv/config'
import { execSync } from 'child_process'

function checkEnv(name) {
  const value = process.env[name]
  if (!value) {
    console.error(`ERROR: Missing ${name} in .env`)
    process.exit(1)
  }
  return value
}

console.log('Checking .env file...')
checkEnv('DATABASE_URL')
checkEnv('TOKEN')

try {
  console.log(' Running database migrations...')
  execSync('npx prisma migrate dev --name auto-init --skip-seed', { stdio: 'inherit' })

  console.log(' Seeding database...')
  execSync('npx prisma db seed', { stdio: 'inherit' })

  console.log(' Starting Telegram bot...')
  execSync('node index.js', { stdio: 'inherit' })

} catch (error) {
  console.error('ERROR: Something went wrong during start.')
  console.error(error.message)
  process.exit(1)
}
