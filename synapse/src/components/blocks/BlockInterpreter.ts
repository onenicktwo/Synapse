import { Block, IfThenBlock, PrintBlock, CreateVariableBlock, ComparisonOperatorBlock, ComparisonLogicBlock, RepeatBlock, MathOperatorBlock } from './types';
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

  private executeBlock(block: Block): any {
    console.log('Executing block:', block);
    switch (block.type) {
      case 'print':
        return this.executePrintBlock(block as PrintBlock);
      case 'ifThen':
        return this.executeIfThenBlock(block as IfThenBlock);
      case 'createVariable':
        return this.executeCreateVariableBlock(block as CreateVariableBlock);
      case 'compareOperator':
        return this.executeComparisonOperatorBlock(block as ComparisonOperatorBlock);
      case 'compareLogic':
        return this.executeComparisonLogicBlock(block as ComparisonLogicBlock);
      case 'repeat':
        return this.executeRepeatBlock(block as RepeatBlock);
      case 'mathOperator':
        return this.executeMathOperatorBlock(block as MathOperatorBlock);
      default:
        console.error(`Unknown block type: ${block.type}`);
        return null;
    }
  }

  
  private executeRepeatBlock(block: RepeatBlock): void {
    const repeatCount = block.repeatCount;
    for (let i = 0; i < repeatCount; i++) {
      for (const nestedBlock of block.nestedBlocks) {
        this.executeBlock(nestedBlock);
      }
    }
  }

  private executeMathOperatorBlock(block: MathOperatorBlock): number {
    const leftValue = this.evaluateInput(block.leftBlock || block.leftInput);
    const rightValue = this.evaluateInput(block.rightBlock || block.rightInput);
    
    switch (block.operator) {
      case '+':
        return Number(leftValue) + Number(rightValue);
      case '-':
        return Number(leftValue) - Number(rightValue);
      case '*':
        return Number(leftValue) * Number(rightValue);
      case '/':
        if (Number(rightValue) === 0) {
          console.error('Division by zero');
          return NaN;
        }
        return Number(leftValue) / Number(rightValue);
      default:
        console.error(`Unknown operator: ${block.operator}`);
        return NaN;
    }
  }



  private executePrintBlock(block: PrintBlock): void {
    if (block.inputs && block.inputs.length > 0) {
      const value = this.evaluateInput(block.inputs[0]);
      this.output.push(String(value));
    }
  }

  private executeIfThenBlock(block: IfThenBlock): void {
    if (block.conditionBlock) {
      const conditionResult = this.evaluateCondition(block.conditionBlock);
      if (conditionResult && block.thenBlocks) {
      for (const thenBlock of block.thenBlocks) {
        this.executeBlock(thenBlock);
      }
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

  private executeComparisonOperatorBlock(block: ComparisonOperatorBlock): boolean {
    const leftValue = block.leftBlock ? this.evaluateInput(block.leftBlock) : block.leftInput;
    const rightValue = block.rightBlock ? this.evaluateInput(block.rightBlock) : block.rightInput;
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

  private executeComparisonLogicBlock(block: ComparisonLogicBlock): boolean {
    if (!block.leftBlock || !block.rightBlock) {
      return false;
    }
    const leftValue = this.evaluateCondition(block.leftBlock);
    const rightValue = this.evaluateCondition(block.rightBlock);
    console.log('Left value:', leftValue);
    console.log('Right value:', rightValue);
    switch (block.operator) {
      case '&&':
        return leftValue && rightValue;
      case '||':
        return leftValue || rightValue;
      default:
        console.error(`Unknown operator: ${block.operator}`);
        return false;
    }
  }

  private evaluateCondition(block: Block): boolean {
    if (block == null) {
      return false;
    }
    switch (block.type) {
      case 'compareOperator':
        return this.executeComparisonOperatorBlock(block as ComparisonOperatorBlock);
      case 'compareLogic':
        return this.executeComparisonLogicBlock(block as ComparisonLogicBlock);
      default:
        console.error(`Unknown block type in condition: ${block.type}`);
        return false;
    }
  }

  private evaluateInput(input: any): any {
    console.log('Evaluating input:', input);
    if (typeof input === 'object' && input !== null) {
      if (input.type === 'variable') {
        // Fetch variable value from store
        return store.getters['variables/getVariableValue'](input.name);
      } else if (input.type === 'mathOperator') {
        // Recursively evaluate math operator blocks
        return this.executeMathOperatorBlock(input as MathOperatorBlock);
      } else if (input.default !== undefined) {
        return input.default;
      }
    }
    return input;
  }}

export default BlockInterpreter;
