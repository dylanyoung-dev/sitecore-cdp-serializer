# Deploy Commands

## Usage

This command is useful for taking physical files and deploying them to a CDP, Personalize or CDP/Personalize tenant. Details of this command are below:

| Command | Description                                         | Parameters                                                                                                                         |
| :-----: | :-------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| deploy  | Command to take physical files and deploy to Tenant | --artifactPath _optional_ (defaults to `./artifacts`)<br />--templateType _optional_ (audience\|decision\|web - defaults to `all`) |

### Example

```bash
npx sitecore-cdp-serializer deploy
```

### Notes

In order to run a deploy command, you must have already run an `auth login` command to authenticate to the tenant you wish to deploy the artifacts out to.

### Warning

> :warning: Currently JS Modules support only allows for a single push and once published they cannot be modified even by the API. This means that if you have already published a JS Module, you will need to delete it from the tenant before you can run a deploy command again. This is a limitation of the API and not the CLI.
