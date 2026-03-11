import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { ENV } from '../config/env.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import ProviderProfile from '../models/ProviderProfile.js';

const seed = async () => {
    await connectDB();
    console.log('🌱 Seeding database…');

    // Clear existing data
    await Promise.all([
        User.deleteMany({}),
        Service.deleteMany({}),
        ProviderProfile.deleteMany({}),
    ]);

    // ── Users ───────────────────────────────
    const passwordHash = await bcrypt.hash('password123', 12);

    const admin = await User.create({
        name: 'Admin User',
        email: 'admin@lendahand.com',
        passwordHash,
        role: 'admin',
    });

    const customer = await User.create({
        name: 'Rahul Sharma',
        email: 'customer@demo.com',
        passwordHash,
        role: 'customer',
        phone: '+91 9876543210',
        addresses: [{ label: 'Home', street: '12 MG Road', city: 'Udupi', state: 'Karnataka', zip: '576101' }],
    });

    const provider1 = await User.create({
        name: 'Priya Patel',
        email: 'provider@demo.com',
        passwordHash,
        role: 'provider',
        phone: '+91 9876543211',
    });

    const provider2 = await User.create({
        name: 'Amit Kumar',
        email: 'provider2@demo.com',
        passwordHash,
        role: 'provider',
        phone: '+91 9876543212',
    });

    // ── Services ────────────────────────────
    const services = await Service.insertMany([
        { name: 'Deep Home Cleaning', description: 'Complete deep cleaning service for your entire home including kitchen and bathrooms.', category: 'Cleaning', basePrice: 199, duration: 180, tags: ['deep-clean', 'home', 'sanitization'] },
        { name: 'Bathroom Cleaning', description: 'Thorough bathroom cleaning with scrubbing, sanitization and freshening.', category: 'Cleaning', basePrice: 99, duration: 60, tags: ['bathroom', 'sanitize'] },
        { name: 'Pipe Leak Repair', description: 'Fix leaking pipes, faucets and water supply issues.', category: 'Plumbing', basePrice: 149, duration: 90, tags: ['leak', 'pipe', 'repair'] },
        { name: 'Full Home Plumbing', description: 'Complete plumbing check and repair for your home.', category: 'Plumbing', basePrice: 349, duration: 240, tags: ['plumbing', 'full-home'] },
        { name: 'Wiring & Switchboard', description: 'Electrical wiring repair and switchboard installation.', category: 'Electrical', basePrice: 179, duration: 120, tags: ['wiring', 'switchboard', 'electrical'] },
        { name: 'Fan & Light Installation', description: 'Install ceiling fans, lights and fixtures.', category: 'Electrical', basePrice: 129, duration: 60, tags: ['fan', 'light', 'installation'] },
        { name: 'Interior Wall Painting', description: 'Professional wall painting with premium paints.', category: 'Painting', basePrice: 299, duration: 480, tags: ['interior', 'wall', 'paint'] },
        { name: 'Furniture Assembly', description: 'Assemble flat-pack furniture and fixtures.', category: 'Carpentry', basePrice: 199, duration: 120, tags: ['furniture', 'assembly'] },
        { name: 'Garden Maintenance', description: 'Lawn mowing, hedge trimming and general garden care.', category: 'Gardening', basePrice: 149, duration: 120, tags: ['garden', 'lawn', 'maintenance'] },
        { name: 'AC Service & Repair', description: 'AC cleaning, gas refill and general service.', category: 'AC & HVAC', basePrice: 249, duration: 90, tags: ['ac', 'service', 'cooling'] },
        { name: 'Pest Control', description: 'Complete pest control treatment for cockroaches, ants and termites.', category: 'Pest Control', basePrice: 179, duration: 60, tags: ['pest', 'cockroach', 'termite'] },
        { name: 'Home Shifting', description: 'Packing, loading, transport and unpacking for home moves.', category: 'Moving', basePrice: 499, duration: 480, tags: ['moving', 'shifting', 'packing'] },
    ]);

    // ── Provider Profiles ───────────────────
    await ProviderProfile.insertMany([
        {
            user: provider1._id,
            bio: 'Certified home cleaning professional with 5+ years of experience.',
            experience: 5,
            servicesOffered: [services[0]._id, services[1]._id, services[10]._id],
            rating: 4.8,
            totalReviews: 47,
            totalBookings: 156,
            verified: true,
            verifiedAt: new Date(),
            availability: [
                { day: 'mon', start: '09:00', end: '18:00' },
                { day: 'tue', start: '09:00', end: '18:00' },
                { day: 'wed', start: '09:00', end: '18:00' },
                { day: 'thu', start: '09:00', end: '18:00' },
                { day: 'fri', start: '09:00', end: '17:00' },
                { day: 'sat', start: '10:00', end: '14:00' },
            ],
            location: { type: 'Point', coordinates: [74.7421, 13.3409] },
        },
        {
            user: provider2._id,
            bio: 'Expert electrician and plumber. Quick, reliable, affordable.',
            experience: 8,
            servicesOffered: [services[2]._id, services[3]._id, services[4]._id, services[5]._id],
            rating: 4.6,
            totalReviews: 32,
            totalBookings: 98,
            verified: true,
            verifiedAt: new Date(),
            availability: [
                { day: 'mon', start: '08:00', end: '20:00' },
                { day: 'tue', start: '08:00', end: '20:00' },
                { day: 'wed', start: '08:00', end: '20:00' },
                { day: 'thu', start: '08:00', end: '20:00' },
                { day: 'fri', start: '08:00', end: '20:00' },
            ],
            location: { type: 'Point', coordinates: [74.7892, 13.3503] },
        },
    ]);

    console.log('✅ Seeded successfully:');
    console.log(`   → ${3 + 1} users (admin, customer, 2 providers)`);
    console.log(`   → ${services.length} services`);
    console.log(`   → 2 provider profiles`);
    console.log('\n📧 Demo accounts:');
    console.log('   admin@lendahand.com  / password123  (admin)');
    console.log('   customer@demo.com    / password123  (customer)');
    console.log('   provider@demo.com    / password123  (provider)');
    console.log('   provider2@demo.com   / password123  (provider)');

    await mongoose.connection.close();
    process.exit(0);
};

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
