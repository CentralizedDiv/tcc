import api from "src/config/api";
import { ArrayResponse } from "src/utils/util.types";
import { CreateSystemDto } from "./store/systems.actions";
import { ISystem } from "./types/system.model";

async function fetchSystems() {
  const response = await api.get<ArrayResponse<ISystem>>("systems");
  return response.data;
}
async function createSystem(createSystemDto: CreateSystemDto) {
  const response = await api.post<ISystem>("systems", createSystemDto);
  return response.data;
}
async function updateSystem(
  id: string,
  updateSystemDto: Partial<CreateSystemDto>
) {
  const response = await api.patch<ArrayResponse<ISystem>>(
    `systems/${id}`,
    updateSystemDto
  );
  return response.data;
}
function deleteSystem(id: string) {
  return api.delete(`systems/${id}`);
}
const endpoints = { fetchSystems, createSystem, updateSystem, deleteSystem };
const systemsApi = endpoints;

export { systemsApi };
