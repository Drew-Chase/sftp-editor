import $ from "jquery";
import Log from "./Logger.ts";


/**
 * A keyboard shortcut object.
 */
export interface KeyboardShortcut
{
    key: string[];
    modifierKeys: ModifierKey[];
    description?: string;
    callback: () => void;
}

/**
 * A list of supported modifier keys.
 */
export enum ModifierKey
{
    Control = "Control",
    Shift = "Shift",
    Alt = "Alt",
}

/**
 * A list of common keyboard keys that are not single characters.
 */
export enum Key
{
    ArrowUp = "ArrowUp",
    ArrowDown = "ArrowDown",
    ArrowLeft = "ArrowLeft",
    ArrowRight = "ArrowRight",
    Enter = "Enter",
    Escape = "Escape",
    Backspace = "Backspace",
    Delete = "Delete",
    Space = " ",
    Tab = "Tab",
}

export default class KeyboardShortcuts
{
    /**
     * The singleton instance of KeyboardShortcuts.
     */
    public static readonly instance = new KeyboardShortcuts();
    private readonly shortcuts: KeyboardShortcut[] = [];
    private readonly pressedModifiers: ModifierKey[] = [];

    private constructor()
    {
        $(document)
            .on("keydown", e =>
            {
                for (const modifier of Object.values(ModifierKey))
                {
                    if (e.key === modifier)
                    {
                        if (!this.pressedModifiers.includes(modifier))
                        {
                            Log.debug("Modifier Key Pressed: {0}", modifier);
                            this.pressedModifiers.push(modifier);
                        }
                        break;
                    }
                }
            })
            .on("keyup", e =>
            {
                for (const modifier of Object.values(ModifierKey))
                {
                    if (e.key === modifier)
                    {
                        if (!this.pressedModifiers.includes(modifier))
                        {
                            Log.debug("Modifier Key Released: {0}", modifier);
                            this.pressedModifiers.slice(this.pressedModifiers.indexOf(modifier), 1); // Remove the modifier from the array.
                        }
                        break;
                    }
                }

                this.shortcuts.forEach(shortcut =>
                {
                    if (shortcut.key.includes(e.key) && shortcut.modifierKeys.every(modifier => this.pressedModifiers.includes(modifier)))
                    {
                        shortcut.callback();
                    }
                });

            });
    }


    /**
     * Pushes a new keyboard shortcut into the shortcuts array.
     * @param shortcut The keyboard shortcut to add. It must be of type KeyboardShortcut.
     */
    push(shortcut: KeyboardShortcut)
    {
        this.shortcuts.push(shortcut);
    }

    /**
     * Removes a specific keyboard shortcut from the shortcuts array.
     * If the provided shortcut does not exist in the array, no changes will be made.
     * @param shortcut The keyboard shortcut to remove. It must be of type KeyboardShortcut.
     */
    remove(shortcut: KeyboardShortcut)
    {
        this.shortcuts.splice(this.shortcuts.indexOf(shortcut), 1);
    }

    /**
     * Clears all keyboard shortcuts in the shortcuts array.
     */
    clear()
    {
        this.shortcuts.splice(0, this.shortcuts.length);
    }

    /**
     * Returns the shortcuts array.
     * @returns An array of KeyboardShortcut.
     */
    get()
    {
        return this.shortcuts;
    }

    /**
     * Returns the array of currently pressed modifiers.
     * @returns An array of ModifierKey.
     */
    getPressedModifiers()
    {
        return this.pressedModifiers;
    }

    /**
     * Checks if a specific modifier is currently being pressed.
     * @param modifier The modifier key to check. It must be of type ModifierKey.
     * @returns A boolean indicating whether or not the modifier is currently pressed.
     */
    isModifierPressed(modifier: ModifierKey)
    {
        return this.pressedModifiers.includes(modifier);
    }

}