// matching.js
const { calculateDistance } = require("./helpers"); //Import distance calculation function

// Function to find potential matches for an item
const findMatches = async (item, items, maxDistance) => {
  //Filter the items array to find only items within a specified distance from the item location
  const potentialMatches = items.filter(
    (otherItem) =>
      otherItem.id !== item.id && //Don't match the item to itself
      otherItem.desiredCommodity === item.category && //Match based on desired commodity
      calculateDistance(
        item.location.lat,
        item.location.lon,
        otherItem.location.lat,
        otherItem.location.lon
      ) <= maxDistance
  );

  //Sort the potentialMatches array based on the distance and other criteria
  potentialMatches.sort((a, b) => {
    //Prioritize closer matches first. You can add other criteria in the sort function
    const distanceA = calculateDistance(
      item.location.lat,
      item.location.lon,
      a.location.lat,
      a.location.lon
    );
    const distanceB = calculateDistance(
      item.location.lat,
      item.location.lon,
      b.location.lat,
      b.location.lon
    );
    return distanceA - distanceB;
  });
  return potentialMatches;
};

//Export the matching function
module.exports = { findMatches };
