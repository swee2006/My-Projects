function ParticipantTable({ participants }) {
  if (!participants.length) {
    return <div className="empty-state">No participants match the current filters.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="participant-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Workshop</th>
            <th>Registered</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant.id}>
              <td>{participant.name}</td>
              <td>{participant.email}</td>
              <td>{participant.phone || "-"}</td>
              <td>{participant.gender}</td>
              <td>{participant.workshop}</td>
              <td>{new Date(participant.registeredAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ParticipantTable;
