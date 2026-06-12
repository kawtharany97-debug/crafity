import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// 1. Load .env
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rootFolder = './my-images';
const bucketName = 'products'; // Ensure this matches a bucket name in your Dashboard

async function uploadFolder(dirPath, parentPath = '') {
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Error: Directory not found: ${dirPath}`);
    return;
  }

  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await uploadFolder(fullPath, `${parentPath}${item}/`);
    } else {
      const fileContent = fs.readFileSync(fullPath);
      // Clean path to remove leading slashes
      let filePath = `${parentPath}${item}`;
      if (filePath.startsWith('/')) filePath = filePath.substring(1);

      console.log(`Uploading ${filePath}...`);
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, fileContent, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (error) {
        console.error(`❌ Error uploading ${filePath}:`, error.message);
      } else {
        console.log(`✅ Successfully uploaded: ${filePath}`);
      }
    }
  }
}

uploadFolder(rootFolder).then(() => console.log("Done!"));