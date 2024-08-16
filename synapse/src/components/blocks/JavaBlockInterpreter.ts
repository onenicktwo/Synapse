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
  ParameterBlock,
  ReturnBlock,
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

      store.dispatch('workspace/setActiveWorkspace', 
        store.state.workspace.workspaces.find((w: { name: any; }) => w.name === workspaceName)?.id
      );

      const workspaceBlocks = store.getters['workspace/getWorkspaceBlocks'];
      
      for (const block of workspaceBlocks) {
        this.generateBlockCode(block);
      }

      this.javaCode.push('}');
      allClassesCode = allClassesCode.concat(this.javaCode);
      allClassesCode.push('');
    }

    return allClassesCode.join('\n');
  }

  private generateBlockCode(block: Block): string | void {
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
      case 'parameter':
        return this.generateParameterCode(block as ParameterBlock);
      case 'return':
        return this.generateReturnCode(block as ReturnBlock);
      default:
        console.warn(`Unexpected block type: ${block.type}`);
        return '';
    }
  }

  private generateReturnCode(block: ReturnBlock): string {
    if (block.valueBlock) {
      return `return ${this.generateBlockCode(block.valueBlock)};`;
    }
    return 'return 0;';
  }

  private generateParameterCode(block: ParameterBlock): string {
    return block.name;
  }

  private generateFunctionGetterBlockCode(block: FunctionGetterBlock): string {
    const funcBlock = store.getters['functions/getFunctionById'](block.functionId);
    if (!funcBlock) {
      console.error(`Function not found with ID: ${block.functionId}`);
      return '';
    }
  
    const paramValues = block.nestedBlocks.map((nestedBlock, index) => {
      if (nestedBlock) {
        return this.generateBlockCode(nestedBlock) || block.parameterValues[index] || '0';
      } else {
        return block.parameterValues[index] || '0';
      }
    });
    const parameterString = paramValues.join(', ');
  
    return `${funcBlock.name}(${parameterString})`;
  }

  private generateFunctionBlockCode(block: FunctionBlock): void {
    const parameterString = block.parameters.map((param: ParameterBlock) => `int ${param.name}`).join(', ');
  
    const returnType = block.returnBlock ? 'int' : 'void';
  
    if (block.functionName === 'main') {
      this.addLine('public static void main(String[] args) {');
    } else {
      this.addLine(`public static ${returnType} ${block.functionName}(${parameterString}) {`); 
    }
  
    for (const nestedBlock of block.nestedBlocks) {
      this.generateBlockCode(nestedBlock);
    }

    if (block.returnBlock) {
      const returnValue = this.generateBlockCode(block.returnBlock);
      this.addLine(`return ${returnValue};`);
    } 
    this.addLine('}');
  }

  private generatePrintBlockCode(block: PrintBlock): void {
    const value = block.nestedBlock 
      ? this.generateBlockCode(block.nestedBlock)
      : this.evaluateInput(block.inputs[0]);
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
      
      if (block.elseBlocks && block.elseBlocks.length > 0) {
        this.addLine('else {');
        this.indentationLevel += 2;
        for (const elseBlock of block.elseBlocks) {
          this.generateBlockCode(elseBlock);
        }
        this.indentationLevel -= 2;
        this.addLine('}');
      }
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
    const left = block.leftBlock ? this.generateBlockCode(block.leftBlock) : block.leftInput;
    const right = block.rightBlock ? this.generateBlockCode(block.rightBlock) : block.rightInput;
    return `(${left} ${block.operator} ${right})`;
  }

  private generateVariableBlockCode(block: VariableBlock): string {
    return store.getters['variables/getVariableById'](block.variableId).name;
  }

  private generateVariableChangeBlockCode(block: VariableChangeBlock): void {
    const variableName = store.getters['variables/getVariableById'](block.variableId).name;
    const value = this.evaluateInput(block.value);
    this.addLine(`${variableName} = ${value};`);
  }

  private generateConditionCode(block: Block): string {
    if (block.type === 'compareOperator') {
      return this.generateComparisonOperatorCode(block as ComparisonOperatorBlock);
    } else if (block.type === 'compareLogic') {
      return this.generateComparisonLogicCode(block as ComparisonLogicBlock);
    } else {
      console.warn(`Unexpected block type in condition: ${block.type}`);
      return 'true';
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
        return store.getters['variables/getVariableById'](input.variableId).name;
      } else if (input.type === 'mathOperator') {
        return this.generateMathOperatorBlockCode(input as MathOperatorBlock);
      } else if (input.type === 'parameter') {
        return this.generateParameterCode(input as ParameterBlock);
      } else if (input.type === 'functionGetter') {
        return this.generateFunctionGetterBlockCode(input as FunctionGetterBlock);
      } else if (input.default !== undefined) {
        return input.default;
      }
    }
    return input;
  }

  private addLine(line: string): void {
    this.javaCode.push(' '.repeat(this.indentationLevel) + line);
  }
}

export default JavaBlockInterpreter;