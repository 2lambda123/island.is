import {
  EventObject,
  Machine,
  Event,
  StateNodeConfig,
  StateSchema,
} from 'xstate'
import { AnyEventObject, MachineOptions, StateMachine } from 'xstate/lib/types'

import { FormLoader, FormText, StaticText } from './Form'
import { Application, ActionCardTag } from './Application'
import { PerformActionResult } from './TemplateApiModuleTypes'
import { ProviderErrorReason } from './DataProviderResult'
import { ProblemType } from '@island.is/shared/problem'
import { Condition } from './Condition'

export type ApplicationRole = 'applicant' | 'assignee' | string

export enum DefaultEvents {
  PAYMENT = 'PAYMENT',
  APPROVE = 'APPROVE',
  ASSIGN = 'ASSIGN',
  REJECT = 'REJECT',
  SUBMIT = 'SUBMIT',
  ABORT = 'ABORT',
  EDIT = 'EDIT',
}

export type ReadWriteValues =
  | 'all'
  | {
      answers?: string[]
      externalData?: string[]
    }
export interface RoleInState<T extends EventObject = AnyEventObject> {
  id: ApplicationRole
  read?: ReadWriteValues
  write?: ReadWriteValues
  delete?: boolean
  formLoader?: FormLoader
  actions?: CallToAction<T>[]
  shouldBeListedForRole?: boolean
  api?: ApplicationTemplateAPIAction[]
}

export interface ApplicationContext {
  application: Application
}

export type CallToAction<T extends EventObject = AnyEventObject> = {
  event: Event<T> | string
  name: FormText
  type: 'primary' | 'subtle' | 'reject' | 'sign'
  condition?: Condition
}

/*export class ApplicationTemplateAPIAction {
  //Data Provider type
  dataProviderType?: string
  // Name of the action that will be run on the API
  // these actions are exported are found in:
  // /libs/application/template-api-modules
  apiModuleAction?: string
  // If response/error should be written to application.externalData, defaults to true
  shouldPersistToExternalData?: boolean
  // Id inside application.externalData, value of apiModuleAction is used by default
  externalDataId?: string
  // Should the state transition be blocked if this action errors out
  // defaults to true
  throwOnError?: boolean
  // Order of execution of actions, defaults to 0
  order?: number
  // Use mocks? defaults to false
  useMockData?: boolean | ((application: Application) => boolean)
  mockData?:
    | PerformActionResult
    | ((application: Application) => PerformActionResult)
  // Shared data providers namspace
  namespace?: string

  //Error messages to be displayed to the user. Maps to the ProblemType enum thrown by the Service
  errorReasons?: ErrorReasonException[]

  //Conditonally  return an error reason from a valid response from the provider
  errorReasonHandler?: (
    result: PerformActionResult,
  ) => ErrorReasonException | void

  params?: { [key: string]: unknown }
}*/

export interface ApplicationTemplateAPIAction {
  apiModuleAction: string
  shouldPersistToExternalData?: boolean
  externalDataId?: string
  throwOnError?: boolean
  order?: number
  namespace?: string
  params?: { [key: string]: unknown }
}

export interface ErrorReasonException {
  reason: ProviderErrorReason | StaticText
  problemType: ProblemType
  statusCode: number
}

export type StateLifeCycle =
  | {
      // Controls visibility from my pages + /umsoknir/:type when in current state
      shouldBeListed: boolean
      shouldBePruned: false
    }
  | {
      shouldBeListed: boolean
      shouldBePruned: true
      // If set to a number prune date will equal current timestamp + whenToPrune (ms)
      whenToPrune: number | ((application: Application) => Date)
    }

export interface ApplicationStateMeta<T extends EventObject = AnyEventObject> {
  name: string
  lifecycle: StateLifeCycle
  actionCard?: {
    title?: StaticText
    description?: StaticText
    tag?: { label?: StaticText; variant?: ActionCardTag }
  }
  progress?: number
  roles?: RoleInState<T>[]
  onExit?: ApplicationTemplateAPIAction
  onEntry?: ApplicationTemplateAPIAction
}

export interface ApplicationStateSchema<T extends EventObject = AnyEventObject>
  extends StateSchema {
  meta: ApplicationStateMeta<T>
  states: {
    [key: string]: ApplicationStateSchema<T>
  }
}

export type ApplicationStateMachine<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject
> = StateMachine<TContext, TStateSchema, TEvents>

// manually overwrites the initial state for the template as well so the interpreter starts in the current application state
export function createApplicationMachine<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvent>,
  TEvent extends EventObject = AnyEventObject
>(
  application: Application,
  config: StateNodeConfig<TContext, TStateSchema, TEvent>,
  options?: Partial<MachineOptions<TContext, TEvent>>,
  initialContext?: TContext,
): ApplicationStateMachine<TContext, TStateSchema, TEvent> {
  const context = initialContext
    ? { ...initialContext, application }
    : { application }

  const applicationState = application.state
  // validate that applicationState is part of the states config, if that fails, use the default initial state?
  let initialState = config.initial
  if (config?.states && config.states[applicationState]) {
    initialState = applicationState
  }

  return Machine(
    { ...config, initial: initialState },
    options ?? {},
    context as TContext,
  )
}
