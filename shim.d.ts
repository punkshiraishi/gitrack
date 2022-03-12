import { ProtocolWithReturn } from 'webext-bridge'

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    'tab-prev': { title: string | undefined }
    'get-current-tab': ProtocolWithReturn<{ tabId: number }, { title?: string }>
    'get-issue-name': ProtocolWithReturn<{ projectName: string; issueId: string }, { issueName?: string }>
    'start-timetracking': ProtocolWithReturn<{ description: string; clockifyProjectId: string }, {}>
  }
}
