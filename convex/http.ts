import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Clerk webhook handler
http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Get the Clerk webhook secret from environment variable
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      return new Response("Webhook secret not configured", { status: 500 });
    }

    // Extract headers for verification
    const svix_id = request.headers.get("svix-id");
    const svix_timestamp = request.headers.get("svix-timestamp");
    const svix_signature = request.headers.get("svix-signature");
    
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    // Get request body
    const body = await request.json();
    
    // Process user data based on event type
    const { type, data } = body;
    
    if (type === "user.created" || type === "user.updated") {
      await ctx.runMutation(api.users.createUser, {
        clerkId: data.id,
        email: data.email_addresses?.[0]?.email_address || "",
        firstName: data.first_name,
        lastName: data.last_name,
        imageUrl: data.image_url,
      });
    }
    
    return new Response(null, { status: 200 });
  }),
});

// Add a path for debugging/checking webhook is alive
http.route({
  path: "/clerk-webhook-check",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return new Response(
      JSON.stringify({ status: "active", message: "Webhook endpoint is active" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }),
});

export default http; 