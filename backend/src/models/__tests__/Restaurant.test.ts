// import { db } from '../../__utilities__/db'; // Adjust the import path as needed
// import { seed } from '../../__utilities__/seed';
// import { Restaurant } from '../Restaurant'; // Adjust the import path as needed

// beforeAll(async () => {
//   await db.resetDatabase();
//   await db.query(seed);
// });

// describe('Restaurant Class Tests', () => {
//   let newRestaurantId: string;

//   it('should create a new restaurant', async () => {
//     const newRestaurant = await Restaurant.create({
//       name: "Test Restaurant",
//       email: "test@restaurant.com",
//       address: "123 Test St",
//       phone: "1234567890"
//       // Add other necessary fields
//     });

//     expect(newRestaurant).toBeDefined();
//     expect(newRestaurant.email).toEqual("test@restaurant.com");
//     newRestaurantId = newRestaurant.id; // Assuming the create method returns an object with an id
//   });

//   it('should find a restaurant by email', async () => {
//     const foundRestaurant = await Restaurant.findByEmail("test@restaurant.com");
//     expect(foundRestaurant).toBeDefined();
//     expect(foundRestaurant.id).toEqual(newRestaurantId);
//   });

//   it('should update a restaurant\'s information', async () => {
//     const updatedRestaurant = await Restaurant.update(newRestaurantId, {
//       name: "Updated Test Restaurant"
//       // Update other fields as necessary
//     });

//     expect(updatedRestaurant).toBeDefined();
//     expect(updatedRestaurant.name).toEqual("Updated Test Restaurant");
//   });

//   it('should delete a restaurant', async () => {
//     await Restaurant.delete(newRestaurantId);
//     const foundRestaurant = await Restaurant.findByEmail("test@restaurant.com");
//     expect(foundRestaurant).toBeNull();
//   });
// });

// afterAll(async () => {
//   await db.close(); // Adjust this to match how your db utility closes the connection
// });
