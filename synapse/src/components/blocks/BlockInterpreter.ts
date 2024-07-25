import { Block, IfThenBlock, PrintBlock, CreateVariableBlock, ComparisonOperatorBlock } from './types';
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
      case 'compareOperator':
        this.executeComparisonOperatorBlock(block as ComparisonOperatorBlock);
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
    const conditionResult = this.evaluateCondition(block.conditionBlock);
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

  private evaluateCondition(block: Block | null): boolean {
    if (block == null) {
      return false;
    }
    let conditionValue = false;
    switch (block.type) {
      case 'compareOperator':
        conditionValue = this.executeComparisonOperatorBlock(block as ComparisonOperatorBlock);
        break;
      default:
        console.error(`Unknown block type: ${block.type}`);
        conditionValue = false;
        break;
    }
    return conditionValue;
  }

  private executeComparisonOperatorBlock(block: ComparisonOperatorBlock): boolean {
    const leftValue = block.leftBlock ? this.evaluateInput(block.leftBlock) : block.leftInput;
    const rightValue = block.rightBlock ? this.evaluateInput(block.rightBlock) : block.rightInput;
    console.log("comparison");
    switch (block.operator) {
      case '==':
        return leftValue == rightValue;
      case '!=':
        return leftValue != rightValue;
      case '<':
        return leftValue < rightValue;
      case '<=':
        return leftValue <= rightValue;
      case '>':
        return leftValue > rightValue;
      case '>=':
        return leftValue >= rightValue;
      default:
        console.error(`Unknown operator: ${block.operator}`);
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
