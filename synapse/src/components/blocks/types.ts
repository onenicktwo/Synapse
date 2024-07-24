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
  value: string;
}

export interface IfThenBlock extends Block {
  type: 'ifThen';
  conditionBlocks: Block[];
  thenBlocks: Block[];
}

export interface CreateVariableBlock extends Block {
  type: 'createVariable';
  inputs: [
    { name: 'variableName'; type: 'text'; default: string }, // Variable Name
    { name: 'variableValue'; type: 'number'; default: string } // Variable Value
  ];
}