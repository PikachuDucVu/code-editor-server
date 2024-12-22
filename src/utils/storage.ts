type InmemStorage = {
  userToken: string | null;
  enableMusic: boolean;
  enableSound: boolean;
  policyApproved?: boolean;
  instructViewed?: boolean;
};

const inmemStorage: InmemStorage = {
  userToken: null,
  enableMusic: true,
  enableSound: true,
};

export const getMusicSetting = (): boolean => {
  try {
    const enableMusic = localStorage.getItem("setting::enableMusic");

    if (enableMusic) {
      return JSON.parse(enableMusic);
    } else {
      setMusicSetting(true);
      return true;
    }
  } catch (error) {
    return inmemStorage.enableMusic;
  }
};

export const setMusicSetting = (isEnable: boolean) => {
  try {
    localStorage.setItem("setting::enableMusic", isEnable.toString());
  } catch (error) {
    inmemStorage.enableMusic = isEnable;
  }
};

export const setSoundFXSetting = (isEnable: boolean) => {
  try {
    localStorage.setItem("setting::enableSound", isEnable.toString());
  } catch (error) {
    inmemStorage.enableSound = isEnable;
  }
};

export const getSoundFXSetting = (): boolean => {
  try {
    const enableSound = localStorage.getItem("setting::enableSound");

    if (enableSound) {
      return JSON.parse(enableSound);
    } else {
      setSoundFXSetting(true);
      return true;
    }
  } catch (error) {
    return inmemStorage.enableSound;
  }
};

export const setPolicyApproved = (approved: boolean) => {
  try {
    localStorage.setItem("setting::policyApproved", approved.toString());
  } catch (error) {
    inmemStorage.policyApproved = approved;
  }
};

export const getPolicyApproved = (): boolean | undefined => {
  try {
    const enableSound = localStorage.getItem("setting::policyApproved");

    if (enableSound) {
      return JSON.parse(enableSound);
    } else {
      return undefined;
    }
  } catch (error) {
    return inmemStorage.policyApproved;
  }
};

export const setInstructViewed = (viewed: boolean) => {
  try {
    localStorage.setItem("setting::instructViewedGame3", viewed.toString());
  } catch (error) {
    inmemStorage.instructViewed = viewed;
  }
};

export const getInstructViewed = (): boolean | undefined => {
  try {
    const viewed = localStorage.getItem("setting::instructViewedGame3");

    if (viewed) {
      return viewed === "true";
    } else {
      return undefined;
    }
  } catch (error) {
    return inmemStorage.instructViewed;
  }
};
