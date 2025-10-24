let hapticsEnabled: boolean = true;

export function playHaptics(duration: number = 50) {
    if(!navigator.vibrate) return;
    if(!hapticsEnabled) return;

    navigator.vibrate(duration);
}

export function setHaptics(enable: boolean) {
    hapticsEnabled = enable;
}
