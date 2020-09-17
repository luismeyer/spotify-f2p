# Spotify f2p sync

Spotify-f2p-sync is an AWS lambda which syncs all tracks from your private library into a playlist. The lambda is triggered by a cron schedule.

## Get started

Configure the .env and (if necessary) the constants.js file.  
Execute the setup script on your local machine to initially obtain a spotify-refresh-token.  
Deploy to AWS locally by running `bash serverless deploy` or by using the github action.  
Enter env variables in AWS lambda.
