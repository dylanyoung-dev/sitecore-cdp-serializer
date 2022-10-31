# Deploy Commands

## Usage

This command is useful for taking physical files and deploying them to a CDP, Personalize or CDP/Personalize tenant. Details of this command are below:

| Command | Description                                         | Parameters                                            |
| :-----: | :-------------------------------------------------- | :---------------------------------------------------- |
| deploy  | Command to take physical files and deploy to Tenant | --artifactPath _optional_ (defaults to `./artifacts`)<br />--templateType _optional_ (audience\|decision\|web - defaults to `all`) |

### Example

```bash
npx sitecore-cdp-serializer deploy
```

### Notes

In order to run a deploy command, you must have already run an `auth login` command to authenticate to the tenant you wish to deploy the artifacts out to.
