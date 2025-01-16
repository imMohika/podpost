import { queryOptions } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";
import { getApiBase } from "./utils";
import {
  SpeechToTextComputeType,
  SpeechToTextDevice,
  SpeechToTextLanguage,
  SpeechToTextTask,
} from "./constants";

export const taskTypes = ["transcription", "full_process"] as const;
export type TaskType = (typeof taskTypes)[number];

export interface TaskStatus {
  identifier: string;
  status: string;
  task_type: TaskType;
}

export const TaskAll = async (): Promise<TaskStatus[]> => {
  console.info("Fetching all tasks...");
  const url = `${getApiBase()}/task/all`;

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
  task_params: {
    language: SpeechToTextLanguage;
    task: SpeechToTextTask;
    device: SpeechToTextDevice;
    device_index: number;
    threads: 0;
    batch_size: number;
    chunk_size: 20;
    compute_type: SpeechToTextComputeType;
    asr_options: {
      beam_size: number;
      best_of: number;
      patience: number;
      length_penalty: number;
      temperatures: number;
      compression_ratio_threshold: number;
      log_prob_threshold: number;
      no_speech_threshold: number;
      initial_prompt: string | null;
      suppress_tokens: Array<number>;
      suppress_numerals: boolean;
      hotwords: string;
    };
  };
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
  console.info(`Fetching task info for ${identifier}...`);
  const url = `${getApiBase()}/task/${identifier}`;

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

export const TaskDelete = async (identifier: string): Promise<void> => {
  console.info(`Deleting task with id ${identifier}...`);
  const url = `${getApiBase()}/task/${identifier}/delete`;

  return new Promise((r) => {
    fetch(url, {
      method: "DELETE",
    }).then(() => r());
  });
};
