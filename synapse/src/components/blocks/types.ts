import { Component, markRaw } from "vue";

export interface BlockInput {
  name: string;
  type: string;
  default: string;
}

export interface Block {
  id: string;
  type: string;
  label: string;
  color: string;
  inputs: BlockInput[];
  position?: {
    x: number;
    y: number;
  };
}

export interface PrintBlock extends Block {
  type: 'print';
  nestedBlock: Block | null;
}

export interface IfThenBlock extends Block {
  type: 'ifThen';
  conditionBlock: Block | null;
  thenBlocks: Block[];
}

export interface CreateVariableBlock extends Block {
  type: 'createVariable';
  inputs: [
    { name: 'variableName'; type: 'text'; default: string },
    { name: 'variableValue'; type: 'number'; default: string }
  ];
}

export interface ComparisonOperatorBlock extends Block {
  type: 'compareOperator';
  operator: '==' | '!=' | '<' | '<=' | '>' | '>=';
  leftBlock: Block | null;
  rightBlock: Block | null;
  leftInput: string;
  rightInput: string;
}

export interface ComparisonLogicBlock extends Block {
  type: 'compareLogic';
  operator: '&&' | '||';
  leftBlock: Block | null;
  rightBlock: Block | null;
}

export interface RepeatBlock extends Block {
  type: 'repeat';
  repeatCount: number;
  nestedBlocks: Block[];
}

export interface MathOperatorBlock extends Block {
  type: 'mathOperator';
  operator: '+' | '-' | '*' | '/';
  leftBlock: Block | null;
  rightBlock: Block | null;
  leftInput: string; // For direct input
  rightInput: string; // For direct input
}

export interface VariableBlock extends Block {
  type: 'variable';
  variableId: string;
}

export interface VariableChangeBlock extends Block {
  type: 'variable';
  variableId: string;
  value: number;
}

export interface FunctionBlock extends Block {
  type: 'function';
  functionName: string;
  nestedBlocks: Block[];
}

export interface FunctionGetterBlock extends Block {
  type: 'functionGetter';
  functionId: string;
}

export type BlockType = 'print' | 'ifThen' | 'createVariable' | 'compareOperator' | 'compareLogic' | 'repeat' | 'variable' | 'mathOperator' 
| 'variableChange' | 'function' | 'functionGetter';

export type BlockComponentName = 'PrintBlock' | 'IfThenBlock' | 'CreateVariableBlock' | 'ComparisonOperatorBlock' | 'ComparisonLogicBlock' 
| 'RepeatBlock' | 'UnknownBlock' | 'VariableBlock' | 'MathOperatorBlock' | 'VariableChangeBlock' | 'FunctionBlock' | 'FunctionGetterBlock';

export const BlockTypeToComponentName: Record<BlockType, BlockComponentName> = {
  print: 'PrintBlock',
  ifThen: 'IfThenBlock',
  createVariable: 'CreateVariableBlock',
  compareOperator: 'ComparisonOperatorBlock',
  compareLogic: 'ComparisonLogicBlock',
  repeat: 'RepeatBlock',
  variable: 'VariableBlock',
  mathOperator: 'MathOperatorBlock',
  variableChange: 'VariableChangeBlock',
  function: 'FunctionBlock',
  functionGetter: 'FunctionGetterBlock'
};

export const blockComponents: Record<BlockComponentName, Component> = {
  PrintBlock: markRaw(require('./PrintBlock.vue').default),
  IfThenBlock: markRaw(require('./IfThenBlock.vue').default),
  CreateVariableBlock: markRaw(require('./CreateVariableBlock.vue').default),
  VariableBlock: markRaw(require('./VariableBlock.vue').default),
  ComparisonOperatorBlock: markRaw(require('./ComparisonOperatorBlock.vue').default),
  ComparisonLogicBlock: markRaw(require('./ComparisonLogicBlock.vue').default),
  RepeatBlock: markRaw(require('./RepeatBlock.vue').default),
  UnknownBlock: markRaw(require('./UnknownBlock.vue').default),
  MathOperatorBlock: markRaw(require('./MathOperatorBlock.vue').default),
  VariableChangeBlock: markRaw(require('./VariableChangeBlock.vue').default),
  FunctionBlock: markRaw(require('./FunctionBlock.vue').default),
  FunctionGetterBlock: markRaw(require('./FunctionGetterBlock.vue').default)
};