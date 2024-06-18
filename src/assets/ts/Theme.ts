import $ from "jquery";

export enum themes
{
    default,
    light,
    dark
}

export function applyTheme(theme: themes = themes.default)
{
    const name: string = theme == themes.light ? "light" : theme == themes.dark ? "dark" : (localStorage.getItem("theme") ?? "light");
    localStorage.setItem("theme", name);
    $("html").removeClass("dark").removeClass("light").addClass(name);
}

export function getCurrentTheme(): themes
{
    switch (localStorage.getItem("theme"))
    {
        case "light":
            return themes.light;
        case "dark":
        default:
            return themes.dark;
    }
}

export const currentTheme: themes = getCurrentTheme();