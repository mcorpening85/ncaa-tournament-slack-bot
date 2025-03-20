/**
 * Utility functions to format messages for Slack
 */

// Get emoji based on game status
function getStatusEmoji(status) {
  switch (status.toLowerCase()) {
    case 'final':
      return ':checkered_flag:';
    case 'inprogress':
    case 'in progress':
      return ':basketball:';
    case 'scheduled':
      return ':calendar:';
    case 'postponed':
      return ':no_entry_sign:';
    case 'canceled':
      return ':x:';
    default:
      return ':grey_question:';
  }
}

// Get emoji for team based on seed
function getSeedEmoji(seed) {
  if (seed <= 4) return ':fire:'; // Top seeds
  if (seed <= 8) return ':muscle:'; // Strong teams
  if (seed >= 13) return ':rabbit2:'; // Potential Cinderellas
  return '';
}

// Format the final score message
function formatFinalGameMessage(game) {
  const upset = game.AwayTeamSeed > game.HomeTeamSeed && game.AwayTeamScore > game.HomeTeamScore ||
               game.HomeTeamSeed > game.AwayTeamSeed && game.HomeTeamScore > game.AwayTeamScore;
  
  const upsetAlert = upset ? " :rotating_light: *UPSET ALERT!* :rotating_light:" : "";
  
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `:checkered_flag: FINAL: ${game.AwayTeam} vs ${game.HomeTeam}${upsetAlert}`
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*${game.AwayTeam}* (${game.AwayTeamSeed})${getSeedEmoji(game.AwayTeamSeed)}\n*${game.AwayTeamScore}*${game.AwayTeamScore > game.HomeTeamScore ? ' :trophy:' : ''}`
          },
          {
            type: "mrkdwn",
            text: `*${game.HomeTeam}* (${game.HomeTeamSeed})${getSeedEmoji(game.HomeTeamSeed)}\n*${game.HomeTeamScore}*${game.HomeTeamScore > game.AwayTeamScore ? ' :trophy:' : ''}`
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Round:* ${game.Round} | *Venue:* ${game.Stadium}`
          }
        ]
      },
      {
        type: "divider"
      }
    ]
  };
}

// Format message for a close in-progress game
function formatCloseGameMessage(game) {
  const scoreDiff = Math.abs(game.AwayTeamScore - game.HomeTeamScore);
  let intensityEmoji = '';
  
  if (scoreDiff <= 1) {
    intensityEmoji = ':fire::fire::fire:';
  } else if (scoreDiff <= 3) {
    intensityEmoji = ':fire::fire:';
  } else {
    intensityEmoji = ':fire:';
  }
  
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `:basketball: CLOSE GAME: ${game.AwayTeam} vs ${game.HomeTeam} ${intensityEmoji}`
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*${game.AwayTeam}* (${game.AwayTeamSeed})\n*${game.AwayTeamScore}*${game.AwayTeamScore > game.HomeTeamScore ? ' :arrow_up:' : ''}`
          },
          {
            type: "mrkdwn",
            text: `*${game.HomeTeam}* (${game.HomeTeamSeed})\n*${game.HomeTeamScore}*${game.HomeTeamScore > game.AwayTeamScore ? ' :arrow_up:' : ''}`
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Time:* ${game.Period === 2 ? '2nd' : '1st'} Half ${game.TimeRemainingMinutes}:${game.TimeRemainingSeconds.toString().padStart(2, '0')} | *Round:* ${game.Round}`
          }
        ]
      },
      {
        type: "divider"
      }
    ]
  };
}

// Format upcoming game message
function formatUpcomingGameMessage(game) {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `:calendar: UPCOMING: ${game.AwayTeam} vs ${game.HomeTeam}`
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*${game.AwayTeam}* (${game.AwayTeamSeed})${getSeedEmoji(game.AwayTeamSeed)}\n${game.AwayTeamStats || 'No stats available'}`
          },
          {
            type: "mrkdwn",
            text: `*${game.HomeTeam}* (${game.HomeTeamSeed})${getSeedEmoji(game.HomeTeamSeed)}\n${game.HomeTeamStats || 'No stats available'}`
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Tipoff:* ${game.DateTime} | *Venue:* ${game.Stadium} | *Round:* ${game.Round}`
          }
        ]
      },
      {
        type: "divider"
      }
    ]
  };
}

module.exports = {
  getStatusEmoji,
  getSeedEmoji,
  formatFinalGameMessage,
  formatCloseGameMessage,
  formatUpcomingGameMessage
};
