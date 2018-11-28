export default {
  googleAnalyticsKey: false, // Google analytics api key for logging
  auth: false, // Show/hide button in home view to authenticate
  originModel: false, // Model to be inserted at origin (0/0/0)
  infoText: "", // Text displayed in info view as html
  live: true, // Enable/disable AR view
  roomPlanner: true, // Enable/disable room planner
  shoppingCart: true, // Enable/disable shopping cart
  share: true, // Enable/disable sharing
  projects: true, // Enable/disable project saving/loading
  showPropertyList: false, // Show properties as list instead of a slider
  showCategoryImages: false, // Show category images instead of a list
  checkoutUrl: false, // URL for report generation
  introVideo: false, // URL to video played in home view background,
  shopFinder: false, // Displays shop finder button in home view. Either a string or { url, type }. Possible types: 'external', 'json' or 'iframe'.
  cloudProjects: false, // Enable/disable saving to/loading from cloud storage.
  hideRoomWalls: false, // Insert new walls hidden per default.
  noCollision: false, // Disable collision with room.
  roomExport: false // Enable room export as obj.
};
