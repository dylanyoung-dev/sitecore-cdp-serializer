import { HrefProp } from '../offers/Offer.interface.js';

export interface FlowDefinition {
  name: string;
  clientKey: string;
  href: string;
  ref: string;
  modifiedByRef: string;
  modifiedAt: string;
  revision: number;
  archived: boolean;
  friendlyId: string;
  type: FlowType;
  subtype: FlowSubType;
  channels: FlowChannel;
  triggers: string; // TODO: Come back to this item
  tags: string[];
  businessProcess: string; // possibly an enum
  traffic: TrafficDefinition;
  variants: VariantDefinition[]; // possibly?
  transpiledVariants: string;
  status: FlowStatus; // possibly an enum
  schedule: ScheduleDefinition; // possibly a global object
  revisions: HrefProp; // TODO: needs to be a global object
  sampleSizeConfig: SampleSizeDefinition; // possibly a global object
}

export interface ScheduleDefinition {
  type: string;
  startDate: string;
  endDate: string;
}

export interface TrafficDefinition {
  type: TrafficDefinitionType; // possibly an enum
  weightingAlgorithm: WeightingAlgorithm;
  allocation: number;
  allocationHigh: number;
  allocationLow: number;
  splits: SplitDefinition[]; // possibly?
  coupled: boolean;
  modifiedAt: string;
}

export enum TrafficDefinitionType {
  Simple = 'simpleTraffic',
  Advanced = 'advancedTraffic',
}

export interface SplitDefinition {
  ref: string;
  split?: number;
  lowSplit?: number;
  highSplit?: number;
}

export enum WeightingAlgorithm {
  MultiArmBandit = 'MULTI_ARM_BANDIT',
  UserDefined = 'USER_DEFINED',
}

export enum FlowType {
  WebFlow = 'INTERACTIVE_WEB_FLOW',
  ApiFlow = 'INTERACTIVE_API_FLOW',
  Triggered = 'TRIGGERED_V3',
}

export enum FlowSubType {
  Experiment = 'EXPERIMENT',
  Experience = 'EXPERIENCE',
}

export enum FlowStatus {
  Draft = 'DRAFT',
  Publishing = 'PUBLISHING',
  Production = 'PRODUCTION',
  Scheduled = 'SCHEDULED',
  Live = 'LIVE',
  Paused = 'PAUSED',
  Completed = 'COMPLETED',
}

export enum FlowChannel {
  CallCenter = 'CALL_CENTER',
  Email = 'EMAIL',
  MobileApp = 'MOBILE_APP',
  MobileWeb = 'MOBILE_WEB',
  PushNotification = 'PUSH_NOTIFICATION',
  SMS = 'SMS',
  Web = 'WEB',
}

export interface SampleSizeDefinition {
  baseValue: number;
  minimumDetectableDifference: number;
  confidenceLevel: number;
}
