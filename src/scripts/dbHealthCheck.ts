import { DataAPIClient } from "@datastax/astra-db-ts";

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN!);
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT!, {
  namespace: "lego_fortnite",
});

interface TestDocument {
  _id?: string;
  test_id: string;
  timestamp: string;
  message: string;
}

async function runDatabaseTest() {
  console.log("Starting database health check...");

  try {
    // Get the test collection
    const testCollection =
      await db.collection<TestDocument>("health_check_test");

    // Create a test document
    const testDoc = {
      test_id: "health_check",
      timestamp: new Date().toISOString(),
      message: "Database connection test successful",
    };

    // Insert the test document
    console.log("Inserting test document...");
    const insertResult = await testCollection.insertOne(testDoc);
    console.log("Test document inserted:", insertResult);

    // Verify we can read the document
    console.log("Verifying document...");
    const foundDoc = await testCollection.findOne({ test_id: "health_check" });
    console.log("Found document:", foundDoc);

    // Clean up by deleting the test document
    console.log("Cleaning up test document...");
    await testCollection.deleteOne({ test_id: "health_check" });
    console.log("Test document deleted");

    console.log("Database health check completed successfully");
  } catch (error) {
    console.error("Database health check failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run the test
runDatabaseTest();
