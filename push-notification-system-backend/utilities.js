
export function convertToCronTime(timeString) {

const date = new Date(timeString);
console.log("type of date "+typeof(date)+" "+JSON.stringify(date))
const minutes = date.getMinutes();
  console.log("minutes "+minutes)
  const hours = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1; // JS months are 0-based
  const dayOfWeek = "*"; // Keep it wildcard unless needed

  return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}