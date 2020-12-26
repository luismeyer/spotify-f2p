# Spotify f2p 🎶

[![build shield](https://img.shields.io/github/workflow/status/luismeyer/spotify-f2p/Deploy%20master%20branch/master)](https://github.com/luismeyer/spotify-f2p/actions)
[![issues shield](https://img.shields.io/github/issues/luismeyer/spotify-f2p)](https://github.com/luismeyer/spotify-f2p/issues)
![repo size shield](https://img.shields.io/github/repo-size/luismeyer/spotify-f2p)
![version shield](https://img.shields.io/github/package-json/v/luismeyer/spotify-f2p)

Spotify-f2p is a Node AWS Lambda triggered by an API Gateway that syncs all tracks from your private library into a public or private playlist. The code is build and deployed using the AWS sam cli.

## Usage 🛠

You can register for the Service [here](https://yj8g7k9t41.execute-api.eu-central-1.amazonaws.com/Prod/auth). After authorizing you can pick the playlist that is uses for the sync. Then you will be redirected to the sync page. There will be a bit.ly link that you can safe for later use.

## Development 👩‍💻👨‍💻

1. Create a .env file based on the .env example and configure it with your credentials
2. Start the API local ([Docker](https://www.docker.com/) required)

   ```bash
   yarn watch
   yarn start
   ```

## Build 🏗

Use AWS sam to build the Application

```bash
yarn build
```

## Deployment 🚀

Deploy the application to AWS either from your local machine or by using the github action. After that enter the Environment variables in the AWS lambda ui.

If you deploy for the first time:

```bash
yarn deploy:new
```

or just

```bash
yarn deploy
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
