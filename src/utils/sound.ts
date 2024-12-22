import { Howl } from "howler";
import { getMusicSetting, getSoundFXSetting } from "./storage";
export enum SoundFxId {
  CLICK_BUTTON = "ClickButton",
  VOUCHER_GIFT = "VoucherGift",
  DROP_ITEM = "DropItem",
  TAKE_ITEM = "TakeItem",
  MISS_ITEM = "MissItem",
  WISH = "Wish",
  CHARACTER_GIFT = "CharacterGift",
  BOMB = "Bomb",
}
export enum MusicId {
  THEME = "ThemeSound",
}

export enum AudioType {
  MUSIC,
  SOUND_FX,
}

class SoundUtils {
  playingBgMusics: Array<string> = [];
  loadedSounds: { [key: string]: Howl } = {};
  soundMuteState: { [key: string]: boolean } = {};

  isMusicEnable = false;
  isSoundFxEnable = false;
  isFocus = false;

  constructor() {
    Object.values(MusicId).forEach((item) => {
      this.soundMuteState[`${item}_${AudioType.MUSIC}`] = false;
    });
    Object.values(SoundFxId).forEach((item) => {
      this.soundMuteState[`${item}_${AudioType.SOUND_FX}`] = false;
    });
  }

  loadSound = (
    assetPath: string,
    soundName: string,
    isloop = false,
    volume = 1
  ) =>
    new Promise<void>((resolve) => {
      if (this.loadedSounds[soundName]) resolve();
      const sound = new Howl({
        src: [`${assetPath}${soundName}.mp3`],
        volume,
        loop: isloop,
        // html5: true,
        onloaderror: (soundId: number, error: unknown) => {
          //
        },
        onplayerror: (soundId: number, error: unknown) => {
          //
        },
      });

      sound.once("load", () => {
        this.loadedSounds[soundName] = sound;
        const audioType = this.isSoundFx(soundName)
          ? AudioType.SOUND_FX
          : AudioType.MUSIC;

        const muted = Object.keys(this.soundMuteState).find(
          (item) => item === `${soundName}_${audioType}`
        );
        if (muted !== undefined && muted !== null) {
          try {
            this.loadedSounds[soundName].mute(this.soundMuteState[muted]);
          } catch (error) {
            console.error(error);
          }
        }
        console.log("loaded", soundName);
        resolve();
      });
    });

  isSoundFx = (soundName: string) => {
    return !!Object.values(SoundFxId).find(
      (item) => (item as string) === soundName
    );
  };

  setIsFocus = (isFocus: boolean) => {
    this.isFocus = isFocus;
  };

  setMusicEnable = (isEnable: boolean) => {
    this.isMusicEnable = isEnable;
  };

  setSoundFxEnable = (isEnable: boolean) => {
    this.isSoundFxEnable = isEnable;
  };

  mute = (type: AudioType, isMuted: boolean): boolean => {
    if (type === AudioType.SOUND_FX) {
      Object.values(SoundFxId).forEach((sound) => {
        this.soundMuteState[`${sound}_${AudioType.SOUND_FX}`] = isMuted;
      });
    }

    if (type === AudioType.MUSIC) {
      Object.values(MusicId).forEach((sound) => {
        this.soundMuteState[`${sound}_${AudioType.MUSIC}`] = isMuted;
      });
    }

    let success = true;

    Object.keys(this.loadedSounds).forEach((key) => {
      if (
        (this.isSoundFx(key) && type === AudioType.SOUND_FX) ||
        (!this.isSoundFx(key) && type === AudioType.MUSIC)
      ) {
        try {
          this.loadedSounds[key]?.mute(isMuted);
        } catch (error) {
          console.error(error);
          success = false;
        }
      }
    });

    return success;
  };

  muteAll = (isMuted: boolean) => {
    if (this.isMusicEnable) {
      this.mute(AudioType.MUSIC, isMuted);
    }
    if (this.isSoundFxEnable) {
      this.mute(AudioType.SOUND_FX, isMuted);
    }
  };

  initSounds = async (assetPath: string) => {
    await Promise.all([
      this.loadSound(assetPath, MusicId.THEME, true, 0.1).then(() => {}),
      // this.loadSound(assetPath, SoundFxId.CHARACTER_GIFT, false, 0.75),
      // this.loadSound(assetPath, SoundFxId.CLICK_BUTTON, false, 0.75),
      // this.loadSound(assetPath, SoundFxId.DROP_ITEM, false, 0.75),
      // this.loadSound(assetPath, SoundFxId.MISS_ITEM, false, 0.75),
      // this.loadSound(assetPath, SoundFxId.TAKE_ITEM, false, 0.3),
      // this.loadSound(assetPath, SoundFxId.VOUCHER_GIFT, false, 0.75),
      // this.loadSound(assetPath, SoundFxId.WISH, false, 0.75),
      // this.loadSound(assetPath, SoundFxId.BOMB, false, 0.5),
    ]);
  };

  play = (soundName: string) => {
    const isBgMusic = this.isBgMusic(soundName);

    if (isBgMusic) {
      if (this.playingBgMusics.includes(soundName)) return;
      this.playingBgMusics.push(soundName);
    }

    const sound = this.loadedSounds[soundName];
    if ((isBgMusic && sound && !sound?.playing()) || sound) {
      try {
        sound.play();
      } catch (error) {
        console.error(error);
      }
    }
  };

  stop = (soundName: string) => {
    if (this.isBgMusic(soundName)) {
      const soundIndex = this.playingBgMusics.findIndex(
        (item) => item === soundName
      );
      if (soundIndex > -1) {
        this.playingBgMusics.splice(soundIndex, 1);
      }
    }

    try {
      this.loadedSounds[soundName]?.stop();
    } catch (error) {
      console.error(error);
    }
  };

  private isBgMusic = (soundName: string) => {
    return Object.values(MusicId as any).includes(soundName);
  };
}

export const soundUtils = new SoundUtils();
