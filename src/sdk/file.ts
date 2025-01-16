import { fetch } from "@tauri-apps/plugin-http";
import {
  DefaultSpeechToTextParams,
  type SpeechToTextComputeType,
  type SpeechToTextDevice,
  type SpeechToTextLanguage,
  type SpeechToTextTask,
  type SpeechToTextinterpolateMethod,
  type TranscribeModel,
} from "./constants";
import { getApiBase } from "./utils";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface FileSSTResponse {
  identifier: string;
  message: string;
}

export interface SpeechToTextParams {
  language?: SpeechToTextLanguage;
  task?: SpeechToTextTask;
  model?: TranscribeModel;
  device?: SpeechToTextDevice;
  deviceIndex?: number;
  threads?: number;
  batchSize?: number;
  chunkSize?: number;
  computeType?: SpeechToTextComputeType;
  alignModel?: string;
  interpolateMethod?: SpeechToTextinterpolateMethod;
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

const mapParamsToQuery = (
  params: SpeechToTextParams,
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
    {} as Record<string, string>,
  );
};

export const SpeechToText = async (
  fileData: Uint8Array,
  params = DefaultSpeechToTextParams,
): Promise<FileSSTResponse> => {
  const mappedParams = mapParamsToQuery(params);
  const queryString = new URLSearchParams(mappedParams).toString();
  const url = `${getApiBase()}/speech-to-text?${queryString}`;
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
