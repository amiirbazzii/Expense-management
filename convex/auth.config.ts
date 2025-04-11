export default {
  providers: [
    {
      // Replace with your actual Issuer URL from the Clerk JWT template
      // To fix "No JWT template exists with name: convex" error:
      // 1. Go to Clerk Dashboard
      // 2. Navigate to JWT Templates
      // 3. Create a new template and select "Convex"
      // 4. Ensure the template is named "convex" (lowercase)
      // 5. Copy the Issuer URL and paste it here
      domain: "https://creative-stud-67.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
}; 