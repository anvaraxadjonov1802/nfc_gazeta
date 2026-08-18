import { put } from "@vercel/blob";

/**
 * Uploads a generated page-audio WAV file to Vercel Blob and returns its
 * public, permanent URL — this is what gets saved onto the page's `audio`
 * field. Requires either a connected Blob store (OIDC, automatic on
 * Vercel) or a `BLOB_READ_WRITE_TOKEN` environment variable for local/
 * self-hosted runs.
 */
export async function uploadAudioToBlob(
  buffer: Buffer,
  pathname: string,
): Promise<string> {
  const blob = await put(pathname, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: "audio/wav",
  });

  return blob.url;
}
