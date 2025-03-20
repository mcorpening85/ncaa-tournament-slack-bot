# NCAA Tournament Slack Bot

A Slack bot that posts NCAA tournament score updates as games complete.

## Features

- Automatically posts updates when games finish
- Alerts for close games (configurable threshold)
- Customizable update frequency
- Rich formatting with team scores and game status
- Easy deployment options

## Prerequisites

- Node.js (v14+)
- Slack workspace with permission to add apps
- Sports data API access (examples: SportRadar, ESPN, SportsData.io)

## Setup

### 1. Clone this repository

```bash
git clone https://github.com/mcorpening85/ncaa-tournament-slack-bot.git
cd ncaa-tournament-slack-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and click "Create New App"
2. Choose "From scratch" and provide a name (e.g., "NCAA Tournament Updates")
3. Select your workspace

### 4. Configure the Slack App

1. Go to "OAuth & Permissions" in the sidebar
2. Under "Scopes," add these Bot Token Scopes:
   - `chat:write`
   - `chat:write.public`
3. Click "Install to Workspace" and authorize the app
4. Copy the "Bot User OAuth Token" (starts with `xoxb-`)

### 5. Get the Slack Channel ID

1. In Slack, right-click on the channel you want to post updates to
2. Select "Copy link"
3. The channel ID is the part after the last `/` in the URL (e.g., `C12345678`)

### 6. Get a Sports API Key

This example uses [SportsData.io](https://sportsdata.io/), but you can adapt it to any sports API:

1. Sign up for an account
2. Subscribe to their NCAA Basketball API (they offer free tiers for development)
3. Get your API key from your account dashboard

### 7. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your credentials:
   ```
   SLACK_TOKEN=xoxb-your-slack-bot-token
   SLACK_CHANNEL_ID=C12345678
   SPORTS_API_KEY=your-api-key-here
   UPDATE_FREQUENCY=5
   NOTIFICATION_THRESHOLD=5
   TIMEZONE=America/New_York
   ```

## Running the Bot

### Local Development

```bash
npm run dev
```

### Production Deployment

#### Option 1: Host on a server

```bash
npm start
```

#### Option 2: Deploy to Heroku

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login and create an app:
   ```bash
   heroku login
   heroku create
   ```
3. Configure environment variables:
   ```bash
   heroku config:set SLACK_TOKEN=xoxb-your-token
   heroku config:set SLACK_CHANNEL_ID=C12345678
   heroku config:set SPORTS_API_KEY=your-api-key
   heroku config:set UPDATE_FREQUENCY=5
   heroku config:set NOTIFICATION_THRESHOLD=5
   heroku config:set TIMEZONE=America/New_York
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

#### Option 3: Deploy to Vercel or similar platforms

Follow their standard Node.js deployment procedures and set environment variables in their dashboard.

## Customization

### Change Update Frequency

Edit the `UPDATE_FREQUENCY` value in the `.env` file (in minutes).

### Adjust Close Game Notification Threshold

Edit the `NOTIFICATION_THRESHOLD` value in the `.env` file (in points).

### Modify Message Format

Edit the `formatGameMessage` function in `index.js` to change the appearance of Slack messages.

## License

MIT
