const AISHA_BASE_URL = "https://back.aisha.group";

// Aisha's sync TTS endpoint accepts at most 1000 characters per request
// (with an API key). We stay a little under that so any punctuation we add
// back while splitting sentences never pushes a chunk over the real limit.
const MAX_CHUNK_LENGTH = 950;

/**
 * Splits a long page of newspaper text into Aisha-sized chunks, breaking on
 * sentence boundaries where possible so each chunk still reads naturally
 * when synthesized. Falls back to a hard word-boundary split for the rare
 * single "sentence" that is still too long on its own.
 */
export function splitTextIntoChunks(
  text: string,
  maxLength: number = MAX_CHUNK_LENGTH,
): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return [];
  }

  if (normalized.length <= maxLength) {
    return [normalized];
  }

  const sentences =
    normalized.match(/[^.!?;]+[.!?;]*\s*/g) ?? [normalized];

  const chunks: string[] = [];
  let current = "";

  function flushCurrent() {
    if (current.trim()) {
      chunks.push(current.trim());
    }

    current = "";
  }

  for (const rawSentence of sentences) {
    const sentence = rawSentence.trim();

    if (!sentence) {
      continue;
    }

    if (sentence.length > maxLength) {
      // A single sentence is still too long — hard-split by words.
      const words = sentence.split(" ");

      for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;

        if (candidate.length > maxLength) {
          flushCurrent();
          current = word;
        } else {
          current = candidate;
        }
      }

      continue;
    }

    const candidate = current
      ? `${current} ${sentence}`
      : sentence;

    if (candidate.length > maxLength) {
      flushCurrent();
      current = sentence;
    } else {
      current = candidate;
    }
  }

  flushCurrent();

  return chunks;
}

interface AishaSyncResponse {
  audio_path?: string;
  id?: number;
  task_id?: string;
  status?: string;
}

/**
 * Sends one chunk of text to Aisha's synchronous TTS endpoint and returns
 * the path of the generated audio file on Aisha's own servers.
 */
export async function requestAishaAudioPath(
  transcript: string,
  apiKey: string,
): Promise<string> {
  const form = new FormData();
  form.set("transcript", transcript);
  form.set("language", "uz");
  form.set("model", "Gulnoza");
  form.set("mood", "Neutral");
  form.set("speed", "1.0");

  const response = await fetch(
    `${AISHA_BASE_URL}/api/v1/tts/post/`,
    {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: form,
    },
  );

  if (!response.ok) {
    const errorBody = await response
      .text()
      .catch(() => "");

    throw new Error(
      `Aisha TTS xatosi (${response.status}): ${
        errorBody || "noma'lum xatolik"
      }`,
    );
  }

  const data =
    (await response.json()) as AishaSyncResponse;

  if (!data.audio_path) {
    throw new Error(
      "Aisha TTS javobida audio fayl topilmadi (so'rov asinxron navbatga tushgan bo'lishi mumkin — webhook_notification_url yuborilmagani uchun bu kutilmagan holat).",
    );
  }

  return data.audio_path;
}

/**
 * Downloads the raw WAV bytes for a chunk Aisha already generated.
 */
export async function fetchAishaAudioBytes(
  audioPath: string,
  apiKey: string,
): Promise<ArrayBuffer> {
  const url = audioPath.startsWith("http")
    ? audioPath
    : `${AISHA_BASE_URL}${audioPath}`;

  const response = await fetch(url, {
    headers: {
      "X-Api-Key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Aisha audio faylini yuklab bo'lmadi (${response.status}).`,
    );
  }

  return response.arrayBuffer();
}

interface ParsedWav {
  format: Buffer;
  data: Buffer;
}

function parseWav(buffer: Buffer): ParsedWav {
  if (
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WAVE"
  ) {
    throw new Error(
      "Aisha'dan qaytgan fayl yaroqli WAV emas.",
    );
  }

  let offset = 12;
  let fmtChunk: Buffer | null = null;
  let dataChunk: Buffer | null = null;

  while (offset + 8 <= buffer.length) {
    const chunkId = buffer.toString(
      "ascii",
      offset,
      offset + 4,
    );
    const chunkSize = buffer.readUInt32LE(
      offset + 4,
    );
    const chunkStart = offset + 8;
    const chunkEnd = chunkStart + chunkSize;

    if (chunkId === "fmt ") {
      fmtChunk = buffer.subarray(
        chunkStart,
        chunkEnd,
      );
    } else if (chunkId === "data") {
      dataChunk = buffer.subarray(
        chunkStart,
        chunkEnd,
      );
    }

    // Chunks are word-aligned: an odd-sized chunk has one padding byte.
    offset = chunkEnd + (chunkSize % 2);
  }

  if (!fmtChunk || !dataChunk) {
    throw new Error(
      "WAV faylida fmt yoki data bo'limi topilmadi.",
    );
  }

  return {
    format: fmtChunk,
    data: dataChunk,
  };
}

/**
 * Concatenates several WAV chunks (all synthesized with the same voice, so
 * they share the same format) into a single, valid WAV file — a naive
 * byte-concat of whole WAV files would produce a broken audio file for
 * every chunk after the first, so this re-parses each one and only stitches
 * the raw PCM `data` sections together under one shared header.
 */
export function mergeWavBuffers(
  buffers: ArrayBuffer[],
): Buffer {
  if (buffers.length === 0) {
    throw new Error(
      "Birlashtirish uchun audio topilmadi.",
    );
  }

  const parsed = buffers.map((buf) =>
    parseWav(Buffer.from(buf)),
  );

  const referenceFormat = parsed[0].format;

  const hasMismatch = parsed.some(
    (item) => !item.format.equals(referenceFormat),
  );

  if (hasMismatch) {
    throw new Error(
      "Audio bo'laklarining formati bir xil emas, birlashtirib bo'lmadi.",
    );
  }

  const dataBuffers = parsed.map(
    (item) => item.data,
  );

  const totalDataLength = dataBuffers.reduce(
    (sum, item) => sum + item.length,
    0,
  );

  const fmtChunkTotalSize =
    8 + referenceFormat.length;

  const riffChunkSize =
    4 +
    fmtChunkTotalSize +
    8 +
    totalDataLength;

  const header = Buffer.alloc(
    12 + fmtChunkTotalSize + 8,
  );

  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(riffChunkSize, 4);
  header.write("WAVE", 8, "ascii");
  header.write("fmt ", 12, "ascii");
  header.writeUInt32LE(
    referenceFormat.length,
    16,
  );
  referenceFormat.copy(header, 20);

  const dataHeaderOffset =
    20 + referenceFormat.length;

  header.write(
    "data",
    dataHeaderOffset,
    "ascii",
  );
  header.writeUInt32LE(
    totalDataLength,
    dataHeaderOffset + 4,
  );

  return Buffer.concat([
    header,
    ...dataBuffers,
  ]);
}
