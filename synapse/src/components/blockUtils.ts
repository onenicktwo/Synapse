

export function getBlockComponent(type: string): string | null {
    switch (type) {
      case 'print':
        return 'PrintBlock';
      case 'ifThen':
        return 'IfThenBlock';
      default:
        console.error(`Unknown block type: ${type}`);
        return null;
    }
  }