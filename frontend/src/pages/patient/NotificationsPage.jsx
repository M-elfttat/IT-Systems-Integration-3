import { useMemo, useState } from "react";
import { EmptyState, PageHeader } from "../../components/common";
import { notificationsStorage } from "../../utils/notificationsStorage";

export default function NotificationsPage() {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const notifications = useMemo(() => notificationsStorage.all(), [refreshFlag]);

  const clear = () => {
    notificationsStorage.clear();
    setRefreshFlag((n) => n + 1);
  };

  return (
    <section>
      <PageHeader title="Notifications" subtitle="Booking confirmations and system alerts" />
      <div className="actions">
        <button className="btn" onClick={clear}>Clear Notifications</button>
      </div>
      {!notifications.length ? (
        <EmptyState text="No notifications yet. Book an appointment to receive updates." />
      ) : (
        notifications.map((n) => (
          <div className="card" key={n.id}>
            <h3>{n.title}</h3>
            <p>{n.message}</p>
            <small>{new Date(n.created_at).toLocaleString()}</small>
          </div>
        ))
      )}
    </section>
  );
}
