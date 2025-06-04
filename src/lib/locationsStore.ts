// This file is no longer used as locations are now stored in Firebase Firestore.
// You can delete this file.

// To re-add the example locations that were previously in this file,
// you'll need to add them to your "locations" collection in Firestore.
// Each document in Firestore should have:
// - A 'type' field with the value "Feature" (string)
// - A 'geometry' field (object) with 'type': "Point" and 'coordinates': [longitude, latitude]
// - A 'properties' field (object) with name, menu, parking, rating, images etc.

// Example structure for a Firestore document in the "locations" collection:
// {
//   type: "Feature",
//   geometry: {
//     type: "Point",
//     coordinates: [16.440193, 43.508133] // Example: Split
//   },
//   properties: {
//     name: "Example Cafe",
//     description: "A nice place to visit.",
//     menu: ["Coffee", "Tea"],
//     parking: "Available",
//     rating: 4.5,
//     images: ["https://placehold.co/600x400.png"]
//   }
// }
