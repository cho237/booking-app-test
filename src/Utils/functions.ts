export  function convertDateFormat(dateString: string): string {
    const date: Date = new Date(dateString);
    const year: number = date.getFullYear() - 2;
    const month: string = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
    const day: string = (date.getDate() < 10 ? '0' : '') + date.getDate();
    return `${year}-${month}-${day}`;
}