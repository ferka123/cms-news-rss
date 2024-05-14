import { processEnv } from "../env";

const API_URL = `${processEnv.IMPORTER_URL}:${processEnv.IMPORTER_PORT}`;

type ApiRsponse = { status: number; msg: string };

export const removeImporterSource = async (
  ids: number[]
): Promise<ApiRsponse> => {
  return fetch(`${API_URL}/task`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to delete source");
    return res.json();
  });
};

export const updateImporterSource = async (id: number): Promise<ApiRsponse> => {
  return fetch(`${API_URL}/task/${id}`, { method: "POST" }).then((res) => {
    if (!res.ok) throw new Error("Failed to update source");
    return res.json();
  });
};

export const updateImporterStatus = async (
  ids: number[],
  paused: boolean
): Promise<ApiRsponse> => {
  return fetch(`${API_URL}/task/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids, paused }),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to update status");
    return res.json();
  });
};
