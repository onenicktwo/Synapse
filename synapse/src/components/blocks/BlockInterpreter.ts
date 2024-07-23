import { Block, IfThenBlock, PrintBlock, CreateVariableBlock } from './types';
import store from '../../store'; // Import the Vuex store

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
        this.executeIfThenBlock(block as IfThenBlock); 
        break;
      case 'createVariable':
        this.executeCreateVariableBlock(block as CreateVariableBlock); 
        break;
      default:
        console.error(`Unknown block type: ${block.type}`);
    }
  }

  private executePrintBlock(block: PrintBlock): void {
    if (block.inputs && block.inputs.length > 0) {
      const value = this.evaluateInput(block.inputs[0]);
      this.output.push(String(value));
    } else {
      console.error('Print block has no inputs');
    }
  }

  private executeIfThenBlock(block: IfThenBlock): void {
    const conditionResult = this.evaluateCondition(block);
    if (conditionResult && block.thenBlocks) {
      for (const thenBlock of block.thenBlocks) {
        this.executeBlock(thenBlock);
      }
    } 
  }

  private executeCreateVariableBlock(block: CreateVariableBlock): void {
    const [nameInput, valueInput] = block.inputs;
    const name = this.evaluateInput(nameInput);
    const value = this.evaluateInput(valueInput);

    if (typeof name === 'string' && typeof value === 'string') {
      store.dispatch('variables/addVariable', { name, value });
    } else {
      console.error('CreateVariable block has invalid inputs');
    }
  }

  private evaluateCondition(block: IfThenBlock): boolean {
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
