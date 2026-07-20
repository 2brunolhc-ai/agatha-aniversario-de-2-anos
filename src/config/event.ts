export const eventConfig = {
  birthdayGirl: "Ágatha",
  age: 2,
  birthdayDate: "2026-07-15",
  celebrationDate: "2026-07-26",
  celebrationTime: "12:00",
  venueName: "",
  addressLines: [
    "Rua Siriema",
    "Qd. 22, Lt. 05",
    "Bairro Major / Itamar Nóbrega 02",
    "Recanto D. Paulo",
  ],
  coordinates: {
    latitude: -15.7415278,
    longitude: -48.3980556,
    formatted: `15°44'29.5\"S 48°23'53.0\"W`,
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=-15.7415278,-48.3980556",
  wazeUrl:
    "https://waze.com/ul?ll=-15.7415278%2C-48.3980556&navigate=yes",
  mapEmbedUrl:
    "https://www.google.com/maps?q=-15.7415278,-48.3980556&z=17&output=embed",
  confirmationDeadline: "",
  timezone: "America/Sao_Paulo",
} as const;

export const celebrationStartsAt = "2026-07-26T12:00:00-03:00";
export const celebrationEndsAt = "2026-07-27T00:00:00-03:00";
