# NCAA Tournament Slack Bot

A Slack bot that posts NCAA tournament score updates as games complete.

## Features

- Automatically posts updates when games finish
- Alerts for close games (configurable threshold)
- Customizable update frequency
- Rich formatting with team scores and game status
- Easy deployment options

## Prerequisites

- Node.js (v14+) or Docker
- Slack workspace with permission to add apps
- Sports data API access (examples: SportRadar, ESPN, SportsData.io)

## Setup

### 1. Clone this repository

```bash
git clone https://github.com/mcorpening85/ncaa-tournament-slack-bot.git
cd ncaa-tournament-slack-bot
```

### 2. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and click "Create New App"
2. Choose "From scratch" and provide a name (e.g., "NCAA Tournament Updates")
3. Select your workspace

### 3. Configure the Slack App

1. Go to "OAuth & Permissions" in the sidebar
2. Under "Scopes," add these Bot Token Scopes:
   - `chat:write`
   - `chat:write.public`
3. Click "Install to Workspace" and authorize the app
4. Copy the "Bot User OAuth Token" (starts with `xoxb-`)

### 4. Get the Slack Channel ID

1. In Slack, right-click on the channel you want to post updates to
2. Select "Copy link"
3. The channel ID is the part after the last `/` in the URL (e.g., `C12345678`)

### 5. Get a Sports API Key

This example uses [SportsData.io](https://sportsdata.io/), but you can adapt it to any sports API:

1. Sign up for an account
2. Subscribe to their NCAA Basketball API (they offer free tiers for development)
3. Get your API key from your account dashboard

### 6. Configure Environment Variables

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

### Option 1: Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Option 2: Docker

```bash
# Build and start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

Alternatively, you can build and run the Docker container manually:

```bash
# Build the Docker image
docker build -t ncaa-tournament-bot .

# Run the container
docker run -d --name ncaa-bot --env-file .env ncaa-tournament-bot

# View logs
docker logs -f ncaa-bot
```

### Option 3: Server Deployment

```bash
# Install dependencies
npm install

# Start the production server
npm start
```

### Option 4: Deploy to Heroku

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

### Option 5: Deploy to Vercel or similar platforms

Follow their standard Node.js deployment procedures and set environment variables in their dashboard.

## Customization

### Change Update Frequency

Edit the `UPDATE_FREQUENCY` value in the `.env` file (in minutes).

### Adjust Close Game Notification Threshold

Edit the `NOTIFICATION_THRESHOLD` value in the `.env` file (in points).

### Modify Message Format

Edit the message formatters in the `util/formatters.js` file to change the appearance of Slack messages.

## Data Storage

When running with Docker, the bot creates a volume mount for the `/app/data` directory, which can be used for persistent storage of game state data.

## License

MIT
