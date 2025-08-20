export default function showNotification(message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Pomodoro Timer", { body: message });
    }
}