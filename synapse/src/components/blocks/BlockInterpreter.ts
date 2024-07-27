import { Block, IfThenBlock, PrintBlock, CreateVariableBlock, ComparisonOperatorBlock, MathOperatorBlock, VariableBlock } from './types';
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
      case 'mathOperator':
        this.executeMathOperatorBlock(block as MathOperatorBlock);
        break;
      case 'variable':
        this.executeVariableBlock(block as VariableBlock);
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
    if (block.conditionBlock && this.evaluateCondition(block.conditionBlock)) {
      for (const subBlock of block.thenBlocks) {
        this.executeBlock(subBlock);
      }
    }
  }

  private executeCreateVariableBlock(block: CreateVariableBlock): void {
    const variableNameInput = block.inputs.find(input => input.name === 'variableName');
    const variableValueInput = block.inputs.find(input => input.name === 'variableValue');

    if (variableNameInput) {
      const variableName = variableNameInput.default;
      const variableValue = variableValueInput ? parseFloat(variableValueInput.default) : 0;
      store.dispatch('variables/addVariable', { name: variableName, value: variableValue });
    } else {
      console.error('CreateVariable block has no variable name input');
    }
  }

  private executeComparisonOperatorBlock(block: ComparisonOperatorBlock): boolean {
    const leftValue = this.evaluateInput(block.leftInput);
    const rightValue = this.evaluateInput(block.rightInput);
    switch (block.operator) {
      case '==':
        return leftValue === rightValue;
      case '!=':
        return leftValue !== rightValue;
      case '<':
        return leftValue < rightValue;
      case '<=':
        return leftValue <= rightValue;
      case '>':
        return leftValue > rightValue;
      case '>=':
        return leftValue >= rightValue;
      default:
        console.error(`Unknown comparison operator: ${block.operator}`);
        return false;
    }
  }

  private executeMathOperatorBlock(block: MathOperatorBlock): number {
    const leftValue = this.evaluateInput(block.leftInput);
    const rightValue = this.evaluateInput(block.rightInput);
    switch (block.operator) {
      case '+':
        return leftValue + rightValue;
      case '-':
        return leftValue - rightValue;
      case '*':
        return leftValue * rightValue;
      case '/':
        return leftValue / rightValue;
      default:
        console.error(`Unknown math operator: ${block.operator}`);
        return 0;
    }
  }

  private executeVariableBlock(block: VariableBlock): number | undefined {
    const variable = store.getters['variables/getVariableByName'](block.variableName);
    if (variable) {
      return variable.value;
    } else {
      console.error(`Variable ${block.variableName} not found`);
      return undefined;
    }
  }

  private evaluateInput(input: any): number {
    if (typeof input === 'number') {
      return input;
    } else if (typeof input === 'string') {
      const variable = store.getters['variables/getVariableByName'](input);
      if (variable) {
        return variable.value;
      } else {
        console.error(`Variable ${input} not found`);
        return 0;
      }
    } else if (input && typeof input === 'object') {
      return this.executeMathOperatorBlock(input as MathOperatorBlock);
    } else {
      return 0;
    }
  }

  private evaluateCondition(condition: any): boolean {
    if (typeof condition === 'boolean') {
      return condition;
    } else if (condition && typeof condition === 'object') {
      return this.executeComparisonOperatorBlock(condition as ComparisonOperatorBlock);
    } else {
      return false;
    }
  }
}

export default BlockInterpreter;
