/**
 * Get the largest file size in human-readable format
 * @param size The size of the file in bytes
 */
export function getLargestFileSize(size: number): string
{
    const ext = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let index = 0;
    while (size >= 1024)
    {
        size /= 1024;
        index++;
    }
    return `${size.toFixed(2)} ${ext[index]}`;
}