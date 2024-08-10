import store from "@/store";
import {
  Block,
  PrintBlock,
  IfThenBlock,
  CreateVariableBlock,
  ComparisonOperatorBlock,
  ComparisonLogicBlock,
  RepeatBlock,
  MathOperatorBlock,
  VariableBlock,
  VariableChangeBlock,
  FunctionBlock,
  FunctionGetterBlock,
} from "./types";

class JavaBlockInterpreter {
  private javaCode: string[] = [];
  private indentationLevel: number = 2;

  generateJavaCode(): string {
    const workspaceNames = store.getters['workspace/getAllWorkspaces'];
    let allClassesCode: string[] = [];

    for (const workspaceName of workspaceNames) {
      this.javaCode = [`class ${workspaceName} {`];
      this.indentationLevel = 2;

      // Set the active workspace to get its blocks
      store.dispatch('workspace/setActiveWorkspace', 
        store.state.workspace.workspaces.find((w: { name: any; }) => w.name === workspaceName)?.id
      );

      const workspaceBlocks = store.getters['workspace/getWorkspaceBlocks'];
      
      for (const block of workspaceBlocks) {
        this.generateBlockCode(block);
      }

      this.javaCode.push('}');
      allClassesCode = allClassesCode.concat(this.javaCode);
      allClassesCode.push(''); // Add an empty line between classes
    }

    return allClassesCode.join('\n');
  }

  private generateBlockCode(block: any): string | void {
    switch (block.type) {
      case 'print':
        return this.generatePrintBlockCode(block as PrintBlock);
      case 'ifThen':
        return this.generateIfThenBlockCode(block as IfThenBlock);
      case 'createVariable':
        return this.generateCreateVariableBlockCode(block as CreateVariableBlock);
      case 'repeat':
        return this.generateRepeatBlockCode(block as RepeatBlock);
      case 'mathOperator':
        return this.generateMathOperatorBlockCode(block as MathOperatorBlock);
      case 'variable':
        return this.generateVariableBlockCode(block as VariableBlock);
      case 'variableChange':
        return this.generateVariableChangeBlockCode(block as VariableChangeBlock);
      case 'function':
        return this.generateFunctionBlockCode(block as FunctionBlock);
      case 'functionGetter':
        return this.generateFunctionGetterBlockCode(block as FunctionGetterBlock);
      default:
        console.warn(`Unexpected block type: ${block.type}`);
        break;
    }
  }

  private generateFunctionGetterBlockCode(block: FunctionGetterBlock): void {
    const funcBlock = store.getters['functions/getFunctionById'](block.functionId);
    this.addLine(funcBlock.name + '();');
  }

  private generateFunctionBlockCode(block: FunctionBlock): void{
    if (block.functionName == 'main') {
      this.addLine('public static void main(String[] args) {');
    } else {
      this.addLine('public static void ' + block.functionName + '() {');
    }
    for(const nestedBlock of block.nestedBlocks) {
      this.generateBlockCode(nestedBlock);
    }
    this.addLine('}');
  }

  private generatePrintBlockCode(block: PrintBlock): void {
    if (block.nestedBlock != null) { 
      const value = this.generateBlockCode(block.nestedBlock) as string;
      this.addLine(`System.out.println(${value});`);
    } else {
      const value = this.evaluateInput(block.inputs[0]);
      this.addLine(`System.out.println("${value}");`);
    }
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
      // Handle the case where there's no condition
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
    const left = block.leftBlock ? this.generateMathOperatorBlockCode(block.leftBlock as MathOperatorBlock) : block.leftInput;
    const right = block.rightBlock ? this.generateMathOperatorBlockCode(block.rightBlock as MathOperatorBlock) : block.rightInput;
    return `(${left} ${block.operator} ${right})`;
  }

  private generateVariableBlockCode(block: VariableBlock): string {
    return store.getters['variables/getVariableById'](block.variableId).name;
  }

  private generateVariableChangeBlockCode(block: VariableChangeBlock) {
    this.addLine(store.getters['variables/getVariableById'](block.variableId).name + ' = ' + block.value + ';');
  }

  private generateConditionCode(block: Block | null): string {
    if (!block) {
      console.warn('Null block in condition');
      return 'true'; // Default to true if the block is null
    }

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
    const left = this.evaluateInput(block.leftBlock || block.leftInput);
    const right = this.evaluateInput(block.rightBlock || block.rightInput);
    return `${left} ${block.operator} ${right}`;
  }

  private generateComparisonLogicCode(block: ComparisonLogicBlock): string {
    const left = block.leftBlock ? this.generateConditionCode(block.leftBlock) : 'true';
    const right = block.rightBlock ? this.generateConditionCode(block.rightBlock) : 'true';
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