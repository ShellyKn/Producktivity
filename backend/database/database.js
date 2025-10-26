
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;
const uri = `mongodb+srv://${db_name}:${db_password}@cluster0.kcznebn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Try with different TLS settings to fix OpenSSL compatibility
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  // Extended timeouts
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000
});

let db = null;

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    if (db) {
      return { client, db };
    }
    
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
    
    // Get the database instance (replace 'producktivity' with your actual database name)
    db = client.db('produck');
    
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Get the database instance (for use in other files)
export async function getDatabase() {
  if (!db) {
    await connectToDatabase();
  }
  return db;
}

// Close the database connection
export async function closeDatabase() {
  if (client) {
    await client.close();
    db = null;
    console.log('MongoDB connection closed');
  }
}
