import { Socket } from "node:net";

export async function checkTcpReachable(input: { host: string; port: number; timeoutMs?: number }): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new Socket();
    const timeout = input.timeoutMs ?? 1000;

    const finish = (reachable: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(reachable);
    };

    socket.setTimeout(timeout);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
    socket.connect(input.port, input.host);
  });
}
