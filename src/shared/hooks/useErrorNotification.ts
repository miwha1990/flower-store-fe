import { useNotifications } from "@toolpad/core/useNotifications";
import { useEffect } from "react";

export function useErrorNotification(error: unknown, severity: 'error' | 'warning' | 'info' | 'success' = 'error') {
  const notifications = useNotifications();

  useEffect(() => {
    if (!error) {
      return () => { };
    }
    let errorMessage;
    if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    // preview-start
    const key = notifications.show(`${errorMessage}`, {
      severity,
      autoHideDuration: 5000,
    });
    return () => {
      notifications.close(key);
    };
    // preview-end
  }, [notifications, error]);

}