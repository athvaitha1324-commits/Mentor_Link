import { api } from '../lib/api';

export default function MeetingLinkButton({ taskId, onCreated }) {
  async function create() {
    await api.post(`/tasks/${taskId}/meeting-link`, {});
    onCreated?.();
  }
  return (
    <button className="btn-secondary" onClick={create}>Generate Meeting Link</button>
  );
}