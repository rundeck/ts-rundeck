Rundeck TypeScript(Javascript) SDK
==================================
TypeScript SDK generated from an OpenApi 2.0 spec via Autorest.

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