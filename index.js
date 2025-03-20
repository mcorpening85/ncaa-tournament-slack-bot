require('dotenv').config();
const axios = require('axios');
const { WebClient } = require('@slack/web-api');
const cron = require('node-cron');

// Initialize Slack client
const slack = new WebClient(process.env.SLACK_TOKEN);
const channelId = process.env.SLACK_CHANNEL_ID;

// Configuration
const UPDATE_FREQUENCY = process.env.UPDATE_FREQUENCY || 5; // minutes
const NOTIFICATION_THRESHOLD = process.env.NOTIFICATION_THRESHOLD || 5; // points

// Store previous game states to track changes
let previousGameStates = {};

// Function to fetch NCAA tournament games
async function fetchNcaaGames() {
  try {
    // This would use a real sports API in production
    // For example: SportRadar, ESPN API, or another sports data provider
    // Example URL: https://api.sportsdata.io/v3/cbb/scores/json/Tournament/2025
    
    const response = await axios.get(`https://api.sportsdata.io/v3/cbb/scores/json/Tournament/2025`, {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.SPORTS_API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching NCAA games:', error.message);
    return [];
  }
}

// Format the game message for Slack
function formatGameMessage(game) {
  const isClose = Math.abs(game.AwayTeamScore - game.HomeTeamScore) <= NOTIFICATION_THRESHOLD;
  const closeGameAlert = isClose ? " :rotating_light: *CLOSE GAME ALERT!* :rotating_light:" : "";
  
  let statusEmoji = '';
  if (game.Status === 'Final') {
    statusEmoji = ':checkered_flag:';
  } else if (game.Status === 'InProgress') {
    statusEmoji = ':basketball:';
  } else {
    statusEmoji = ':soon:';
  }
  
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${statusEmoji} ${game.AwayTeam} vs ${game.HomeTeam}${closeGameAlert}`
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*${game.AwayTeam}*\n${game.AwayTeamScore}`
          },
          {
            type: "mrkdwn",
            text: `*${game.HomeTeam}*\n${game.HomeTeamScore}`
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Status:* ${game.Status}${game.Period ? ` | *Period:* ${game.Period}` : ''}${game.TimeRemainingMinutes ? ` | *Time:* ${game.TimeRemainingMinutes}:${game.TimeRemainingSeconds.toString().padStart(2, '0')}` : ''} | *Round:* ${game.Round}`
          }
        ]
      },
      {
        type: "divider"
      }
    ]
  };
}

// Send a game update to Slack
async function sendSlackUpdate(game) {
  try {
    const message = formatGameMessage(game);
    await slack.chat.postMessage({
      channel: channelId,
      blocks: message.blocks,
      text: `${game.Status}: ${game.AwayTeam} ${game.AwayTeamScore} - ${game.HomeTeamScore} ${game.HomeTeam}`
    });
    console.log(`Posted update for ${game.AwayTeam} vs ${game.HomeTeam}`);
  } catch (error) {
    console.error('Error sending Slack message:', error.message);
  }
}

// Check for game updates and send notifications
async function checkForUpdates() {
  console.log('Checking for NCAA tournament game updates...');
  
  try {
    const games = await fetchNcaaGames();
    
    for (const game of games) {
      const gameId = game.GameID;
      const prevGame = previousGameStates[gameId];
      
      // New completed game
      if (game.Status === 'Final' && (!prevGame || prevGame.Status !== 'Final')) {
        await sendSlackUpdate(game);
      }
      // Close game that's changed
      else if (game.Status === 'InProgress' && 
               Math.abs(game.AwayTeamScore - game.HomeTeamScore) <= NOTIFICATION_THRESHOLD &&
               (!prevGame || 
                prevGame.AwayTeamScore !== game.AwayTeamScore || 
                prevGame.HomeTeamScore !== game.HomeTeamScore)) {
        await sendSlackUpdate(game);
      }
      
      // Update previous state
      previousGameStates[gameId] = game;
    }
  } catch (error) {
    console.error('Error checking for updates:', error.message);
  }
}

// Set up the scheduled task to check for updates
function scheduleUpdates() {
  // Schedule to run every X minutes
  cron.schedule(`*/${UPDATE_FREQUENCY} * * * *`, checkForUpdates);
  console.log(`Bot scheduled to check for updates every ${UPDATE_FREQUENCY} minutes`);
}

// Initialize the bot
async function initialize() {
  try {
    // Send startup message
    await slack.chat.postMessage({
      channel: channelId,
      text: ':basketball: NCAA Tournament Score Bot is now active! I will post updates as games complete. :basketball:'
    });
    
    // Run an initial check
    await checkForUpdates();
    
    // Schedule future updates
    scheduleUpdates();
  } catch (error) {
    console.error('Error initializing bot:', error.message);
  }
}

// Start the bot
initialize();
