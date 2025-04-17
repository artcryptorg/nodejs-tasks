# Telegram Shop Bot

A Telegram bot for displaying a product catalog with variants (size, color, price). Built with Node.js, Telegraf, Prisma, and SQLite.

---

## Environment Variables

Create a `.env` file in the project root with the following values:

```env
# Path to local SQLite DB
DATABASE_URL="file:./dev.db"

# Telegram bot token from @BotFather
TOKEN="your-telegram-bot-token"
```

### Variables used:

| Variable      | Description                                         |
|---------------|-----------------------------------------------------|
| `DATABASE_URL`| Path or connection string for Prisma                |
| `TOKEN`       | Telegram bot token (from [@BotFather](https://t.me/BotFather)) |

---

## Installation and Run the Bot

Start the bot with:

```bash
npm ci start && npm start
```

---

##  Bot Commands

| Command     | Description                                      |
|-------------|--------------------------------------------------|
| `/start`    | Greets the user                                  |
| 

