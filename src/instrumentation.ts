export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const socketio = await import("@/socketio");
    await socketio.startWSServer();
  }
}
