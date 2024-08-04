import store from "@/store";
import { Block, PrintBlock, IfThenBlock, CreateVariableBlock, ComparisonOperatorBlock, ComparisonLogicBlock, RepeatBlock, MathOperatorBlock, VariableBlock } from "./types";

class JavaBlockInterpreter {
  private javaCode: string[] = [];
  private indentationLevel: number = 2;

  generateJavaCode(blocks: Block[]): string {
    this.javaCode = ['public class Main {', '  public static void main(String[] args) {'];
    for (const block of blocks) {
      this.generateBlockCode(block);
    }
    this.javaCode.push('  }', '}');
    return this.javaCode.join('\n');
  }

  private generateBlockCode(block: Block): void {
    switch (block.type) {
      case 'print':
        this.generatePrintBlockCode(block as PrintBlock);
        break;
      case 'ifThen':
        this.generateIfThenBlockCode(block as IfThenBlock);
        break;
      case 'createVariable':
        this.generateCreateVariableBlockCode(block as CreateVariableBlock);
        break;
      case 'compareOperator':
        this.generateComparisonOperatorCode(block as ComparisonOperatorBlock);
        break;
      case 'compareLogic':
        this.generateComparisonLogicCode(block as ComparisonLogicBlock);
        break;
      case 'repeat':
        this.generateRepeatBlockCode(block as RepeatBlock);
        break;
      case 'mathOperator':
        this.generateMathOperatorBlockCode(block as MathOperatorBlock);
        break;
      case 'variable':
        this.generateVariableBlockCode(block as VariableBlock);
        break;
      default:
        console.error(`Unknown block type: ${block.type}`);
    }
  }

  private generatePrintBlockCode(block: PrintBlock): void {
    let value;
    if (block.nestedBlock) {
      value = this.generateBlockCode(block.nestedBlock);
    } else {
      value = '"' + this.evaluateInput(block.inputs[0]) + '"';
    }
    this.addLine(`System.out.println(${value});`);
  }

  private generateIfThenBlockCode(block: IfThenBlock): void {
    if (block.conditionBlock) {
      const condition = this.generateConditionCode(block.conditionBlock);
      this.addLine(`if (${condition}) {`);
      this.indentationLevel += 2;
      for (const thenBlock of block.thenBlocks) {
        this.generateBlockCode(thenBlock);
      }
      this.indentationLevel -= 2;
      this.addLine('}');
    } else {
      console.warn('If-Then block has no condition');
    }
  }

  private generateCreateVariableBlockCode(block: CreateVariableBlock): void {
    const name = this.evaluateInput(block.inputs[0]);
    const value = this.evaluateInput(block.inputs[1]);
    this.addLine(`int ${name} = ${value};`);
  }
  

  private generateRepeatBlockCode(block: RepeatBlock): void {
    this.addLine(`for (int i = 0; i < ${block.repeatCount}; i++) {`);
    this.indentationLevel += 2;
    for (const nestedBlock of block.nestedBlocks) {
      this.generateBlockCode(nestedBlock);
    }
    this.indentationLevel -= 2;
    this.addLine('}');
  }

  private generateMathOperatorBlockCode(block: MathOperatorBlock): string {
    const left = block.leftBlock ? this.generateMathOperatorBlockCode(block.leftBlock as MathOperatorBlock) : this.evaluateInput(block.leftInput);
    const right = block.rightBlock ? this.generateMathOperatorBlockCode(block.rightBlock as MathOperatorBlock) : this.evaluateInput(block.rightInput);
    return `(${left} ${block.operator} ${right})`;
  }

  private generateVariableBlockCode(block: VariableBlock): string {
    return block.variableId;
  }

  private generateConditionCode(block: Block): string {
    if (block.type === 'compareOperator') {
      return this.generateComparisonOperatorCode(block as ComparisonOperatorBlock);
    } else if (block.type === 'compareLogic') {
      return this.generateComparisonLogicCode(block as ComparisonLogicBlock);
    } else {
      console.warn(`Unexpected block type in condition: ${block.type}`);
      return 'true'; // Default to true if the block type is unexpected
    }
  }

  private generateComparisonOperatorCode(block: ComparisonOperatorBlock): string {
    const left = block.leftBlock ? this.generateBlockCode(block.leftBlock) : this.evaluateInput(block.leftInput);
    const right = block.rightBlock ? this.generateBlockCode(block.rightBlock) : this.evaluateInput(block.rightInput);
    return `${left} ${block.operator} ${right}`;
  }

  private generateComparisonLogicCode(block: ComparisonLogicBlock): string {
    if (!block.leftBlock || !block.rightBlock) {
      return 'false';
    }
    const left = this.generateConditionCode(block.leftBlock);
    const right = this.generateConditionCode(block.rightBlock);
    return `(${left} ${block.operator} ${right})`;
  }

  private evaluateInput(input: any): any {
    if (typeof input === 'object' && input !== null) {
      if (input.type === 'variable') {
        return store.getters['variables/getVariableValue'](input.name);
      } else if (input.type === 'mathOperator') {
        return this.generateMathOperatorBlockCode(input as MathOperatorBlock);
      } else if (input.default !== undefined) {
        return input.default;
      }
    }
    return JSON.stringify(input);
  }

  private addLine(line: string): void {
    this.javaCode.push(' '.repeat(this.indentationLevel) + line);
  }
}

export default JavaBlockInterpreter;