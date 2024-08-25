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
  elseBlocks: Block[]; 
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

export interface VariableChangeBlock {
  id: string;
  type: 'variableChange';
  variableId: string | null;
  mathOperator: MathOperatorBlock | null;
  parentFunctionId?: string; // Add this line
}


export interface ParameterBlock extends Block {
  type: 'parameter';
  name: string; 
  value: string | number | null;
}

export interface FunctionBlock extends Block {
  type: 'function';
  functionName: string;
  nestedBlocks: Block[];
  parameters: ParameterBlock[]; 
  hasReturn: boolean;
}

export interface FunctionGetterBlock extends Block {
  type: 'functionGetter';
  functionId: string;
  parameterValues: string[];
  nestedBlocks: (Block | null)[]; 
  hasReturn: boolean;
}

export interface ReturnBlock extends Block {
  type: 'return';
  valueBlock: Block | null;
}

export interface ClassInstantiationBlock extends Block {
  type: 'classInstantiation';
  inputs: [
    { name: 'className'; type: 'string'; default: string },
    { name: 'instanceName'; type: 'string'; default: string }
  ];
}

export type BlockType = 'print' | 'ifThen' | 'createVariable' | 'compareOperator' | 'compareLogic' | 'repeat' | 'variable' | 'mathOperator' 
| 'variableChange' | 'function' | 'functionGetter' | 'parameter' | 'return' | 'classInstantiation';

export type BlockComponentName = 'PrintBlock' | 'IfThenBlock' | 'CreateVariableBlock' | 'ComparisonOperatorBlock' | 'ComparisonLogicBlock' 
| 'RepeatBlock' | 'UnknownBlock' | 'VariableBlock' | 'MathOperatorBlock' | 'VariableChangeBlock' | 'FunctionBlock' | 'FunctionGetterBlock'
| 'ParameterBlock' | 'ReturnBlock' | 'ClassInstantiationBlock';

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
  functionGetter: 'FunctionGetterBlock',
  parameter: 'ParameterBlock',
  return: 'ReturnBlock',
  classInstantiation: 'ClassInstantiationBlock',
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
  FunctionGetterBlock: markRaw(require('./FunctionGetterBlock.vue').default),
  ParameterBlock: markRaw(require('./ParameterBlock.vue').default),
  ReturnBlock: markRaw(require('./ReturnBlock.vue').default),
  ClassInstantiationBlock: markRaw(require('./ClassInstantiationBlock.vue').default)
};