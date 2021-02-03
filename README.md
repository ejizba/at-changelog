Tool used to auto-generate a changelog based on GitHub releases in the [Microsoft/vscode-azuretools](https://github.com/microsoft/vscode-azuretools) repo.

Just run it locally using the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) and hit a url like this:
```
http://localhost:7071/getChangelog?name=ui
```

NOTE: set the environment variable `GITHUB_RO_PAT` to a personal access token for your GitHub account to avoid hitting a rate limit.