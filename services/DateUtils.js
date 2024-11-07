class DateUtils {
    static isValidDateFormat(dateString) {
        const dateArray = dateString.split("-");
        if (dateArray.length !== 3) return false;
        const [day, month, year] = dateArray;
        return !isNaN(day) && !isNaN(month) && !isNaN(year) && day > 0 && day <= 31 && month > 0 && month <= 12;
    }

    static parseDate(dateStr) {
        const [day, month, year] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day);
    }

    static formatToValidDate(date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    }
}

module.exports = DateUtils;