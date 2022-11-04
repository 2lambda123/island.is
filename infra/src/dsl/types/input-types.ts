import { FeatureNames } from '../features'
import { EnvironmentConfig } from './charts'

export type OpsEnv = 'dev' | 'staging' | 'prod'
export const MissingSetting = 'Missing setting'
export type MissingSettingType = typeof MissingSetting

export interface Service {
  serviceDef: ServiceDefinition
}

// Input types
export type Hash = { [name: string]: Hash | string | number }
export type ValueSource = string | ((e: Context) => string)
export type ValueType = MissingSettingType | ValueSource
// See https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes for more info
export type AccessModes = 'ReadWrite' | 'ReadOnly'

export type PostgresInfo = {
  host?: {
    [idx in OpsEnv]: ValueType
  }
  name?: string
  username?: string
  passwordSecret?: string
}
export type PostgresInfoForEnv = {
  host?: ValueSource
  name?: string
  username?: string
  passwordSecret?: string
}

export type HealthProbe = {
  path: string
  initialDelaySeconds: number
  timeoutSeconds: number
}

export type Secrets = { [name: string]: string }

export type EnvironmentVariableValue =
  | {
      [idx in OpsEnv]: ValueType
    }
  | ValueType

export type EnvironmentVariables = {
  [name: string]: EnvironmentVariableValue
}
export type EnvironmentVariablesForEnv = {
  [name: string]: ValueSource
}

export interface XroadConfig {
  getEnv(): EnvironmentVariables

  getSecrets(): Secrets
}

export type Feature = {
  env: EnvironmentVariables
  secrets: Secrets
}

export type Features = { [name in FeatureNames]: Feature }
export type MountedFile = { filename: string; env: string }

type ServiceDefinitionCore = {
  liveness: HealthProbe
  readiness: HealthProbe
  healthPort?: number
  port?: number
  secrets: Secrets
  features: Partial<Features>
  namespace: string
  grantNamespaces: string[]
  grantNamespacesEnabled: boolean
  name: string
  accountName?: string
  serviceAccountEnabled: boolean
  cmds?: string
  args?: string[]
  image?: string
  resources: Resources
  replicaCount?: ReplicaCount
  securityContext: {
    privileged: boolean
    allowPrivilegeEscalation: boolean
  }
  files: MountedFile[]
  volumes: PersistentVolumeClaim[]
}
export type ServiceDefinition = ServiceDefinitionCore & {
  initContainers?: InitContainers
  env: EnvironmentVariables
  ingress: { [name: string]: Ingress }
  postgres?: PostgresInfo
  extraAttributes?: ExtraValues
  xroadConfig: XroadConfig[]
}

export type ServiceDefinitionForEnv = ServiceDefinitionCore & {
  initContainers?: InitContainersForEnv
  env: EnvironmentVariablesForEnv
  ingress: { [name: string]: IngressForEnv }
  postgres?: PostgresInfoForEnv
  extraAttributes?: ExtraValuesForEnv
}

export interface Ingress {
  host: {
    [name in OpsEnv]: string | string[]
  }
  paths: string[]
  public?: boolean
  extraAnnotations?: { [name in OpsEnv]: { [idx: string]: string | null } }
}

export interface IngressForEnv {
  host: string | string[]
  paths: string[]
  public?: boolean
  extraAnnotations?: { [idx: string]: string | null }
}

export type PersistentVolumeClaim = {
  name?: string
  size: '1Gi' | '5Gi' | '10Gi' | string
  accessModes: AccessModes
  mountPath: string
  /**
   * Sets the storageClass, leave empty if storageClass means little to you(defaults to efs-csi),
   * Mostly for internal use by the DevOps team.
   */
  storageClass?: string
}

export type Resources = {
  limits: {
    cpu: string
    memory: string
  }
  requests: {
    cpu: string
    memory: string
  }
}

export type ReplicaCount = {
  default: number
  max: number
  min: number
  /**
   * This is mostly for internal use by the DevOps team. If you would like to know more about it, please be in touch with them.
   * For more info, see this - https://prometheus.io/docs/prometheus/latest/querying/functions/#irate
   */
  scalingMagicNumber?: number
}

export type InitContainers = {
  envs: EnvironmentVariables
  secrets: Secrets
  features: Partial<Features>
  containers: {
    command: string
    args?: string[]
    name?: string
    resources?: Resources
  }[]
  postgres?: PostgresInfo
}
export type InitContainersForEnv = {
  envs: EnvironmentVariablesForEnv
  secrets: Secrets
  features: Partial<Features>
  containers: {
    command: string
    args?: string[]
    name?: string
    resources?: Resources
  }[]
  postgres?: PostgresInfoForEnv
}

export interface Context {
  featureDeploymentName?: string

  svc(dep: Service | string): string

  env: EnvironmentConfig
}

export type ExtraValuesForEnv = Hash
export type ExtraValues = { [idx in OpsEnv]: Hash | MissingSettingType }
