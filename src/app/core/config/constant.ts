export class Constant {
  // local storage key
  public static token = 'token';
  public static locale = 'locale';
  public static userData = 'userData';
  public static requestId = 'requestId';
  public static requestData = 'requestData';
  public static requestIdView = 'requestIdView';
  public static scorecardIdViewMode = 'scorecardViewMode';
  public static selectedScorecardId = 'selectedScorecardId';


  // regex
  public static allowEnglishLanguage = RegExp(/^[a-zA-Z ]+$/);
  public static englishLettersAndNumbersOnly = RegExp(/^[a-zA-Z0-9!'@#\$%\^\&*\)\(+=._-]*$/i);
  public static englishLettersAndNumbersWithCommaOnly = RegExp(/^[a-zA-Z0-9,'’!#~?"@^|<>\/\\$%\&*\)\(+=._-]*$/i);
  public static capitalLetterOnly = RegExp(/^[A-Z ]+$/);
  public static allowNumbersOnly = RegExp(/^[0-9]+$/);
  public static allowPercentageOnly = RegExp(/^(\d{1,2}(\.\d+)?|100(\.0+)?)$/);
  public static allowDecimalNumbersOnly = RegExp(/^-?\d+(\.\d+)?$/);

  public static allowArabicLanguage = RegExp(
    /^[\u0600-\u06FF\u0750-\u077F\uFB50-\uFC3F\uFE70-\uFEFC]+$/
  );

  public static allowArabicLettersAndNumbersOnly = RegExp(
    // /^[\u0600-\u06FF\u0750-\u077F\uFB50-\uFC3F\uFE70-\uFEFC0-9]+$/
    /^[\u0600-\u06FF0-9\s!@#$%^&*()_+=[\]{}|\\;:'",.<>?-]+$/
  );

  public static allowArabicLettersAndSpecialChars = RegExp(/^[\u0600-\u06FF\s\-,_\/]+$/);

  public static allowArabicLetters = RegExp(/[\u0600-\u06FF]/);
}
