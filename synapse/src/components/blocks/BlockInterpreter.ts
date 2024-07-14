import { Block } from './types';

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
        this.executePrintBlock(block);
        break;
      // Add more cases for other block types as you create them
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

  private evaluateInput(input: any): any {
    console.log('Evaluating input:', input);
    if (typeof input === 'object' && input.default !== undefined) {
      return input.default;
    }
    return input;
  }
}

export default BlockInterpreter;