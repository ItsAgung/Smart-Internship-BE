function convertDate(indonesianDateString, timezone) {
  const dateObj = new Date(indonesianDateString);
  const englishDate = dateObj.toLocaleDateString(timezone, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return englishDate;
}

function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

//   // Contoh penggunaan:
//   const englishDate = convertDate(tanggalAwal);

//   console.log(englishDate);

export default { convertDate, isToday };
