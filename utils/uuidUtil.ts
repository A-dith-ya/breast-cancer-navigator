import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import config from "@/config";
import logger from "@/utils/logger";

export const getOrCreateUUID = async (): Promise<string> => {
  let uuidValue = await AsyncStorage.getItem(config.UUID_KEY);

  if (!uuidValue) {
    uuidValue = uuid.v4();
    logger.log("Generated UUID:", uuidValue);
    await AsyncStorage.setItem(config.UUID_KEY, uuidValue);
  }

  return uuidValue;
};
