let musicVolume: number = 0.2;
let sfxVolume: number = 0.2;

export function playMusic(clip: cc.AudioClip) {
    cc.audioEngine.playMusic(clip, true);
}

export function playSFX(clip: cc.AudioClip) {
    cc.audioEngine.playEffect(clip, false);
}

export function setMusicVolume(volume: number) {
    musicVolume = volume;
    cc.audioEngine.setMusicVolume(volume);
}

export function setSFXVolume(volume: number) {
    sfxVolume = volume;
    cc.audioEngine.setEffectsVolume(volume);
}