import { queryOptions } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";

export type TaskType = "transcription" | "full_process";

export interface TaskStatus {
  identifier: string;
  status: string;
  task_type: TaskType;
}

export const TaskAll = async (): Promise<TaskStatus[]> => {
  const base = "http://localhost:8200";
  console.info("Fetching all tasks...");
  const url = `${base}/task/all`;

  await new Promise((r) => setTimeout(r, 500));

  const response = await fetch(url);
  type JSONResponse = {
    tasks: TaskStatus[];
  };
  const { tasks }: JSONResponse = await response.json();
  console.log({ tasks });
  return tasks ?? [];
};

export const TaskAllQueryOptions = queryOptions({
  queryKey: ["task-all"],
  queryFn: () => TaskAll(),
});

export interface ResultSegment {
  text: string;
  speaker: string | null;
  start: number;
  end: number;
}

export interface TaskResult {
  segments: ResultSegment[];
  language: string;
}

export interface TaskMetadata {
  task_type: string;
  // todo)) task_params
  // "task_params": {
  //   "language": "en",
  //   "task": "transcribe",
  //   "model": "tiny.en",
  //   "device": "cuda",
  //   "device_index": 0,
  //   "threads": 0,
  //   "batch_size": 8,
  //   "chunk_size": 20,
  //   "compute_type": "float16",
  //   "asr_options": {
  //     "beam_size": 5,
  //     "best_of": 5,
  //     "patience": 1,
  //     "length_penalty": 1,
  //     "temperatures": 0,
  //     "compression_ratio_threshold": 2.4,
  //     "log_prob_threshold": -1,
  //     "no_speech_threshold": 0.6,
  //     "initial_prompt": null,
  //     "suppress_tokens": [
  //       -1
  //     ],
  //     "suppress_numerals": false,
  //     "hotwords": null
  //   },
  vad_options: {
    vad_onset: number;
    vad_offset: number;
  };
  language: string;
  file_name: string | null;
  url: string | null;
  duration: number;
  audio_duration: number;
  start_time: string;
  end_time: string;
}

export interface TaskInfo {
  status: string;
  result: TaskResult | null;
  metadata: TaskMetadata;
  error: string;
}

export const TaskInfo = async (identifier: string): Promise<TaskInfo> => {
  const base = "http://localhost:8200";
  console.info(`Fetching task info for ${identifier}...`);
  const url = `${base}/task/${identifier}`;

  await new Promise((r) => setTimeout(r, 500));

  const response = await fetch(url);
  const info: TaskInfo = await response.json();
  console.log({ info });
  return info;
};

export const TaskInfoQueryOptions = (identifier: string) =>
  queryOptions({
    queryKey: ["task", identifier],
    queryFn: () => TaskInfo(identifier),
  });
