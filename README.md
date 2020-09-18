# Spotify f2p 🎶

Spotify-f2p is an Node AWS Lambda triggered by a cron schedule which syncs all tracks from your private library into a playlist. The code is build and deployed using the AWS sam cli.

## Development 👩‍💻👨‍💻

1. Configure the .env and (if necessary) the constants.js file
2. Execute the setup script on your local machine to initially obtain a spotify-refresh-token

   ```bash
   npm run setup
   ```

3. Invoke the local lambda function

   ```bash
   npm start
   ```

## Deployment 🚀

Deploy to AWS from your local machine or by using the github action. After that enter the Environment variables in AWS lambda.

```bash
npm run deploy
```
