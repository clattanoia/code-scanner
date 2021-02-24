const message = 'hello world';

export const printMsg = (msg: string = message): string => {
  return `${msg}!`;
};

printMsg(message);
