export class RegexConfig {

    public static emailRegExp = /(^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+)/

    public static passwordRegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/

    public static englishLettersAndNumbersOnly = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]*$/i

    public static englishLettersAndNumbersWithCommaOnly = /^[a-zA-Z0-9,'!#~?"@^|<>\/\\$%\&*\)\(+=._-]*$/i

    public static arabicLetters = /^[\u0621-\u064A0-9 ]+$/g

    public static domainRegExp = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/

    public static saudiPhoneNumbers = /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/

    public static IntegersOnly = /^[\d]*$/

    public static phoneRegExp = (input: string) => {
        return input.replace('', '');
    }
    public static escapeRegExp = (input: string) => {
        return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

}
