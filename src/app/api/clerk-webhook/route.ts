import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

export async function POST(request: Request) {
  // Get the headers
  const headersList = headers();
  const svix_id = headersList.get('svix-id') || '';
  const svix_timestamp = headersList.get('svix-timestamp') || '';
  const svix_signature = headersList.get('svix-signature') || '';

  // If there are no svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error: Missing svix headers', { status: 400 });
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Get the webhook secret from environment variable
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!secret) {
    return new NextResponse('Error: Missing webhook secret', { status: 500 });
  }

  // Create a new Svix instance with your secret
  const webhook = new Webhook(secret);
  
  let event;
  
  try {
    // Verify the webhook payload
    event = webhook.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (error) {
    console.error('Error verifying webhook:', error);
    return new NextResponse('Error verifying webhook', { status: 400 });
  }

  // Handle the event
  const eventType = event.type;
  
  // Initialize Convex client
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');
  
  try {
    if (eventType === 'user.created') {
      // User was created in Clerk, create user in Convex
      await convex.mutation(api.users.createUser, {
        clerkId: event.data.id,
        email: event.data.email_addresses[0]?.email_address,
        firstName: event.data.first_name || '',
        lastName: event.data.last_name || '',
        imageUrl: event.data.image_url || '',
      });
    } else if (eventType === 'user.updated') {
      // User was updated in Clerk, update user in Convex
      await convex.mutation(api.users.updateUser, {
        clerkId: event.data.id,
        email: event.data.email_addresses[0]?.email_address,
        firstName: event.data.first_name || '',
        lastName: event.data.last_name || '',
        imageUrl: event.data.image_url || '',
      });
    } else if (eventType === 'user.deleted') {
      // User was deleted in Clerk, delete user in Convex
      await convex.mutation(api.users.deleteUser, {
        clerkId: event.data.id
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
} 