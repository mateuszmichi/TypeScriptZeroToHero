export type Template<T extends object = {}> = (data: T) => string;

function hashCode(str: string) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toFixed();
}

export const sendEmail = async (recipient: string, text: string) => {
  console.log(`Fake SES: sending to ${recipient} (${text})`);
  return Promise.resolve(hashCode(`${recipient}${text}`));
};
