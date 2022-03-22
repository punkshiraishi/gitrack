import { ProtocolWithReturn } from 'webext-bridge'
import { ClockifyProject } from '~/background/api'

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    'tab-prev': { title: string | undefined }
    'get-current-tab': ProtocolWithReturn<{ tabId: number }, { title?: string }>
    'get-issue-name': ProtocolWithReturn<{ projectNameWithNamespace: string; issueId: string }, { issueName?: string }>
    'get-merge-request-name': ProtocolWithReturn<{ projectNameWithNamespace: string; mergeRequestId: string }, { mergeRequestName?: string; error?: string }>
    'get-clockify-projects': ProtocolWithReturn<{ projectName: string }, ClockifyProject[]>
    'start-timetracking': ProtocolWithReturn<{ description: string; clockifyProjectId: string }, {}>
  }
}
