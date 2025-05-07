import { keccak256, toHex } from 'viem';

export function getEventTopic(event: string) {
  return keccak256(toHex(event));
}

// Example usage
// const sig = getEventTopic('ComposeExecuted(address,bytes,bool)');
// console.log(sig);
