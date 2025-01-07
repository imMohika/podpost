import { fetch } from "@tauri-apps/plugin-http";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface FileSSTResponse {
  identifier: string;
  message: string;
}

export interface SpeechToTextParams {
  language?: string;
  task?: "transcribe" | "translate";
  model?:
    | "tiny"
    | "tiny.en"
    | "base"
    | "base.en"
    | "small"
    | "small.en"
    | "medium"
    | "medium.en"
    | "large"
    | "large-v1"
    | "large-v2"
    | "large-v3"
    | "large-v3-turbo";
  device?: "cuda" | "cpu";
  deviceIndex?: number;
  threads?: number;
  batchSize?: number;
  chunkSize?: number;
  computeType?: "int8" | "float16" | "float32";
  alignModel?: string;
  interpolateMethod?: "nearest" | "linear" | "ignore";
  returnCharAlignments?: boolean;
  minSpeakers?: number;
  maxSpeakers?: number;
  beamSize?: number;
  bestOf?: number;
  patience?: number;
  lengthPenalty?: number;
  temperatures?: number;
  compressionRatioThreshold?: number;
  logProbThreshold?: number;
  noSpeechThreshold?: number;
  initialPrompt?: string;
  suppressTokens?: number;
  suppressNumerals?: boolean;
  hotwords?: string;
  vadOnset?: number;
  vadOffset?: number;
}

export const DefaultSpeechToTextParams: SpeechToTextParams = {
  language: "en",
  task: "transcribe",
  model: "tiny.en",
  device: "cuda",
  deviceIndex: 0,
  threads: 0,
  batchSize: 8,
  chunkSize: 20,
  computeType: "float16",
  interpolateMethod: "nearest",
  returnCharAlignments: true,
  minSpeakers: 1,
  beamSize: 5,
  bestOf: 5,
  patience: 1,
  lengthPenalty: 1,
  temperatures: 0,
  compressionRatioThreshold: 2.4,
  logProbThreshold: -1,
  noSpeechThreshold: 0.6,
  suppressTokens: -1,
  vadOnset: 0.5,
  vadOffset: 0.363,
};

const mapParamsToQuery = (
  params: SpeechToTextParams
): Record<string, string> => {
  const mappings: Record<string, string> = {
    deviceIndex: "device_index",
    batchSize: "batch_size",
    chunkSize: "chunk_size",
    computeType: "compute_type",
    alignModel: "align_model",
    interpolateMethod: "interpolate_method",
    returnCharAlignments: "return_char_alignments",
    minSpeakers: "min_speakers",
    maxSpeakers: "max_speakers",
    beamSize: "beam_size",
    bestOf: "best_of",
    lengthPenalty: "length_penalty",
    temperatures: "temperatures",
    compressionRatioThreshold: "compression_ratio_threshold",
    logProbThreshold: "log_prob_threshold",
    noSpeechThreshold: "no_speech_threshold",
    initialPrompt: "initial_prompt",
    suppressTokens: "suppress_tokens",
    suppressNumerals: "suppress_numerals",
    hotwords: "hotwords",
    vadOnset: "vad_onset",
    vadOffset: "vad_offset",
  };

  return Object.entries(params).reduce(
    (query, [key, value]) => {
      if (value !== undefined) {
        query[mappings[key] || key] = value;
      }
      return query;
    },
    {} as Record<string, string>
  );
};

export const SpeechToText = async (
  fileData: Uint8Array,
  params: SpeechToTextParams = {}
): Promise<FileSSTResponse> => {
  const baseURL = "http://localhost:8200";
  const endpoint = "/speech-to-text";
  const mappedParams = mapParamsToQuery(params);
  const queryString = new URLSearchParams(mappedParams).toString();
  const url = `${baseURL}${endpoint}?${queryString}`;
  console.info("Sending file for speech-to-text processing...");

  const form = new FormData();
  form.append("file", new Blob([fileData]), "audio.wav");

  await delay(500);

  const response = await fetch(url, {
    method: "POST",
    body: form,
  });
  const info: FileSSTResponse = await response.json();
  console.log({ info });
  return info;
};
