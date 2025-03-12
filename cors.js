import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const updateBucketCors = async () => {
  const { data, error } = await supabase.storage.updateBucket('building-images', {
    public: true, // Set to false if private
    cors_rules: [
      {
        allow_origins: ["*"], // Adjust for security (use specific domains in production)
        allow_methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers: ["*"],
        expose_headers: ["Content-Length", "Content-Range"],
        max_age_seconds: 3600
      }
    ]
  });

  if (error) {
    console.error("Error updating CORS:", error);
  } else {
    console.log("CORS updated successfully:", data);
  }
};

// Run the function
updateBucketCors();
