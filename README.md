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


## OpenAPI Spec(OAS)
This project is the current home of the OpenAPI specification used to generate the project.

### Spec Progress
- [x] System Info
- [ ] List Metrics
- [x] User Profile
- [x] Log Storage
- [x] Execution Mode
- [x] Cluster Mode
- [x] ACLs
- [x] Jobs
- [ ] Executions
  - [x] Get Executions for a Job
  - [x] Delete all Executions for a Job
  - [ ] Listing Running Executions
  - [ ] Execution Info
  - [ ] List Input Files for an Execution
  - [ ] Delete an Execution
  - [ ] Bulk Delete Executions
  - [ ] Execution Query
  - [ ] Execution State
  - [ ] Execution Output
  - [ ] Execution Output with State
  - [ ] Aborting Executions
- [ ] Adhoc
- [ ] Key Storage
  - [ ] Upload keys
  - [x] List keys
  - [ ] Get Key Metadata
  - [ ] Get Key Contents
  - [x] Delete Keys
- [ ] Projects
  - [x] Listing Projects
  - [x] Project Creation
  - [x] Getting Project Info
  - [x] Project Deletion
  - [x] Project Configuration
  - [x ] Project Configuration Keys
  - [x] Project Archive Export
  - [ ] Project Archive Export Async
  - [ ] Project Archive Export Status
  - [x] Project Archive Import
  - [ ] Updating and Listing Resources for a Project
  - [x] Project Readme File
  - [ ] Project ACLs
- [ ] Listing History
- [ ] Resources/Nodes
- [ ] SCM