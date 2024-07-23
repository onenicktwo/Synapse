

export function getBlockComponent(type: string): string | null {
    switch (type) {
      case 'print':
        return 'PrintBlock';
      case 'ifThen':
        return 'IfThenBlock';
        case 'createVariable':
            return 'CreateVariableBlock';
          case 'changeVariable':
            return 'ChangeVariableBlock';
          case 'variable':
            return 'VariableBlock';
      default:
        console.error(`Unknown block type: ${type}`);
        return null;
    }
  }