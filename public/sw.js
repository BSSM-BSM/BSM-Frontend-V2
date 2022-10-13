// 푸시알림을 받았을 때
self.addEventListener('push', event => {
    const payload = JSON.parse(event.data.text());
    event.waitUntil(
        registration.showNotification(payload.title, {
            body: payload.body,
            data: {
                link: payload.link
            },
        })
    );
});

// 알림을 클릭할 때
self.addEventListener('notificationclick', event => {
    clients.openWindow(event.notification.data.link);
});