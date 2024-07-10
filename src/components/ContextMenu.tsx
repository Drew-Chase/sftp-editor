// import $ from "jquery";
// import {Listbox, ListboxItem, ListboxSection} from "@nextui-org/react";
// import React, {createContext, useContext, useEffect, useState} from "react";
//
// export interface ContextMenuContextProps
// {
//     menu: ContextMenuProps;
//     openContextMenu: (props: ContextMenuProps) => {},
//     closeContextMenu: () => {},
// }
//
// export interface ContextMenuProps
// {
//     open: boolean;
//     position: { x: number, y: number };
//     items: ContextMenuItems;
// }
//
// export interface ContextMenuItem
// {
//     title: string;
//     description?: string;
//     icon?: JSX.Element;
//     onClick?: () => void;
// }
//
// export interface ContextMenuItems
// {
//     [key: string]: ContextMenuItem[];
// }
//
// export const MenuContext = createContext<ContextMenuContextProps>({menu: {open: false, position: {x: 0, y: 0}, items: {}}} as ContextMenuContextProps);
//
// export function MenuProvider({children}: { children: React.ReactNode })
// {
//     const [menu, setMenu] = useState<ContextMenuProps>({
//                                                            open: false,
//                                                            position: {x: 0, y: 0},
//                                                            items: {}
//                                                        });
//
//     const openContextMenu = (x: number, y: number, items: ContextMenuItems) =>
//     {
//         setMenu({
//                     open: true,
//                     position: {x, y},
//                     items
//                 });
//     };
//
//     const closeContextMenu = () =>
//     {
//         setMenu(prevMenu => ({...prevMenu, open: false}));
//     };
//
//     return (
//         <MenuContext.Provider value={{menu, openContextMenu, closeContextMenu}}>
//             {children}
//         </MenuContext.Provider>
//     );
// }
//
//
// export default function ContextMenu()
// {
//
//     const {menu, closeContextMenu} = useContext(MenuContext);
//     useEffect(() =>
//               {
//               }, [menu.open]);
//
//     const menuSections: JSX.Element[] = [];
//
//     const sections: string[] = Object.keys(menu.items);
//     for (const section of sections)
//     {
//         const items: ContextMenuItem[] = menu.items[section];
//         menuSections.push(
//             <ListboxSection key={section} title={section}>
//                 {
//                     items.map((item: ContextMenuItem, index: number) => (
//                         <ListboxItem key={index} onClick={item.onClick} description={item.description} startContent={item.icon}>
//                             {item.title}
//                         </ListboxItem>
//                     ))
//                 }
//             </ListboxSection>
//         );
//     }
//
//     return (
//         <div
//             id={"context-menu"}
//             className={
//                 "w-full max-w-[260px] px-1 py-2 rounded-small absolute z-10 shadow-small bg-[rgba(24_,_24_,_27_,_0.9)] backdrop-blur-sm transition-[opacity,scale,transform] max-h-[350px] overflow-y-scroll " +
//                 (menu.open ? "opacity-1 pointer-events-all scale-100" : "opacity-0 pointer-events-none scale-90 transform-gpu")
//             }
//             style={{
//                 left: menu.position.x,
//                 top: menu.position.y
//             }}
//             tabIndex={0}
//             onBlur={() =>
//             {
//                 $("tr[context-menu-item]").css({background: ""}).removeAttr("context-menu-item");
//                 closeContextMenu();
//             }}
//         >
//             <Listbox>
//                 {menuSections}
//             </Listbox>
//         </div>
//     );
// }
//
// export function openContextMenuWithPosition(x: number, y: number, items: ContextMenuItems): ContextMenuProps
// {
//     const menu = $("#context-menu");
//     if (menu.length === 0)
//     {
//         console.error("Context menu not found.");
//         return {} as ContextMenuProps;
//     }
//     menu.css({left: x, top: y});
//     return {
//         open: true,
//         position: {x, y},
//         items
//     };
// }
//
// export function openContextMenuWithMouseEvent(event: MouseEvent, content: ContextMenuItems): ContextMenuProps
// {
//     const menu = $("#context-menu");
//     if (menu.length === 0)
//     {
//         console.error("Context menu not found.");
//         return {} as ContextMenuProps;
//     }
//     const contextMenuWidth: number = menu.width()!;
//     const contextMenuHeight: number = menu.height()!;
//     let x: number = event.clientX - 24;
//     let y: number = event.clientY;
//
//     if (event.clientX + contextMenuWidth + 16 > window.innerWidth)
//     {
//         x = window.innerWidth - contextMenuWidth - 16;
//     }
//     if (event.clientY + contextMenuHeight + 24 > window.innerHeight)
//     {
//         y = window.innerHeight - contextMenuHeight - 24;
//     }
//     Log.debug("{0} {1} {2}",x, y, content);
//     return openContextMenuWithPosition(x, y, content);
// }