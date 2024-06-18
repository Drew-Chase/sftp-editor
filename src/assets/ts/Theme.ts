import $ from "jquery";
import {GetSettings, SaveSettings} from "./Settings.ts";

export enum Themes
{
    default,
    light,
    dark
}

export function applyTheme(theme: Themes = Themes.default)
{
    theme = theme === Themes.default ? GetSettings().general.darkMode ? Themes.dark : Themes.light : theme;
    const name: string = theme == Themes.light ? "light" : "dark";
    SaveSettings({...GetSettings(), general: {...GetSettings()?.general, darkMode: theme === Themes.dark}});
    $("html").removeClass("dark").removeClass("light").addClass(name);
}

export function getCurrentTheme(): Themes
{
    return GetSettings().general.darkMode ? Themes.dark : Themes.light;
}

export const currentTheme: Themes = getCurrentTheme();