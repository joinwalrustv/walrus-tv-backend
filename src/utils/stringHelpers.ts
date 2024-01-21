// https://stackoverflow.com/questions/7394748/whats-the-right-way-to-decode-a-string-that-has-special-html-entities-in-it
export const decodeHtmlEntity = (str: string) => {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
};

export const formatTimestamp = (ms: number) => {
  const base = Math.floor(ms / 1000);
  const minutes = Math.floor(base / 60);
  const seconds = Math.floor(base % 60);

  return minutes + ":" + (seconds > 9 ? seconds : "0"+seconds);
}

export const randomRoomId = () => {
  return Math.random().toString(36).slice(2, 9);
};
