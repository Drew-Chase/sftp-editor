import $ from "jquery";
import {currentSettings, GetSettings, SaveSettings} from "./Settings.ts";

export enum Themes
{
    default,
    light,
    dark
}

export function applyTheme(theme: Themes = Themes.default)
{
    if (!currentSettings) return;
    theme = theme === Themes.default ? currentSettings?.general_settings?.dark_mode ? Themes.dark : Themes.light : theme;
    const name: string = theme == Themes.light ? "light" : "dark";
    SaveSettings({...GetSettings(), general_settings: {...currentSettings?.general_settings, dark_mode: theme === Themes.dark}});
    $("html").removeClass("dark").removeClass("light").addClass(name);
}

export function getCurrentTheme(): Themes
{
    if (!currentSettings) return Themes.light;
    return currentSettings?.general_settings?.dark_mode ? Themes.dark : Themes.light;
}

export const currentTheme: Themes = getCurrentTheme();