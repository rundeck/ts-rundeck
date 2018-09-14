Rundeck TypeScript(Javascript) SDK
==================================
TypeScript SDK generated from an OpenApi 2.0 spec via Autorest.

> `WARNING:` The OpenApi spec and SDK are under heavy development. The spec, methods, interfaces, and project structure
may change heavily between releases.

## Example Usage

```ts
import {Rundeck, PasswordCredentialProvider} from 'ts-rundeck'

async function main() {
    const credProvider = new PasswordCredentialProvider('admin', 'admin')
    const rundeck = new Rundeck(credProvider, 'http://127.0.0.1:4440', {withCredentials: true})

    const users = await rundeck.userList()
}

main()
```

## Building

### Pre-requisites
[`DotNet Core SDK`](https://www.microsoft.com/net/download) - Required for the Autorest backend  
`Nodejs/npm` - Required for the Autorest frontend

### Quick Start
To generate client and compile TypeScript to `/dist`:
```
npm run build
```

### Slow Start
Checkout the Autorest literate configuration [here](autorest.md).