import { OpaqueIterable, PathReference, Reference, IteratorDelegate } from '@glimmer/reference';
import { AttributeOperation } from '../dom/attributes';
import { AttrNamespace, SimpleElement, SimpleDocument } from '@simple-dom/interface';
import { ComponentInstanceState } from '../components';
import { ComponentManager } from '../components/component-manager';
import { Drop, Option, SymbolDestroyable } from '../core';
import { GlimmerTreeChanges, GlimmerTreeConstruction } from '../dom/changes';
import { ModifierManager } from './modifier';

export interface EnvironmentOptions {
  document?: SimpleDocument;
  appendOperations?: GlimmerTreeConstruction;
  updateOperations?: GlimmerTreeChanges;
}

export type InternalComponent = ComponentInstanceState;
export type InternalComponentManager = ComponentManager<ComponentInstanceState>;

export interface Transaction {}

declare const TransactionSymbol: unique symbol;
export type TransactionSymbol = typeof TransactionSymbol;

export interface Effect extends SymbolDestroyable {
  createOrUpdate(): void;
}

export interface Environment<Extra = unknown> {
  [TransactionSymbol]: Option<Transaction>;

  didCreate(component: InternalComponent, manager: InternalComponentManager): void;
  didUpdate(component: unknown, manager: ComponentManager<unknown>): void;

  willDestroy(drop: Drop): void;
  didDestroy(drop: Drop): void;

  registerEffect(effect: Effect, transaction?: boolean): void;

  begin(): void;
  commit(): void;

  getDOM(): GlimmerTreeChanges;
  protocolForURL(s: string): string;
  attributeFor(
    element: SimpleElement,
    attr: string,
    isTrusting: boolean,
    namespace: Option<AttrNamespace>
  ): AttributeOperation;
  getAppendOperations(): GlimmerTreeConstruction;

  // Moving away from these, toward `toIterator` and `toBool` respectively
  iterableFor(reference: Reference<unknown>, key: unknown): OpaqueIterable;
  toConditionalReference(reference: Reference<unknown>): Reference<boolean>;

  toBool(value: unknown): boolean;
  toIterator(value: unknown): Option<IteratorDelegate>;

  getPath(item: unknown, path: string): unknown;
  setPath(item: unknown, path: string, value: unknown): unknown;

  getTemplatePathDebugContext(ref: PathReference): string;
  setTemplatePathDebugContext(
    ref: PathReference,
    desc: string,
    parentRef: Option<PathReference>
  ): void;

  isInteractive: boolean;
  extra: Extra;
}

export interface DynamicScope {
  get(key: string): PathReference<unknown>;
  set(key: string, reference: PathReference<unknown>): PathReference<unknown>;
  child(): DynamicScope;
}
