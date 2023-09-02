import { makeFakeWorkspace } from './make-fake-workspace'
import { Workspace } from '@/protocols/use-cases/workspace'
import { WorkspaceModel } from '@/protocols/models/workspace'

export class WorkspaceStub implements Workspace {
  async create(): Promise<WorkspaceModel | undefined> {
    return Promise.resolve(makeFakeWorkspace())
  }

  async getAll(): Promise<WorkspaceModel[]> {
    return Promise.resolve([
      makeFakeWorkspace(),
      makeFakeWorkspace(),
    ])
  }

  async getById(): Promise<WorkspaceModel | undefined> {
    return Promise.resolve(makeFakeWorkspace())
  }
}
