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
    conditionBlock: null;
    type: 'ifThen';
    thenBlocks: Block[];
  }