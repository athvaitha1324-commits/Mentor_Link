import { useForm } from 'react-hook-form';
import { api } from '../lib/api';

export default function ProofUploader({ taskId, onUploaded }) {
  const { register, handleSubmit, reset } = useForm();

  async function onSubmit(data) {
    // Upload file to drive first
    const form = new FormData();
    form.append('file', data.file[0]);
    const up = await api.post('/proofs/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    const payload = {
      taskId,
      driveFileId: up.data.driveFileId,
      driveLink: up.data.driveLink,
      originalName: up.data.originalName,
      mimeType: up.data.mimeType,
      notes: data.notes,
    };
    await api.post('/proofs', payload);
    reset();
    onUploaded?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input className="input" type="file" accept="application/pdf,image/*" {...register('file')} />
      <input className="input" placeholder="Notes (optional)" {...register('notes')} />
      <button className="btn-primary" type="submit">Upload Proof</button>
    </form>
  );
}