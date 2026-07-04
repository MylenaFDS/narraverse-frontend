import type { ConsistencyIssue } from "./ConsistencyIssue"

export interface ConsistencyResult {

  valid: boolean

  issues: ConsistencyIssue[]

}