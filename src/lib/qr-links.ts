export function isLoopbackOrigin(origin: string) {
  const host = new URL(origin).hostname.toLowerCase();
  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "[::1]" ||
    /^127\./.test(host) ||
    host === "0.0.0.0" ||
    host === "[::]"
  );
}
export function tagEntryLink(origin: string, tagId: string, demo: boolean) {
  return new URL(demo ? "/prueba-qr" : `/t/${encodeURIComponent(tagId)}`, origin).href;
}
