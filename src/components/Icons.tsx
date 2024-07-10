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

export function TrashIcon(props: IconProps)
{
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            role="presentation"
            viewBox="0 0 20 20"
            width={props.width ?? props.size ?? 24}
            height={props.height ?? props.size ?? 24}
        >
            <path
                d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
            <path
                d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
            <path
                d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
            <path
                d="M8.60834 13.75H11.3833"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
            <path
                d="M7.91669 10.4167H12.0834"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            />
        </svg>
    );
}

export function ConnectIcon(props: IconProps)
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
            d="M9.4 86.6C-3.1 74.1-3.1 53.9 9.4 41.4s32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 9.4 86.6zM256 416H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
            fill={props.color ?? "currentColor"}
        />
    </svg>);
}

export function CheckmarkIcon(props: IconProps)
{
    return (<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        width={props.width ?? props.size ?? 24}
        height={props.height ?? props.size ?? 24}
        opacity={props.opacity ?? 1}
        className={props.className}
    >
        <path
            d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
            fill={props.color ?? "currentColor"}
        />
    </svg>);
}

export function EditIcon(props: IconProps)
{
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            role="presentation"
            viewBox="0 0 20 20"
            width={props.width ?? props.size ?? 24}
            height={props.height ?? props.size ?? 24}
        >
            <path
                d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
            />
            <path
                d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
            />
            <path
                d="M2.5 18.3333H17.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
            />
        </svg>
    );
}

export function ArchiveIcon(props: IconProps)
{
    return (
        <svg
            viewBox="0 0 22 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={props.width ?? props.size ?? 24}
            height={props.height ?? props.size ?? 24}
            opacity={props.opacity ?? 1}
            className={props.className}
        >
            <path
                d="M3 5.9966C2.83599 5.99236 2.7169 5.98287 2.60982 5.96157C1.81644 5.80376 1.19624 5.18356 1.03843 4.39018C1 4.19698 1 3.96466 1 3.5C1 3.03534 1 2.80302 1.03843 2.60982C1.19624 1.81644 1.81644 1.19624 2.60982 1.03843C2.80302 1 3.03534 1 3.5 1H18.5C18.9647 1 19.197 1 19.3902 1.03843C20.1836 1.19624 20.8038 1.81644 20.9616 2.60982C21 2.80302 21 3.03534 21 3.5C21 3.96466 21 4.19698 20.9616 4.39018C20.8038 5.18356 20.1836 5.80376 19.3902 5.96157C19.2831 5.98287 19.164 5.99236 19 5.9966M9 11H13M3 6H19V14.2C19 15.8802 19 16.7202 18.673 17.362C18.3854 17.9265 17.9265 18.3854 17.362 18.673C16.7202 19 15.8802 19 14.2 19H7.8C6.11984 19 5.27976 19 4.63803 18.673C4.07354 18.3854 3.6146 17.9265 3.32698 17.362C3 16.7202 3 15.8802 3 14.2V6Z"
                stroke={props.color ?? "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function DownloadIcon(props: IconProps)
{
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={props.width ?? props.size ?? 24}
            height={props.height ?? props.size ?? 24}
            opacity={props.opacity ?? 1}
            className={props.className}
        >
            <path
                d="M19 13V14.2C19 15.8802 19 16.7202 18.673 17.362C18.3854 17.9265 17.9265 18.3854 17.362 18.673C16.7202 19 15.8802 19 14.2 19H5.8C4.11984 19 3.27976 19 2.63803 18.673C2.07354 18.3854 1.6146 17.9265 1.32698 17.362C1 16.7202 1 15.8802 1 14.2V13M15 8L10 13M10 13L5 8M10 13V1"
                stroke={props.color ?? "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>

    );
}

export function RenameIcon(props: IconProps)
{
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={props.width ?? props.size ?? 24}
            height={props.height ?? props.size ?? 24}
            opacity={props.opacity ?? 1}
            className={props.className}
        >
            <path
                d="M13 7H5.2C4.0799 7 3.51984 7 3.09202 7.21799C2.71569 7.40973 2.40973 7.71569 2.21799 8.09202C2 8.51984 2 9.0799 2 10.2V13.8C2 14.9201 2 15.4802 2.21799 15.908C2.40973 16.2843 2.71569 16.5903 3.09202 16.782C3.51984 17 4.07989 17 5.2 17H13M17 7H18.8C19.9201 7 20.4802 7 20.908 7.21799C21.2843 7.40973 21.5903 7.71569 21.782 8.09202C22 8.51984 22 9.0799 22 10.2V13.8C22 14.9201 22 15.4802 21.782 15.908C21.5903 16.2843 21.2843 16.5903 20.908 16.782C20.4802 17 19.9201 17 18.8 17H17M17 21L17 3M19.5 3.00001L14.5 3M19.5 21L14.5 21"
                stroke={props.color ?? "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>

    );
}

export function NewFolderIcon(props: IconProps)
{
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={props.width ?? props.size ?? 24}
            height={props.height ?? props.size ?? 24}
            opacity={props.opacity ?? 1}
            className={props.className}
        >
            <path
                d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7ZM12 17V11M9 14H15"
                stroke={props.color ?? "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function NewFileIcon(props: IconProps)
{
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={props.width ?? props.size ?? 24}
            height={props.height ?? props.size ?? 24}
            opacity={props.opacity ?? 1}
            className={props.className}
        >
            <path
                d="M20 10.5V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H12M14 11H8M10 15H8M16 7H8M18 21V15M15 18H21"
                stroke={props.color ?? "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>

    );
}


export function UploadIcon(props: IconProps)
{
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={props.width ?? props.size ?? 24}
            height={props.height ?? props.size ?? 24}
            opacity={props.opacity ?? 1}
            className={props.className}
        >
            <path
                d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 8L12 3M12 3L7 8M12 3V15"
                stroke={props.color ?? "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}


export function CopyIcon(props: IconProps)
{
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={props.width ?? props.size ?? 24}
            height={props.height ?? props.size ?? 24}
            opacity={props.opacity ?? 1}
            className={props.className}
        >
            <path
                d="M7.5 3H14.6C16.8402 3 17.9603 3 18.816 3.43597C19.5686 3.81947 20.1805 4.43139 20.564 5.18404C21 6.03969 21 7.15979 21 9.4V16.5M6.2 21H14.3C15.4201 21 15.9802 21 16.408 20.782C16.7843 20.5903 17.0903 20.2843 17.282 19.908C17.5 19.4802 17.5 18.9201 17.5 17.8V9.7C17.5 8.57989 17.5 8.01984 17.282 7.59202C17.0903 7.21569 16.7843 6.90973 16.408 6.71799C15.9802 6.5 15.4201 6.5 14.3 6.5H6.2C5.0799 6.5 4.51984 6.5 4.09202 6.71799C3.71569 6.90973 3.40973 7.21569 3.21799 7.59202C3 8.01984 3 8.57989 3 9.7V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.0799 21 6.2 21Z"
                stroke={props.color ?? "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function MoveIcon(props: IconProps)
{
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={props.width ?? props.size ?? 24}
            height={props.height ?? props.size ?? 24}
            opacity={props.opacity ?? 1}
            className={props.className}
        >
            <path
                d="M10.5 2.0028C9.82495 2.01194 9.4197 2.05103 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8.05103 3.4197 8.01194 3.82495 8.0028 4.5M19.5 2.0028C20.1751 2.01194 20.5803 2.05103 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C21.949 3.4197 21.9881 3.82494 21.9972 4.49999M21.9972 13.5C21.9881 14.175 21.949 14.5803 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.5803 15.949 20.1751 15.9881 19.5 15.9972M22 7.99999V9.99999M14.0001 2H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z"
                stroke={props.color ?? "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function SaveIcon(props: IconProps)
{
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={props.width ?? props.size ?? 24}
            height={props.height ?? props.size ?? 24}
            opacity={props.opacity ?? 1}
            className={props.className}
        >
            <path
                d="M7 3H14.6745C15.1637 3 15.4083 3 15.6385 3.05526C15.8425 3.10425 16.0376 3.18506 16.2166 3.29472C16.4184 3.4184 16.5914 3.59135 16.9373 3.93726L20.0627 7.06274C20.4086 7.40865 20.5816 7.5816 20.7053 7.78343C20.8149 7.96237 20.8957 8.15746 20.9447 8.36154C21 8.59171 21 8.8363 21 9.32548V17M12.5 10H8.6C8.03995 10 7.75992 10 7.54601 9.89101C7.35785 9.79513 7.20487 9.64215 7.10899 9.45399C7 9.24008 7 8.96005 7 8.4V6.5M13.5 21V16.6C13.5 16.0399 13.5 15.7599 13.391 15.546C13.2951 15.3578 13.1422 15.2049 12.954 15.109C12.7401 15 12.4601 15 11.9 15H8.6C8.03995 15 7.75992 15 7.54601 15.109C7.35785 15.2049 7.20487 15.3578 7.10899 15.546C7 15.7599 7 16.0399 7 16.6V21M17.5 10.1627V17.8C17.5 18.9201 17.5 19.4802 17.282 19.908C17.0903 20.2843 16.7843 20.5903 16.408 20.782C15.9802 21 15.4201 21 14.3 21H6.2C5.0799 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V9.7C3 8.57989 3 8.01984 3.21799 7.59202C3.40973 7.21569 3.71569 6.90973 4.09202 6.71799C4.51984 6.5 5.0799 6.5 6.2 6.5H13.8373C14.0818 6.5 14.2041 6.5 14.3192 6.52763C14.4213 6.55213 14.5188 6.59253 14.6083 6.64736C14.7092 6.7092 14.7957 6.79568 14.9686 6.96863L17.0314 9.03137C17.2043 9.20432 17.2908 9.2908 17.3526 9.39172C17.4075 9.48119 17.4479 9.57873 17.4724 9.68077C17.5 9.79586 17.5 9.91815 17.5 10.1627Z"
                stroke={props.color ?? "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}


export function OpenPanelIcon(props: IconProps)
{
    return (
        <svg
            viewBox="0 -960 960 960"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={props.width ?? props.size ?? 24}
            height={props.height ?? props.size ?? 24}
            opacity={props.opacity ?? 1}
            className={props.className}
            style={{minWidth: `${props.height ?? props.size ?? 24}px`, minHeight: `${props.height ?? props.size ?? 24}px`}}
        >
            <path
                d="M460-320v-320L300-480l160 160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm440-80h120v-560H640v560Zm-80 0v-560H200v560h360Zm80 0h120-120Z"
                fill={props.color ?? "currentColor"}
            />
        </svg>
    );
}


export function ClosePanelIcon(props: IconProps)
{
    return (
        <svg
            viewBox="0 -960 960 960"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={props.width ?? props.size ?? 24}
            height={props.height ?? props.size ?? 24}
            opacity={props.opacity ?? 1}
            className={props.className}
            style={{minWidth: `${props.height ?? props.size ?? 24}px`, minHeight: `${props.height ?? props.size ?? 24}px`}}
        >
            <path
                d="M300-640v320l160-160-160-160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm440-80h120v-560H640v560Zm-80 0v-560H200v560h360Zm80 0h120-120Z"
                fill={props.color ?? "currentColor"}
            />
        </svg>
    );
}

