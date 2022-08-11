# API Commands

## Usage

The API commands should never be used by a public application. Your Sitecore CDP/Personalize API Username and Password should never be send to anyone you don't trust. It's recommended that you create a Service API account in your Sitecore CDP/Personalize tenant so you can have more control over revoking access in the future.

## Available Commands

|   Command   | Description                                                     | Parameters                                     |
| :---------: | :-------------------------------------------------------------- | :--------------------------------------------- |
|    auth     | Required command to create access token for future CLI commands | -u, --username, -p, --password, -l, --location |
| connections | Retrieve all connections from your connected tenant             | \<none>                                        |
