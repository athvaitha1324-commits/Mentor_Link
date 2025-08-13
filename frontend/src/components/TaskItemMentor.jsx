import MeetingLinkButton from './MeetingLinkButton.jsx';

export default function TaskItemMentor({ task, onRefresh }) {
  return (
    <li className="border p-2 rounded">
      <div className="font-medium">{task.title}</div>
      <div className="text-sm text-gray-600">Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}</div>
      {task.attachment?.driveLink && (
        <a className="text-blue-600 text-sm" href={task.attachment.driveLink} target="_blank">Attachment</a>
      )}
      <div className="flex items-center gap-2 mt-1">
        {task.meetingLink ? (
          <div className="text-sm">Meeting: <a className="text-blue-600" href={task.meetingLink} target="_blank">{task.meetingLink}</a></div>
        ) : (
          <MeetingLinkButton taskId={task._id} onCreated={onRefresh} />
        )}
      </div>
    </li>
  );
}