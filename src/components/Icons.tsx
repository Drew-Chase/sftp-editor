import {cn} from "@nextui-org/react";

export interface IconProps
{
    size?: number;
    color?: string;
    width?: number;
    height?: number;
    opacity?: number;
    className?: string;
}

// @ts-ignore
export const IconWrapper = ({children, className}) => (
    <div className={cn(className, "flex items-center rounded-small justify-center w-10 h-7 p-1")}>
        {children}
    </div>
);

export function SettingsIcon(props: IconProps)
{
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="-5.0 -10.0 110.0 135.0"
             width={props.width ?? props.size ?? 24}
             height={props.height ?? props.size ?? 24}
             opacity={props.opacity ?? 1}
             className={props.className}
        >
            <g>
                <path d="m76.199 90c4.3008 0 7.6992-3.5 7.6992-7.6992v-64.602c0-4.3008-3.5-7.6992-7.6992-7.6992h-52.398c-4.3008 0-7.6992 3.5-7.6992 7.6992v64.5c0 4.3008 3.5 7.6992 7.6992 7.6992h52.398zm-57.5-7.6992v-64.602c0-2.8008 2.3008-5.1992 5.1992-5.1992h52.301c2.8008 0 5.1992 2.3008 5.1992 5.1992v64.5c0 2.8008-2.3008 5.1992-5.1992 5.1992h-52.398c-2.8008 0-5.1016-2.2969-5.1016-5.0977z" stroke={props.color ?? "currentColor"}/>
                <path d="m32.398 44.801v30.699c0 0.69922 0.60156 1.3008 1.3008 1.3008s1.3008-0.60156 1.3008-1.3008v-30.699c3.1016-0.60156 5.5-3.3984 5.5-6.6992 0-3.3008-2.3984-6-5.5-6.6992v-7c0-0.69922-0.60156-1.3008-1.3008-1.3008s-1.3008 0.60156-1.3008 1.3008v7c-3.1016 0.60156-5.5 3.3984-5.5 6.6992 0 3.2969 2.4023 6.0977 5.5 6.6992zm1.3008-10.902c2.3008 0 4.1992 1.8984 4.1992 4.1992 0 2.3008-1.8984 4.1992-4.1992 4.1992s-4.1992-1.8984-4.1992-4.1992c0-2.2969 1.8984-4.1992 4.1992-4.1992z"
                      stroke={props.color ?? "currentColor"}/>
                <path d="m48.699 70.199v5.3008c0 0.69922 0.60156 1.3008 1.3008 1.3008s1.3008-0.60156 1.3008-1.3008v-5.3008c3.1016-0.60156 5.5-3.3984 5.5-6.6992s-2.3984-6-5.5-6.6992v-32.301c0-0.69922-0.60156-1.3008-1.3008-1.3008s-1.3008 0.60156-1.3008 1.3008v32.398c-3.1016 0.60156-5.5 3.3984-5.5 6.6992 0 3.3008 2.4023 6.0039 5.5 6.6016zm1.3008-10.801c2.3008 0 4.1992 1.8984 4.1992 4.1992 0 2.3008-1.8984 4.1992-4.1992 4.1992s-4.1992-1.8984-4.1992-4.1992c0-2.2969 1.8984-4.1992 4.1992-4.1992z"
                      stroke={props.color ?? "currentColor"}/>
                <path d="m65 55.199v20.301c0 0.69922 0.60156 1.3008 1.3008 1.3008s1.3008-0.60156 1.3008-1.3008v-20.301c3.1016-0.60156 5.5-3.3984 5.5-6.6992s-2.3984-6-5.5-6.6992v-17.301c0-0.69922-0.60156-1.3008-1.3008-1.3008s-1.3008 0.60156-1.3008 1.3008v17.398c-3.1016 0.60156-5.5 3.3984-5.5 6.6992 0 3.2031 2.3984 6.0039 5.5 6.6016zm1.3008-10.898c2.3008 0 4.1992 1.8984 4.1992 4.1992s-1.8984 4.1992-4.1992 4.1992-4.1992-1.8984-4.1992-4.1992 1.8984-4.1016 4.1992-4.1992z"
                      stroke={props.color ?? "currentColor"}/>
            </g>
        </svg>);
}

export function TableIcon(props: IconProps)
{
    return (
        <svg
            width={props.width || props.size}
            className={props.className}
            stroke-width="1.5"
            height={props.height || props.size}
            viewBox="0 0 24 24"
            fill="none"
            color={props.color}
        >
            <path d="M9 6L20 6" stroke={props.color ?? "currentColor"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M3.80002 5.79999L4.60002 6.59998L6.60001 4.59999" stroke={props.color ?? "currentColor"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M3.80002 11.8L4.60002 12.6L6.60001 10.6" stroke={props.color ?? "currentColor"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M3.80002 17.8L4.60002 18.6L6.60001 16.6" stroke={props.color ?? "currentColor"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M9 12L20 12" stroke={props.color ?? "currentColor"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M9 18L20 18" stroke={props.color ?? "currentColor"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>);
}


export function UpdateIcon(props: IconProps)
{
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 512 512"
             width={props.width ?? props.size ?? 24}
             height={props.height ?? props.size ?? 24}
             opacity={props.opacity ?? 1}
             className={props.className}
        >
            <path
                d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"
                fill={props.color ?? "currentColor"}
            />
        </svg>);
}

export function XIcon(props: IconProps)
{
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 384 512"
             width={props.width ?? props.size ?? 24}
             height={props.height ?? props.size ?? 24}
             opacity={props.opacity ?? 1}
             className={props.className}
        >
            <path
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                fill={props.color ?? "currentColor"}
            />
        </svg>);
}

export function MinimizeIcon(props: IconProps)
{
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 384 512"
             width={props.width ?? props.size ?? 24}
             height={props.height ?? props.size ?? 24}
             opacity={props.opacity ?? 1}
             className={props.className}
        >
            <path
                d="M24 432c-13.3 0-24 10.7-24 24s10.7 24 24 24H488c13.3 0 24-10.7 24-24s-10.7-24-24-24H24z"
                fill={props.color ?? "currentColor"}
            />
        </svg>);
}

export function MaximizeIcon(props: IconProps)
{
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 384 512"
             width={props.width ?? props.size ?? 24}
             height={props.height ?? props.size ?? 24}
             opacity={props.opacity ?? 1}
        >
            <path
                d="M384 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
                fill={props.color ?? "currentColor"}
            />
        </svg>);
}

export function BugIcon(props: IconProps)
{
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 24 24"
             width={props.width ?? props.size ?? 24}
             height={props.height ?? props.size ?? 24}
             opacity={props.opacity ?? 1}
             className={props.className}
        >
            <path
                d="M16.895,6.519l2.813-2.812l-1.414-1.414l-2.846,2.846c-0.233-0.166-0.473-0.321-0.723-0.454 c-1.723-0.91-3.726-0.911-5.45,0c-0.25,0.132-0.488,0.287-0.722,0.453L5.707,2.293L4.293,3.707l2.813,2.812 C6.53,7.242,6.08,8.079,5.756,9H2v2h2.307C4.242,11.495,4.2,11.997,4.2,12.5c0,0.507,0.042,1.013,0.107,1.511H2v2h2.753 c0.013,0.039,0.021,0.08,0.034,0.118c0.188,0.555,0.421,1.093,0.695,1.6c0.044,0.081,0.095,0.155,0.141,0.234l-2.33,2.33 l1.414,1.414l2.11-2.111c0.235,0.254,0.478,0.498,0.736,0.716c0.418,0.354,0.867,0.657,1.332,0.903 c0.479,0.253,0.982,0.449,1.496,0.58C10.911,21.931,11.455,22,12,22s1.089-0.069,1.618-0.204c0.514-0.131,1.017-0.327,1.496-0.58 c0.465-0.246,0.914-0.55,1.333-0.904c0.258-0.218,0.5-0.462,0.734-0.716l2.111,2.111l1.414-1.414l-2.33-2.33 c0.047-0.08,0.098-0.155,0.142-0.236c0.273-0.505,0.507-1.043,0.694-1.599c0.013-0.039,0.021-0.079,0.034-0.118H22v-2h-2.308 c0.065-0.499,0.107-1.004,0.107-1.511c0-0.503-0.042-1.005-0.106-1.5H22V9h-3.756C17.92,8.079,17.47,7.242,16.895,6.519z M8.681,7.748c0.445-0.558,0.96-0.993,1.528-1.294c1.141-0.603,2.442-0.602,3.581,0c0.569,0.301,1.084,0.736,1.53,1.295 c0.299,0.373,0.54,0.8,0.753,1.251H7.927C8.141,8.549,8.381,8.121,8.681,7.748z M17.8,12.5c0,0.522-0.042,1.044-0.126,1.553 c-0.079,0.49-0.199,0.973-0.355,1.436c-0.151,0.449-0.34,0.882-0.559,1.288c-0.217,0.399-0.463,0.772-0.733,1.11 c-0.267,0.333-0.56,0.636-0.869,0.898c-0.31,0.261-0.639,0.484-0.979,0.664s-0.695,0.317-1.057,0.41 c-0.04,0.01-0.082,0.014-0.122,0.023V14h-2v5.881c-0.04-0.009-0.082-0.013-0.122-0.023c-0.361-0.093-0.717-0.23-1.057-0.41 s-0.669-0.403-0.978-0.664c-0.311-0.263-0.604-0.565-0.871-0.899c-0.27-0.337-0.516-0.71-0.731-1.108 c-0.22-0.407-0.408-0.84-0.56-1.289c-0.156-0.463-0.276-0.946-0.356-1.438C6.242,13.544,6.2,13.022,6.2,12.5 c0-0.505,0.041-1.009,0.119-1.5h11.361C17.759,11.491,17.8,11.995,17.8,12.5z"
                fill={props.color ?? "currentColor"}
            />
        </svg>);
}

export function FolderIcon(props: IconProps)
{
    return (<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        width={props.width ?? props.size ?? 24}
        height={props.height ?? props.size ?? 24}
        opacity={props.opacity ?? 1}
        className={props.className}
    >
        <path
            d="M88.7 223.8L0 375.8V96C0 60.7 28.7 32 64 32H181.5c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7H416c35.3 0 64 28.7 64 64v32H144c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224H544c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480H32c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z"
            fill={props.color ?? "currentColor"}
        />
    </svg>);
}
