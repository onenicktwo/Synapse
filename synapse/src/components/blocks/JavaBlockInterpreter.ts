import store from "@/store";
import { Block, PrintBlock } from "./types";

class JavaBlockInterpreter {
    private javaCode: string[] = [];
  
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
      }
    }
  
    private generatePrintBlockCode(block: PrintBlock): void {
      const value = this.evaluateInput(block.inputs[0]);
      this.javaCode.push(`System.out.println(${value});`);
    }

    private evaluateInput(input: any): any {
        console.log('Evaluating input:', input);
        if (typeof input === 'object' && input !== null) {
          if (input.type === 'variable') {
            return store.getters['variables/getVariableValue'](input.name);
          } else if (input.default !== undefined) {
            return input.default;
          }
        }
        return input;
      }
}

export default JavaBlockInterpreter