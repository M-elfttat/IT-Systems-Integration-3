const KEY = "patient_notifications";

export const notificationsStorage = {
  all() {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  },
  add(notification) {
    const next = [notification, ...this.all()].slice(0, 100);
    localStorage.setItem(KEY, JSON.stringify(next));
  },
  clear() {
    localStorage.removeItem(KEY);
  },
};
