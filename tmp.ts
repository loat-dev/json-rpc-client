import * as ansi from "@std/cli/unstable-ansi";
import {promptSecret} from "@std/cli/prompt-secret";
import {promptSelect} from "@std/cli/unstable-prompt-select";
import * as colors from "@std/fmt/colors";

function write(data : string) {
  Deno.stdout.write(new TextEncoder().encode(data));
}

const address = prompt('Address (<management-server-host>:<management-server-port>):');
if (address === '') {
  console.log(colors.red('Please provide an address!'));
  
  Deno.exit(1);
}
const token = promptSecret('Token (<management-server-secret>):');
if (token === '') {
  console.log(colors.red('Please provide a token!'));
  
  Deno.exit(1);
}
const printPretty = promptSelect('Print pretty?', ['Yes', 'No']);

console.clear();
write(ansi.setScrollableRegion(1, Deno.consoleSize().rows - 2));


const ws = new WebSocket(`ws://${address}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

ws.addEventListener('error', () => {

});

ws.addEventListener('message', ({data}) => {
  write(ansi.setCursorPosition(Deno.consoleSize().rows - 2, 0));
  const message = printPretty === 'Yes' ? Deno.inspect(JSON.parse(data), {
    colors: true,
    breakLength: Deno.consoleSize().columns,
    depth: Infinity,
    compact: false,
    iterableLimit: Infinity,
    strAbbreviateSize: Infinity,
  }) : JSON.stringify(JSON.parse(data))
  for (const line of message.split('\n')) {
    write(line + '\n');
  }
  write(ansi.setCursorPosition(Deno.consoleSize().rows, 3));
});

ws.addEventListener('close', () => {

});

ws.addEventListener('open', () => {
  write(ansi.setCursorPosition(Deno.consoleSize().rows - 1, 0));
  write(colors.gray('\u2500'.repeat(Deno.consoleSize().columns) + '\n> '));
});

for await (const messageRaw of Deno.stdin.readable) {
  const message = new TextDecoder().decode(messageRaw);
  
  write(ansi.setCursorPosition(Deno.consoleSize().rows - 2, 0));
  write(colors.gray('\n> ') + message);

  write(ansi.setCursorPosition(Deno.consoleSize().rows - 1, 0));
  write(colors.gray('\u2500'.repeat(Deno.consoleSize().columns) + '\n> '));
  write(ansi.eraseCharacters(100));
  write(ansi.setCursorPosition(Deno.consoleSize().rows - 2, 0));
  if (message.trim() !== '') {
    ws.send(message);
  } else {
    write(ansi.setCursorPosition(Deno.consoleSize().rows, 3));
  }
}
