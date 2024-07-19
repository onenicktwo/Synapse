import { Block } from './types';

class BlockInterpreter {
  private output: string[] = [];
  private variables: { [key: string]: number } = {};

  execute(blocks: Block[]): string[] {
    this.output = [];
    this.variables = {};
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
      case 'variable':
        this.executeVariableBlock(block);
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

  private executeVariableBlock(block: Block): void {
    if (block.inputs && block.inputs.length > 0) {
      const variableName = block.label;
      const value = this.evaluateInput(block.inputs[0]);
      if (typeof value === 'number') {
        this.variables[variableName] = value;
      } else {
        console.error(`Invalid value for variable ${variableName}: ${value}`);
      }
    } else {
      console.error('Variable block has no inputs');
    }
  }

  private evaluateInput(input: any): any {
    console.log('Evaluating input:', input);
    if (typeof input === 'object' && input.default !== undefined) {
      return input.default;
    }
    if (typeof input === 'string' && Object.prototype.hasOwnProperty.call(this.variables, input)) {
      return this.variables[input];
    }
    return input;
  }
}

export default BlockInterpreter;