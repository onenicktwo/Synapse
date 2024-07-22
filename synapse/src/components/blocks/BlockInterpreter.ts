import { Block, IfThenBlock, PrintBlock } from './types';

class BlockInterpreter {
  private output: string[] = [];

  execute(blocks: Block[]): string[] {
    this.output = [];
    for (const block of blocks) {
      this.executeBlock(block);
    }
    return this.output;
  }

  private executeBlock(block: Block): void {
    console.log('Executing block:', block);
    switch (block.type) {
      case 'print':
        this.executePrintBlock(block as PrintBlock); 
        break;
      case 'ifThen':
        // Type Assertion to pass the block as IfThenBlock
        this.executeIfThenBlock(block as IfThenBlock); 
        break;
      default:
        console.error(`Unknown block type: ${block.type}`);
    }
  }

  private executePrintBlock(block: Block): void {
    if (block.inputs && block.inputs.length > 0) {
      const value = this.evaluateInput(block.inputs[0]);
      this.output.push(String(value));
    } else {
      console.error('Print block has no inputs');
    }
  }

  private executeIfThenBlock(block: IfThenBlock): void {
    const conditionResult = true;
    if (conditionResult && block.thenBlocks) {
      for (const thenBlock of block.thenBlocks) {
        this.executeBlock(thenBlock);
      }
    } 
  }

  private evaluateCondition(block: Block): boolean {
    if (block.inputs && block.inputs.length > 0) {
      const conditionValue = this.evaluateInput(block.inputs[0]);
      return Boolean(conditionValue); // Convert the condition to a boolean
    } else {
      console.error('IfThen block has no condition input');
      return false;
    }
  }

  private evaluateInput(input: any): any {
    console.log('Evaluating input:', input);
    if (typeof input === 'object' && input.default !== undefined) {
      return input.default;
    }
    return input;
  }
}

export default BlockInterpreter;