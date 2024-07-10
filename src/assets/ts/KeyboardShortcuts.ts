import $ from "jquery";

export interface KeyboardShortcut
{
    key: string[];
    modifierKeys: ModifierKey[];
    description?: string;
    callback: () => void;
}

export enum ModifierKey
{
    Control = "Control",
    Shift = "Shift",
    Alt = "Alt",
}

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
    public static readonly instance = new KeyboardShortcuts();
    private readonly shortcuts: KeyboardShortcut[] = [];
    private readonly pressedModifiers: ModifierKey[] = [];

    private constructor()
    {
        $(document)
            .on("keydown", e =>
            {
                if (e.key === ModifierKey.Control)
                {
                    if (!this.pressedModifiers.includes(ModifierKey.Control))
                        this.pressedModifiers.push(ModifierKey.Control);
                } else if (e.key === ModifierKey.Shift)
                {
                    if (!this.pressedModifiers.includes(ModifierKey.Shift))
                        this.pressedModifiers.push(ModifierKey.Shift);
                } else if (e.key === ModifierKey.Alt)
                {
                    if (!this.pressedModifiers.includes(ModifierKey.Alt))
                        this.pressedModifiers.push(ModifierKey.Alt);
                }
            })
            .on("keyup", e =>
            {
                if (e.key === "Control")
                {
                    this.pressedModifiers.splice(this.pressedModifiers.indexOf(ModifierKey.Control), 1);
                } else if (e.key === "Shift")
                {
                    this.pressedModifiers.splice(this.pressedModifiers.indexOf(ModifierKey.Shift), 1);
                } else if (e.key === "Alt")
                {
                    this.pressedModifiers.splice(this.pressedModifiers.indexOf(ModifierKey.Alt), 1);
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


    push(shortcut: KeyboardShortcut)
    {
        this.shortcuts.push(shortcut);
    }

    remove(shortcut: KeyboardShortcut)
    {
        this.shortcuts.splice(this.shortcuts.indexOf(shortcut), 1);
    }

    clear()
    {
        this.shortcuts.splice(0, this.shortcuts.length);
    }

    get()
    {
        return this.shortcuts;
    }

    getPressedModifiers()
    {
        return this.pressedModifiers;
    }

    isModifierPressed(modifier: ModifierKey)
    {
        return this.pressedModifiers.includes(modifier);
    }

}