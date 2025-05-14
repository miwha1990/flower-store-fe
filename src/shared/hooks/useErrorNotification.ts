import { useNotifications } from "@toolpad/core/useNotifications";
import { useEffect } from "react";

export function useErrorNotification(error: unknown, severity: 'error' | 'warning' | 'info' | 'success' = 'error') {
  const notifications = useNotifications();
  
  useEffect(() => {
    if (!error) {
      return () => {};
    }
    // preview-start
    const key = notifications.show(`${error}`, {
      severity,
      autoHideDuration: 5000,
    });
    return () => {
      notifications.close(key);
    };
    // preview-end
  }, [notifications, error]);

}