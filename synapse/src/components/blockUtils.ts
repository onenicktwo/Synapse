import { Block, BlockComponentName, BlockTypeToComponentName } from "./blocks/types";

export function getBlockComponent(type: Block['type']): BlockComponentName {
  return (BlockTypeToComponentName[type as keyof typeof BlockTypeToComponentName] as BlockComponentName) || 'UnknownBlock';
}