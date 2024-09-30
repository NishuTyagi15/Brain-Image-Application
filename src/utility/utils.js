export const splitFileString = (file) => {
    const lastSlashIndex = file.lastIndexOf('/');
    const firstPart = file.substring(0, lastSlashIndex);
    const secondPart = file.substring(lastSlashIndex + 1);
    return { firstPart, secondPart };
};