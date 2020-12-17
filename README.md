# Spotify f2p 🎶

[![build shield](https://img.shields.io/github/workflow/status/luismeyer/spotify-f2p/Deploy%20master%20branch/master)](https://github.com/luismeyer/spotify-f2p/actions)
[![issues shield](https://img.shields.io/github/issues/luismeyer/spotify-f2p)](https://github.com/luismeyer/spotify-f2p/issues)
![repo size shield](https://img.shields.io/github/repo-size/luismeyer/spotify-f2p)
![version shield](https://img.shields.io/github/package-json/v/luismeyer/spotify-f2p)

Spotify-f2p is a Node AWS Lambda triggered by a cron schedule which syncs all tracks from your private library into a playlist. The code is build and deployed using the AWS sam cli.

## Development 👩‍💻👨‍💻

1. Create a .env file based on the .env example and configure it with your credentials
2. Execute the setup script on your local machine to initially obtain a spotify-refresh-token

   ```bash
   yarn setup
   ```

3. Invoke the lambda function local ([Docker](https://www.docker.com/) required)

   ```bash
   yarn invoke
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

## Tipps and Tricks 🤓

If you don't know the playlist ID you can execute the search-playlist script

```bash
yarn search --name <PLAYLIST_NAME>
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
