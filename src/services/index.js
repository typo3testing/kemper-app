import createRoomPlanner from "viewar-room-planner";
import createTranslationProvider from "./translations";

export const roomPlanner = createRoomPlanner(window);

export const translationProvider = createTranslationProvider();

export const translate = (id, asHtml) =>
  translationProvider ? translationProvider.translate(id, asHtml) : id;
